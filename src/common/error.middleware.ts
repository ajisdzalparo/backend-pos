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
        
        // Clean up raw database constraint names like "ms_product_category_id_fkey (index)"
        const cleaned = target.replace(/_fkey.*/, '').replace(/^ms_/, '');
        const parts = cleaned.split('_');

        if (parts[parts.length - 1] === 'id') {
          const lastThree = parts.slice(-3);
          if (lastThree[0] === 'sub' && lastThree[1] === 'category') {
            relation = 'Sub-category';
          } else if (lastThree[0] === 'item' && lastThree[1] === 'modifier') {
            relation = 'Item modifier';
          } else if (lastThree[0] === 'bank' && lastThree[1] === 'type') {
            relation = 'Bank type';
          } else {
            const word = parts[parts.length - 2];
            relation = word ? word.charAt(0).toUpperCase() + word.slice(1) : 'relation';
          }
        } else {
          relation = parts.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' ');
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
