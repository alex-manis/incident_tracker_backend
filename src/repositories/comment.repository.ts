import { Comment } from '@prisma/client';
import { prisma } from '../lib/prisma.js';
import { CommentWithAuthor } from '../lib/types.js';

export class CommentRepository {
  async findManyByIncidentId(incidentId: string): Promise<CommentWithAuthor[]> {
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
