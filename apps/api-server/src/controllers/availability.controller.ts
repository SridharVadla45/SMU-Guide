import type { Request, Response, NextFunction } from "express";
import { availabilityService } from "../services/availability.services.js";
import {
  validateCreateSlots,
  validateUpdateSlot,
} from "../validators/availability.validators.js";
import { Errors } from "../errors/ApiError.js";

const parseIntParam = (raw: string, name: string): number => {
  const n = Number(raw);
  if (isNaN(n)) {
    throw Errors.Validation(`${name} must be a number`);
  }
  return n;
};

export const availabilityController = {
  // GET /api/mentors/:mentorId/availability (public)
  getMentorAvailability: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const mentorId = parseIntParam(req.params.mentorId, "mentorId");

      const availability =
        await availabilityService.getMentorAvailability(mentorId);

      res.json({
        success: true,
        data: availability,
      });
    } catch (err) {
      next(err);
    }
  },

  // POST /api/mentors/me/availability
  addMyAvailabilitySlots: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const user = (req as any).user as { id: number } | undefined;
      if (!user) {
        throw Errors.Unauthorized("Unauthorized", "UNAUTHORIZED");
      }

      const slots = validateCreateSlots(req.body);
      const updated = await availabilityService.addMyAvailabilitySlots(
        user.id,
        slots
      );

      res.status(201).json({
        success: true,
        data: updated,
      });
    } catch (err) {
      next(err);
    }
  },

  // PUT /api/mentors/me/availability/:slotId
  updateMyAvailabilitySlot: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const user = (req as any).user as { id: number } | undefined;
      if (!user) {
        throw Errors.Unauthorized("Unauthorized", "UNAUTHORIZED");
      }

      const slotId = parseIntParam(req.params.slotId, "slotId");
      const updateData = validateUpdateSlot(req.body);

      const updated = await availabilityService.updateMyAvailabilitySlot(
        user.id,
        slotId,
        updateData
      );

      res.status(200).json({
        success: true,
        data: updated,
      });
    } catch (err) {
      next(err);
    }
  },

  // DELETE /api/mentors/me/availability/:slotId
  deleteMyAvailabilitySlot: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const user = (req as any).user as { id: number } | undefined;
      if (!user) {
        throw Errors.Unauthorized("Unauthorized", "UNAUTHORIZED");
      }

      const slotId = parseIntParam(req.params.slotId, "slotId");

      await availabilityService.deleteMyAvailabilitySlot(user.id, slotId);

      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
};
