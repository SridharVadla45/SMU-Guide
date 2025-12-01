// src/routes/appointment.routes.ts
import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { appointmentController } from "../controllers/appointment.controller.js";

const router = Router();

// all appointment routes require auth
router.use(authMiddleware);

// POST /api/appointments
router.post("/", appointmentController.createAppointment);

// GET /api/appointments/my
router.get("/my", appointmentController.getMyAppointments);

// GET /api/appointments/:id
router.get("/:id", appointmentController.getAppointmentById);

// PUT /api/appointments/:id/cancel
router.put("/:id/cancel", appointmentController.cancelAppointment);

// PUT /api/appointments/:id/complete
router.put("/:id/complete", appointmentController.completeAppointment);

export  {router as appointmentRoutes};
