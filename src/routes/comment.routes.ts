import { Router } from 'express';
import { CommentController } from '../controllers/comment.controller.js';
import { authMiddleware } from '../middleware/auth.js';
import { requireRole } from '../middleware/authorize.js';
import { validateParams } from '../middleware/validate.js';
import { Role } from '@incident-tracker/shared';
import { z } from 'zod';

const router = Router();
const controller = new CommentController();

router.get(
  '/:id/comments',
  authMiddleware,
  validateParams(z.object({ id: z.string().uuid() })),
  controller.getMany.bind(controller)
);
router.post(
  '/:id/comments',
  authMiddleware,
  requireRole([Role.ADMIN, Role.MANAGER, Role.AGENT]),
  validateParams(z.object({ id: z.string().uuid() })),
  controller.create.bind(controller)
);

export default router;
