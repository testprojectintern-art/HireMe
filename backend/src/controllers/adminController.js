import asyncHandler from 'express-async-handler';
import Worker from '../models/Worker.js';
import ServiceJob from '../models/ServiceJob.js';
import Dispute from '../models/Dispute.js';

// ── GET /api/admin/stats ─────────────────────────────────────────────────────
export const getAdminStats = asyncHandler(async (req, res) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [
        activeWorkers,
        ongoingJobs,
        pendingVerifications,
        todayRevenue,
        totalWorkers,
        totalJobs,
        openDisputes,
        completedJobsToday,
    ] = await Promise.all([
        Worker.countDocuments({ status: { $in: ['online', 'busy'] }, isActive: true }),
        ServiceJob.countDocuments({ status: { $in: ['dispatched', 'in_progress'] } }),
        Worker.countDocuments({ verificationStatus: 'pending', isActive: true }),
        ServiceJob.aggregate([
            {
                $match: {
                    status: 'completed',
                    completedAt: { $gte: today, $lt: tomorrow },
                },
            },
            { $group: { _id: null, total: { $sum: '$platformFee' } } },
        ]),
        Worker.countDocuments({ isActive: true }),
        ServiceJob.countDocuments(),
        Dispute.countDocuments({ status: { $in: ['open', 'investigating'] } }),
        ServiceJob.countDocuments({
            status: 'completed',
            completedAt: { $gte: today, $lt: tomorrow },
        }),
    ]);

    // Weekly jobs trend (last 7 days)
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 6);
    weekAgo.setHours(0, 0, 0, 0);

    const weeklyJobsTrend = await ServiceJob.aggregate([
        { $match: { createdAt: { $gte: weekAgo } } },
        {
            $group: {
                _id: {
                    $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
                },
                count: { $sum: 1 },
                revenue: { $sum: '$platformFee' },
            },
        },
        { $sort: { _id: 1 } },
        { $project: { date: '$_id', count: 1, revenue: 1, _id: 0 } },
    ]);

    // Worker category breakdown
    const workerCategories = await Worker.aggregate([
        { $match: { isActive: true, isVerified: true } },
        { $group: { _id: '$primaryCategory', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $project: { category: '$_id', count: 1, _id: 0 } },
    ]);

    res.json({
        success: true,
        data: {
            kpis: {
                activeWorkers,
                ongoingJobs,
                pendingVerifications,
                todayRevenue: todayRevenue[0]?.total || 0,
                totalWorkers,
                totalJobs,
                openDisputes,
                completedJobsToday,
            },
            weeklyJobsTrend,
            workerCategories,
        },
    });
});

// ── GET /api/admin/activity-log ──────────────────────────────────────────────
export const getActivityLog = asyncHandler(async (req, res) => {
    const { limit = 20 } = req.query;

    // Fetch recent verifications, jobs, and disputes as activity items
    const [recentVerifications, recentJobs, recentDisputes] = await Promise.all([
        Worker.find({ verificationStatus: { $ne: 'pending' } })
            .sort({ updatedAt: -1 })
            .limit(parseInt(limit))
            .select('firstName lastName verificationStatus updatedAt rejectionReason'),
        ServiceJob.find()
            .sort({ updatedAt: -1 })
            .limit(parseInt(limit))
            .select('jobId status customerName category updatedAt'),
        Dispute.find()
            .sort({ createdAt: -1 })
            .limit(parseInt(limit))
            .select('type status priority createdAt'),
    ]);

    // Merge and sort into a unified activity log
    const activities = [
        ...recentVerifications.map((w) => ({
            id: w._id,
            type: 'verification',
            icon: w.verificationStatus === 'approved' ? 'check' : 'x',
            color: w.verificationStatus === 'approved' ? 'green' : 'red',
            text: `Worker ${w.firstName} ${w.lastName} was ${w.verificationStatus}`,
            timestamp: w.updatedAt,
        })),
        ...recentJobs.map((j) => ({
            id: j._id,
            type: 'job',
            icon: 'briefcase',
            color: 'blue',
            text: `Job ${j.jobId} (${j.category}) status: ${j.status}`,
            timestamp: j.updatedAt,
        })),
        ...recentDisputes.map((d) => ({
            id: d._id,
            type: 'dispute',
            icon: 'alert',
            color: d.priority === 'critical' ? 'red' : 'orange',
            text: `New ${d.priority} priority dispute: ${d.type.replace(/_/g, ' ')}`,
            timestamp: d.createdAt,
        })),
    ]
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, parseInt(limit));

    res.json({ success: true, data: activities });
});
