import { body, param } from 'express-validator';

export const createCustomerValidator = () => {
    return [
        body('customerId')
            .notEmpty().withMessage('Customer ID is required')
            .isString().withMessage('Customer ID must be a string'),
        body('fullName')
            .notEmpty().withMessage('Full Name is required')
            .isString().withMessage('Full Name must be a string'),
        body('MobileNumber')
            .notEmpty().withMessage('Mobile Number is required')
            .isString().withMessage('Mobile Number must be a string'),
        body('totalAmount')
            .notEmpty().withMessage('Total Amount is required')
            .isNumeric().withMessage('Total Amount must be a number'),
        body('paidAmount')
            .optional()
            .isNumeric().withMessage('Paid Amount must be a number'),
        body('dueAmount')
            .notEmpty().withMessage('Due Amount is required')
            .isNumeric().withMessage('Due Amount must be a number'),
        body('paymentMode')
            .optional()
            .isIn(["Cash", "Card", "Online", "UPI", "Net Banking"])
            .withMessage('Payment Mode must be one of Cash, Card, Online, UPI, Net Banking'),
        body('note')
            .optional()
            .isString().withMessage('Note must be a string'),
        body('requiredDocuments')
            .optional()
            .isArray().withMessage('Required Documents must be an array of strings'),
        body('deliveryDate')
            .optional()
            .isISO8601().toDate().withMessage('Delivery Date must be a valid date'),
        body('selectedServices')
            .optional()
            .isArray().withMessage('Selected Services must be an array of service objects'),
        body('selectedServices.*.serviceId')
            .optional()
            .isMongoId().withMessage('Service ID in selectedServices must be a valid ID'),
        body('selectedServices.*.serviceName')
            .optional()
            .isString().withMessage('Service Name in selectedServices must be a string'),
        body('selectedServices.*.serviceAmount')
            .optional()
            .isNumeric().withMessage('Service Amount in selectedServices must be a number'),
        body('selectedServices.*.serviceStatus')
            .optional()
            .isIn(["Pending Docs", "Pending", "Apply", "In Progress", "Submitted", "Completed", "Delivered"])
            .withMessage('Service Status in selectedServices is invalid'),
        body('selectedServices.*.assignedTo')
            .optional()
            .isMongoId().withMessage('AssignedTo in selectedServices must be a valid ID'),
        body('selectedServices.*.note')
            .optional()
            .isString().withMessage('Note in selectedServices must be a string')
    ]
};

export const updateCustomerValidator = () => {
    return [
        param('id')
            .isMongoId().withMessage('Invalid Customer ID'),
        body('fullName')
            .optional()
            .isString().withMessage('Full Name must be a string'),
        body('MobileNumber')
            .optional()
            .isString().withMessage('Mobile Number must be a string'),
        body('totalAmount')
            .optional()
            .isNumeric().withMessage('Total Amount must be a number'),
        body('paidAmount')
            .optional()
            .isNumeric().withMessage('Paid Amount must be a number'),
        body('dueAmount')
            .optional()
            .isNumeric().withMessage('Due Amount must be a number'),
        body('paymentMode')
            .optional()
            .isIn(["Cash", "Card", "Online", "UPI", "Net Banking"])
            .withMessage('Payment Mode must be one of Cash, Card, Online, UPI, Net Banking'),
        body('note')
            .optional()
            .isString().withMessage('Note must be a string'),
        body('requiredDocuments')
            .optional()
            .isArray().withMessage('Required Documents must be an array of strings'),
        body('deliveryDate')
            .optional()
            .isISO8601().toDate().withMessage('Delivery Date must be a valid date'),
        body('selectedServices')
            .optional()
            .isArray().withMessage('Selected Services must be an array of service objects'),
        body('overStatus')
            .optional()
            .isIn(["Pending Docs", "Pending", "Apply", "In Progress", "Submitted", "Completed", "Delivered"])
            .withMessage('Over Status is invalid')
    ]
};