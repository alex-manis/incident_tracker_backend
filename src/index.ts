import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import 'express-async-errors';
import pinoHttp from 'pino-http';
import { config } from './config.js';
import { logger } from './lib/logger.js';
import { errorHandler } from './middleware/error-handler.js';
import { prisma } from './lib/prisma.js';

// Routes
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import incidentRoutes from './routes/incident.routes.js';
import commentRoutes from './routes/comment.routes.js';
import auditRoutes from './routes/audit.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';
import healthRoutes from './routes/health.routes.js';
import metricsRoutes from './routes/metrics.routes.js';

const app = express();

// Middleware
app.use(
  cors({
    origin: config.frontendUrl,
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(pinoHttp({ logger: logger as any }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/incidents', incidentRoutes);
app.use('/api/incidents', commentRoutes);
app.use('/api/incidents', auditRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/health', healthRoutes);
app.use('/api/metrics', metricsRoutes);

// Error handler
app.use(errorHandler);

const server = app.listen(config.port, () => {
  logger.info({ port: config.port }, 'Server started');
});

process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully');
  server.close(async () => {
    await prisma.$disconnect();
    logger.info('Process terminated');
    process.exit(0);
  });
});

process.on('SIGINT', async () => {
  logger.info('SIGINT received, shutting down gracefully');
  server.close(async () => {
    await prisma.$disconnect();
    logger.info('Process terminated');
    process.exit(0);
  });
});
