import mongoose from 'mongoose';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { Customer } from "../models/customer.model.js";
import { Service } from "../models/service.model.js";
import { User } from "../models/user.model.js";
import { getDateGroupFormat } from '../utils/reportsHelperFn.js';

const getDashboardReport = asyncHandler(async (req, res) => {
    const { range = '7d', employee = "all" } = req.query;

    const matchEmployee = employee !== 'all' ? { "selectedServices.assignedTo": mongoose.Types.ObjectId(employee) } : {};

    const unwind = { $unwind: "$selectedServices" }

    const overallStatsPipeline = [
        unwind,
        { $match: matchEmployee },
        {
            $group: {
                _id: null,
                totalRevenue: { $sum: "$selectedServices.serviceAmount" },
                totalPaid: { $sum: "$paidAmount" },
                totalDue: { $sum: "$dueAmount" },
                totalCustomers: { $addToSet: "$_id" }
            }
        },
        {
            $project: {
                _id: 0,
                totalRevenue: 1,
                totalPaid: 1,
                totalDue: 1,
                totalCustomers: { $size: "$totalCustomers" }
            }
        }
    ];

    const overallStats = (await Customer.aggregate(overallStatsPipeline))[0] || {
        totalRevenue: 0,
        totalPaid: 0,
        totalDue: 0,
        totalCustomers: 0
    };

    const serviceStatsPipeline = [
        unwind,
        { $match: matchEmployee },
        {
            $group: {
                _id: "$selectedServices.serviceStatus",
                count: { $sum: 1 }
            }
        },
        {
            $project: {
                _id: 0,
                serviceStatus: "$_id",
                count: 1
            }
        }
    ];

    const serviceStats = await Customer.aggregate(serviceStatsPipeline);

    const employeeStatsPipeline = [
        unwind,
        { $match: matchEmployee },
        {
            $group: {
                _id: "$selectedServices.assignedTo",
                revenue: { $sum: "$selectedServices.serviceAmount" },
                services: { $sum: 1 },
                completedCount: {
                    $sum: {
                        $cond: [{ $eq: ["$selectedServices.serviceStatus", "Completed"] }, 1, 0]
                    }
                },
                customersCompleted: {
                    $addToSet: {
                        $cond: [{ $eq: ["$selectedServices.serviceStatus", "Completed"] }, "$_id", "$$REMOVE"]
                    }
                }
            }
        },
        {
            $project: {
                _id: 1,
                revenue: 1,
                services: 1,
                completedPercent: { $multiply: [{ $divide: ["$completedCount", "$services"] }, 100] },
                customersCompleted: { $size: "$customersCompleted" }
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "_id",
                foreignField: "_id",
                as: "employee"
            }
        },
        {
            $unwind: { path: "$employee", preserveNullAndEmptyArrays: true }
        },
        {
            $project: {
                name: "$employee.fullName",
                revenue: 1,
                services: 1,
                completedPercent: 1,
                customersCompleted: 1
            }
        }
    ];

    const employeeStats = await Customer.aggregate(employeeStatsPipeline);

    // --- Step 6: Revenue Trend ---
    const dateFormat = getDateGroupFormat(range);
    const startDate = (() => {
        const now = new Date();
        switch (range) {
            case "1d": return new Date(now.setDate(now.getDate() - 1));
            case "7d": return new Date(now.setDate(now.getDate() - 7));
            case "1m": return new Date(now.setMonth(now.getMonth() - 1));
            case "3m": return new Date(now.setMonth(now.getMonth() - 3));
            case "6m": return new Date(now.setMonth(now.getMonth() - 6));
            case "1y": return new Date(now.setFullYear(now.getFullYear() - 1));
            case "life": return new Date("2000-01-01");
            default: return new Date(now.setDate(now.getDate() - 7));
        }
    })();

    const revenueTrendPipeline = [
        unwind,
        { $match: { ...matchEmployee, "selectedServices.deliveryDate": { $gte: startDate } } },
        {
            $group: {
                _id: {
                    $dateToString: { format: dateFormat, date: "$selectedServices.deliveryDate" }
                },
                revenue: { $sum: "$selectedServices.serviceAmount" }
            }
        },
        { $sort: { "_id": 1 } },
        { $project: { date: "$_id", revenue: 1, _id: 0 } }
    ];

    const revenueTrend = await Customer.aggregate(revenueTrendPipeline);

    return res.status(200).json(new ApiResponse(true, {
        overallStats,
        serviceStats,
        employeeStats,
        revenueTrend
    }, "Dashboard report fetched successfully"))
});

export { getDashboardReport };