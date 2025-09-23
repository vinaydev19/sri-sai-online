import { Router } from 'express';
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/roles.middleware.js";
import {
    createEmployee,
    getAllEmployees,
    getOneEmployee,
    updateEmployee,
    deleteEmployee
} from "../controllers/employee.controller.js";
import { validate } from "../middlewares/validator.middleware.js";
import { createEmployeeValidator, updateEmployeeValidator } from "../validators/employee.validate.js"

const router = Router();

router.route("/").post(verifyJWT, authorizeRoles("admin"), createEmployeeValidator(), validate, createEmployee);

router.route("/").get(verifyJWT, authorizeRoles("admin"), getAllEmployees);

router.route("/:id").get(verifyJWT, authorizeRoles("admin", "employee"), getOneEmployee);

router.route("/:id").put(verifyJWT, authorizeRoles("admin"), updateEmployeeValidator(), validate, updateEmployee);

router.route("/:id").delete(verifyJWT, authorizeRoles("admin"), deleteEmployee);

export default router;