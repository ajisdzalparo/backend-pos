import { Request, Response, NextFunction } from 'express';
import { ApiUtils } from './ApiError';
import { Prisma } from '@prisma/client';

export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error('API Error:', err);

  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    statusCode = 400;
    switch (err.code) {
      case 'P2002': {
        const target = (err.meta?.target as string[])?.join(', ') || 'field';
        message = `Unique constraint failed. The value for field(s) [${target}] already exists.`;
        break;
      }
      case 'P2003': {
        const target = (err.meta?.target as string) || (err.meta?.field_name as string) || '';
        let relation = 'relation';
        if (target.includes('category_id')) {
          relation = 'Category';
        } else if (target.includes('sub_category_id')) {
          relation = 'Sub-category';
        } else if (target.includes('tax_id')) {
          relation = 'Tax';
        } else if (target.includes('item_modifier_id')) {
          relation = 'Item modifier';
        }
        message = `Invalid relation: The referenced ${relation} does not exist.`;
        break;
      }
      case 'P2025': {
        message = (err.meta?.cause as string) || 'Record to update or delete not found.';
        statusCode = 404;
        break;
      }
      default: {
        message = 'A database error occurred.';
        break;
      }
    }
  } else if (err instanceof Prisma.PrismaClientValidationError) {
    statusCode = 400;
    message = 'Validation error: Invalid input data format.';
  } else if (err instanceof Prisma.PrismaClientInitializationError) {
    statusCode = 500;
    message = 'Database connection error.';
  } else if (err instanceof Prisma.PrismaClientRustPanicError) {
    statusCode = 500;
    message = 'Database engine error.';
  }

  return res.status(statusCode).json(
    ApiUtils.createError(null, message)
  );
};
