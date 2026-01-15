import { Incident, User, Comment, AuditLog } from '@prisma/client';

/**
 * Incident with relations (assignee and reporter)
 */
export type IncidentWithRelations = Incident & {
  assignee: User | null;
  reporter: User;
};

/**
 * Comment with author relation
 */
export type CommentWithAuthor = Comment & {
  author: User;
};

/**
 * AuditLog with actor relation
 */
export type AuditLogWithActor = AuditLog & {
  actor: User;
};

/**
 * Pagination metadata
 */
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
