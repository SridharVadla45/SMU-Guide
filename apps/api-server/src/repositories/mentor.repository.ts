import { prisma } from "../lib/prisma.js";
import { Prisma } from "@prisma/client";

export const mentorRepository = {
    findAll: async (params: {
        skip?: number;
        take?: number;
        where?: Prisma.UserWhereInput;
    }) => {
        const { skip, take, where } = params;
        return prisma.user.findMany({
            where: {
                role: "MENTOR",
                ...where,
            },
            include: {
                mentorProfile: true,
            },
            skip,
            take,
        });
    },

    count: async (where?: Prisma.UserWhereInput) => {
        return prisma.user.count({
            where: {
                role: "MENTOR",
                ...where,
            },
        });
    },

    findById: async (id: number) => {
        return prisma.user.findUnique({
            where: { id },
            include: {
                mentorProfile: {
                    include: {
                        availabilities: true,
                    },
                },
            },
        });
    },

    findProfileByUserId: async (userId: number) => {
        return prisma.mentorProfile.findUnique({
            where: { userId },
            include: {
                availabilities: true,
            },
        });
    },

    upsertProfile: async (userId: number, data: Omit<Prisma.MentorProfileCreateInput, 'user'>) => {
        // Check if profile exists
        const existing = await prisma.mentorProfile.findUnique({
            where: { userId },
        });

        if (existing) {
            return prisma.mentorProfile.update({
                where: { userId },
                data,
                include: {
                    availabilities: true,
                },
            });
        } else {
            return prisma.mentorProfile.create({
                data: {
                    ...data,
                    user: { connect: { id: userId } },
                },
                include: {
                    availabilities: true,
                },
            });
        }
    },

    addAvailability: async (mentorProfileId: number, data: Prisma.MentorAvailabilityCreateManyInput[]) => {
        return prisma.mentorAvailability.createMany({
            data: data.map((slot) => ({
                ...slot,
                mentorProfileId,
            })),
        });
    },

    updateAvailability: async (slotId: number, data: Prisma.MentorAvailabilityUpdateInput) => {
        return prisma.mentorAvailability.update({
            where: { id: slotId },
            data,
        });
    },

    deleteAvailability: async (slotId: number) => {
        return prisma.mentorAvailability.delete({
            where: { id: slotId },
        });
    },

    findAvailabilityById: async (slotId: number) => {
        return prisma.mentorAvailability.findUnique({
            where: { id: slotId }
        })
    }
};
