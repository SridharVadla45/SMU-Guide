// src/errors/ApiError.ts
export class ApiError extends Error {
  statusCode: number;
  code: string;
  isOperational: boolean;

  constructor(statusCode: number, message: string, code = "INTERNAL_ERROR") {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;

    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

// Convenience helpers
export const Errors = {
  BadRequest: (message: string, code = "BAD_REQUEST") =>
    new ApiError(400, message, code),

  Unauthorized: (message = "Unauthorized", code = "UNAUTHORIZED") =>
    new ApiError(401, message, code),

  Forbidden: (message = "Forbidden", code = "FORBIDDEN") =>
    new ApiError(403, message, code),

  NotFound: (message = "Resource not found", code = "NOT_FOUND") =>
    new ApiError(404, message, code),

  Conflict: (message = "Conflict", code = "CONFLICT") =>
    new ApiError(409, message, code),

  Validation: (message = "Invalid data", code = "VALIDATION_ERROR") =>
    new ApiError(422, message, code),
};
