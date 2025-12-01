// src/services/forum.services.ts
import { Role } from "@prisma/client";
import { Errors } from "../errors/ApiError.js";
import { forumRepository } from "../repositories/forum.repository.js";
import {
  AuthUserContext,
  CreateAnswerInput,
  CreateQuestionInput,
  CreateTopicInput,
  QuestionFilter,
  TopicFilter,
  UpdateAnswerInput,
  UpdateQuestionInput,
} from "../types/forum.types.js";

export const forumService = {
  /* ---------- Topics ---------- */

  listTopics: async (filter: TopicFilter) => {
    return forumRepository.listTopics(filter);
  },

  createTopic: async (authUser: AuthUserContext, data: CreateTopicInput) => {
    if (authUser.role !== Role.ADMIN) {
      throw Errors.Forbidden("Only admin can create topics", "FORBIDDEN");
    }
    return forumRepository.createTopic(data, authUser.id);
  },

  /* ---------- Questions ---------- */

  listQuestions: async (filter: QuestionFilter) => {
    return forumRepository.listQuestions(filter);
  },

  getQuestionById: async (id: number) => {
    const q = await forumRepository.getQuestionById(id);
    if (!q) {
      throw Errors.NotFound("Question not found", "QUESTION_NOT_FOUND");
    }
    return q;
  },

  createQuestion: async (
    authUser: AuthUserContext,
    data: CreateQuestionInput
  ) => {
    // any authenticated user can ask
    if (!authUser.id) {
      throw Errors.Unauthorized("Unauthorized", "UNAUTHORIZED");
    }

    // ensure topic exists
    const topic = await forumRepository.getTopicById(data.topicId);
    if (!topic) {
      throw Errors.NotFound("Topic not found", "TOPIC_NOT_FOUND");
    }

    return forumRepository.createQuestion(data, authUser.id);
  },

  updateQuestion: async (
    authUser: AuthUserContext,
    id: number,
    data: UpdateQuestionInput
  ) => {
    const existing = await forumRepository.getQuestionById(id);
    if (!existing) {
      throw Errors.NotFound("Question not found", "QUESTION_NOT_FOUND");
    }

    const isOwner = existing.askedById === authUser.id;
    const isAdmin = authUser.role === Role.ADMIN;

    if (!isOwner && !isAdmin) {
      throw Errors.Forbidden("You cannot edit this question", "FORBIDDEN");
    }

    return forumRepository.updateQuestion(id, data);
  },

  deleteQuestion: async (authUser: AuthUserContext, id: number) => {
    const existing = await forumRepository.getQuestionById(id);
    if (!existing) {
      throw Errors.NotFound("Question not found", "QUESTION_NOT_FOUND");
    }

    const isOwner = existing.askedById === authUser.id;
    const isAdmin = authUser.role === Role.ADMIN;

    if (!isOwner && !isAdmin) {
      throw Errors.Forbidden("You cannot delete this question", "FORBIDDEN");
    }

    await forumRepository.deleteQuestion(id);
  },

  /* ---------- Answers ---------- */

  addAnswer: async (
    authUser: AuthUserContext,
    questionId: number,
    data: CreateAnswerInput
  ) => {
    if (!authUser.id) {
      throw Errors.Unauthorized("Unauthorized", "UNAUTHORIZED");
    }

    const question = await forumRepository.getQuestionById(questionId);
    if (!question) {
      throw Errors.NotFound("Question not found", "QUESTION_NOT_FOUND");
    }

    return forumRepository.createAnswer(questionId, data, authUser.id);
  },

  updateAnswer: async (
    authUser: AuthUserContext,
    answerId: number,
    data: UpdateAnswerInput
  ) => {
    const answer = await forumRepository.getAnswerById(answerId);
    if (!answer) {
      throw Errors.NotFound("Answer not found", "ANSWER_NOT_FOUND");
    }

    const isOwner = answer.answeredById === authUser.id;
    const isAdmin = authUser.role === Role.ADMIN;

    if (!isOwner && !isAdmin) {
      throw Errors.Forbidden("You cannot edit this answer", "FORBIDDEN");
    }

    return forumRepository.updateAnswer(answerId, data);
  },

  deleteAnswer: async (authUser: AuthUserContext, answerId: number) => {
    const answer = await forumRepository.getAnswerById(answerId);
    if (!answer) {
      throw Errors.NotFound("Answer not found", "ANSWER_NOT_FOUND");
    }

    const isOwner = answer.answeredById === authUser.id;
    const isAdmin = authUser.role === Role.ADMIN;

    if (!isOwner && !isAdmin) {
      throw Errors.Forbidden("You cannot delete this answer", "FORBIDDEN");
    }

    await forumRepository.deleteAnswer(answerId);
  },

  acceptAnswer: async (authUser: AuthUserContext, answerId: number) => {
    const answer = await forumRepository.getAnswerById(answerId);
    if (!answer) {
      throw Errors.NotFound("Answer not found", "ANSWER_NOT_FOUND");
    }

    const question = answer.question;
    const isQuestionOwner = question.askedById === authUser.id;
    const isAdmin = authUser.role === Role.ADMIN;

    if (!isQuestionOwner && !isAdmin) {
      throw Errors.Forbidden(
        "Only question owner or admin can accept an answer",
        "FORBIDDEN"
      );
    }

    return forumRepository.acceptAnswer(answerId, question.id);
  },
};
