import { Router } from "express";
import { forumController } from "../controllers/forum.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const forumRouter = Router();

// Topics - public read, admin create
forumRouter.get("/topics", forumController.listTopics);
forumRouter.get("/topics/:topicId", forumController.getTopicById);
forumRouter.post("/topics", authMiddleware, forumController.createTopic);

// Questions - public read, authenticated create
forumRouter.get("/questions", forumController.listQuestions);
forumRouter.get("/questions/:questionId", forumController.getQuestionById);
forumRouter.post("/questions", authMiddleware, forumController.createQuestion);

// Answers - authenticated only
forumRouter.post("/questions/:questionId/answers", authMiddleware, forumController.createAnswer);
forumRouter.patch("/answers/:answerId/accept", authMiddleware, forumController.acceptAnswer);

export { forumRouter };
