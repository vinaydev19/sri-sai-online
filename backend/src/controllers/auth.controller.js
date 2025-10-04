import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { User } from '../models/user.model.js';
import jwt from 'jsonwebtoken';

const isProd = process.env.NODE_ENV === "production";

const accessCookieOptions = {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    path: "/",
    maxAge: 15 * 60 * 1000, // 15 minutes
};

const refreshCookieOptions = {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000,   // 7 days (adjust as needed)
};

const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = await user.generateAccessToken()
        const refreshToken = await user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }
    } catch (error) {
        throw new ApiError(500, "something want wrong while generater the access and refresh Token")
    }
}

const registerUser = asyncHandler(async (req, res, next) => {
    const { username, email, password, role } = req.body;

    if ([!username, !email, !password, !role].includes(undefined)) {
        throw new ApiError(400, 'All fields are required');
    }

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });

    if (existingUser) {
        throw new ApiError(409, 'User with given email, username or employeeId already exists');
    }

    const user = await User.create({ username, email, password, role });

    if (!user) {
        throw new ApiError(500, 'Failed to create user');
    }

    const createdUser = await User.findById(user._id).select('-password -refreshToken');

    return res.status(201).json(new ApiResponse(201, { createdUser }, 'User registered successfully'));
});

const loginUser = asyncHandler(async (req, res, next) => {
    const { username, email, employeeId, password } = req.body;

    console.log(req.body);


    if ([!password].includes(undefined) || [!username, !email, !employeeId].every(field => field === undefined)) {
        throw new ApiError(400, 'All fields are required');
    }

    const query = [];
    if (username) query.push({ username });
    if (email) query.push({ email });
    if (employeeId) query.push({ employeeId });

    const findUser = await User.findOne({ $or: query });

    if (!findUser) {
        throw new ApiError(401, 'User not found');
    }

    const isPasswordValid = await findUser.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new ApiError(401, 'Password is incorrect');
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(findUser._id);

    const loggedUser = await User.findById(findUser._id).select('-password -refreshToken');

    return res
        .status(200)
        .cookie('accessToken', accessToken, accessCookieOptions)
        .cookie('refreshToken', refreshToken, refreshCookieOptions)
        .json(new ApiResponse(200, { loggedUser }, 'User logged in successfully'));
});

const logoutUser = asyncHandler(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user._id, {
        $unset: { refreshToken: 1 }
    }, { new: true });

    return res
        .status(200)
        .clearCookie('accessToken', accessCookieOptions)
        .clearCookie('refreshToken', refreshCookieOptions)
        .json(new ApiResponse(200, null, 'User logged out successfully'));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies?.refreshToken || req.body?.refreshToken;

    if (!incomingRefreshToken) {
        throw new ApiError(401, "unauthorized request");
    }

    try {
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);

        const user = await User.findById(decodedToken?._id);

        if (!user) {
            throw new ApiError(401, "invalid refresh Token");
        }

        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "refresh Token is expired or used");
        }

        const { accessToken, refreshToken: newRefreshToken } = await generateAccessAndRefreshToken(user._id);

        return res
            .status(200)
            .cookie("accessToken", accessToken, accessCookieOptions)
            .cookie("refreshToken", newRefreshToken, refreshCookieOptions)
            .json(new ApiResponse(200, { accessToken, refreshToken: newRefreshToken }, "access token refreshed"));
    } catch (error) {
        throw new ApiError(401, error?.message || "invalid refresh token");
    }
});

const getCurrentUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user).select("-password -refreshToken");

    return res
        .status(200)
        .json(new ApiResponse(200, { user }, "User fetched successfully"));
});

const updateAccountDetails = asyncHandler(async (req, res) => {
    const { fullName, employeeId, username, email, moblieNumber } = req.body;

    if ([!fullName, !employeeId, !username, !email, !moblieNumber].includes(undefined)) {
        throw new ApiError(400, "All fields are required");
    }

    const user = await User.findByIdAndUpdate(req.user?._id, {
        $set: {
            fullName,
            employeeId,
            username,
            email,
            moblieNumber
        }
    }, { new: true, }).select("-password -refreshToken");

    return res
        .status(200)
        .json(new ApiResponse(200, { user }, "Account details updated successfully"));
});

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    getCurrentUser,
    updateAccountDetails
};
