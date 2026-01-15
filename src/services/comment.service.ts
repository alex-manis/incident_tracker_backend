import { CommentRepository } from '../repositories/comment.repository.js';
import { AuditLogRepository } from '../repositories/audit-log.repository.js';
import { CreateCommentRequest, CommentWithAuthor as CommentWithAuthorDTO, Role } from '@incident-tracker/shared';
import { prisma } from '../lib/prisma.js';
import { logger } from '../lib/logger.js';
import { CommentWithAuthor } from '../lib/types.js';

const commentRepo = new CommentRepository();
const auditLogRepo = new AuditLogRepository();

function toCommentWithAuthor(comment: CommentWithAuthor): CommentWithAuthorDTO {
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
      role: comment.author.role as Role,
      isActive: comment.author.isActive,
      createdAt: comment.author.createdAt,
      updatedAt: comment.author.updatedAt,
    },
  };
}

export class CommentService {
  async getManyByIncidentId(incidentId: string): Promise<CommentWithAuthorDTO[]> {
    const comments = await commentRepo.findManyByIncidentId(incidentId);

    const commentsWithAuthors = comments.map((comment: CommentWithAuthor) => {
      if (!comment.author) {
        throw new Error('Author not found');
      }
      return toCommentWithAuthor(comment);
    });

    return commentsWithAuthors;
  }

  async create(
    incidentId: string,
    data: CreateCommentRequest,
    authorId: string
  ): Promise<CommentWithAuthorDTO> {
    // Check incident existence
    const incident = await prisma.incident.findUnique({
      where: { id: incidentId },
    });

    if (!incident) {
      throw new Error('Incident not found');
    }

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
    if (!author) {
      throw new Error('Author not found');
    }

    logger.info({ 
      commentId: comment.id, 
      incidentId, 
      authorId 
    }, 'Comment created');

    return toCommentWithAuthor({
      ...comment,
      author,
    });
  }
}
