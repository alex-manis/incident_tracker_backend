import { PrismaClient, Comment } from '@prisma/client';

const prisma = new PrismaClient();

export class CommentRepository {
  async findManyByIncidentId(incidentId: string): Promise<Comment[]> {
    return prisma.comment.findMany({
      where: { incidentId },
      orderBy: { createdAt: 'asc' },
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
