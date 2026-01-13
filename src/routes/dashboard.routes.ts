import { Router } from 'express';
import { DashboardController } from '../controllers/dashboard.controller.js';
import { authMiddleware } from '../middleware/auth.js';
import { requireRole } from '../middleware/authorize.js';
import { Role } from '@incident-tracker/shared';

const router: Router = Router();
const controller = new DashboardController();

router.get('/summary', authMiddleware, requireRole([Role.ADMIN, Role.MANAGER, Role.AGENT]), controller.getSummary.bind(controller));

export default router;
