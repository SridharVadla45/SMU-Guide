import { Request, Response, NextFunction } from "express";
import { appointmentService } from "../services/appointment.service.js";
import { Errors } from "../errors/ApiError.js";
import { AppointmentStatus } from "@prisma/client";

export const appointmentController = {
    createAppointment: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = (req as any).user?.id;
            const userRole = (req as any).user?.role;

            if (!userId) throw Errors.Unauthorized("Not authenticated");
            if (userRole !== "STUDENT") throw Errors.Forbidden("Only students can book appointments");

            const result = await appointmentService.createAppointment(userId, req.body);
            res.status(201).json({ data: result });
        } catch (err) {
            next(err);
        }
    },

    listAppointments: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = (req as any).user?.id;
            const userRole = (req as any).user?.role;

            if (!userId) throw Errors.Unauthorized("Not authenticated");

            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;
            const status = req.query.status as AppointmentStatus | undefined;

            const result = await appointmentService.listAppointments({
                userId,
                userRole,
                page,
                limit,
                status,
            });

            res.json(result);
        } catch (err) {
            next(err);
        }
    },

    getAppointmentById: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = (req as any).user?.id;
            if (!userId) throw Errors.Unauthorized("Not authenticated");

            const id = Number(req.params.appointmentId);
            const result = await appointmentService.getAppointmentById(id, userId);

            res.json({ data: result });
        } catch (err) {
            next(err);
        }
    },

    cancelAppointment: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = (req as any).user?.id;
            if (!userId) throw Errors.Unauthorized("Not authenticated");

            const id = Number(req.params.appointmentId);
            const result = await appointmentService.cancelAppointment(id, userId);

            res.json({ data: result });
        } catch (err) {
            next(err);
        }
    },

    completeAppointment: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = (req as any).user?.id;
            if (!userId) throw Errors.Unauthorized("Not authenticated");

            const id = Number(req.params.appointmentId);
            const result = await appointmentService.completeAppointment(id, userId);

            res.json({ data: result });
        } catch (err) {
            next(err);
        }
    },

    confirmAppointment: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = (req as any).user?.id;
            if (!userId) throw Errors.Unauthorized("Not authenticated");

            const id = Number(req.params.appointmentId);
            const result = await appointmentService.confirmAppointment(id, userId);

            res.json({ data: result });
        } catch (err) {
            next(err);
        }
    },
};
