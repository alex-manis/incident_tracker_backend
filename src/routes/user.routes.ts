import { Router } from 'express';
import { UserController } from '../controllers/user.controller.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();
const controller = new UserController();

router.get('/', authMiddleware, controller.getMany.bind(controller));

export default router;
