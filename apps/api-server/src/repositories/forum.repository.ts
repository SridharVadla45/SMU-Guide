import { prisma } from "../lib/prisma.js";
import { Prisma } from "@prisma/client";

export const forumRepository = {
    // Topics
    createTopic: async (data: Prisma.TopicCreateInput) => {
        return prisma.topic.create({ data });
    },

    findAllTopics: async () => {
        return prisma.topic.findMany({
            include: {
                _count: {
                    select: { questions: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
    },

    findTopicById: async (id: number) => {
        return prisma.topic.findUnique({
            where: { id },
            include: {
                questions: {
                    include: {
                        askedBy: {
                            select: { id: true, name: true, avatarUrl: true }
                        },
                        _count: {
                            select: { answers: true }
                        }
                    },
                    orderBy: { createdAt: 'desc' }
                }
            }
        });
    },

    // Questions
    createQuestion: async (data: Prisma.QuestionCreateInput) => {
        return prisma.question.create({
            data,
            include: {
                askedBy: {
                    select: { id: true, name: true, avatarUrl: true }
                },
                topic: true
            }
        });
    },

    findQuestionById: async (id: number) => {
        return prisma.question.findUnique({
            where: { id },
            include: {
                askedBy: {
                    select: { id: true, name: true, avatarUrl: true, role: true }
                },
                topic: true,
                answers: {
                    include: {
                        answeredBy: {
                            select: { id: true, name: true, avatarUrl: true, role: true }
                        }
                    },
                    orderBy: [
                        { isAccepted: 'desc' },
                        { createdAt: 'asc' }
                    ]
                }
            }
        });
    },

    findAllQuestions: async (params: {
        topicId?: number;
        skip?: number;
        take?: number;
    }) => {
        const { topicId, skip, take } = params;
        const where: Prisma.QuestionWhereInput = topicId ? { topicId } : {};

        return prisma.question.findMany({
            where,
            include: {
                askedBy: {
                    select: { id: true, name: true, avatarUrl: true }
                },
                topic: true,
                _count: {
                    select: { answers: true }
                }
            },
            orderBy: { createdAt: 'desc' },
            skip,
            take
        });
    },

    countQuestions: async (where?: Prisma.QuestionWhereInput) => {
        return prisma.question.count({ where });
    },

    // Answers
    createAnswer: async (data: Prisma.AnswerCreateInput) => {
        return prisma.answer.create({
            data,
            include: {
                answeredBy: {
                    select: { id: true, name: true, avatarUrl: true, role: true }
                }
            }
        });
    },

    findAnswerById: async (id: number) => {
        return prisma.answer.findUnique({
            where: { id },
            include: {
                answeredBy: true,
                question: true
            }
        });
    },

    acceptAnswer: async (id: number) => {
        return prisma.answer.update({
            where: { id },
            data: { isAccepted: true }
        });
    }
};
