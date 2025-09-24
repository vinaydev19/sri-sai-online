import { Router } from 'express';
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validator.middleware.js";
import { createServiceValidator, updateServiceValidator } from "../validators/service.validate.js"
import { createService, getAllServices, getServiceById, updateService, deleteService } from "../controllers/service.controller.js";
import { authorizeRoles } from "../middlewares/roles.middleware.js";

const router = Router();

router.route('/').post(verifyJWT, authorizeRoles('admin'), createServiceValidator(), validate, createService)

router.route('/').get(verifyJWT, authorizeRoles("admin"), getAllServices);

router.route('/:id').get(verifyJWT, authorizeRoles("admin"), getServiceById);

router.route('/:id').put(verifyJWT, authorizeRoles('admin'), updateServiceValidator(), validate, updateService);

router.route('/:id').delete(verifyJWT, authorizeRoles('admin'), deleteService);

export default router;