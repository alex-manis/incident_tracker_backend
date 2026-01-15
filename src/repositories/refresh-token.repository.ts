import { RefreshToken } from '@prisma/client';
import { hashToken, compareToken, comparePassword } from '../lib/hash.js';
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
    // First, try to find with SHA-256 hash (new format)
    const tokenHash = hashToken(token);
    const storedToken = await prisma.refreshToken.findFirst({
      where: {
        userId,
        tokenHash,
        revokedAt: null,
        expiresAt: {
          gt: new Date(),
        },
      },
    });

    if (storedToken) {
      return storedToken;
    }

    // Fallback: check all tokens for this user (for backward compatibility with bcrypt hashed tokens)
    // This handles tokens created before the migration from bcrypt to SHA-256
    const allTokens = await prisma.refreshToken.findMany({
      where: {
        userId,
        revokedAt: null,
        expiresAt: {
          gt: new Date(),
        },
      },
    });

    for (const tokenRecord of allTokens) {
      // Try bcrypt comparison (for old tokens)
      try {
        const isValid = await comparePassword(token, tokenRecord.tokenHash);
        if (isValid) {
          // Found old token - migrate it to SHA-256
          await this.migrateTokenToSha256(tokenRecord.id, token);
          return tokenRecord;
        }
      } catch (error) {
        // If comparePassword fails, it's not a bcrypt hash, skip
        continue;
      }
    }

    return null;
  }

  /**
   * Migrates a token from bcrypt to SHA-256 hash
   */
  private async migrateTokenToSha256(tokenId: string, token: string): Promise<void> {
    const newHash = hashToken(token);
    await prisma.refreshToken.update({
      where: { id: tokenId },
      data: { tokenHash: newHash },
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
