import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller.js';
import { validateBody } from '../middleware/validate.js';
import { authMiddleware } from '../middleware/auth.js';
import { LoginRequestSchema } from '@incident-tracker/shared';

const router = Router();
const controller = new AuthController();

router.post('/login', validateBody(LoginRequestSchema), controller.login.bind(controller));
router.post('/refresh', controller.refresh.bind(controller));
router.post('/logout', controller.logout.bind(controller));
router.get('/me', authMiddleware, controller.me.bind(controller));

export default router;
