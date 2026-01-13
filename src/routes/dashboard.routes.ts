import { Router } from 'express';
import { DashboardController } from '../controllers/dashboard.controller.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();
const controller = new DashboardController();

router.get('/summary', authMiddleware, controller.getSummary.bind(controller));

export default router;
