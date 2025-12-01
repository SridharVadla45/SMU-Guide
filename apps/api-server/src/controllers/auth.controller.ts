import type { Request, Response, NextFunction } from "express";
import { authService } from "../services/auth.services.js";
import { validateLoginInput, validateRegisterInput } from "../validators/auth.validators.js";
import { ApiError, Errors } from "../errors/ApiError.js";

export const authController = {
  register: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const input = validateRegisterInput(req.body);
      const result = await authService.register(input);
      res.status(201).json({
        success: true,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  },

  login: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const input = validateLoginInput(req.body);
      console.log(input);
      const result = await authService.login(input);
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  },

  me: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authUser = (req as any).user as { id: number } | undefined;
      if (!authUser?.id) {
        throw Errors.Unauthorized("Unauthorized", "UNAUTHORIZED");
      }

      const user = await authService.getMe(authUser.id);
      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (err) {
      next(err);
    }
  },
};
