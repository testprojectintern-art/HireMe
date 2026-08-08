import mongoose from 'mongoose';
import Counter, { getNextSequence } from './Counter.js';

const timelineEventSchema = new mongoose.Schema(
    {
        event: { type: String }, // e.g. "dispatched", "worker_arrived", "job_started", "completed"
        note:  { type: String },
        by:    { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        timestamp: { type: Date, default: Date.now },
        location: {
            type: { type: String, enum: ['Point'] },
            coordinates: { type: [Number] },
        },
    },
    { _id: false }
);

const serviceJobSchema = new mongoose.Schema(
    {
        jobId: { type: String, unique: true }, // e.g. "JOB-0001"

        // Parties
        customerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Customer',
            default: null,
        },
        customerName:  { type: String, trim: true },
        customerPhone: { type: String, trim: true },
        workerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Worker',
            default: null,
        },

        // Job Details
        category: {
            type: String,
            enum: ['Plumber', 'Electrician', 'Carpenter', 'Coconut Plucker', 'Painter', 'Mason', 'Cleaner', 'Other'],
            default: 'Other',
        },
        description: { type: String, trim: true },

        // Status
        status: {
            type: String,
            enum: ['pending', 'dispatched', 'in_progress', 'completed', 'cancelled', 'disputed'],
            default: 'pending',
        },

        // Location
        location: {
            type: { type: String, enum: ['Point'], default: 'Point' },
            coordinates: { type: [Number], default: [0, 0] }, // [lng, lat]
        },
        address: { type: String, trim: true },

        // Financials
        quotedAmount:   { type: Number, default: 0 },
        finalAmount:    { type: Number, default: 0 },
        platformFee:    { type: Number, default: 0 },
        workerPayout:   { type: Number, default: 0 },
        commissionRate: { type: Number, default: 10 }, // %

        // Rating
        rating:       { type: Number, min: 0, max: 5 },
        reviewText:   { type: String, trim: true },
        ratedAt:      { type: Date },

        // Admin
        customerNote: { type: String, trim: true },
        adminNote:    { type: String, trim: true },
        isDisputed:   { type: Boolean, default: false },

        // Timeline
        timeline: [timelineEventSchema],

        // Timestamps for key events
        dispatchedAt:  { type: Date },
        startedAt:     { type: Date },
        completedAt:   { type: Date },
        cancelledAt:   { type: Date },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// 2dsphere index for geospatial queries
serviceJobSchema.index({ location: '2dsphere' });
serviceJobSchema.index({ status: 1 });
serviceJobSchema.index({ workerId: 1 });
serviceJobSchema.index({ customerId: 1 });
serviceJobSchema.index({ createdAt: -1 });

// Auto-generate jobId before save
serviceJobSchema.pre('save', async function (next) {
    if (!this.isNew) return next();
    try {
        const seq = await getNextSequence('serviceJobId');
        this.jobId = `JOB-${String(seq).padStart(4, '0')}`;
    } catch (err) {
        return next(err);
    }
    next();
});

// Calculate platform fee & worker payout on finalAmount save
serviceJobSchema.pre('save', function (next) {
    if (this.isModified('finalAmount') || this.isModified('commissionRate')) {
        this.platformFee  = parseFloat(((this.finalAmount * this.commissionRate) / 100).toFixed(2));
        this.workerPayout = parseFloat((this.finalAmount - this.platformFee).toFixed(2));
    }
    next();
});

const ServiceJob = mongoose.model('ServiceJob', serviceJobSchema);
export default ServiceJob;
