// src/app.ts
import express from "express";
import cors from "cors";
import morgan from "morgan";
import { authRouter as authRoutes } from "./routes/auth.routes.js";
import {  mentorRouter } from "./routes/mentor.routes.js";
import { globalErrorHandler } from "./errors/errorHandler.js";
import { ApiError, Errors } from "./errors/ApiError.js";
import { availabilityRoutes } from "./routes/availability.routes.js";
import { appointmentRoutes } from "./routes/appointment.routes.js";
import { forumRoutes } from "./routes/forum.routes.js";

const app = express();

// Global middlewares
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/mentors", mentorRouter);
app.use("/api/mentors", availabilityRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/forum", forumRoutes);


// 404 handler for unknown routes
app.use((req, res,next) => {
  next(Errors.NotFound(`Route ${req.method} ${req.originalUrl} not found`));
});

app.use(globalErrorHandler);

export { app };
