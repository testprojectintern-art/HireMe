import asyncHandler from 'express-async-handler';
import Dispute from '../models/Dispute.js';
import Worker from '../models/Worker.js';
import ServiceJob from '../models/ServiceJob.js';

// ── GET /api/admin/disputes ───────────────────────────────────────────────────
export const getDisputes = asyncHandler(async (req, res) => {
    const {
        page = 1,
        limit = 20,
        status,
        type,
        priority,
    } = req.query;

    const filter = {};
    if (status)   filter.status = status;
    if (type)     filter.type = type;
    if (priority) filter.priority = priority;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [disputes, total] = await Promise.all([
        Dispute.find(filter)
            .populate('jobId', 'jobId category customerName workerId')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit)),
        Dispute.countDocuments(filter),
    ]);

    res.json({
        success: true,
        data: disputes,
        pagination: {
            total,
            page: parseInt(page),
            limit: parseInt(limit),
            pages: Math.ceil(total / parseInt(limit)),
        },
    });
});

// ── GET /api/admin/disputes/:id ───────────────────────────────────────────────
export const getDisputeById = asyncHandler(async (req, res) => {
    const dispute = await Dispute.findById(req.params.id)
        .populate({
            path: 'jobId',
            select: 'jobId category status customerName customerPhone workerId rating reviewText createdAt',
            populate: { path: 'workerId', select: 'firstName lastName phone rating' },
        })
        .populate('resolvedBy', 'firstName lastName');

    if (!dispute) {
        res.status(404);
        throw new Error('Dispute not found');
    }

    res.json({ success: true, data: dispute });
});

// ── PATCH /api/admin/disputes/:id/resolve ─────────────────────────────────────
export const resolveDispute = asyncHandler(async (req, res) => {
    const { resolution, status = 'resolved' } = req.body;

    if (!resolution) {
        res.status(400);
        throw new Error('Resolution note is required');
    }

    const dispute = await Dispute.findById(req.params.id);
    if (!dispute) {
        res.status(404);
        throw new Error('Dispute not found');
    }

    dispute.status = status;
    dispute.resolution = resolution;
    dispute.resolvedAt = new Date();
    dispute.resolvedBy = req.user._id;

    // Add to admin notes
    dispute.adminNotes.push({
        note: `[${status.toUpperCase()}] ${resolution}`,
        addedBy: req.user._id,
    });

    await dispute.save();

    res.json({ success: true, message: 'Dispute resolved successfully', data: dispute });
});

// ── PATCH /api/admin/disputes/:id/suspend ─────────────────────────────────────
export const suspendFromDispute = asyncHandler(async (req, res) => {
    const { suspendWorker, suspendCustomer, reason } = req.body;

    const dispute = await Dispute.findById(req.params.id).populate('jobId');
    if (!dispute) {
        res.status(404);
        throw new Error('Dispute not found');
    }

    const updates = [];

    if (suspendWorker && dispute.jobId?.workerId) {
        updates.push(
            Worker.findByIdAndUpdate(dispute.jobId.workerId, {
                isSuspended: true,
                suspendedAt: new Date(),
                suspensionReason: reason || `Suspended due to dispute #${dispute._id}`,
                status: 'offline',
            })
        );
        dispute.workerSuspended = true;
    }

    if (suspendCustomer && dispute.jobId?.customerId) {
        // If customer is in User model, suspend them similarly
        updates.push(
            ServiceJob.updateMany(
                { customerId: dispute.jobId.customerId, status: 'pending' },
                { status: 'cancelled', adminNote: `Auto-cancelled due to customer suspension` }
            )
        );
        dispute.customerSuspended = true;
    }

    dispute.suspensionNote = reason;
    dispute.adminNotes.push({
        note: `Account suspension applied: worker=${suspendWorker}, customer=${suspendCustomer}. Reason: ${reason}`,
        addedBy: req.user._id,
    });

    await Promise.all([...updates, dispute.save()]);

    res.json({ success: true, message: 'Suspension applied successfully', data: dispute });
});

// ── POST /api/admin/disputes/:id/notes ───────────────────────────────────────
export const addDisputeNote = asyncHandler(async (req, res) => {
    const { note } = req.body;
    const dispute = await Dispute.findById(req.params.id);
    if (!dispute) {
        res.status(404);
        throw new Error('Dispute not found');
    }

    dispute.adminNotes.push({ note, addedBy: req.user._id });
    await dispute.save();

    res.json({ success: true, message: 'Note added', data: dispute });
});
