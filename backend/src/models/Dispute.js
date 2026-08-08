import mongoose from 'mongoose';

const disputeSchema = new mongoose.Schema(
    {
        jobId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'ServiceJob',
            required: true,
        },

        // Who filed the dispute
        reportedBy: {
            type: String,
            enum: ['customer', 'worker', 'admin'],
            required: true,
        },
        reporterId: {
            type: mongoose.Schema.Types.ObjectId,
        },

        // Dispute type
        type: {
            type: String,
            enum: ['low_rating', 'safety_concern', 'payment_issue', 'no_show', 'misconduct', 'other'],
            required: true,
        },

        // Description
        description: { type: String, trim: true, required: true },

        // Evidence (Cloudinary URLs)
        evidenceUrls: [{ type: String }],

        // Status
        status: {
            type: String,
            enum: ['open', 'investigating', 'resolved', 'dismissed'],
            default: 'open',
        },

        // Resolution
        resolution:  { type: String, trim: true },
        resolvedAt:  { type: Date },
        resolvedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },

        // Account actions taken
        workerSuspended:   { type: Boolean, default: false },
        customerSuspended: { type: Boolean, default: false },
        suspensionNote:    { type: String, trim: true },

        // Admin notes
        adminNotes: [
            {
                note:       { type: String },
                addedBy:    { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
                addedAt:    { type: Date, default: Date.now },
            },
        ],

        // Priority
        priority: {
            type: String,
            enum: ['low', 'medium', 'high', 'critical'],
            default: 'medium',
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

disputeSchema.index({ status: 1 });
disputeSchema.index({ jobId: 1 });
disputeSchema.index({ createdAt: -1 });
disputeSchema.index({ type: 1 });

const Dispute = mongoose.model('Dispute', disputeSchema);
export default Dispute;
