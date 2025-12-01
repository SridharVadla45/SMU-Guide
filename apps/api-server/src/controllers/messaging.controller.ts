// src/controllers/messaging.controller.ts
import { Request, Response, NextFunction } from "express";
import { messagingService } from "../services/messaging.services.js";
import {
  parseIdParam,
  validateSendMessage,
  validateStartConversation,
} from "../validators/mesaging.validators.js";
import { Errors } from "../errors/ApiError.js";
import { Role } from "@prisma/client";

export const messagingController = {
  /* ---------- Conversations ---------- */

  listConversations: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authUser = (req as any).user as { id: number; role: Role } | undefined;
      if (!authUser) {
        throw Errors.Unauthorized("Unauthorized", "UNAUTHORIZED");
      }

      const conversations = await messagingService.listConversations({
        id: authUser.id,
        role: authUser.role,
      });

      res.json({
        success: true,
        data: conversations,
      });
    } catch (err) {
      next(err);
    }
  },

  startConversation: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authUser = (req as any).user as { id: number; role: Role } | undefined;
      if (!authUser) {
        throw Errors.Unauthorized("Unauthorized", "UNAUTHORIZED");
      }

      const input = validateStartConversation(req.body);

      const conversation = await messagingService.startConversation(
        { id: authUser.id, role: authUser.role },
        input
      );

      res.status(201).json({
        success: true,
        data: conversation,
      });
    } catch (err) {
      next(err);
    }
  },

  getConversationInfo: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const authUser = (req as any).user as { id: number; role: Role } | undefined;
      if (!authUser) {
        throw Errors.Unauthorized("Unauthorized", "UNAUTHORIZED");
      }

      const conversationId = parseIdParam(req.params.id, "id");

      const conversation = await messagingService.getConversationInfo(
        { id: authUser.id, role: authUser.role },
        conversationId
      );

      res.json({
        success: true,
        data: conversation,
      });
    } catch (err) {
      next(err);
    }
  },

  /* ---------- Messages ---------- */

  listMessages: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authUser = (req as any).user as { id: number; role: Role } | undefined;
      if (!authUser) {
        throw Errors.Unauthorized("Unauthorized", "UNAUTHORIZED");
      }

      const conversationId = parseIdParam(req.params.id, "id");

      const result = await messagingService.listMessages(
        { id: authUser.id, role: authUser.role },
        conversationId
      );

      res.json({
        success: true,
        data: result.messages,
      });
    } catch (err) {
      next(err);
    }
  },

  sendMessage: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authUser = (req as any).user as { id: number; role: Role } | undefined;
      if (!authUser) {
        throw Errors.Unauthorized("Unauthorized", "UNAUTHORIZED");
      }

      const conversationId = parseIdParam(req.params.id, "id");
      const input = validateSendMessage(req.body);

      const message = await messagingService.sendMessage(
        { id: authUser.id, role: authUser.role },
        conversationId,
        input
      );

      res.status(201).json({
        success: true,
        data: message,
      });
    } catch (err) {
      next(err);
    }
  },

  markMessageAsRead: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const authUser = (req as any).user as { id: number; role: Role } | undefined;
      if (!authUser) {
        throw Errors.Unauthorized("Unauthorized", "UNAUTHORIZED");
      }

      const messageId = parseIdParam(req.params.id, "id");

      const message = await messagingService.markMessageAsRead(
        { id: authUser.id, role: authUser.role },
        messageId
      );

      res.json({
        success: true,
        data: message,
      });
    } catch (err) {
      next(err);
    }
  },
};
