import mongoose from 'mongoose';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { Customer } from "../models/customer.model.js";
import { generateCustomerId } from '../utils/generateId.js';


const createCustomer = asyncHandler(async (req, res) => {
    const {
        fullName,
        MobileNumber,
        totalAmount,
        paidAmount,
        dueAmount,
        paymentMode,
        note,
        deliveryDate,
        selectedServices,
    } = req.body;

    const customerId = await generateCustomerId()

    if (!customerId || !fullName || !MobileNumber || !totalAmount || !dueAmount) {
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
        deliveryDate,
        selectedServices,
        userId: req.user._id
    });

    res.status(201).json(new ApiResponse(201, { customer }, 'Customer created successfully'));
});

const getCustomers = asyncHandler(async (req, res) => {

    const customers = await Customer.aggregate([
        { $match: { userId: new mongoose.Types.ObjectId(req.user._id) } },
        {
            $lookup: {
                from: 'services',
                localField: 'selectedServices.serviceId',
                foreignField: '_id',
                as: 'serviceDetails'
            }
        },
        {
            $addFields: {
                dueAmount: { $subtract: ['$totalAmount', '$paidAmount'] }
            }
        },
        { $sort: { createdAt: -1 } }
    ]);

    res.status(200).json(
        new ApiResponse(200, { customers }, 'Customers retrieved successfully')
    );
});

const getCustomerById = asyncHandler(async (req, res, next) => {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return next(new ApiError(400, 'Invalid customer ID'));
    }

    const customer = await Customer.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(id),
                userId: new mongoose.Types.ObjectId(req.user._id)
            }
        },
        {
            $lookup: {
                from: 'services',
                localField: 'selectedServices.serviceId',
                foreignField: '_id',
                as: 'serviceDetails'
            }
        },
        {
            $addFields: {
                dueAmount: { $subtract: ['$totalAmount', '$paidAmount'] }
            }
        },
    ]);

    if (!customer || customer.length === 0) {
        return next(new ApiError(404, 'Customer not found'));
    }

    res.status(200).json(new ApiResponse(200, { customer: customer[0] }, 'Customer retrieved successfully'));
});

const updateCustomer = asyncHandler(async (req, res, next) => {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
        return next(new ApiError(404, 'Customer not found'));
    }

    const { fullName, MobileNumber, totalAmount, paidAmount, dueAmount, paymentMode, note, deliveryDate, selectedServices, overStatus } = req.body;

    customer.fullName = fullName || customer.fullName;
    customer.MobileNumber = MobileNumber || customer.MobileNumber;
    customer.totalAmount = totalAmount || customer.totalAmount;
    customer.paidAmount = paidAmount != null ? paidAmount : customer.paidAmount;
    customer.dueAmount = dueAmount || customer.dueAmount;
    customer.paymentMode = paymentMode || customer.paymentMode;
    customer.note = note || customer.note;
    customer.deliveryDate = deliveryDate || customer.deliveryDate;
    customer.selectedServices = selectedServices || customer.selectedServices;
    customer.overStatus = overStatus || customer.overStatus;

    await customer.save();
    res.status(200).json(new ApiResponse(true, 200, 'Customer updated successfully', customer));
});

const deleteCustomer = asyncHandler(async (req, res, next) => {
    const id = req.params.id;

    const customer = await Customer.findByIdAndDelete(id);

    if (!customer) {
        return next(new ApiError(404, 'Customer not found'));
    }

    res.status(200).json(new ApiResponse(true, 200, 'Customer deleted successfully'));
});

const getNextCustomerId = asyncHandler(async (req, res, next) => {
    const nextId = await generateCustomerId();

    res.status(200).json(new ApiResponse(200, { nextId }, 'Next Service ID generated successfully'));
});
export {
    createCustomer,
    getCustomers,
    getCustomerById,
    updateCustomer,
    deleteCustomer,
    getNextCustomerId
};