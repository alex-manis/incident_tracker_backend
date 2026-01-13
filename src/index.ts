import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import 'express-async-errors';
import pinoHttp from 'pino-http';
import { config } from './config.js';
import { logger } from './lib/logger.js';
import { errorHandler } from './middleware/error-handler.js';

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
app.use(pinoHttp({ logger }));

// Routes
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/incidents', incidentRoutes);
app.use('/incidents', commentRoutes);
app.use('/incidents', auditRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/', healthRoutes);
app.use('/', metricsRoutes);

// Error handler
app.use(errorHandler);

const server = app.listen(config.port, () => {
  logger.info({ port: config.port }, 'Server started');
});

process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  server.close(() => {
    logger.info('Process terminated');
    process.exit(0);
  });
});
