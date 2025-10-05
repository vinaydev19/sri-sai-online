import mongoose from "mongoose";

const serviceRequestSchema = new mongoose.Schema({
    serviceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service',
        required: true
    },
    serviceName: {
        type: String,
        required: true,
        trim: true
    },
    applicationNumber: {
        type: String,
        trim: true
    },
    serviceAmount: {
        type: Number,
        required: true,
    },
    serviceStatus: {
        type: String,
        enum: ["Pending Docs", "Pending", "Apply", "In Progress", "Submitted", "Completed", "Delivered", "Cancelled"],
        default: 'Pending'
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    note: {
        type: String,
        trim: true
    },
})

const customerSchema = new mongoose.Schema({
    customerId: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    mobileNumber: {
        type: String,
        required: true,
        trim: true
    },
    totalAmount: {
        type: Number,
        required: true,
    },
    paidAmount: {
        type: Number,
        required: true,
        default: 0
    },
    dueAmount: {
        type: Number,
        required: true,
    },
    paymentMode: {
        type: String,
        enum: ["Cash", "Card", "Online", "UPI", "Net Banking"],
        default: 'Cash'
    },
    overStatus: {
        type: String,
        enum: ["Pending Docs", "Pending", "Apply", "In Progress", "Submitted", "Completed", "Delivered", "Cancelled"],
        default: 'Pending'
    },
    note: {
        type: String,
        trim: true
    },
    deliveryDate: {
        type: Date,
    },
    selectedServices: {
        type: [serviceRequestSchema],
        default: []
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

export const Customer = mongoose.model('Customer', customerSchema);