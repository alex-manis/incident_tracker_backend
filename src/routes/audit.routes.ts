import { Router } from 'express';
import { AuditLogController } from '../controllers/audit-log.controller.js';
import { authMiddleware } from '../middleware/auth.js';
import { validateParams } from '../middleware/validate.js';
import { z } from 'zod';

const router: Router = Router();
const controller = new AuditLogController();

router.get(
  '/:id/audit',
  authMiddleware,
  validateParams(z.object({ id: z.string().uuid() })),
  controller.getByIncident.bind(controller)
);

export default router;
