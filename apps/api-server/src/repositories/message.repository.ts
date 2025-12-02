import { prisma } from "../lib/prisma.js";
import { Prisma } from "@prisma/client";

export const messageRepository = {
    // Conversations
    createConversation: async (participantIds: number[]) => {
        return prisma.conversation.create({
            data: {
                participants: {
                    create: participantIds.map(userId => ({
                        userId
                    }))
                }
            },
            include: {
                participants: {
                    include: {
                        user: {
                            select: { id: true, name: true, avatarUrl: true, role: true }
                        }
                    }
                }
            }
        });
    },

    findConversationById: async (id: number) => {
        return prisma.conversation.findUnique({
            where: { id },
            include: {
                participants: {
                    include: {
                        user: {
                            select: { id: true, name: true, avatarUrl: true, role: true }
                        }
                    }
                },
                messages: {
                    include: {
                        sender: {
                            select: { id: true, name: true, avatarUrl: true }
                        }
                    },
                    orderBy: { createdAt: 'asc' },
                    take: 50 // Last 50 messages
                }
            }
        });
    },

    findConversationsByUserId: async (userId: number) => {
        return prisma.conversation.findMany({
            where: {
                participants: {
                    some: { userId }
                }
            },
            include: {
                participants: {
                    include: {
                        user: {
                            select: { id: true, name: true, avatarUrl: true, role: true }
                        }
                    }
                },
                messages: {
                    orderBy: { createdAt: 'desc' },
                    take: 1 // Last message for preview
                }
            },
            orderBy: { createdAt: 'desc' }
        });
    },

    findExistingConversation: async (userId1: number, userId2: number) => {
        return prisma.conversation.findFirst({
            where: {
                AND: [
                    {
                        participants: {
                            some: { userId: userId1 }
                        }
                    },
                    {
                        participants: {
                            some: { userId: userId2 }
                        }
                    }
                ]
            },
            include: {
                participants: {
                    include: {
                        user: {
                            select: { id: true, name: true, avatarUrl: true, role: true }
                        }
                    }
                }
            }
        });
    },

    // Messages
    createMessage: async (data: Prisma.MessageCreateInput) => {
        return prisma.message.create({
            data,
            include: {
                sender: {
                    select: { id: true, name: true, avatarUrl: true }
                }
            }
        });
    },

    findMessagesByConversationId: async (conversationId: number, params: {
        skip?: number;
        take?: number;
    }) => {
        const { skip, take } = params;
        return prisma.message.findMany({
            where: { conversationId },
            include: {
                sender: {
                    select: { id: true, name: true, avatarUrl: true }
                }
            },
            orderBy: { createdAt: 'asc' },
            skip,
            take
        });
    },

    markAsRead: async (messageId: number) => {
        return prisma.message.update({
            where: { id: messageId },
            data: { readAt: new Date() }
        });
    }
};
