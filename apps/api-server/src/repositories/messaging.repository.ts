// src/repositories/messaging.repository.ts
import { prisma } from "../lib/prisma.js";

export const messagingRepository = {
  /* ---------- Conversations ---------- */

  getConversationsForUser: async (userId: number) => {
    const conversations = await prisma.conversation.findMany({
      where: {
        participants: {
          some: { userId },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        participants: {
          include: {
            user: {
              select: { id: true, name: true, email: true, role: true },
            },
          },
        },
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    });

    return conversations;
  },

  findConversationByIdForUser: async (conversationId: number, userId: number) => {
    return prisma.conversation.findFirst({
      where: {
        id: conversationId,
        participants: {
          some: { userId },
        },
      },
      include: {
        participants: {
          include: {
            user: { select: { id: true, name: true, email: true, role: true } },
          },
        },
      },
    });
  },

  findDirectConversationBetweenUsers: async (userAId: number, userBId: number) => {
    // direct 2-person conversation
    const conversations = await prisma.conversation.findMany({
      where: {
        participants: {
          some: { userId: userAId },
        },
      },
      include: {
        participants: true,
      },
    });

    return conversations.find((c) => {
      const ids = c.participants.map((p) => p.userId);
      return ids.length === 2 && ids.includes(userAId) && ids.includes(userBId);
    });
  },

  createConversation: async (userId: number, participantId: number) => {
    return prisma.conversation.create({
      data: {
        participants: {
          create: [
            { userId },
            { userId: participantId },
          ],
        },
      },
      include: {
        participants: {
          include: {
            user: { select: { id: true, name: true, email: true, role: true } },
          },
        },
      },
    });
  },

  /* ---------- Messages ---------- */

  getMessagesForConversation: async (
    conversationId: number,
    userId: number
  ) => {
    // ensure user is participant
    const conversation = await prisma.conversation.findFirst({
      where: {
        id: conversationId,
        participants: { some: { userId } },
      },
    });

    if (!conversation) return null;

    const messages = await prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: "asc" },
      include: {
        sender: { select: { id: true, name: true, email: true, role: true } },
      },
    });

    return { conversation, messages };
  },

  createMessage: async (
    conversationId: number,
    senderId: number,
    content: string
  ) => {
    return prisma.message.create({
      data: {
        conversationId,
        senderId,
        content,
      },
      include: {
        sender: { select: { id: true, name: true, email: true, role: true } },
      },
    });
  },

  findMessageByIdForUser: async (messageId: number, userId: number) => {
    return prisma.message.findFirst({
      where: {
        id: messageId,
        conversation: {
          participants: {
            some: { userId },
          },
        },
      },
      include: {
        conversation: true,
        sender: {
          select: { id: true, name: true, email: true, role: true },
        },
      },
    });
  },

  markMessageAsRead: async (messageId: number) => {
    return prisma.message.update({
      where: { id: messageId },
      data: { readAt: new Date() },
    });
  },

  isUserParticipantInConversation: async (conversationId: number, userId: number) => {
    const count = await prisma.conversationParticipant.count({
      where: {
        conversationId,
        userId,
      },
    });
    return count > 0;
  },
};
