import { Router } from 'express';
import { IncidentController } from '../controllers/incident.controller.js';
import { authMiddleware } from '../middleware/auth.js';
import { validateQuery, validateParams } from '../middleware/validate.js';
import { z } from 'zod';

const router = Router();
const controller = new IncidentController();

router.get(
  '/',
  authMiddleware,
  validateQuery(z.object({})),
  controller.getMany.bind(controller)
);
router.get('/:id', authMiddleware, validateParams(z.object({ id: z.string().uuid() })), controller.getById.bind(controller));
router.post('/', authMiddleware, controller.create.bind(controller));
router.patch('/:id', authMiddleware, validateParams(z.object({ id: z.string().uuid() })), controller.update.bind(controller));

export default router;
