// src/modules/mentors/mentor.controller.ts
import type { Request, Response, NextFunction } from "express";
import { mentorService } from "../services/mentor.service.js";
import {
  validateAvailabilitySlots,
  validateMentorFilter,
  validateUpsertMentorProfile,
} from "../validators/mentor.validators.js";
import { Errors } from "../errors/ApiError.js";

export const mentorController = {
  listMentors: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const filter = validateMentorFilter(req.query);
      const result = await mentorService.listMentors(filter);
      res.json({
        success: true,
        data: result.items,
        meta: {
          total: result.total,
          page: result.page,
          limit: result.limit,
        },
      });
    } catch (err) {
      next(err);
    }
  },

  getMentorById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const mentorId = Number(req.params.mentorId);
      if (isNaN(mentorId)) {
        throw Errors.Validation("mentorId must be a number");
      }

      const mentor = await mentorService.getMentorById(mentorId);
      res.json({
        success: true,
        data: mentor,
      });
    } catch (err) {
      next(err);
    }
  },

  getMentorAvailability: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const mentorId = Number(req.params.mentorId);
      if (isNaN(mentorId)) {
        throw Errors.Validation("mentorId must be a number");
      }

      const availability = await mentorService.getMentorAvailability(mentorId);
      res.json({
        success: true,
        data: availability,
      });
    } catch (err) {
      next(err);
    }
  },

  getMyMentorProfile: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const user = (req as any).user as { id: number } | undefined;
      if (!user) {
        throw Errors.Unauthorized("Unauthorized", "UNAUTHORIZED");
      }

      const profile = await mentorService.getMyMentorProfile(user.id);
      res.json({
        success: true,
        data: profile,
      });
    } catch (err) {
      next(err);
    }
  },

  upsertMyMentorProfile: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const user = (req as any).user as { id: number } | undefined;
      if (!user) {
        throw Errors.Unauthorized("Unauthorized", "UNAUTHORIZED");
      }

      const input = validateUpsertMentorProfile(req.body);
      const profile = await mentorService.upsertMyMentorProfile(
        user.id,
        input
      );

      res.status(200).json({
        success: true,
        data: profile,
      });
    } catch (err) {
      next(err);
    }
  },

  setMyAvailability: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const user = (req as any).user as { id: number } | undefined;
      if (!user) {
        throw Errors.Unauthorized("Unauthorized", "UNAUTHORIZED");
      }

      const slots = validateAvailabilitySlots(req.body);
      const updated = await mentorService.setMyAvailability(user.id, slots);

      res.status(200).json({
        success: true,
        data: updated,
      });
    } catch (err) {
      next(err);
    }
  },
};
