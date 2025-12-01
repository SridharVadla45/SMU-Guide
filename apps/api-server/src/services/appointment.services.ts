// src/services/appointment.services.ts
import {
  AppointmentStatus,
  MentorAvailability,
  Role,
} from "@prisma/client";
import { Errors } from "../errors/ApiError.js";
import { appointmentRepository } from "../repositories/appointment.repository.js";
import {
  AuthUserContext,
  CreateAppointmentInput,
  GetMyAppointmentsFilter,
} from "../types/appointment.types.js";

const parseAndValidateDates = (input: CreateAppointmentInput) => {
  const startsAt = new Date(input.startsAt);
  const endsAt = new Date(input.endsAt);

  if (isNaN(startsAt.getTime()) || isNaN(endsAt.getTime())) {
    throw Errors.Validation("Invalid date format for startsAt or endsAt");
  }

  if (endsAt <= startsAt) {
    throw Errors.Validation("endsAt must be after startsAt");
  }

  return { startsAt, endsAt };
};

const isWithinAvailability = (
  slots: MentorAvailability[],
  startsAt: Date,
  endsAt: Date
) => {
  if (slots.length === 0) return false;

  const day = startsAt.getDay(); // 0–6
  const startTimeStr = startsAt.toTimeString().slice(0, 5); // HH:MM
  const endTimeStr = endsAt.toTimeString().slice(0, 5);     // HH:MM

  return slots.some((slot) => {
    if (slot.dayOfWeek !== day) return false;
    // simple string comparison works for HH:MM
    return (
      startTimeStr >= slot.startTime &&
      endTimeStr <= slot.endTime
    );
  });
};

export const appointmentService = {
  createAppointment: async (
    authUser: AuthUserContext,
    input: CreateAppointmentInput
  ) => {
    if (authUser.role !== Role.STUDENT) {
      throw Errors.Forbidden("Only students can create appointments", "FORBIDDEN");
    }

    const { startsAt, endsAt } = parseAndValidateDates(input);

    // Check mentor exists + availability
    const mentor = await appointmentRepository.findMentorById(input.mentorId);
    if (!mentor) {
      throw Errors.NotFound("Mentor not found", "MENTOR_NOT_FOUND");
    }

    const availabilitySlots =
      mentor.mentorProfile?.availabilities || [];

    if (!isWithinAvailability(availabilitySlots, startsAt, endsAt)) {
      throw Errors.Validation(
        "Requested time is not within mentor's availability"
      );
    }

    // Check overlapping appointments for mentor
    const mentorConflicts =
      await appointmentRepository.findOverlappingAppointmentsForMentor(
        mentor.id,
        startsAt,
        endsAt
      );
    if (mentorConflicts.length > 0) {
      throw Errors.Conflict(
        "Mentor already has an appointment at this time",
        "MENTOR_BUSY"
      );
    }

    // Check overlapping appointments for student
    const studentConflicts =
      await appointmentRepository.findOverlappingAppointmentsForStudent(
        authUser.id,
        startsAt,
        endsAt
      );
    if (studentConflicts.length > 0) {
      throw Errors.Conflict(
        "You already have an appointment at this time",
        "STUDENT_BUSY"
      );
    }

    // Create appointment
    const appointment = await appointmentRepository.createAppointment({
      studentId: authUser.id,
      mentorId: mentor.id,
      startsAt,
      endsAt,
    });

    return appointment;
  },

  getMyAppointments: async (
    authUser: AuthUserContext,
    filter: GetMyAppointmentsFilter
  ) => {
    if (authUser.role === Role.STUDENT) {
      return appointmentRepository.getAppointmentsForStudent(
        authUser.id,
        filter.status
      );
    }

    if (authUser.role === Role.MENTOR) {
      return appointmentRepository.getAppointmentsForMentor(
        authUser.id,
        filter.status
      );
    }

    // ADMIN or others – get all
    return appointmentRepository.getAllAppointments(filter.status);
  },

  getAppointmentById: async (authUser: AuthUserContext, id: number) => {
    const appointment = await appointmentRepository.findAppointmentById(id);
    if (!appointment) {
      throw Errors.NotFound("Appointment not found", "APPOINTMENT_NOT_FOUND");
    }

    const isParticipant =
      appointment.studentId === authUser.id ||
      appointment.mentorId === authUser.id;

    if (!isParticipant && authUser.role !== Role.ADMIN) {
      throw Errors.Forbidden("You are not allowed to view this appointment", "FORBIDDEN");
    }

    return appointment;
  },

  cancelAppointment: async (authUser: AuthUserContext, id: number) => {
    const appointment = await appointmentRepository.findAppointmentById(id);
    if (!appointment) {
      throw Errors.NotFound("Appointment not found", "APPOINTMENT_NOT_FOUND");
    }

    const isParticipant =
      appointment.studentId === authUser.id ||
      appointment.mentorId === authUser.id;

    if (!isParticipant && authUser.role !== Role.ADMIN) {
      throw Errors.Forbidden("You cannot cancel this appointment", "FORBIDDEN");
    }

    if (
      appointment.status === AppointmentStatus.CANCELLED ||
      appointment.status === AppointmentStatus.COMPLETED
    ) {
      throw Errors.Conflict(
        "Appointment is already finalised",
        "APPOINTMENT_FINAL"
      );
    }

    return appointmentRepository.updateAppointmentStatus(
      id,
      AppointmentStatus.CANCELLED
    );
  },

  completeAppointment: async (authUser: AuthUserContext, id: number) => {
    const appointment = await appointmentRepository.findAppointmentById(id);
    if (!appointment) {
      throw Errors.NotFound("Appointment not found", "APPOINTMENT_NOT_FOUND");
    }

    // Only mentor or admin
    if (
      appointment.mentorId !== authUser.id &&
      authUser.role !== Role.ADMIN
    ) {
      throw Errors.Forbidden(
        "Only mentor or admin can mark as completed",
        "FORBIDDEN"
      );
    }

    if (appointment.status === AppointmentStatus.CANCELLED) {
      throw Errors.Conflict(
        "Cancelled appointment cannot be completed",
        "INVALID_STATE"
      );
    }

    if (appointment.status === AppointmentStatus.COMPLETED) {
      return appointment; // idempotent
    }

    return appointmentRepository.updateAppointmentStatus(
      id,
      AppointmentStatus.COMPLETED
    );
  },
};
