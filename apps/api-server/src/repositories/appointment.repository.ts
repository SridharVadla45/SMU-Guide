import { prisma } from "../lib/prisma.js";
import { Prisma, AppointmentStatus } from "@prisma/client";

export const appointmentRepository = {
    create: async (data: Prisma.AppointmentCreateInput) => {
        return prisma.appointment.create({
            data,
            include: {
                student: true,
                mentor: true,
            },
        });
    },

    findAll: async (params: {
        where?: Prisma.AppointmentWhereInput;
        skip?: number;
        take?: number;
    }) => {
        const { where, skip, take } = params;
        return prisma.appointment.findMany({
            where,
            include: {
                student: {
                    select: { id: true, name: true, email: true, avatarUrl: true }
                },
                mentor: {
                    select: { id: true, name: true, email: true, avatarUrl: true }
                }
            },
            orderBy: { startsAt: 'asc' },
            skip,
            take,
        });
    },

    count: async (where?: Prisma.AppointmentWhereInput) => {
        return prisma.appointment.count({ where });
    },

    findById: async (id: number) => {
        return prisma.appointment.findUnique({
            where: { id },
            include: {
                student: true,
                mentor: true,
            },
        });
    },

    updateStatus: async (id: number, status: AppointmentStatus) => {
        return prisma.appointment.update({
            where: { id },
            data: { status },
        });
    },

    updateZoomDetails: async (id: number, zoomDetails: { zoomMeetingId: string; zoomJoinUrl: string; zoomStartUrl: string }) => {
        return prisma.appointment.update({
            where: { id },
            data: zoomDetails,
        });
    }
};
