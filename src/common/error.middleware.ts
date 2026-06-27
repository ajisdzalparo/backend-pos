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

        const cleaned = target.replace(/_fkey.*/, '');
        const tableNames = Object.values(Prisma.ModelName).map(modelName => {
          const snake = modelName
            .replace(/([A-Z])/g, '_$1')
            .toLowerCase()
            .replace(/^_/, '');
          return `ms_${snake}`;
        });

        const matchedTable = tableNames.find(tableName => cleaned.startsWith(`${tableName}_`));

        if (matchedTable) {
          const relationField = cleaned
            .replace(`${matchedTable}_`, '')
            .replace(/_id$/, '');

          relation = relationField
            .split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
        } else {
          const simpleClean = cleaned.replace(/^ms_/, '').replace(/_id$/, '');
          relation = simpleClean
            .split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
        }

        message = `Invalid relation: The referenced ${relation} does not exist.`;
        break;
      }
      case 'P2018': {
        message = (err.meta?.details as string) || 'The required connected records were not found.';
        statusCode = 400;
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
