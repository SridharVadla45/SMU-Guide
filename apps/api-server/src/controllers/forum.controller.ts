// src/controllers/forum.controllers.ts
import { Request, Response, NextFunction } from "express";
import { forumService } from "../services/forum.services.js";
import {
  parseIdParam,
  validateCreateAnswer,
  validateCreateQuestion,
  validateCreateTopic,
  validateQuestionFilter,
  validateTopicFilter,
  validateUpdateAnswer,
  validateUpdateQuestion,
} from "../validators/forum.validators.js";
import { Errors } from "../errors/ApiError.js";
import { Role } from "@prisma/client";

export const forumController = {
  /* ---------- Topics ---------- */

  listTopics: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const filter = validateTopicFilter(req.query);

      const result = await forumService.listTopics(filter);

      res.json({
        success: true,
        data: result.items,
        meta: {
          total: result.total,
          page: result.page,
          limit: result.limit,
        },
      });
    } catch (err) {
      next(err);
    }
  },

  createTopic: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authUser = (req as any).user as { id: number; role: Role } | undefined;
      if (!authUser) {
        throw Errors.Unauthorized("Unauthorized", "UNAUTHORIZED");
      }

      const input = validateCreateTopic(req.body);

      const topic = await forumService.createTopic(
        { id: authUser.id, role: authUser.role },
        input
      );

      res.status(201).json({
        success: true,
        data: topic,
      });
    } catch (err) {
      next(err);
    }
  },

  /* ---------- Questions ---------- */

  listQuestions: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const filter = validateQuestionFilter(req.query);

      const result = await forumService.listQuestions(filter);

      res.json({
        success: true,
        data: result.items,
        meta: {
          total: result.total,
          page: result.page,
          limit: result.limit,
        },
      });
    } catch (err) {
      next(err);
    }
  },

  getQuestionById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseIdParam(req.params.id, "id");

      const question = await forumService.getQuestionById(id);

      res.json({
        success: true,
        data: question,
      });
    } catch (err) {
      next(err);
    }
  },

  createQuestion: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authUser = (req as any).user as { id: number; role: Role } | undefined;
      if (!authUser) {
        throw Errors.Unauthorized("Unauthorized", "UNAUTHORIZED");
      }

      const input = validateCreateQuestion(req.body);

      const question = await forumService.createQuestion(
        { id: authUser.id, role: authUser.role },
        input
      );

      res.status(201).json({
        success: true,
        data: question,
      });
    } catch (err) {
      next(err);
    }
  },

  updateQuestion: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authUser = (req as any).user as { id: number; role: Role } | undefined;
      if (!authUser) {
        throw Errors.Unauthorized("Unauthorized", "UNAUTHORIZED");
      }

      const id = parseIdParam(req.params.id, "id");
      const input = validateUpdateQuestion(req.body);

      const question = await forumService.updateQuestion(
        { id: authUser.id, role: authUser.role },
        id,
        input
      );

      res.json({
        success: true,
        data: question,
      });
    } catch (err) {
      next(err);
    }
  },

  deleteQuestion: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authUser = (req as any).user as { id: number; role: Role } | undefined;
      if (!authUser) {
        throw Errors.Unauthorized("Unauthorized", "UNAUTHORIZED");
      }

      const id = parseIdParam(req.params.id, "id");

      await forumService.deleteQuestion(
        { id: authUser.id, role: authUser.role },
        id
      );

      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },

  /* ---------- Answers ---------- */

  addAnswer: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authUser = (req as any).user as { id: number; role: Role } | undefined;
      if (!authUser) {
        throw Errors.Unauthorized("Unauthorized", "UNAUTHORIZED");
      }

      const questionId = parseIdParam(req.params.id, "id");
      const input = validateCreateAnswer(req.body);

      const answer = await forumService.addAnswer(
        { id: authUser.id, role: authUser.role },
        questionId,
        input
      );

      res.status(201).json({
        success: true,
        data: answer,
      });
    } catch (err) {
      next(err);
    }
  },

  updateAnswer: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authUser = (req as any).user as { id: number; role: Role } | undefined;
      if (!authUser) {
        throw Errors.Unauthorized("Unauthorized", "UNAUTHORIZED");
      }

      const answerId = parseIdParam(req.params.answerId, "answerId");
      const input = validateUpdateAnswer(req.body);

      const answer = await forumService.updateAnswer(
        { id: authUser.id, role: authUser.role },
        answerId,
        input
      );

      res.json({
        success: true,
        data: answer,
      });
    } catch (err) {
      next(err);
    }
  },

  deleteAnswer: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authUser = (req as any).user as { id: number; role: Role } | undefined;
      if (!authUser) {
        throw Errors.Unauthorized("Unauthorized", "UNAUTHORIZED");
      }

      const answerId = parseIdParam(req.params.answerId, "answerId");

      await forumService.deleteAnswer(
        { id: authUser.id, role: authUser.role },
        answerId
      );

      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },

  acceptAnswer: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authUser = (req as any).user as { id: number; role: Role } | undefined;
      if (!authUser) {
        throw Errors.Unauthorized("Unauthorized", "UNAUTHORIZED");
      }

      const answerId = parseIdParam(req.params.answerId, "answerId");

      const answer = await forumService.acceptAnswer(
        { id: authUser.id, role: authUser.role },
        answerId
      );

      res.json({
        success: true,
        data: answer,
      });
    } catch (err) {
      next(err);
    }
  },
};
