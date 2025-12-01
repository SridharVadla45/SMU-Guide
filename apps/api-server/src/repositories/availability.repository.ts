// src/modules/availability/availability.repository.ts
import { prisma } from "../lib/prisma.js";
import {
  AvailabilitySlotInput,
  AvailabilitySlotUpdateInput,
} from "../types/availability.types.js";

export const availabilityRepository = {
  // Public: get availability for a given mentor (userId)
  getAvailabilityForMentor: async (mentorUserId: number) => {
    const profile = await prisma.mentorProfile.findUnique({
      where: { userId: mentorUserId },
      include: { availabilities: true },
    });

    return profile?.availabilities || [];
  },

  // Get or create mentor profile for current mentor user
  getOrCreateMentorProfile: async (userId: number) => {
    let profile = await prisma.mentorProfile.findUnique({
      where: { userId },
      include: { availabilities: true },
    });

    if (!profile) {
      profile = await prisma.mentorProfile.create({
        data: { userId },
        include: { availabilities: true },
      });
    }

    return profile;
  },

  // Append multiple new slots
  addSlots: async (mentorProfileId: number, slots: AvailabilitySlotInput[]) => {
    if (slots.length === 0) return [];

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

  // Find a specific slot that belongs to a given mentor user
  findSlotForMentor: async (userId: number, slotId: number) => {
    return prisma.mentorAvailability.findFirst({
      where: {
        id: slotId,
        mentorProfile: {
          userId,
        },
      },
    });
  },

  updateSlot: async (slotId: number, data: AvailabilitySlotUpdateInput) => {
    return prisma.mentorAvailability.update({
      where: { id: slotId },
      data,
    });
  },

  deleteSlot: async (slotId: number) => {
    return prisma.mentorAvailability.delete({
      where: { id: slotId },
    });
  },
};
