import type { Request, Response, NextFunction } from "express";
import { Errors } from "../errors/ApiError.js";
import { verifyToken } from "../lib/jwt.js";

export const authMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(Errors.Unauthorized("Missing or invalid authorization header"));
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = verifyToken(token);
    (req as any).user = {
      id: payload.userId,
      email: payload.email,
      role: payload.role,
    };
    next();
  } catch (err) {
    next(Errors.Unauthorized("Invalid or expired token", "INVALID_TOKEN"));
  }
};
