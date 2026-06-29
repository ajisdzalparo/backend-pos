import express from 'express';
import cors from 'cors';
import authRoutes from './modules/auth/auth.routes';
import { Request, Response, NextFunction } from 'express';
import { MasterRouter } from './modules/backoffice/master/master.router';
import { errorHandler } from './common/error.middleware';
import { ApiError } from './common/ApiError';

const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
];

if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

// Backoffice Routes
app.use('/api/backoffice', MasterRouter());

// Health check
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'OK', timestamp: new Date() });
});

app.use((_req: Request, _res: Response, next: NextFunction) => {
  next(new ApiError('Endpoint not found', 404));
});

// Error handling middleware
app.use(errorHandler as any);

export default app;
