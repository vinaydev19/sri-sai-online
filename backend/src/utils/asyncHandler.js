import { ApiError } from "./ApiError.js";



const asyncHandler = (fn) => async (req, res, next) => {
    try {
        await fn(req, res, next)
    } catch (error) {
        console.log(error);
        if (!error.statusCode) {
            error = new ApiError(500, "Internal server error")
        }
        next(error)
    }
}

export { asyncHandler }