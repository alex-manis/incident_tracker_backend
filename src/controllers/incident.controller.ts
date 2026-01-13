import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { IncidentService } from '../services/incident.service.js';
import {
  CreateIncidentRequestSchema,
  UpdateIncidentRequestSchema,
  IncidentFiltersSchema,
  PaginationParamsSchema,
} from '@incident-tracker/shared';

const incidentService = new IncidentService();

export class IncidentController {
  async getMany(req: AuthRequest, res: Response): Promise<void> {
    const filters = IncidentFiltersSchema.parse(req.query);
    const pagination = PaginationParamsSchema.parse(req.query);
    const result = await incidentService.getMany(filters, pagination);
    res.json(result);
  }

  async getById(req: AuthRequest, res: Response): Promise<void> {
    const { id } = req.params;
    const incident = await incidentService.getById(id);
    res.json(incident);
  }

  async create(req: AuthRequest, res: Response): Promise<void> {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const data = CreateIncidentRequestSchema.parse(req.body);
    const incident = await incidentService.create(data, req.user.userId, req.user.userId);
    res.status(201).json(incident);
  }

  async update(req: AuthRequest, res: Response): Promise<void> {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { id } = req.params;
    const data = UpdateIncidentRequestSchema.parse(req.body);
    const incident = await incidentService.update(id, data, req.user.userId);
    res.json(incident);
  }
}
