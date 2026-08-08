import asyncHandler from 'express-async-handler';
import ServiceJob from '../models/ServiceJob.js';
import Worker from '../models/Worker.js';

// ── GET /api/admin/jobs ───────────────────────────────────────────────────────
export const getJobs = asyncHandler(async (req, res) => {
    const {
        page = 1,
        limit = 20,
        search = '',
        status,
        category,
        startDate,
        endDate,
    } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (startDate || endDate) {
        filter.createdAt = {};
        if (startDate) filter.createdAt.$gte = new Date(startDate);
        if (endDate)   filter.createdAt.$lte = new Date(endDate);
    }
    if (search) {
        filter.$or = [
            { jobId: { $regex: search, $options: 'i' } },
            { customerName: { $regex: search, $options: 'i' } },
            { customerPhone: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } },
        ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [jobs, total] = await Promise.all([
        ServiceJob.find(filter)
            .populate('workerId', 'firstName lastName phone rating')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit)),
        ServiceJob.countDocuments(filter),
    ]);

    res.json({
        success: true,
        data: jobs,
        pagination: {
            total,
            page: parseInt(page),
            limit: parseInt(limit),
            pages: Math.ceil(total / parseInt(limit)),
        },
    });
});

// ── GET /api/admin/jobs/live ──────────────────────────────────────────────────
export const getLiveJobs = asyncHandler(async (req, res) => {
    const jobs = await ServiceJob.find({
        status: { $in: ['dispatched', 'in_progress'] },
    })
        .populate('workerId', 'firstName lastName phone status location primaryCategory rating')
        .select('jobId category status customerName customerPhone address location workerId dispatchedAt startedAt');

    res.json({ success: true, data: jobs });
});

// ── GET /api/admin/jobs/:id ───────────────────────────────────────────────────
export const getJobById = asyncHandler(async (req, res) => {
    const job = await ServiceJob.findById(req.params.id)
        .populate('workerId', 'firstName lastName phone rating status location primaryCategory');

    if (!job) {
        res.status(404);
        throw new Error('Job not found');
    }

    res.json({ success: true, data: job });
});

// ── PATCH /api/admin/jobs/:id/reassign ───────────────────────────────────────
export const reassignJob = asyncHandler(async (req, res) => {
    const { workerId, note } = req.body;

    const [job, worker] = await Promise.all([
        ServiceJob.findById(req.params.id),
        Worker.findById(workerId),
    ]);

    if (!job) { res.status(404); throw new Error('Job not found'); }
    if (!worker) { res.status(404); throw new Error('Worker not found'); }
    if (!worker.isVerified) { res.status(400); throw new Error('Worker is not verified'); }
    if (worker.isSuspended) { res.status(400); throw new Error('Worker is suspended'); }

    const previousWorkerId = job.workerId;
    job.workerId = workerId;

    // If previous worker had this job, free them up
    if (previousWorkerId) {
        await Worker.findByIdAndUpdate(previousWorkerId, { status: 'online' });
    }
    // Set new worker as busy
    await Worker.findByIdAndUpdate(workerId, { status: 'busy' });

    // Add timeline event
    job.timeline.push({
        event: 'reassigned',
        note: note || `Reassigned from admin to ${worker.fullName}`,
        by: req.user._id,
    });
    job.status = 'dispatched';

    await job.save();

    // Emit socket event
    if (req.io) {
        req.io.to('admin_room').emit('job_update', {
            jobId: job._id,
            status: 'dispatched',
            workerId,
        });
    }

    res.json({ success: true, message: 'Job reassigned successfully', data: job });
});

// ── GET /api/admin/jobs/export ────────────────────────────────────────────────
export const exportJobs = asyncHandler(async (req, res) => {
    const { status, category, startDate, endDate } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (startDate || endDate) {
        filter.createdAt = {};
        if (startDate) filter.createdAt.$gte = new Date(startDate);
        if (endDate)   filter.createdAt.$lte = new Date(endDate);
    }

    const jobs = await ServiceJob.find(filter)
        .populate('workerId', 'firstName lastName phone')
        .sort({ createdAt: -1 })
        .limit(5000);

    // Build CSV
    const header = ['Job ID','Category','Status','Customer','Customer Phone','Worker','Quoted','Final','Platform Fee','Worker Payout','Rating','Created At'];
    const rows = jobs.map((j) => [
        j.jobId,
        j.category,
        j.status,
        j.customerName,
        j.customerPhone,
        j.workerId ? `${j.workerId.firstName} ${j.workerId.lastName}` : '-',
        j.quotedAmount,
        j.finalAmount,
        j.platformFee,
        j.workerPayout,
        j.rating || '-',
        new Date(j.createdAt).toLocaleString(),
    ]);

    const csv = [header, ...rows].map((r) => r.join(',')).join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=jobs-export.csv');
    res.send(csv);
});
