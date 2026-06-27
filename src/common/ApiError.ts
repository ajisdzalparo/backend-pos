export class ApiError extends Error {
  public readonly statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'ApiError';
  }
}

export const ApiUtils = {
  createSuccess: <T>(data: T, message: string = "success", metadata: Object = {}) => ({
    status: true,
    message: message,
    metadata: metadata,
    data: data
  }),

  createError: <T>(data: T, message: string = "error", metadata: Object = {}) => ({
    status: false,
    message: message,
    metadata: metadata,
    data: data
  })
}