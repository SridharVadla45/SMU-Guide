import { Router } from "express";
import { mentorController } from "../controllers/mentor.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const mentorRouter = Router();

// Protected routes (Mentor management) - must come before /:mentorId to avoid conflicts
mentorRouter.get("/me", authMiddleware, mentorController.getMyProfile);
mentorRouter.put("/me", authMiddleware, mentorController.upsertMyProfile);
mentorRouter.post("/me/availability", authMiddleware, mentorController.addAvailability);
mentorRouter.put("/me/availability/:slotId", authMiddleware, mentorController.updateAvailability);
mentorRouter.delete("/me/availability/:slotId", authMiddleware, mentorController.deleteAvailability);

// Public routes
mentorRouter.get("/", mentorController.listMentors);
mentorRouter.get("/:mentorId", mentorController.getMentorById);
mentorRouter.get("/:mentorId/availability", mentorController.getMentorAvailability);

export { mentorRouter };
