// src/modules/mentors/mentor.routes.ts
import { Router } from "express";
import { mentorController } from "../controllers/mentor.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/role.middleware.js";
import { Role } from "@prisma/client";

const router = Router();

// ---------- Public routes ----------

// GET /api/mentors
router.get("/", mentorController.listMentors);

// These must be AFTER /me routes, so we'll add them later in the file

// ---------- Mentor-only routes ----------
router.use(authMiddleware, requireRole(Role.MENTOR));

// GET /api/mentors/me/profile
router.get("/me/profile", mentorController.getMyMentorProfile);

// POST /api/mentors/me/profile
router.post("/me/profile", mentorController.upsertMyMentorProfile);

// POST /api/mentors/me/availability
router.post("/me/availability", mentorController.setMyAvailability);

// ---------- Public routes with :mentorId (placed after /me/*) ----------

// GET /api/mentors/:mentorId
router.get("/:mentorId", mentorController.getMentorById);

// GET /api/mentors/:mentorId/availability
router.get("/:mentorId/availability", mentorController.getMentorAvailability);

export {router as mentorRouter};
