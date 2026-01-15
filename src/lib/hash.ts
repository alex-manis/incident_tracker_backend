import bcrypt from 'bcryptjs';
import crypto from 'crypto';

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Хеширует токен с использованием SHA-256.
 * Используется для refresh tokens, так как они не требуют медленного хеширования как пароли.
 */
export function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

/**
 * Сравнивает токен с хешем.
 */
export function compareToken(token: string, hash: string): boolean {
  return hashToken(token) === hash;
}
