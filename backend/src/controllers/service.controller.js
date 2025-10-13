import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { Service } from '../models/service.model.js';
import { generateServiceId } from '../utils/generateId.js';
import mongoose from 'mongoose';


const createService = asyncHandler(async (req, res, next) => {
    if (req.user.role === 'employee') {
        throw new ApiError(403, 'Employees are not allowed to create services');
    }

    const { serviceId, serviceName, serviceAmount, note, serviceStatus, assignedTo } = req.body;

    if (!serviceId || !serviceName || !serviceAmount) {
        throw new ApiError(400, 'Service ID, Name, Amount, and User ID are required');
    }

    const existingService = await Service.findOne({ serviceId });

    if (existingService) {
        throw new ApiError(400, 'Service with this ID already exists');
    }

    const service = await Service.create({
        serviceId,
        serviceName,
        serviceAmount,
        note,
        serviceStatus,
        assignedTo,
        userId: req.user._id
    });

    if (!service) {
        throw new ApiError(500, 'Failed to create service');
    }

    res.status(201).json(new ApiResponse(201, { service }, 'Service created successfully'));
})

const getAllServices = asyncHandler(async (req, res, next) => {

    let match = {};

    if (req.user.role === 'admin') {
        // Admin sees all services they created
        match.userId = new mongoose.Types.ObjectId(req.user._id);
    } else if (req.user.role === 'employee') {
        // Employee sees only services assigned to them
        match.assignedTo = new mongoose.Types.ObjectId(req.user._id);
    }

    const services = await Service.aggregate([
        { $match: match },
        {
            $lookup: {
                from: 'users',
                localField: 'assignedTo',
                foreignField: '_id',
                as: 'assignedToDetails'
            }
        },
        {
            $unwind: {
                path: '$assignedToDetails',
                preserveNullAndEmptyArrays: true
            }
        },
        { $sort: { createdAt: -1 } },
        {
            $project: {
                _id: 1,
                serviceId: 1,
                serviceName: 1,
                serviceAmount: 1,
                note: 1,
                serviceStatus: 1,
                assignedTo: 1,
                'assignedToDetails.fullName': 1,
                'assignedToDetails.email': 1,
                'assignedToDetails.employeeId': 1,
                createdAt: 1,
                updatedAt: 1
            }
        }
    ]);

    res.status(200).json(new ApiResponse(200, { services }, 'Services retrieved successfully'));
});

const getServiceById = asyncHandler(async (req, res, next) => {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, 'Invalid service ID');
    }

    const service = await Service.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(id),
                userId: new mongoose.Types.ObjectId(req.user._id)
            }
        },
        {
            $lookup: {
                from: 'users',
                localField: 'assignedTo',
                foreignField: '_id',
                as: 'assignedToDetails'
            }
        },
        {
            $unwind: {
                path: '$assignedToDetails',
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $project: {
                _id: 1,
                serviceId: 1,
                serviceName: 1,
                serviceAmount: 1,
                note: 1,
                serviceStatus: 1,
                assignedTo: 1,
                'assignedToDetails.fullName': 1,
                'assignedToDetails.email': 1,
                'assignedToDetails.employeeId': 1,
                createdAt: 1,
                updatedAt: 1
            }
        }
    ]);

    if (!service || service.length === 0) {
        return next(new ApiError(404, 'Service not found'));
    }

    res.status(200).json(new ApiResponse(200, { service: service[0] }, 'Service retrieved successfully'));
});

const updateService = asyncHandler(async (req, res, next) => {
    if (req.user.role === 'employee') {
        throw new ApiError(403, 'Employees are not allowed to update services');
    }

    const id = req.params.id;
    const { serviceId, serviceName, serviceAmount, note, serviceStatus, assignedTo } = req.body;

    const service = await Service.findOne({ _id: id, userId: req.user._id });

    if (!service) {
        throw new ApiError(404, 'Service not found');
    }

    service.serviceId = serviceId || service.serviceId;
    service.serviceName = serviceName || service.serviceName;
    service.serviceAmount = serviceAmount || service.serviceAmount;
    service.note = note || service.note;
    service.serviceStatus = serviceStatus || service.serviceStatus;
    service.assignedTo = assignedTo || service.assignedTo;

    await service.save();

    res.status(200).json(new ApiResponse(200, { service }, 'Service updated successfully'));
});

const deleteService = asyncHandler(async (req, res, next) => {
    if (req.user.role === 'employee') {
        throw new ApiError(403, 'Employees are not allowed to delete services');
    }

    const id = req.params.id;

    const service = await Service.findOneAndDelete({ _id: id, userId: req.user._id });

    if (!service) {
        throw new ApiError(404, 'Service not found');
    }

    res.status(200).json(new ApiResponse(200, {}, 'Service deleted successfully'));
});

const getNextServiceId = asyncHandler(async (req, res, next) => {
    const nextId = await generateServiceId();

    res.status(200).json(new ApiResponse(200, { nextId }, 'Next Service ID generated successfully'));
});


export {
    createService,
    getAllServices,
    getServiceById,
    updateService,
    deleteService,
    getNextServiceId
};