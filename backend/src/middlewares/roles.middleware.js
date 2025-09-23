export const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!allowedRoles.includes(req.user.role)) {
            throw new ApiError(403, "You do not have permission");
        }
        next();
    };
};
