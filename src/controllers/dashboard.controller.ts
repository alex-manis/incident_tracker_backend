import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { IncidentService } from '../services/incident.service.js';

const incidentService = new IncidentService();

export class DashboardController {
  async getSummary(req: AuthRequest, res: Response): Promise<void> {
    const summary = await incidentService.getDashboardSummary();
    res.json(summary);
  }
}
