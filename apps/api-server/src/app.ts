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
import paymentMethodRouter from "./routes/payment-method.routes.js";
import { globalErrorHandler } from "./errors/errorHandler.js";
import { ApiError, Errors } from "./errors/ApiError.js";

import { prisma } from "./lib/prisma.js";

const app = express();

// Auto-migration to ensure PaymentMethod table exists
(async () => {
  try {
    await prisma.$executeRawUnsafe(`
            CREATE TABLE IF NOT EXISTS PaymentMethod (
                id INTEGER NOT NULL AUTO_INCREMENT,
                userId INTEGER NOT NULL,
                type VARCHAR(191) NOT NULL DEFAULT 'card',
                brand VARCHAR(191) NOT NULL,
                last4 VARCHAR(191) NOT NULL,
                expMonth INTEGER NOT NULL,
                expYear INTEGER NOT NULL,
                isDefault BOOLEAN NOT NULL DEFAULT false,
                createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
                PRIMARY KEY (id),
                INDEX PaymentMethod_userId_idx (userId)
            ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
        `);
    console.log('Database: PaymentMethod table ensured.');
  } catch (e) {
    console.error('Database: Auto-migration failed:', e);
  }
})();

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
app.use("/api/payment-methods", paymentMethodRouter);





// 404 handler for unknown routes
app.use((req, res, next) => {
  next(Errors.NotFound(`Route ${req.method} ${req.originalUrl} not found`));
});

app.use(globalErrorHandler);

export { app };
