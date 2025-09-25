import { body, param } from "express-validator";

export const createServiceValidator = () => {
    return [
        body('serviceId')
            .notEmpty().withMessage('Service ID is required')
            .isString().withMessage('Service ID must be a string'),
        body('serviceName')
            .notEmpty().withMessage('Service Name is required')
            .isString().withMessage('Service Name must be a string'),
        body('serviceAmount')
            .notEmpty().withMessage('Service Amount is required')
            .isNumeric().withMessage('Service Amount must be a number'),
        body('requiredDocuments')
            .optional()
            .isArray().withMessage('Required Documents must be an array of strings'),
        body('note')
            .optional()
            .isString().withMessage('Note must be a string'),
        body('serviceStatus')
            .optional()
            .isIn(['active', 'inactive']).withMessage('Service Status must be either active or inactive'),
        body('assignedTo')
            .optional()
            .isMongoId().withMessage('AssignedTo must be a valid user ID')
    ]
};

export const updateServiceValidator = () => {
    return [
        param('id')
            .isMongoId().withMessage('Invalid service ID'),
        body('serviceId')
            .optional()
            .isString().withMessage('Service ID must be a string'),
        body('serviceName')
            .optional()
            .isString().withMessage('Service Name must be a string'),
        body('serviceAmount')
            .optional()
            .isNumeric().withMessage('Service Amount must be a number'),
        body('requiredDocuments')
            .optional()
            .isArray().withMessage('Required Documents must be an array of strings'),
        body('note')
            .optional()
            .isString().withMessage('Note must be a string'),
        body('serviceStatus')
            .optional()
            .isIn(['active', 'inactive']).withMessage('Service Status must be either active or inactive'),
        body('assignedTo')
            .optional()
            .isMongoId().withMessage('AssignedTo must be a valid user ID')
    ]
};
