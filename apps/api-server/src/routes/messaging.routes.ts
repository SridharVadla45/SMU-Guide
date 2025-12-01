// src/routes/messaging.routes.ts
import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { messagingController } from "../controllers/messaging.controller.js";


const router = Router();

// all messaging routes require auth
router.use(authMiddleware);

/* ---------- Conversations ---------- */

// GET /api/messages/conversations
router.get("/conversations", messagingController.listConversations);

// POST /api/messages/conversations
router.post("/conversations", messagingController.startConversation);

// GET /api/messages/conversations/:id
router.get("/conversations/:id", messagingController.getConversationInfo);

/* ---------- Messages ---------- */

// GET /api/messages/conversations/:id/messages
router.get(
  "/conversations/:id/messages",
  messagingController.listMessages
);

// POST /api/messages/conversations/:id/messages
router.post(
  "/conversations/:id/messages",
  messagingController.sendMessage
);

// PUT /api/messages/messages/:id/read
router.put("/messages/:id/read", messagingController.markMessageAsRead);

export {router as messagingRoutes};
