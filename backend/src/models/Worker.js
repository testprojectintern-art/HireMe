import mongoose from 'mongoose';

const workerSchema = new mongoose.Schema(
    {
        // Link to User account (for login credentials)
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null,
        },
        // Personal Info
        firstName:   { type: String, required: true, trim: true },
        lastName:    { type: String, required: true, trim: true },
        phone:       { type: String, required: true, trim: true },
        email:       { type: String, trim: true, lowercase: true },
        address:     { type: String, trim: true },
        nic:         { type: String, trim: true },

        // Skills & Category
        skills: [{ type: String, trim: true }],
        primaryCategory: {
            type: String,
            enum: ['Plumber', 'Electrician', 'Carpenter', 'Coconut Plucker', 'Painter', 'Mason', 'Cleaner', 'Other'],
            default: 'Other',
        },

        // Reference contacts
        referencePhones: [{ type: String, trim: true }],

        // Verification
        verificationStatus: {
            type: String,
            enum: ['pending', 'approved', 'rejected'],
            default: 'pending',
        },
        isVerified: { type: Boolean, default: false },
        rejectionReason: { type: String, trim: true },
        verifiedAt:  { type: Date },
        verifiedBy:  { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

        // Documents (Cloudinary URLs)
        nicFrontUrl: { type: String },
        nicBackUrl:  { type: String },
        certificates: [
            {
                title: { type: String },
                url:   { type: String },
                uploadedAt: { type: Date, default: Date.now },
            },
        ],
        profilePhotoUrl: { type: String },

        // Live Status
        status: {
            type: String,
            enum: ['offline', 'online', 'busy'],
            default: 'offline',
        },

        // GeoJSON location (for geospatial queries)
        location: {
            type: { type: String, enum: ['Point'], default: 'Point' },
            coordinates: { type: [Number], default: [0, 0] }, // [lng, lat]
        },
        lastLocationUpdate: { type: Date },

        // Performance
        rating:    { type: Number, default: 0, min: 0, max: 5 },
        totalJobs: { type: Number, default: 0 },
        totalRatings: { type: Number, default: 0 },

        // Account flags
        isActive:   { type: Boolean, default: true },
        isSuspended: { type: Boolean, default: false },
        suspendedAt: { type: Date },
        suspensionReason: { type: String },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// 2dsphere index for geospatial queries
workerSchema.index({ location: '2dsphere' });
workerSchema.index({ verificationStatus: 1 });
workerSchema.index({ status: 1 });
workerSchema.index({ primaryCategory: 1 });

// Virtual: full name
workerSchema.virtual('fullName').get(function () {
    return `${this.firstName} ${this.lastName}`;
});

const Worker = mongoose.model('Worker', workerSchema);
export default Worker;
