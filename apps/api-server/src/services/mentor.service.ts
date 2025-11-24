import { Errors } from "../errors/ApiError.js";
import { mentorRepository } from "../repositories/mentor.repository.js";
import {
  MentorAvailabilitySlotInput,
  MentorFilter,
  UpsertMentorProfileInput,
} from "../types/mentor.types.js";

export const mentorService = {
  listMentors: async (filter: MentorFilter) => {
    const [items, total] = await Promise.all([
      mentorRepository.findMentors(filter),
      mentorRepository.countMentors(filter),
    ]);

    return {
      items,
      total,
      page: filter.page || 1,
      limit: filter.limit || 10,
    };
  },

  getMentorById: async (mentorId: number) => {
    const mentor = await mentorRepository.findMentorById(mentorId);
    if (!mentor) {
      throw Errors.NotFound("Mentor not found", "MENTOR_NOT_FOUND");
    }
    return mentor;
  },

  getMyMentorProfile: async (userId: number) => {
    const profile = await mentorRepository.getOrCreateMentorProfile(userId);
    return profile;
  },

  upsertMyMentorProfile: async (
    userId: number,
    data: UpsertMentorProfileInput
  ) => {
    const profile = await mentorRepository.upsertMentorProfile(userId, data);
    return profile;
  },

  setMyAvailability: async (
    userId: number,
    slots: MentorAvailabilitySlotInput[]
  ) => {
    const profile = await mentorRepository.getOrCreateMentorProfile(userId);
    const updatedSlots = await mentorRepository.replaceAvailability(
      profile.id,
      slots
    );
    return updatedSlots;
  },

  getMentorAvailability: async (mentorId: number) => {
    const availability = await mentorRepository.getAvailabilityForMentor(
      mentorId
    );
    return availability;
  },
};
