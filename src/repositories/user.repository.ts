import { PrismaClient, User } from '@prisma/client';
import { Role } from '@incident-tracker/shared';

const prisma = new PrismaClient();

export class UserRepository {
  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  async findMany(where?: { role?: Role; isActive?: boolean }): Promise<User[]> {
    return prisma.user.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(data: {
    name: string;
    email: string;
    passwordHash: string;
    role?: Role;
  }): Promise<User> {
    return prisma.user.create({
      data,
    });
  }
}
