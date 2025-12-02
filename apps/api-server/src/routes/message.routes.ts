import { Router } from "express";
import { messageController } from "../controllers/message.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const messageRouter = Router();

// All routes require authentication
messageRouter.use(authMiddleware);

// Conversations
messageRouter.post("/conversations", messageController.createOrGetConversation);
messageRouter.get("/conversations", messageController.listConversations);
messageRouter.get("/conversations/:conversationId", messageController.getConversationById);

// Messages
messageRouter.post("/conversations/:conversationId/messages", messageController.sendMessage);
messageRouter.get("/conversations/:conversationId/messages", messageController.getMessages);

export { messageRouter };
