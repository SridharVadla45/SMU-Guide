// src/app.ts
import express from "express";
import cors from "cors";
import morgan from "morgan";
import { authRouter as authRoutes } from "./routes/auth.routes.js";
import {  mentorRouter } from "./routes/mentor.routes.js";
import { globalErrorHandler } from "./errors/errorHandler.js";
import { ApiError, Errors } from "./errors/ApiError.js";

const app = express();

// Global middlewares
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/mentors", mentorRouter);

// 404 handler for unknown routes
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use(globalErrorHandler);

export { app };
