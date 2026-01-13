import { Comment } from '@prisma/client';
import { prisma } from '../lib/prisma.js';

export class CommentRepository {
  async findManyByIncidentId(incidentId: string): Promise<Comment[]> {
    return prisma.comment.findMany({
      where: { incidentId },
      orderBy: { createdAt: 'asc' },
      include: {
        author: true,
      },
    });
  }

  async create(data: {
    incidentId: string;
    authorId: string;
    text: string;
  }): Promise<Comment> {
    return prisma.comment.create({
      data,
    });
  }
}
