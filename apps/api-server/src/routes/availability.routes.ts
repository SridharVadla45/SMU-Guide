import { Router } from "express";
import { availabilityController } from "../controllers/availability.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/role.middleware.js";
import { Role } from "@prisma/client";

const router = Router();

// ---------- Public route ----------
// GET /api/mentors/:mentorId/availability
router.get("/:mentorId/availability", availabilityController.getMentorAvailability);

// ---------- Mentor-only routes ----------
router.use("/me", authMiddleware, requireRole(Role.MENTOR));

// POST /api/mentors/me/availability
router.post("/me/availability", availabilityController.addMyAvailabilitySlots);

// PUT /api/mentors/me/availability/:slotId
router.put(
  "/me/availability/:slotId",
  availabilityController.updateMyAvailabilitySlot
);

// DELETE /api/mentors/me/availability/:slotId
router.delete(
  "/me/availability/:slotId",
  availabilityController.deleteMyAvailabilitySlot
);

export {router as availabilityRoutes};
