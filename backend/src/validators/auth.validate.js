import { body } from "express-validator";

export const registerUserValidator = () => {
    return [
        body("username")
            .trim()
            .notEmpty()
            .withMessage("Username is required"),

        body("email")
            .trim()
            .notEmpty()
            .withMessage("Email is required")
            .isEmail()
            .withMessage("Invalid email address"),

        body("password")
            .notEmpty()
            .withMessage("Password is required")
            .isLength({ min: 6 })
            .withMessage("Password must be at least 6 characters"),

        body("role")
            .notEmpty()
            .withMessage("Role is required")
            .isIn(["admin", "employee"])
            .withMessage("Role must be either 'admin' or 'employee'"),
    ]
};

export const loginUserValidator = () => {
    return [
        body("password")
            .notEmpty()
            .withMessage("Password is required"),

        body("email")
            .optional()
            .isEmail()
            .withMessage("Invalid email address"),

        body("username")
            .trim()
            .notEmpty()
            .withMessage("Username is required"),

        body("employeeId")
            .optional()
            .isString()
            .withMessage("Employee ID must be string"),

        body().custom((value) => {
            if (!value.email && !value.username && !value.employeeId) {
                throw new Error("Either email, username, or employeeId is required");
            }
            return true;
        }),
    ]
};

export const updateAccountValidator = () => {
    return [
        body("fullName")
            .trim()
            .notEmpty()
            .withMessage("Full name is required")
            .isLength({ min: 2 })
            .withMessage("Full name must be at least 2 characters"),

        body("username")
            .trim()
            .notEmpty()
            .withMessage("Username is required")
            .isAlphanumeric()
            .withMessage("Username must be alphanumeric"),

        body("email")
            .trim()
            .notEmpty()
            .withMessage("Email is required")
            .isEmail()
            .withMessage("Invalid email address"),

        body("employeeId")
            .trim()
            .notEmpty()
            .withMessage("Employee ID is required"),

        body("moblieNumber")
            .trim()
            .notEmpty()
            .withMessage("Mobile number is required")
            .isMobilePhone()
            .withMessage("Invalid mobile number"),
    ]
};
