import type { CookieOptions } from "express";

const isProd = process.env.NODE_ENV === "production";

// express CookieOptions.sameSite: boolean | 'lax' | 'strict' | 'none'
const sameSite: CookieOptions["sameSite"] = isProd ? "none" : "lax";

export const config = {
  port: Number(process.env.PORT) || 3001,
  nodeEnv: process.env.NODE_ENV || "development",
  databaseUrl: process.env.DATABASE_URL || "",
  jwtSecret: process.env.JWT_SECRET || "",
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || "",
  jwtExpiresIn: "15m",
  jwtRefreshExpiresIn: "7d",

  frontendUrl: (process.env.FRONTEND_URL || "https://tracker.alexmanis.org").replace(/\/$/, ""),

  cookieName: "refreshToken",
  cookieOptions: {
    httpOnly: true,
    secure: isProd,
    sameSite,
    path: "/", // Cookie available for all paths, not just /api/auth/refresh
    maxAge: 7 * 24 * 60 * 60 * 1000,
    // Don't set domain - let browser handle it automatically for cross-origin requests
  },
} as const;

if (!config.databaseUrl) {
  throw new Error("DATABASE_URL is required");
}

if (!config.jwtSecret || config.jwtSecret.length < 32) {
  throw new Error("JWT_SECRET must be at least 32 characters");
}

if (!config.jwtRefreshSecret || config.jwtRefreshSecret.length < 32) {
  throw new Error("JWT_REFRESH_SECRET must be at least 32 characters");
}