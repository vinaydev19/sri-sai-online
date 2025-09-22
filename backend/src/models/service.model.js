import monogoose from 'mongoose';

const serviceSchema = new monogoose.Schema({
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
    requiredDocuments: {
        type: [String],
        default: []
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
        type: monogoose.Schema.Types.ObjectId,
        ref: 'User',
    },
})

export const Service = monogoose.model('Service', serviceSchema);