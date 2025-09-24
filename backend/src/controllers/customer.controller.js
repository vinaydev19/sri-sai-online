import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { Customer } from "../models/customer.model.js";


const createCustomer = asyncHandler(async (req, res) => {
    const {
        customerId,
        fullName,
        MobileNumber,
        totalAmount,
        paidAmount,
        dueAmount,
        paymentMode,
        note,
        requiredDocuments,
        deliveryDate,
        selectedServices,
    } = req.body;

    if (!customerId || !fullName || !MobileNumber || !totalAmount || !dueAmount || !userId) {
        return next(new ApiError(400, 'Customer ID, Name, Mobile, Total Amount, Due Amount, and User ID are required'));
    }


    const existingCustomer = await Customer.findOne({ customerId });

    if (existingCustomer) {
        return next(new ApiError(400, 'Customer with this ID already exists'));
    }

    const customer = await Customer.create({
        customerId,
        fullName,
        MobileNumber,
        totalAmount,
        paidAmount,
        dueAmount,
        paymentMode,
        note,
        requiredDocuments,
        deliveryDate,
        selectedServices,
        userId: req.user._id
    });

    res.status(201).json(new ApiResponse(201, { customer }, 'Customer created successfully'));
});

const getCustomers = asyncHandler(async (req, res) => {
    const customers = await Customer.find({ userId: req.user._id });
    res.status(200).json(new ApiResponse(200, { customers }, 'Customers retrieved successfully'));
});

const getCustomerById = asyncHandler(async (req, res, next) => {
    const id = req.params.id;

    const customer = await Customer.findOne({ _id: id, userId: req.user._id });

    if (!customer) {
        return next(new ApiError(404, 'Customer not found'));
    }

    res.status(200).json(new ApiResponse(200, { customer }, 'Customer retrieved successfully'));
});

export const updateCustomer = asyncHandler(async (req, res, next) => {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
        return next(new ApiError(404, 'Customer not found'));
    }

    const { fullName, MobileNumber, totalAmount, paidAmount, dueAmount, paymentMode, note, requiredDocuments, deliveryDate, selectedServices, overStatus } = req.body;

    customer.fullName = fullName || customer.fullName;
    customer.MobileNumber = MobileNumber || customer.MobileNumber;
    customer.totalAmount = totalAmount || customer.totalAmount;
    customer.paidAmount = paidAmount != null ? paidAmount : customer.paidAmount;
    customer.dueAmount = dueAmount || customer.dueAmount;
    customer.paymentMode = paymentMode || customer.paymentMode;
    customer.note = note || customer.note;
    customer.requiredDocuments = requiredDocuments || customer.requiredDocuments;
    customer.deliveryDate = deliveryDate || customer.deliveryDate;
    customer.selectedServices = selectedServices || customer.selectedServices;
    customer.overStatus = overStatus || customer.overStatus;

    await customer.save();
    res.status(200).json(new ApiResponse(true, 200, 'Customer updated successfully', customer));
});

export const deleteCustomer = asyncHandler(async (req, res, next) => {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
        return next(new ApiError(404, 'Customer not found'));
    }

    await customer.remove();
    res.status(200).json(new ApiResponse(true, 200, 'Customer deleted successfully'));
});

export {
    createCustomer,
    getCustomers,
    getCustomerById,
    updateCustomer,
    deleteCustomer
};