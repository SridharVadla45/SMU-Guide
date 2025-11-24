// src/modules/mentors/mentor.repository.ts
import { prisma } from "../lib/prisma.js";
import { Role } from "@prisma/client";
import {
  MentorAvailabilitySlotInput,
  MentorFilter,
  UpsertMentorProfileInput,
} from "../types/mentor.types.js";

export const mentorRepository = {
  findMentors: async (filter: MentorFilter) => {
    const { department, search, page = 1, limit = 10 } = filter;

    return prisma.user.findMany({
      where: {
        role: Role.MENTOR,
        ...(department ? { department } : {}),
        ...(search
          ? {
              OR: [
                { name: { contains: search, mode: "insensitive" } },
                { bio: { contains: search, mode: "insensitive" } },
              ],
            }
          : {}),
      },
      include: {
        mentorProfile: {
          include: {
            availabilities: true,
          },
        },
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: {
        name: "asc",
      },
    });
  },

  countMentors: async (filter: MentorFilter) => {
    const { department, search } = filter;
    return prisma.user.count({
      where: {
        role: Role.MENTOR,
        ...(department ? { department } : {}),
        ...(search
          ? {
              OR: [
                { name: { contains: search, mode: "insensitive" } },
                { bio: { contains: search, mode: "insensitive" } },
              ],
            }
          : {}),
      },
    });
  },

  findMentorById: async (userId: number) => {
    return prisma.user.findFirst({
      where: {
        id: userId,
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

  getOrCreateMentorProfile: async (userId: number) => {
    let profile = await prisma.mentorProfile.findUnique({
      where: { userId },
      include: { availabilities: true },
    });

    if (!profile) {
      profile = await prisma.mentorProfile.create({
        data: {
          userId,
        },
        include: { availabilities: true },
      });
    }

    return profile;
  },

  upsertMentorProfile: async (
    userId: number,
    data: UpsertMentorProfileInput
  ) => {
    return prisma.mentorProfile.upsert({
      where: { userId },
      update: {
        ...data,
      },
      create: {
        userId,
        ...data,
      },
      include: {
        availabilities: true,
      },
    });
  },

  replaceAvailability: async (
    mentorProfileId: number,
    slots: MentorAvailabilitySlotInput[]
  ) => {
    await prisma.mentorAvailability.deleteMany({
      where: { mentorProfileId },
    });

    if (slots.length === 0) {
      return [];
    }

    await prisma.mentorAvailability.createMany({
      data: slots.map((slot) => ({
        mentorProfileId,
        dayOfWeek: slot.dayOfWeek,
        startTime: slot.startTime,
        endTime: slot.endTime,
      })),
    });

    return prisma.mentorAvailability.findMany({
      where: { mentorProfileId },
      orderBy: [
        { dayOfWeek: "asc" },
        { startTime: "asc" },
      ],
    });
  },

  getAvailabilityForMentor: async (mentorUserId: number) => {
    const profile = await prisma.mentorProfile.findUnique({
      where: { userId: mentorUserId },
      include: { availabilities: true },
    });

    return profile?.availabilities || [];
  },
};
