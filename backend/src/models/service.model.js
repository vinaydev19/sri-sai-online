import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
    serviceId: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    serviceName: {
        type: String,
        required: true,
        trim: true
    },
    serviceAmount: {
        type: Number,
        required: true,
    },
    note: {
        type: String,
        trim: true
    },
    serviceStatus: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

export const Service = mongoose.model('Service', serviceSchema);