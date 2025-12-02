import { Request, Response, NextFunction } from "express";
import { forumService } from "../services/forum.service.js";
import { Errors } from "../errors/ApiError.js";

export const forumController = {
    // Topics
    createTopic: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userRole = (req as any).user?.role;
            if (userRole !== "ADMIN") {
                throw Errors.Forbidden("Only admins can create topics");
            }

            const result = await forumService.createTopic(req.body);
            res.status(201).json({ data: result });
        } catch (err) {
            next(err);
        }
    },

    listTopics: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await forumService.listTopics();
            res.json({ data: result });
        } catch (err) {
            next(err);
        }
    },

    getTopicById: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = Number(req.params.topicId);
            const result = await forumService.getTopicById(id);
            res.json({ data: result });
        } catch (err) {
            next(err);
        }
    },

    // Questions
    createQuestion: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = (req as any).user?.id;
            if (!userId) throw Errors.Unauthorized("Not authenticated");

            const result = await forumService.createQuestion(userId, req.body);
            res.status(201).json({ data: result });
        } catch (err) {
            next(err);
        }
    },

    listQuestions: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;
            const topicId = req.query.topicId ? Number(req.query.topicId) : undefined;

            const result = await forumService.listQuestions({ topicId, page, limit });
            res.json(result);
        } catch (err) {
            next(err);
        }
    },

    getQuestionById: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = Number(req.params.questionId);
            const result = await forumService.getQuestionById(id);
            res.json({ data: result });
        } catch (err) {
            next(err);
        }
    },

    // Answers
    createAnswer: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = (req as any).user?.id;
            if (!userId) throw Errors.Unauthorized("Not authenticated");

            const questionId = Number(req.params.questionId);
            const { body } = req.body;

            const result = await forumService.createAnswer(userId, questionId, body);
            res.status(201).json({ data: result });
        } catch (err) {
            next(err);
        }
    },

    acceptAnswer: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = (req as any).user?.id;
            if (!userId) throw Errors.Unauthorized("Not authenticated");

            const answerId = Number(req.params.answerId);
            const result = await forumService.acceptAnswer(answerId, userId);
            res.json({ data: result });
        } catch (err) {
            next(err);
        }
    },
};
