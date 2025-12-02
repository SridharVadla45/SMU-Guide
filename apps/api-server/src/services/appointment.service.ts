import { appointmentRepository } from "../repositories/appointment.repository.js";
import { Errors } from "../errors/ApiError.js";
import { AppointmentStatus, Prisma } from "@prisma/client";

export const appointmentService = {
    createAppointment: async (studentId: number, data: {
        mentorId: number;
        startsAt: string;
        endsAt: string;
    }) => {
        // Validate times
        const startsAt = new Date(data.startsAt);
        const endsAt = new Date(data.endsAt);

        if (startsAt >= endsAt) {
            throw Errors.BadRequest("Start time must be before end time");
        }

        if (startsAt < new Date()) {
            throw Errors.BadRequest("Cannot book appointments in the past");
        }

        return appointmentRepository.create({
            student: { connect: { id: studentId } },
            mentor: { connect: { id: data.mentorId } },
            startsAt,
            endsAt,
            status: AppointmentStatus.PENDING,
        });
    },

    listAppointments: async (params: {
        userId: number;
        userRole: string;
        page: number;
        limit: number;
        status?: AppointmentStatus;
    }) => {
        const { userId, userRole, page, limit, status } = params;
        const skip = (page - 1) * limit;

        const where: Prisma.AppointmentWhereInput = {};

        // Filter by role
        if (userRole === "STUDENT") {
            where.studentId = userId;
        } else if (userRole === "MENTOR") {
            where.mentorId = userId;
        }

        // Filter by status
        if (status) {
            where.status = status;
        }

        const [appointments, total] = await Promise.all([
            appointmentRepository.findAll({ where, skip, take: limit }),
            appointmentRepository.count(where),
        ]);

        return {
            data: appointments,
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    },

    getAppointmentById: async (id: number, userId: number) => {
        const appointment = await appointmentRepository.findById(id);

        if (!appointment) {
            throw Errors.NotFound("Appointment not found");
        }

        // Check if user is part of this appointment
        if (appointment.studentId !== userId && appointment.mentorId !== userId) {
            throw Errors.Forbidden("You do not have access to this appointment");
        }

        return appointment;
    },

    cancelAppointment: async (id: number, userId: number) => {
        const appointment = await appointmentRepository.findById(id);

        if (!appointment) {
            throw Errors.NotFound("Appointment not found");
        }

        // Only student or mentor can cancel
        if (appointment.studentId !== userId && appointment.mentorId !== userId) {
            throw Errors.Forbidden("You do not have access to this appointment");
        }

        // Cannot cancel completed appointments
        if (appointment.status === AppointmentStatus.COMPLETED) {
            throw Errors.BadRequest("Cannot cancel completed appointments");
        }

        return appointmentRepository.updateStatus(id, AppointmentStatus.CANCELLED);
    },

    completeAppointment: async (id: number, mentorId: number) => {
        const appointment = await appointmentRepository.findById(id);

        if (!appointment) {
            throw Errors.NotFound("Appointment not found");
        }

        // Only mentor can complete
        if (appointment.mentorId !== mentorId) {
            throw Errors.Forbidden("Only the mentor can complete this appointment");
        }

        // Must be confirmed or pending
        if (appointment.status === AppointmentStatus.CANCELLED || appointment.status === AppointmentStatus.COMPLETED) {
            throw Errors.BadRequest(`Cannot complete ${appointment.status.toLowerCase()} appointments`);
        }

        return appointmentRepository.updateStatus(id, AppointmentStatus.COMPLETED);
    },

    confirmAppointment: async (id: number, mentorId: number) => {
        const appointment = await appointmentRepository.findById(id);

        if (!appointment) {
            throw Errors.NotFound("Appointment not found");
        }

        // Only mentor can confirm
        if (appointment.mentorId !== mentorId) {
            throw Errors.Forbidden("Only the mentor can confirm this appointment");
        }

        if (appointment.status !== AppointmentStatus.PENDING) {
            throw Errors.BadRequest("Only pending appointments can be confirmed");
        }

        return appointmentRepository.updateStatus(id, AppointmentStatus.CONFIRMED);
    }
};
