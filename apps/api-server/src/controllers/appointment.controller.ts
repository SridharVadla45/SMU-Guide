// src/controllers/appointment.controllers.ts
import { Request, Response, NextFunction } from "express";
import { appointmentService } from "../services/appointment.services.js";
import {
  validateCreateAppointment,
  validateMyAppointmentsQuery,
  parseIdParam,
} from "../validators/appointment.validators.js";
import { Errors } from "../errors/ApiError.js";
import { Role } from "@prisma/client";

export const appointmentController = {
  // POST /api/appointments
  createAppointment: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const authUser = (req as any).user as {
        id: number;
        role: Role;
      } | undefined;

      if (!authUser) {
        throw Errors.Unauthorized("Unauthorized", "UNAUTHORIZED");
      }

      const input = validateCreateAppointment(req.body);

      const appointment = await appointmentService.createAppointment(
        { id: authUser.id, role: authUser.role },
        input
      );

      res.status(201).json({
        success: true,
        data: appointment,
      });
    } catch (err) {
      next(err);
    }
  },

  // GET /api/appointments/my
  getMyAppointments: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const authUser = (req as any).user as {
        id: number;
        role: Role;
      } | undefined;

      if (!authUser) {
        throw Errors.Unauthorized("Unauthorized", "UNAUTHORIZED");
      }

      const filter = validateMyAppointmentsQuery(req.query);

      const items = await appointmentService.getMyAppointments(
        { id: authUser.id, role: authUser.role },
        filter
      );

      res.json({
        success: true,
        data: items,
      });
    } catch (err) {
      next(err);
    }
  },

  // GET /api/appointments/:id
  getAppointmentById: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const authUser = (req as any).user as {
        id: number;
        role: Role;
      } | undefined;

      if (!authUser) {
        throw Errors.Unauthorized("Unauthorized", "UNAUTHORIZED");
      }

      const id = parseIdParam(req.params.id, "id");

      const appointment = await appointmentService.getAppointmentById(
        { id: authUser.id, role: authUser.role },
        id
      );

      res.json({
        success: true,
        data: appointment,
      });
    } catch (err) {
      next(err);
    }
  },

  // PUT /api/appointments/:id/cancel
  cancelAppointment: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const authUser = (req as any).user as {
        id: number;
        role: Role;
      } | undefined;

      if (!authUser) {
        throw Errors.Unauthorized("Unauthorized", "UNAUTHORIZED");
      }

      const id = parseIdParam(req.params.id, "id");

      const appointment = await appointmentService.cancelAppointment(
        { id: authUser.id, role: authUser.role },
        id
      );

      res.json({
        success: true,
        data: appointment,
      });
    } catch (err) {
      next(err);
    }
  },

  // PUT /api/appointments/:id/complete
  completeAppointment: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const authUser = (req as any).user as {
        id: number;
        role: Role;
      } | undefined;

      if (!authUser) {
        throw Errors.Unauthorized("Unauthorized", "UNAUTHORIZED");
      }

      const id = parseIdParam(req.params.id, "id");

      const appointment = await appointmentService.completeAppointment(
        { id: authUser.id, role: authUser.role },
        id
      );

      res.json({
        success: true,
        data: appointment,
      });
    } catch (err) {
      next(err);
    }
  },
};
