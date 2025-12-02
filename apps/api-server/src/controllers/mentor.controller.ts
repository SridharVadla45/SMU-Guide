import { Request, Response, NextFunction } from "express";
import { mentorService } from "../services/mentor.service.js";
import { Errors } from "../errors/ApiError.js";

export const mentorController = {
    listMentors: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;
            const search = req.query.search as string;
            const department = req.query.department as string;

            const result = await mentorService.listMentors({ page, limit, search, department });
            res.json(result);
        } catch (err) {
            next(err);
        }
    },

    getMentorById: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = Number(req.params.mentorId);
            const result = await mentorService.getMentorById(id);
            res.json({ data: result });
        } catch (err) {
            next(err);
        }
    },

    getMentorAvailability: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = Number(req.params.mentorId);
            const result = await mentorService.getMentorAvailability(id);
            res.json({ data: result });
        } catch (err) {
            next(err);
        }
    },

    getMyProfile: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = (req as any).user?.id;
            if (!userId) throw Errors.Unauthorized("Not authenticated");

            const result = await mentorService.getMyProfile(userId);
            res.json({ data: result });
        } catch (err) {
            next(err);
        }
    },

    upsertMyProfile: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = (req as any).user?.id;
            if (!userId) throw Errors.Unauthorized("Not authenticated");

            const result = await mentorService.upsertMyProfile(userId, req.body);
            res.json({ data: result });
        } catch (err) {
            next(err);
        }
    },

    addAvailability: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = (req as any).user?.id;
            if (!userId) throw Errors.Unauthorized("Not authenticated");

            const result = await mentorService.addAvailability(userId, req.body);
            res.json({ data: result });
        } catch (err) {
            next(err);
        }
    },

    updateAvailability: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = (req as any).user?.id;
            if (!userId) throw Errors.Unauthorized("Not authenticated");
            const slotId = Number(req.params.slotId);

            const result = await mentorService.updateAvailability(userId, slotId, req.body);
            res.json({ data: result });
        } catch (err) {
            next(err);
        }
    },

    deleteAvailability: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = (req as any).user?.id;
            if (!userId) throw Errors.Unauthorized("Not authenticated");
            const slotId = Number(req.params.slotId);

            const result = await mentorService.deleteAvailability(userId, slotId);
            res.json({ data: result });
        } catch (err) {
            next(err);
        }
    },
};
