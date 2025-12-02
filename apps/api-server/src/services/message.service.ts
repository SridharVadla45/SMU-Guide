import { messageRepository } from "../repositories/message.repository.js";
import { Errors } from "../errors/ApiError.js";

export const messageService = {
    // Conversations
    createOrGetConversation: async (userId: number, otherUserId: number) => {
        if (userId === otherUserId) {
            throw Errors.BadRequest("Cannot create conversation with yourself");
        }

        // Check if conversation already exists
        const existing = await messageRepository.findExistingConversation(userId, otherUserId);
        if (existing) {
            return existing;
        }

        // Create new conversation
        return messageRepository.createConversation([userId, otherUserId]);
    },

    listConversations: async (userId: number) => {
        return messageRepository.findConversationsByUserId(userId);
    },

    getConversationById: async (conversationId: number, userId: number) => {
        const conversation = await messageRepository.findConversationById(conversationId);

        if (!conversation) {
            throw Errors.NotFound("Conversation not found");
        }

        // Check if user is a participant
        const isParticipant = conversation.participants.some(p => p.userId === userId);
        if (!isParticipant) {
            throw Errors.Forbidden("You are not a participant in this conversation");
        }

        return conversation;
    },

    // Messages
    sendMessage: async (userId: number, conversationId: number, content: string) => {
        const conversation = await messageRepository.findConversationById(conversationId);

        if (!conversation) {
            throw Errors.NotFound("Conversation not found");
        }

        // Check if user is a participant
        const isParticipant = conversation.participants.some(p => p.userId === userId);
        if (!isParticipant) {
            throw Errors.Forbidden("You are not a participant in this conversation");
        }

        return messageRepository.createMessage({
            content,
            conversation: { connect: { id: conversationId } },
            sender: { connect: { id: userId } }
        });
    },

    getMessages: async (conversationId: number, userId: number, params: {
        page: number;
        limit: number;
    }) => {
        const conversation = await messageRepository.findConversationById(conversationId);

        if (!conversation) {
            throw Errors.NotFound("Conversation not found");
        }

        // Check if user is a participant
        const isParticipant = conversation.participants.some(p => p.userId === userId);
        if (!isParticipant) {
            throw Errors.Forbidden("You are not a participant in this conversation");
        }

        const { page, limit } = params;
        const skip = (page - 1) * limit;

        return messageRepository.findMessagesByConversationId(conversationId, { skip, take: limit });
    }
};
