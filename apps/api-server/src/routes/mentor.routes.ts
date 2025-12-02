import { Router } from "express";
import { mentorController } from "../controllers/mentor.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const mentorRouter = Router();

// Public routes
mentorRouter.get("/", mentorController.listMentors);
mentorRouter.get("/:mentorId(\\d+)", mentorController.getMentorById); // Regex to ensure ID is number, avoiding conflict with 'me' if not careful, though 'me' is specific string
mentorRouter.get("/:mentorId(\\d+)/availability", mentorController.getMentorAvailability);

// Protected routes (Mentor management)
mentorRouter.get("/me", authMiddleware, mentorController.getMyProfile);
mentorRouter.put("/me", authMiddleware, mentorController.upsertMyProfile);
mentorRouter.post("/me/availability", authMiddleware, mentorController.addAvailability);
mentorRouter.put("/me/availability/:slotId", authMiddleware, mentorController.updateAvailability);
mentorRouter.delete("/me/availability/:slotId", authMiddleware, mentorController.deleteAvailability);

export { mentorRouter };
