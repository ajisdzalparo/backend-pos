import express from 'express';
import cors from 'cors';
import authRoutes from './modules/auth/auth.routes';
import { Request, Response } from 'express';
import { MasterRouter } from './modules/backoffice/master/master.router';
import { errorHandler } from './common/error.middleware';

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

// Backoffice Routes
app.use('/api/backoffice', MasterRouter());

// Health check
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'OK', timestamp: new Date() });
});

// Error handling middleware
app.use(errorHandler as any);

export default app;
