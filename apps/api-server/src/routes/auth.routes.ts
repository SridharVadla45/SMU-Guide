import { Router } from "express";
import { authController } from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const authRouter = Router();


authRouter.post("/register", authController.register);

authRouter.post("/login", authController.login);

// GET /api/auth/me
authRouter.get("/me", authMiddleware, authController.me);

export {authRouter};