import express, { Express } from 'express';
import apiRouter from './routes/index.js';
import healthRoutes from './routes/healthRoutes.js';
import { requestLogger } from './middleware/requestLogger.js';
import { errorHandler } from './middleware/errorHandler.js';

export function createApp(): Express {
  const app = express();

  // Middleware
  app.use(express.json({ limit: '25mb' }));
  app.use(express.urlencoded({ extended: true, limit: '25mb' }));
  app.use(requestLogger);

  // Health check endpoint (both root /health and /api/health)
  app.use('/health', healthRoutes);

  // API router
  app.use('/api', apiRouter);

  // Global Error Handler
  app.use(errorHandler);

  return app;
}
