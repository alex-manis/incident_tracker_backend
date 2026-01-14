export const config = {
  port: Number(process.env.PORT) || 3001,
  nodeEnv: process.env.NODE_ENV || 'development',
  databaseUrl: process.env.DATABASE_URL || '',
  jwtSecret: process.env.JWT_SECRET || '',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || '',
  jwtExpiresIn: '15m',
  jwtRefreshExpiresIn: '7d',
  frontendUrl: process.env.FRONTEND_URL || 'https://tracker.alexmanis.org',
  cookieName: 'refreshToken',
  cookieOptions: {
    httpOnly: true,
    secure: isProd,
    sameSite: (isProd ? "none" : "lax") as const,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: "/auth/refresh"
  },
};

if (!config.databaseUrl) {
  throw new Error('DATABASE_URL is required');
}

if (!config.jwtSecret || config.jwtSecret.length < 32) {
  throw new Error('JWT_SECRET must be at least 32 characters');
}

if (!config.jwtRefreshSecret || config.jwtRefreshSecret.length < 32) {
  throw new Error('JWT_REFRESH_SECRET must be at least 32 characters');
}
