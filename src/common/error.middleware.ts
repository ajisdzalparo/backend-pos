import { Request, Response, NextFunction } from 'express';
import { ApiUtils } from './ApiError';

export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error('API Error:', err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  return res.status(statusCode).json(
    ApiUtils.createError(null, message)
  );
};
