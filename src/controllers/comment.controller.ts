import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { CommentService } from '../services/comment.service.js';
import { CreateCommentRequestSchema } from '@incident-tracker/shared';

const commentService = new CommentService();

export class CommentController {
  async getMany(req: AuthRequest, res: Response): Promise<void> {
    const { id: incidentId } = req.params;
    const comments = await commentService.getManyByIncidentId(incidentId);
    res.json(comments);
  }

  async create(req: AuthRequest, res: Response): Promise<void> {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { id: incidentId } = req.params;
    const data = CreateCommentRequestSchema.parse(req.body);
    const comment = await commentService.create(incidentId, data, req.user.userId);
    res.status(201).json(comment);
  }
}
