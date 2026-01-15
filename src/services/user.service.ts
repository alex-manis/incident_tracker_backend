import { UserRepository } from '../repositories/user.repository.js';
import { UserPublic, Role } from '@incident-tracker/shared';
import { toUserPublic } from '../lib/mappers.js';

export class UserService {
  private userRepo = new UserRepository();

  async getMany(filters?: { role?: Role; isActive?: boolean }): Promise<UserPublic[]> {
    const users = await this.userRepo.findMany(filters);
    return users.map(toUserPublic);
  }
}
