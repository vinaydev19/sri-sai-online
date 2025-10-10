import { Router } from 'express';
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/roles.middleware.js";
import { getDashboardReport } from '../controllers/reports.controller.js';

const router = Router();

router.get('/dashboard', verifyJWT, authorizeRoles('admin'), getDashboardReport);

export default router;
