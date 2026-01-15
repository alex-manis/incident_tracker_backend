import { comparePassword, hashToken } from '../lib/hash.js';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../lib/jwt.js';
import { UserRepository } from '../repositories/user.repository.js';
import { RefreshTokenRepository } from '../repositories/refresh-token.repository.js';
import { LoginRequest, UserPublic, Role } from '@incident-tracker/shared';
import { prisma } from '../lib/prisma.js';
import { toUserPublic } from '../lib/mappers.js';
import { logger } from '../lib/logger.js';

const userRepo = new UserRepository();
const refreshTokenRepo = new RefreshTokenRepository();

export class AuthService {
  async login(credentials: LoginRequest): Promise<{
    user: UserPublic;
    accessToken: string;
    refreshToken: string;
  }> {
    const user = await userRepo.findByEmail(credentials.email);
    if (!user || !user.isActive) {
      logger.warn({ email: credentials.email }, 'Login attempt failed: user not found or inactive');
      throw new Error('Invalid credentials');
    }

    const isValid = await comparePassword(credentials.password, user.passwordHash);
    if (!isValid) {
      logger.warn({ userId: user.id, email: credentials.email }, 'Login attempt failed: invalid password');
      throw new Error('Invalid credentials');
    }

    const accessToken = signAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role as Role,
    });

    const refreshToken = signRefreshToken({
      userId: user.id,
      email: user.email,
      role: user.role as Role,
    });

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await refreshTokenRepo.create({
      userId: user.id,
      token: refreshToken,
      expiresAt,
    });

    logger.info({ userId: user.id, email: user.email, role: user.role }, 'User logged in successfully');

    return {
      user: toUserPublic(user),
      accessToken,
      refreshToken,
    };
  }

  async refresh(refreshToken: string): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    const payload = verifyRefreshToken(refreshToken);

    const user = await userRepo.findById(payload.userId);
    if (!user || !user.isActive) {
      logger.warn({ userId: payload.userId }, 'Refresh token attempt failed: user not found or inactive');
      throw new Error('User not found or inactive');
    }

    const tokenHash = hashToken(refreshToken);

    // Use transaction to prevent race conditions
    const result = await prisma.$transaction(async (tx) => {
      // Check token within transaction
      const storedToken = await tx.refreshToken.findFirst({
        where: {
          userId: payload.userId,
          tokenHash,
          revokedAt: null,
          expiresAt: {
            gt: new Date(),
          },
        },
      });

      if (!storedToken) {
        logger.warn({ userId: payload.userId }, 'Refresh token attempt failed: invalid token');
        throw new Error('Invalid refresh token');
      }

      // Check that token is not already revoked (race condition protection)
      if (storedToken.revokedAt) {
        logger.warn({ userId: payload.userId, tokenId: storedToken.id }, 'Refresh token attempt failed: token already revoked');
        throw new Error('Token already revoked');
      }

      // Generate new tokens
      const newAccessToken = signAccessToken({
        userId: user.id,
        email: user.email,
        role: user.role as Role,
      });

      const newRefreshToken = signRefreshToken({
        userId: user.id,
        email: user.email,
        role: user.role as Role,
      });

      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);

      // Create new token
      await tx.refreshToken.create({
        data: {
          userId: user.id,
          tokenHash: hashToken(newRefreshToken),
          expiresAt,
        },
      });

      // Revoke old token
      await tx.refreshToken.update({
        where: { id: storedToken.id },
        data: { revokedAt: new Date() },
      });

      logger.info({ userId: user.id, oldTokenId: storedToken.id }, 'Refresh token rotated successfully');

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };
    });

    // Clean up expired tokens (outside transaction to avoid blocking)
    refreshTokenRepo.deleteExpiredTokens().catch((error) => {
      logger.error({ error }, 'Failed to clean up expired tokens');
    });

    return result;
  }

  async logout(refreshToken: string): Promise<void> {
    try {
      const payload = verifyRefreshToken(refreshToken);
      const storedToken = await refreshTokenRepo.findByToken(payload.userId, refreshToken);
      if (storedToken) {
        await refreshTokenRepo.revokeToken(storedToken.id);
        logger.info({ userId: payload.userId, tokenId: storedToken.id }, 'User logged out, token revoked');
      }
    } catch (error) {
      // Log but don't throw - logout should always succeed
      logger.debug({ error }, 'Error during logout (ignored)');
    }
  }

  async getCurrentUser(userId: string): Promise<UserPublic> {
    const user = await userRepo.findById(userId);
    if (!user || !user.isActive) {
      throw new Error('User not found');
    }
    return toUserPublic(user);
  }
}
