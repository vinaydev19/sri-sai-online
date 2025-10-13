import mongoose from 'mongoose';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { Customer } from "../models/customer.model.js";
import { getDateGroupFormat } from '../utils/reportsHelperFn.js';

// ✅ Dashboard Report Controller
const getDashboardReport = asyncHandler(async (req, res) => {
    const { range = '7d', employee = "all" } = req.query;

    // ✅ Employee filter (if employee !== all)
    const matchEmployee =
        employee !== 'all'
            ? { "selectedServices.assignedTo": new mongoose.Types.ObjectId(employee) }
            : {};

    // ✅ Clone-safe date handling
    const now = new Date();
    const startDate = (() => {
        const d = new Date(now); // clone before modifying
        switch (range) {
            case "1d": return new Date(d.setDate(d.getDate() - 1));
            case "7d": return new Date(d.setDate(d.getDate() - 7));
            case "1m": return new Date(d.setMonth(d.getMonth() - 1));
            case "3m": return new Date(d.setMonth(d.getMonth() - 3));
            case "6m": return new Date(d.setMonth(d.getMonth() - 6));
            case "1y": return new Date(d.setFullYear(d.getFullYear() - 1));
            case "life": return new Date("2000-01-01");
            default: return new Date(d.setDate(d.getDate() - 7));
        }
    })();

    // ✅ For debugging (optional)
    console.log("📅 Range:", range);
    console.log("➡️ Match Condition:", {
        ...matchEmployee,
        "selectedServices.deliveryDate": { $gte: startDate, $lte: now },
    });

    const unwind = { $unwind: "$selectedServices" };

    // --- Overall Stats ---
    const overallStatsPipeline = [
        unwind,
        { $match: matchEmployee },
        {
            $group: {
                _id: null,
                totalRevenue: { $sum: "$selectedServices.serviceAmount" },
                totalPaid: { $sum: "$paidAmount" },
                totalDue: { $sum: "$dueAmount" },
                totalCustomers: { $addToSet: "$_id" },
            },
        },
        {
            $project: {
                _id: 0,
                totalRevenue: 1,
                totalPaid: 1,
                totalDue: 1,
                totalCustomers: { $size: "$totalCustomers" },
            },
        },
    ];

    const overallStats =
        (await Customer.aggregate(overallStatsPipeline))[0] || {
            totalRevenue: 0,
            totalPaid: 0,
            totalDue: 0,
            totalCustomers: 0,
        };

    // --- Service Stats ---
    const serviceStatsPipeline = [
        unwind,
        { $match: matchEmployee },
        {
            $group: {
                _id: "$selectedServices.serviceStatus",
                count: { $sum: 1 },
            },
        },
        {
            $project: {
                _id: 0,
                serviceStatus: "$_id",
                count: 1,
            },
        },
    ];
    const serviceStats = await Customer.aggregate(serviceStatsPipeline);

    // --- Employee Stats ---
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
                        $cond: [
                            { $eq: ["$selectedServices.serviceStatus", "Completed"] },
                            1,
                            0,
                        ],
                    },
                },
                customersCompleted: {
                    $addToSet: {
                        $cond: [
                            { $eq: ["$selectedServices.serviceStatus", "Completed"] },
                            "$_id",
                            "$$REMOVE",
                        ],
                    },
                },
            },
        },
        {
            $project: {
                _id: 1,
                revenue: 1,
                services: 1,
                completedPercent: {
                    $multiply: [{ $divide: ["$completedCount", "$services"] }, 100],
                },
                customersCompleted: { $size: "$customersCompleted" },
            },
        },
        {
            $lookup: {
                from: "users",
                localField: "_id",
                foreignField: "_id",
                as: "employee",
            },
        },
        { $unwind: { path: "$employee", preserveNullAndEmptyArrays: true } },
        {
            $project: {
                name: "$employee.fullName",
                revenue: 1,
                services: 1,
                completedPercent: 1,
                customersCompleted: 1,
            },
        },
    ];
    const employeeStats = await Customer.aggregate(employeeStatsPipeline);

    // --- Revenue Trend ---
    const dateFormat = getDateGroupFormat(range);
    const revenueTrendPipeline = [
        unwind,
        {
            $match: {
                ...matchEmployee,
                // ✅ use root-level deliveryDate
                deliveryDate: { $gte: startDate, $lte: now },
            },
        },
        {
            $group: {
                _id: {
                    $dateToString: {
                        format: dateFormat,
                        date: "$deliveryDate",
                    },
                },
                revenue: { $sum: "$selectedServices.serviceAmount" },
            },
        },
        { $sort: { "_id": 1 } },
        {
            $project: {
                _id: 0,
                date: "$_id",
                revenue: 1,
            },
        },
    ];


    const revenueTrend = await Customer.aggregate(revenueTrendPipeline);

    // --- Response ---
    return res
        .status(200)
        .json(
            new ApiResponse(
                true,
                { overallStats, serviceStats, employeeStats, revenueTrend },
                "Dashboard report fetched successfully"
            )
        );
});

export { getDashboardReport };
