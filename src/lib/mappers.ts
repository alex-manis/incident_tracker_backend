import { User } from '@prisma/client';
import { UserPublic, Role } from '@incident-tracker/shared';

/**
 * Преобразует User из Prisma в UserPublic DTO
 */
export function toUserPublic(user: User): UserPublic {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role as Role,
    isActive: user.isActive,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}
