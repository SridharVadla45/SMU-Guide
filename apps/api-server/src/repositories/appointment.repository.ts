// src/repositories/appointment.repository.ts
import { prisma } from "../lib/prisma.js";
import { AppointmentStatus, Role } from "@prisma/client";

export const appointmentRepository = {
  // Ensure mentor exists and is a MENTOR
  findMentorById: async (mentorId: number) => {
    return prisma.user.findFirst({
      where: {
        id: mentorId,
        role: Role.MENTOR,
      },
      include: {
        mentorProfile: {
          include: {
            availabilities: true,
          },
        },
      },
    });
  },

  // Load mentor availability slots
  getMentorAvailability: async (mentorId: number) => {
    const profile = await prisma.mentorProfile.findUnique({
      where: { userId: mentorId },
      include: { availabilities: true },
    });

    return profile?.availabilities || [];
  },

  // Overlapping appointments for mentor
  findOverlappingAppointmentsForMentor: async (
    mentorId: number,
    startsAt: Date,
    endsAt: Date
  ) => {
    return prisma.appointment.findMany({
      where: {
        mentorId,
        status: {
          in: [AppointmentStatus.PENDING, AppointmentStatus.CONFIRMED],
        },
        OR: [
          {
            startsAt: { lt: endsAt },
            endsAt: { gt: startsAt },
          },
        ],
      },
    });
  },

  // Overlapping appointments for student
  findOverlappingAppointmentsForStudent: async (
    studentId: number,
    startsAt: Date,
    endsAt: Date
  ) => {
    return prisma.appointment.findMany({
      where: {
        studentId,
        status: {
          in: [AppointmentStatus.PENDING, AppointmentStatus.CONFIRMED],
        },
        OR: [
          {
            startsAt: { lt: endsAt },
            endsAt: { gt: startsAt },
          },
        ],
      },
    });
  },

  createAppointment: async (data: {
    studentId: number;
    mentorId: number;
    startsAt: Date;
    endsAt: Date;
  }) => {
    return prisma.appointment.create({
      data: {
        studentId: data.studentId,
        mentorId: data.mentorId,
        startsAt: data.startsAt,
        endsAt: data.endsAt,
        status: AppointmentStatus.PENDING,
      },
      include: {
        student: { select: { id: true, name: true, email: true } },
        mentor: { select: { id: true, name: true, email: true } },
      },
    });
  },

  findAppointmentById: async (id: number) => {
    return prisma.appointment.findUnique({
      where: { id },
      include: {
        student: { select: { id: true, name: true, email: true } },
        mentor: { select: { id: true, name: true, email: true } },
      },
    });
  },

  getAppointmentsForStudent: async (
    studentId: number,
    status?: AppointmentStatus
  ) => {
    return prisma.appointment.findMany({
      where: {
        studentId,
        ...(status ? { status } : {}),
      },
      orderBy: { startsAt: "asc" },
      include: {
        student: { select: { id: true, name: true, email: true } },
        mentor: { select: { id: true, name: true, email: true } },
      },
    });
  },

  getAppointmentsForMentor: async (
    mentorId: number,
    status?: AppointmentStatus
  ) => {
    return prisma.appointment.findMany({
      where: {
        mentorId,
        ...(status ? { status } : {}),
      },
      orderBy: { startsAt: "asc" },
      include: {
        student: { select: { id: true, name: true, email: true } },
        mentor: { select: { id: true, name: true, email: true } },
      },
    });
  },

  getAllAppointments: async (status?: AppointmentStatus) => {
    return prisma.appointment.findMany({
      where: {
        ...(status ? { status } : {}),
      },
      orderBy: { startsAt: "asc" },
      include: {
        student: { select: { id: true, name: true, email: true } },
        mentor: { select: { id: true, name: true, email: true } },
      },
    });
  },

  updateAppointmentStatus: async (
    id: number,
    status: AppointmentStatus
  ) => {
    return prisma.appointment.update({
      where: { id },
      data: { status },
      include: {
        student: { select: { id: true, name: true, email: true } },
        mentor: { select: { id: true, name: true, email: true } },
      },
    });
  },
};
