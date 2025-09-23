import { body, param } from "express-validator";

export const createEmployeeValidator = [
    body("fullName")
        .notEmpty()
        .withMessage("Full Name is required")
        .isLength({ min: 2 })
        .withMessage("Full Name must be at least 2 characters"),

    body("employeeId")
        .notEmpty()
        .withMessage("Employee ID is required")
        .isLength({ min: 3 })
        .withMessage("Employee ID must be at least 3 characters"),

    body("username")
        .notEmpty()
        .withMessage("Username is required")
        .isLength({ min: 3 })
        .withMessage("Username must be at least 3 characters"),

    body("email")
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
];

export const updateEmployeeValidator = [
    param("id")
        .notEmpty()
        .withMessage("Employee ID param is required")
        .isMongoId()
        .withMessage("Invalid Employee ID"),

    body("fullName")
        .optional()
        .isLength({ min: 2 })
        .withMessage("Full Name must be at least 2 characters"),

    body("employeeId")
        .optional()
        .isLength({ min: 3 })
        .withMessage("Employee ID must be at least 3 characters"),

    body("username")
        .optional()
        .isLength({ min: 3 })
        .withMessage("Username must be at least 3 characters"),

    body("email")
        .optional()
        .isEmail()
        .withMessage("Invalid email address"),

    body("role")
        .optional()
        .isIn(["admin", "employee"])
        .withMessage("Role must be either 'admin' or 'employee'"),
];
