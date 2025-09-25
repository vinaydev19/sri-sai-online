import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { Service } from '../models/service.model.js';


const createService = asyncHandler(async (req, res, next) => {
    const { serviceId, serviceName, serviceAmount, requiredDocuments, note, serviceStatus, assignedTo } = req.body;

    if (!serviceId || !serviceName || !serviceAmount) {
        return next(new ApiError(400, 'Service ID, Name and Amount are required'));
    }

    const existingService = await Service.findOne({ serviceId });

    if (existingService) {
        return next(new ApiError(400, 'Service with this ID already exists'));
    }

    const service = await Service.create({
        serviceId,
        serviceName,
        serviceAmount,
        requiredDocuments,
        note,
        serviceStatus,
        assignedTo,
        userId: req.user._id
    });

    if (!service) {
        return next(new ApiError(500, 'Failed to create service'));
    }

    res.status(201).json(new ApiResponse(201, { service }, 'Service created successfully'));
})

const getAllServices = asyncHandler(async (req, res, next) => {
    const services = await Service.find({ userId: req.user._id });

    res.status(200).json(new ApiResponse(200, { services }, 'Services retrieved successfully'));
});

const getServiceById = asyncHandler(async (req, res, next) => {
    const id = req.params.id;

    const service = await Service.findOne({ _id: id, userId: req.user._id });

    if (!service) {
        return next(new ApiError(404, 'Service not found'));
    }

    res.status(200).json(new ApiResponse(200, { service }, 'Service retrieved successfully'));
});

const updateService = asyncHandler(async (req, res, next) => {
    const id = req.params.id;
    const { serviceId, serviceName, serviceAmount, requiredDocuments, note, serviceStatus, assignedTo } = req.body;

    const service = await Service.findOne({ _id: id, userId: req.user._id });

    if (!service) {
        return next(new ApiError(404, 'Service not found'));
    }

    service.serviceId = serviceId || service.serviceId;
    service.serviceName = serviceName || service.serviceName;
    service.serviceAmount = serviceAmount || service.serviceAmount;
    service.requiredDocuments = requiredDocuments || service.requiredDocuments;
    service.note = note || service.note;
    service.status = serviceStatus || service.status;
    service.assignedTo = assignedTo || service.assignedTo;

    await service.save();

    res.status(200).json(new ApiResponse(200, { service }, 'Service updated successfully'));
});

const deleteService = asyncHandler(async (req, res, next) => {
    const id = req.params.id;

    const service = await Service.findOneAndDelete({ _id: id, userId: req.user._id });

    if (!service) {
        return next(new ApiError(404, 'Service not found'));
    }

    res.status(200).json(new ApiResponse(200, {}, 'Service deleted successfully'));
});


export {
    createService,
    getAllServices,
    getServiceById,
    updateService,
    deleteService
};