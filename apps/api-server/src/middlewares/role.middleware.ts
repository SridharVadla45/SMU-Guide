// src/middleware/role.middleware.ts
import type { Request, Response, NextFunction } from "express";
import { Errors } from "../errors/ApiError.js";
import { Role } from "@prisma/client";

export const requireRole =
  (...allowedRoles: Role[]) =>
  (req: Request, _res: Response, next: NextFunction) => {
    const user = (req as any).user as { id: number; role: Role } | undefined;

    if (!user) {
      return next(Errors.Unauthorized("Unauthorized", "UNAUTHORIZED"));
    }

    if (!allowedRoles.includes(user.role)) {
      return next(
        Errors.Forbidden("You do not have permission for this action", "FORBIDDEN")
      );
    }

    next();
  };
