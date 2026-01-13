import { comparePassword } from '../lib/hash.js';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../lib/jwt.js';
import { UserRepository } from '../repositories/user.repository.js';
import { RefreshTokenRepository } from '../repositories/refresh-token.repository.js';
import { LoginRequest, UserPublic, Role } from '@incident-tracker/shared';
import { User } from '@prisma/client';

const userRepo = new UserRepository();
const refreshTokenRepo = new RefreshTokenRepository();

function toUserPublic(user: User): UserPublic {
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

export class AuthService {
  async login(credentials: LoginRequest): Promise<{
    user: UserPublic;
    accessToken: string;
    refreshToken: string;
  }> {
    const user = await userRepo.findByEmail(credentials.email);
    if (!user || !user.isActive) {
      throw new Error('Invalid credentials');
    }

    const isValid = await comparePassword(credentials.password, user.passwordHash);
    if (!isValid) {
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

    const storedToken = await refreshTokenRepo.findByToken(payload.userId, refreshToken);

    if (!storedToken) {
      throw new Error('Invalid refresh token');
    }

    const user = await userRepo.findById(payload.userId);
    if (!user || !user.isActive) {
      throw new Error('User not found or inactive');
    }

    // Issue new tokens first (before revoking old one to prevent race condition)
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

    // Create new token first, then revoke old one
    await refreshTokenRepo.create({
      userId: user.id,
      token: newRefreshToken,
      expiresAt,
    });

    // Revoke old token after new one is created
    await refreshTokenRepo.revokeToken(storedToken.id);

    // Clean up expired tokens
    await refreshTokenRepo.deleteExpiredTokens();

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  async logout(refreshToken: string): Promise<void> {
    try {
      const payload = verifyRefreshToken(refreshToken);
      const storedToken = await refreshTokenRepo.findByToken(payload.userId, refreshToken);
      if (storedToken) {
        await refreshTokenRepo.revokeToken(storedToken.id);
      }
    } catch (error) {
      // Ignore errors on logout
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
