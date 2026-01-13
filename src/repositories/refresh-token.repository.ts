import { PrismaClient, RefreshToken } from '@prisma/client';
import { hashPassword, comparePassword } from '../lib/hash.js';

const prisma = new PrismaClient();

export class RefreshTokenRepository {
  async create(data: {
    userId: string;
    token: string;
    expiresAt: Date;
  }): Promise<RefreshToken> {
    const tokenHash = await hashPassword(data.token);
    return prisma.refreshToken.create({
      data: {
        userId: data.userId,
        tokenHash,
        expiresAt: data.expiresAt,
      },
    });
  }

  async findByToken(userId: string, token: string): Promise<RefreshToken | null> {
    const tokens = await prisma.refreshToken.findMany({
      where: {
        userId,
        revokedAt: null,
        expiresAt: {
          gt: new Date(),
        },
      },
    });

    for (const storedToken of tokens) {
      const isValid = await comparePassword(token, storedToken.tokenHash);
      if (isValid) {
        return storedToken;
      }
    }

    return null;
  }

  async revokeToken(id: string): Promise<void> {
    await prisma.refreshToken.update({
      where: { id },
      data: { revokedAt: new Date() },
    });
  }

  async revokeAllUserTokens(userId: string): Promise<void> {
    await prisma.refreshToken.updateMany({
      where: {
        userId,
        revokedAt: null,
      },
      data: {
        revokedAt: new Date(),
      },
    });
  }

  async deleteExpiredTokens(): Promise<void> {
    await prisma.refreshToken.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });
  }
}
