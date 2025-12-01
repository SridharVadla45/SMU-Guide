// src/errors/errorHandler.ts
import type { Request, Response, NextFunction } from "express";
import { ApiError } from "./ApiError.js";

export const globalErrorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  let statusCode = 500;
  let message = "Something went wrong";
  let code = "INTERNAL_ERROR";

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
    code = err.code;
  }

  console.error({
    name: (err as any)?.name,
    message: (err as any)?.message,
    stack: (err as any)?.stack,
    statusCode,
    code,
    method: req.method,
    path: req.path,
  });

  res.status(statusCode).json({
    success: false,
    message,
    code,
  });
};
