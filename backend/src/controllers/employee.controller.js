import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { User } from '../models/user.model.js';


const createEmployee = asyncHandler(async (req, res, next) => {
    const { fullName, employeeId, username, email, password, role } = req.body;

    if ([!fullName, !employeeId, !username, !email, !password, !role].includes(undefined)) {
        throw new ApiError(400, 'All fields are required');
    }

    const existingUser = await User.findOne({ $or: [{ email }, { username }, { employeeId }] });

    if (existingUser) {
        throw new ApiError(409, 'User with given email, username or employeeId already exists');
    }

    const user = await User.create(
        {
            fullName,
            employeeId,
            username,
            email,
            password,
            role: role || 'employee'
        }
    );

    if (!user) {
        throw new ApiError(500, 'Failed to create user');
    }

    const createdUser = await User.findById(user._id).select('-password -refreshToken');

    return res.status(201).json(new ApiResponse(201, { createdUser }, 'Employee created successfully'));
});

const getAllEmployees = asyncHandler(async (req, res, next) => {
    const employees = await User.find({
        $and: [
            { role: { $in: ['employee'] } },
            { _id: { $ne: req.user._id } }
        ]
    }).select('-password -refreshToken');

    return res.status(200).json(new ApiResponse(200, { employees }, 'Employees fetched successfully'));
});

const getOneEmployee = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const employee = await User.findOne({
        $and: [
            { _id: id },
            { role: { $in: ['employee'] } }
        ]
    }).select('-password -refreshToken');

    if (!employee) {
        throw new ApiError(404, 'Employee not found');
    }

    return res.status(200).json(new ApiResponse(200, { employee }, 'Employee fetched successfully'));

});

const updateEmployee = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { fullName, employeeId, username, email, role } = req.body;

    const findEmployee = await User.findOne({ _id: id, role: 'employee' });

    if (!findEmployee) {
        throw new ApiError(404, 'Employee not found');
    }

    const uniqueFields = { email, username, employeeId };
    for (const [key, value] of Object.entries(uniqueFields)) {
        if (value && value !== findEmployee[key]) {
            const exists = await User.findOne({ [key]: value });
            if (exists) {
                throw new ApiError(409, `${key.charAt(0).toUpperCase() + key.slice(1)} already in use`);
            }
        }
    }

    const updateData = {};
    if (fullName) updateData.fullName = fullName;
    if (email) updateData.email = email;
    if (username) updateData.username = username;
    if (employeeId) updateData.employeeId = employeeId;
    if (role) updateData.role = role;

    const employee = await User.findByIdAndUpdate(id, updateData, {
        new: true,
        select: '-password -refreshToken'
    });

    return res.status(200).json(new ApiResponse(200, { employee }, 'Employee updated successfully'));
});

const deleteEmployee = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const employee = await User.findOne({
        $and: [
            { _id: id },
            { role: { $in: ['employee'] } }
        ]
    });

    if (!employee) {
        throw new ApiError(404, 'Employee not found');
    }

    await User.findByIdAndDelete(id);

    return res.status(200).json(new ApiResponse(200, {}, 'Employee deleted successfully'));
});

export {
    createEmployee,
    getAllEmployees,
    getOneEmployee,
    updateEmployee,
    deleteEmployee
};