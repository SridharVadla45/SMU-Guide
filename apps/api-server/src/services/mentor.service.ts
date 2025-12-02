import { mentorRepository } from "../repositories/mentor.repository.js";
import { Errors } from "../errors/ApiError.js";
import { Prisma } from "@prisma/client";

export const mentorService = {
    listMentors: async (params: {
        page: number;
        limit: number;
        search?: string;
        department?: string;
    }) => {
        const { page, limit, search, department } = params;
        const skip = (page - 1) * limit;

        const where: Prisma.UserWhereInput = {};

        if (search) {
            where.OR = [
                { name: { contains: search } },
                { email: { contains: search } },
            ];
        }

        if (department) {
            where.department = department;
        }

        const [mentors, total] = await Promise.all([
            mentorRepository.findAll({ skip, take: limit, where }),
            mentorRepository.count(where),
        ]);

        return {
            data: mentors,
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    },

    getMentorById: async (id: number) => {
        const mentor = await mentorRepository.findById(id);
        if (!mentor) {
            throw Errors.NotFound("Mentor not found");
        }
        if (mentor.role !== "MENTOR") {
            throw Errors.NotFound("User is not a mentor");
        }
        return mentor;
    },

    getMentorAvailability: async (mentorId: number) => {
        const mentor = await mentorRepository.findById(mentorId);
        if (!mentor || !mentor.mentorProfile) {
            throw Errors.NotFound("Mentor profile not found");
        }
        return mentor.mentorProfile.availabilities;
    },

    getMyProfile: async (userId: number) => {
        let profile = await mentorRepository.findProfileByUserId(userId);
        if (!profile) {
            // Create empty profile if not exists, as per requirements
            profile = await mentorRepository.upsertProfile(userId, {});
        }
        return profile;
    },

    upsertMyProfile: async (userId: number, data: any) => {
        return mentorRepository.upsertProfile(userId, {
            graduationYear: data.graduationYear,
            currentCompany: data.currentCompany,
            currentRole: data.currentRole,
            bioExtended: data.bioExtended
        });
    },

    addAvailability: async (userId: number, slotsData: any) => {
        const profile = await mentorRepository.findProfileByUserId(userId);
        if (!profile) {
            throw Errors.NotFound("Mentor profile not found. Please create a profile first.");
        }

        // Handle both single object and array
        const slots = Array.isArray(slotsData) ? slotsData : [slotsData];

        // Basic validation
        for (const slot of slots) {
            if (slot.dayOfWeek < 0 || slot.dayOfWeek > 6) {
                throw Errors.BadRequest("dayOfWeek must be between 0 and 6");
            }
            if (!slot.startTime || !slot.endTime) {
                throw Errors.BadRequest("startTime and endTime are required");
            }
        }

        return mentorRepository.addAvailability(profile.id, slots);
    },

    updateAvailability: async (userId: number, slotId: number, data: any) => {
        const slot = await mentorRepository.findAvailabilityById(slotId);
        if (!slot) throw Errors.NotFound("Slot not found");

        const profile = await mentorRepository.findProfileByUserId(userId);
        if (!profile || profile.id !== slot.mentorProfileId) {
            throw Errors.Forbidden("You do not own this availability slot");
        }

        return mentorRepository.updateAvailability(slotId, data);
    },

    deleteAvailability: async (userId: number, slotId: number) => {
        const slot = await mentorRepository.findAvailabilityById(slotId);
        if (!slot) throw Errors.NotFound("Slot not found");

        const profile = await mentorRepository.findProfileByUserId(userId);
        if (!profile || profile.id !== slot.mentorProfileId) {
            throw Errors.Forbidden("You do not own this availability slot");
        }

        return mentorRepository.deleteAvailability(slotId);
    }
};
