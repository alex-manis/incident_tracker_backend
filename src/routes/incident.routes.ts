import { Router } from 'express';
import { IncidentController } from '../controllers/incident.controller.js';
import { authMiddleware } from '../middleware/auth.js';
import { requireRole } from '../middleware/authorize.js';
import { validateQuery, validateParams } from '../middleware/validate.js';
import { Role, IncidentFiltersSchema, PaginationParamsSchema } from '@incident-tracker/shared';
import { z } from 'zod';

const router = Router();
const controller = new IncidentController();

router.get(
  '/',
  authMiddleware,
  validateQuery(IncidentFiltersSchema.merge(PaginationParamsSchema)),
  controller.getMany.bind(controller)
);
router.get('/:id', authMiddleware, validateParams(z.object({ id: z.string().uuid() })), controller.getById.bind(controller));
router.post('/', authMiddleware, requireRole([Role.ADMIN, Role.MANAGER, Role.AGENT]), controller.create.bind(controller));
router.patch('/:id', authMiddleware, requireRole([Role.ADMIN, Role.MANAGER, Role.AGENT]), validateParams(z.object({ id: z.string().uuid() })), controller.update.bind(controller));

export default router;
