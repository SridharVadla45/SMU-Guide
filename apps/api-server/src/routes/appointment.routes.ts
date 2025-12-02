import { Router } from "express";
import { appointmentController } from "../controllers/appointment.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const appointmentRouter = Router();

// All routes require authentication
appointmentRouter.use(authMiddleware);

appointmentRouter.post("/", appointmentController.createAppointment);
appointmentRouter.get("/", appointmentController.listAppointments);
appointmentRouter.get("/:appointmentId", appointmentController.getAppointmentById);
appointmentRouter.patch("/:appointmentId/cancel", appointmentController.cancelAppointment);
appointmentRouter.patch("/:appointmentId/complete", appointmentController.completeAppointment);
appointmentRouter.patch("/:appointmentId/confirm", appointmentController.confirmAppointment);

export { appointmentRouter };
