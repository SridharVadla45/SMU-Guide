// src/app.ts
import express from "express";
import cors from "cors";
import morgan from "morgan";
import { authRouter as authRoutes } from "./routes/auth.routes.js";
import { mentorRouter } from "./routes/mentor.routes.js";
import { appointmentRouter } from "./routes/appointment.routes.js";
import { forumRouter } from "./routes/forum.routes.js";
import { userRouter } from "./routes/user.routes.js";
import { paymentRouter } from "./routes/payment.routes.js";
import { globalErrorHandler } from "./errors/errorHandler.js";
import { ApiError, Errors } from "./errors/ApiError.js";

const app = express();

// Global middlewares
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/mentors", mentorRouter);
app.use("/api/appointments", appointmentRouter);
app.use("/api/forum", forumRouter);
app.use("/api/users", userRouter);
app.use("/api/payments", paymentRouter);





// 404 handler for unknown routes
app.use((req, res, next) => {
  next(Errors.NotFound(`Route ${req.method} ${req.originalUrl} not found`));
});

app.use(globalErrorHandler);

export { app };
