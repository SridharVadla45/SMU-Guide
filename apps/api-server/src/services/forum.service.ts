import { forumRepository } from "../repositories/forum.repository.js";
import { Errors } from "../errors/ApiError.js";

export const forumService = {
    // Topics
    createTopic: async (data: { title: string; description?: string }) => {
        return forumRepository.createTopic(data);
    },

    listTopics: async () => {
        return forumRepository.findAllTopics();
    },

    getTopicById: async (id: number) => {
        const topic = await forumRepository.findTopicById(id);
        if (!topic) {
            throw Errors.NotFound("Topic not found");
        }
        return topic;
    },

    // Questions
    createQuestion: async (userId: number, data: {
        title: string;
        body: string;
        topicId: number;
    }) => {
        // Verify topic exists
        const topic = await forumRepository.findTopicById(data.topicId);
        if (!topic) {
            throw Errors.NotFound("Topic not found");
        }

        return forumRepository.createQuestion({
            title: data.title,
            body: data.body,
            topic: { connect: { id: data.topicId } },
            askedBy: { connect: { id: userId } }
        });
    },

    listQuestions: async (params: {
        topicId?: number;
        page: number;
        limit: number;
    }) => {
        const { topicId, page, limit } = params;
        const skip = (page - 1) * limit;

        const where = topicId ? { topicId } : undefined;

        const [questions, total] = await Promise.all([
            forumRepository.findAllQuestions({ topicId, skip, take: limit }),
            forumRepository.countQuestions(where)
        ]);

        return {
            data: questions,
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        };
    },

    getQuestionById: async (id: number) => {
        const question = await forumRepository.findQuestionById(id);
        if (!question) {
            throw Errors.NotFound("Question not found");
        }
        return question;
    },

    // Answers
    createAnswer: async (userId: number, questionId: number, body: string) => {
        // Verify question exists
        const question = await forumRepository.findQuestionById(questionId);
        if (!question) {
            throw Errors.NotFound("Question not found");
        }

        return forumRepository.createAnswer({
            body,
            question: { connect: { id: questionId } },
            answeredBy: { connect: { id: userId } }
        });
    },

    acceptAnswer: async (answerId: number, userId: number) => {
        const answer = await forumRepository.findAnswerById(answerId);

        if (!answer) {
            throw Errors.NotFound("Answer not found");
        }

        // Only the question asker can accept an answer
        if (answer.question.askedById !== userId) {
            throw Errors.Forbidden("Only the question asker can accept an answer");
        }

        if (answer.isAccepted) {
            throw Errors.BadRequest("Answer is already accepted");
        }

        return forumRepository.acceptAnswer(answerId);
    }
};
