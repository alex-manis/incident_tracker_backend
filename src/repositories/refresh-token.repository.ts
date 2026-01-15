import { RefreshToken } from '@prisma/client';
import { hashToken, compareToken } from '../lib/hash.js';
import { prisma } from '../lib/prisma.js';

export class RefreshTokenRepository {
  async create(data: {
    userId: string;
    token: string;
    expiresAt: Date;
  }): Promise<RefreshToken> {
    const tokenHash = hashToken(data.token);
    return prisma.refreshToken.create({
      data: {
        userId: data.userId,
        tokenHash,
        expiresAt: data.expiresAt,
      },
    });
  }

  async findByToken(userId: string, token: string): Promise<RefreshToken | null> {
    const tokenHash = hashToken(token);
    return prisma.refreshToken.findFirst({
      where: {
        userId,
        tokenHash,
        revokedAt: null,
        expiresAt: {
          gt: new Date(),
        },
      },
    });
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
