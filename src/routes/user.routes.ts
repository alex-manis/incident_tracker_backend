import { Router } from 'express';
import { UserController } from '../controllers/user.controller.js';
import { authMiddleware } from '../middleware/auth.js';
import { requireRole } from '../middleware/authorize.js';
import { Role } from '@incident-tracker/shared';

const router = Router();
const controller = new UserController();

router.get('/', authMiddleware, requireRole([Role.ADMIN, Role.MANAGER]), controller.getMany.bind(controller));

export default router;
