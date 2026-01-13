import { UserRepository } from '../repositories/user.repository.js';
import { UserPublic, Role } from '@incident-tracker/shared';
import { User } from '@prisma/client';

function toUserPublic(user: User): UserPublic {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    isActive: user.isActive,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

export class UserService {
  private userRepo = new UserRepository();

  async getMany(filters?: { role?: Role; isActive?: boolean }): Promise<UserPublic[]> {
    const users = await this.userRepo.findMany(filters);
    return users.map(toUserPublic);
  }
}
