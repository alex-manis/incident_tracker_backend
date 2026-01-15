import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller.js';
import { validateBody } from '../middleware/validate.js';
import { authMiddleware } from '../middleware/auth.js';
import { authLimiter } from '../middleware/rate-limit.js';
import { LoginRequestSchema } from '@incident-tracker/shared';

const router: Router = Router();
const controller = new AuthController();

router.post('/login', authLimiter, validateBody(LoginRequestSchema), controller.login.bind(controller));

// Handle unsupported HTTP methods for refresh endpoint (must be before POST route)
router.all('/refresh', (req, res, next) => {
  if (req.method !== 'POST') {
    res.status(405).json({ 
      error: 'Method Not Allowed', 
      message: `The ${req.method} method is not allowed for this endpoint. Use POST instead.`,
      allowedMethods: ['POST']
    });
    return;
  }
  next();
});
router.post('/refresh', authLimiter, controller.refresh.bind(controller));

router.post('/logout', controller.logout.bind(controller));
router.get('/me', authMiddleware, controller.me.bind(controller));

export default router;
