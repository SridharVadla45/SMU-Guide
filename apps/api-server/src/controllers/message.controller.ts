import { Request, Response, NextFunction } from "express";
import { messageService } from "../services/message.service.js";
import { Errors } from "../errors/ApiError.js";

export const messageController = {
    // Conversations
    createOrGetConversation: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = (req as any).user?.id;
            if (!userId) throw Errors.Unauthorized("Not authenticated");

            const { otherUserId } = req.body;
            const result = await messageService.createOrGetConversation(userId, otherUserId);
            res.status(201).json({ data: result });
        } catch (err) {
            next(err);
        }
    },

    listConversations: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = (req as any).user?.id;
            if (!userId) throw Errors.Unauthorized("Not authenticated");

            const result = await messageService.listConversations(userId);
            res.json({ data: result });
        } catch (err) {
            next(err);
        }
    },

    getConversationById: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = (req as any).user?.id;
            if (!userId) throw Errors.Unauthorized("Not authenticated");

            const conversationId = Number(req.params.conversationId);
            const result = await messageService.getConversationById(conversationId, userId);
            res.json({ data: result });
        } catch (err) {
            next(err);
        }
    },

    // Messages
    sendMessage: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = (req as any).user?.id;
            if (!userId) throw Errors.Unauthorized("Not authenticated");

            const conversationId = Number(req.params.conversationId);
            const { content } = req.body;

            const result = await messageService.sendMessage(userId, conversationId, content);
            res.status(201).json({ data: result });
        } catch (err) {
            next(err);
        }
    },

    getMessages: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = (req as any).user?.id;
            if (!userId) throw Errors.Unauthorized("Not authenticated");

            const conversationId = Number(req.params.conversationId);
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 50;

            const result = await messageService.getMessages(conversationId, userId, { page, limit });
            res.json({ data: result });
        } catch (err) {
            next(err);
        }
    },
};
