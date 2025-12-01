// src/repositories/forum.repository.ts
import { prisma } from "../lib/prisma.js";
import {
  CreateAnswerInput,
  CreateQuestionInput,
  CreateTopicInput,
  QuestionFilter,
  TopicFilter,
  UpdateAnswerInput,
  UpdateQuestionInput,
} from "../types/forum.types.js";

export const forumRepository = {
  /* ---------- Topics ---------- */

  listTopics: async (filter: TopicFilter) => {
    const { page = 1, limit = 10 } = filter;

    const [items, total] = await Promise.all([
      prisma.topic.findMany({
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.topic.count(),
    ]);

    return { items, total, page, limit };
  },

  createTopic: async (data: CreateTopicInput, userId: number) => {
    // userId stored nowhere in Topic, but could be used for auditing later
    return prisma.topic.create({
      data: {
        title: data.title,
        description: data.description,
      },
    });
  },

  getTopicById: async (id: number) => {
    return prisma.topic.findUnique({
      where: { id },
    });
  },

  /* ---------- Questions ---------- */

  listQuestions: async (filter: QuestionFilter) => {
    const { topicId, page = 1, limit = 10 } = filter;

    const where: any = {};
    if (topicId !== undefined) {
      where.topicId = topicId;
    }

    const [items, total] = await Promise.all([
      prisma.question.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          topic: true,
          askedBy: { select: { id: true, name: true, email: true, role: true } },
          answers: {
            include: {
              answeredBy: {
                select: { id: true, name: true, email: true, role: true },
              },
            },
          },
        },
      }),
      prisma.question.count({ where }),
    ]);

    return { items, total, page, limit };
  },

  getQuestionById: async (id: number) => {
    return prisma.question.findUnique({
      where: { id },
      include: {
        topic: true,
        askedBy: { select: { id: true, name: true, email: true, role: true } },
        answers: {
          orderBy: { createdAt: "asc" },
          include: {
            answeredBy: {
              select: { id: true, name: true, email: true, role: true },
            },
          },
        },
      },
    });
  },

  createQuestion: async (data: CreateQuestionInput, askedById: number) => {
    return prisma.question.create({
      data: {
        title: data.title,
        body: data.body,
        topicId: data.topicId,
        askedById,
      },
    });
  },

  updateQuestion: async (id: number, data: UpdateQuestionInput) => {
    return prisma.question.update({
      where: { id },
      data,
    });
  },

  deleteQuestion: async (id: number) => {
    return prisma.question.delete({
      where: { id },
    });
  },

  /* ---------- Answers ---------- */

  createAnswer: async (
    questionId: number,
    data: CreateAnswerInput,
    answeredById: number
  ) => {
    return prisma.answer.create({
      data: {
        questionId,
        body: data.body,
        answeredById,
      },
    });
  },

  getAnswerById: async (id: number) => {
    return prisma.answer.findUnique({
      where: { id },
      include: {
        question: true,
        answeredBy: {
          select: { id: true, name: true, email: true, role: true },
        },
      },
    });
  },

  updateAnswer: async (id: number, data: UpdateAnswerInput) => {
    return prisma.answer.update({
      where: { id },
      data,
    });
  },

  deleteAnswer: async (id: number) => {
    return prisma.answer.delete({
      where: { id },
    });
  },

  acceptAnswer: async (answerId: number, questionId: number) => {
    // mark this answer accepted, others of same question not accepted
    await prisma.answer.updateMany({
      where: { questionId },
      data: { isAccepted: false },
    });

    return prisma.answer.update({
      where: { id: answerId },
      data: { isAccepted: true },
    });
  },
};
