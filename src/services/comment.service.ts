import { CommentRepository } from '../repositories/comment.repository.js';
import { AuditLogRepository } from '../repositories/audit-log.repository.js';
import { CreateCommentRequest, CommentWithAuthor } from '@incident-tracker/shared';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const commentRepo = new CommentRepository();
const auditLogRepo = new AuditLogRepository();

function toCommentWithAuthor(comment: any): CommentWithAuthor {
  return {
    id: comment.id,
    incidentId: comment.incidentId,
    authorId: comment.authorId,
    text: comment.text,
    createdAt: comment.createdAt,
    author: {
      id: comment.author.id,
      name: comment.author.name,
      email: comment.author.email,
      role: comment.author.role,
      isActive: comment.author.isActive,
      createdAt: comment.author.createdAt,
      updatedAt: comment.author.updatedAt,
    },
  };
}

export class CommentService {
  async getManyByIncidentId(incidentId: string): Promise<CommentWithAuthor[]> {
    const comments = await commentRepo.findManyByIncidentId(incidentId);

    const commentsWithAuthors = await Promise.all(
      comments.map(async (comment) => {
        const author = await prisma.user.findUnique({ where: { id: comment.authorId } });
        return toCommentWithAuthor({
          ...comment,
          author: author!,
        });
      })
    );

    return commentsWithAuthors;
  }

  async create(
    incidentId: string,
    data: CreateCommentRequest,
    authorId: string
  ): Promise<CommentWithAuthor> {
    const comment = await commentRepo.create({
      incidentId,
      authorId,
      text: data.text,
    });

    await auditLogRepo.create({
      actorId: authorId,
      entityType: 'Comment',
      entityId: comment.id,
      action: 'CREATE',
      diffJson: { text: data.text },
    });

    const author = await prisma.user.findUnique({ where: { id: authorId } });
    return toCommentWithAuthor({
      ...comment,
      author: author!,
    });
  }
}
