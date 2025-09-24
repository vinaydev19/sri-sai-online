import { Router } from 'express';
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validator.middleware.js";
import { createCustomerValidator, updateCustomerValidator } from "../validators/customer.validate.js"
import { createCustomer, getCustomerById, getCustomers, updateCustomer, deleteCustomer } from "../controllers/customer.controller.js";
import { authorizeRoles } from "../middlewares/roles.middleware.js";

const router = Router();

router.route('/').post(verifyJWT, authorizeRoles('admin', 'employee'), createCustomerValidator(), validate, createCustomer)

router.route('/').get(verifyJWT, authorizeRoles('admin', 'employee'), getCustomers);

router.route('/:id').get(verifyJWT, authorizeRoles('admin', 'employee'), getCustomerById);

router.route('/:id').put(verifyJWT, authorizeRoles('admin', 'employee'), updateCustomerValidator(), validate, updateCustomer);

router.route('/:id').delete(verifyJWT, authorizeRoles('admin'), deleteCustomer);

export default router;