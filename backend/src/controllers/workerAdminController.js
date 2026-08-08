import asyncHandler from 'express-async-handler';
import Worker from '../models/Worker.js';
import ServiceJob from '../models/ServiceJob.js';

// ── GET /api/admin/workers ───────────────────────────────────────────────────
export const getWorkers = asyncHandler(async (req, res) => {
    const {
        page = 1,
        limit = 20,
        search = '',
        status,
        category,
        verificationStatus,
    } = req.query;

    const filter = { isActive: true };
    if (status) filter.status = status;
    if (category) filter.primaryCategory = category;
    if (verificationStatus) filter.verificationStatus = verificationStatus;
    if (search) {
        filter.$or = [
            { firstName:  { $regex: search, $options: 'i' } },
            { lastName:   { $regex: search, $options: 'i' } },
            { phone:      { $regex: search, $options: 'i' } },
            { nic:        { $regex: search, $options: 'i' } },
        ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [workers, total] = await Promise.all([
        Worker.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit))
            .select('-nicFrontUrl -nicBackUrl -certificates'), // exclude heavy doc URLs from list
        Worker.countDocuments(filter),
    ]);

    res.json({
        success: true,
        data: workers,
        pagination: {
            total,
            page: parseInt(page),
            limit: parseInt(limit),
            pages: Math.ceil(total / parseInt(limit)),
        },
    });
});

// ── GET /api/admin/workers/pending ───────────────────────────────────────────
export const getPendingWorkers = asyncHandler(async (req, res) => {
    const workers = await Worker.find({
        verificationStatus: 'pending',
        isActive: true,
    })
        .sort({ createdAt: 1 }) // oldest first (FIFO queue)
        .select('firstName lastName phone nic primaryCategory skills createdAt profilePhotoUrl');

    res.json({ success: true, data: workers, count: workers.length });
});

// ── GET /api/admin/workers/live ──────────────────────────────────────────────
export const getLiveWorkers = asyncHandler(async (req, res) => {
    const workers = await Worker.find({
        status: { $in: ['online', 'busy'] },
        isActive: true,
        isVerified: true,
        'location.coordinates': { $ne: [0, 0] },
    }).select('firstName lastName phone status primaryCategory location rating lastLocationUpdate');

    res.json({ success: true, data: workers });
});

// ── GET /api/admin/workers/:id ───────────────────────────────────────────────
export const getWorkerById = asyncHandler(async (req, res) => {
    const worker = await Worker.findById(req.params.id);
    if (!worker) {
        res.status(404);
        throw new Error('Worker not found');
    }

    // Also get their recent jobs
    const recentJobs = await ServiceJob.find({ workerId: req.params.id })
        .sort({ createdAt: -1 })
        .limit(10)
        .select('jobId status category customerName createdAt finalAmount rating');

    res.json({ success: true, data: { worker, recentJobs } });
});

// ── PATCH /api/admin/workers/:id/verify ─────────────────────────────────────
export const verifyWorker = asyncHandler(async (req, res) => {
    const { action, reason } = req.body; // action: 'approve' | 'reject'

    if (!['approve', 'reject'].includes(action)) {
        res.status(400);
        throw new Error("Action must be 'approve' or 'reject'");
    }
    if (action === 'reject' && !reason) {
        res.status(400);
        throw new Error('Rejection reason is required');
    }

    const worker = await Worker.findById(req.params.id);
    if (!worker) {
        res.status(404);
        throw new Error('Worker not found');
    }

    if (action === 'approve') {
        worker.verificationStatus = 'approved';
        worker.isVerified = true;
        worker.verifiedAt = new Date();
        worker.verifiedBy = req.user._id;
        worker.rejectionReason = undefined;
    } else {
        worker.verificationStatus = 'rejected';
        worker.isVerified = false;
        worker.rejectionReason = reason;
    }

    await worker.save();

    // Emit socket event for real-time dashboard update
    if (req.io) {
        req.io.to('admin_room').emit('verification_update', {
            workerId: worker._id,
            status: worker.verificationStatus,
            workerName: worker.fullName,
        });
    }

    res.json({
        success: true,
        message: `Worker ${action === 'approve' ? 'approved' : 'rejected'} successfully`,
        data: worker,
    });
});

// ── PATCH /api/admin/workers/:id/suspend ─────────────────────────────────────
export const suspendWorker = asyncHandler(async (req, res) => {
    const { suspend, reason } = req.body;
    const worker = await Worker.findById(req.params.id);
    if (!worker) {
        res.status(404);
        throw new Error('Worker not found');
    }

    worker.isSuspended = suspend;
    if (suspend) {
        worker.suspendedAt = new Date();
        worker.suspensionReason = reason || 'Administrative action';
        worker.status = 'offline';
    } else {
        worker.suspendedAt = undefined;
        worker.suspensionReason = undefined;
    }

    await worker.save();
    res.json({
        success: true,
        message: `Worker ${suspend ? 'suspended' : 'unsuspended'} successfully`,
        data: worker,
    });
});
