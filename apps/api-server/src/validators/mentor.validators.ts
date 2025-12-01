// src/modules/mentors/mentor.validators.ts
import { Errors } from "../../errors/ApiError";
import {
  MentorAvailabilitySlotInput,
  MentorFilter,
  UpsertMentorProfileInput,
} from "./mentor.types";

export const validateMentorFilter = (query: any): MentorFilter => {
  const department =
    typeof query.department === "string" ? query.department.trim() : undefined;
  const search =
    typeof query.search === "string" ? query.search.trim() : undefined;

  const page =
    query.page && !isNaN(Number(query.page)) ? Number(query.page) : 1;
  const limit =
    query.limit && !isNaN(Number(query.limit)) ? Number(query.limit) : 10;

  return {
    department,
    search,
    page,
    limit,
  };
};

export const validateUpsertMentorProfile = (
  body: any
): UpsertMentorProfileInput => {
  const out: UpsertMentorProfileInput = {};

  if (body.graduationYear !== undefined) {
    const n = Number(body.graduationYear);
    if (isNaN(n)) {
      throw Errors.Validation("graduationYear must be a number");
    }
    out.graduationYear = n;
  }

  if (body.currentCompany !== undefined) {
    if (typeof body.currentCompany !== "string") {
      throw Errors.Validation("currentCompany must be a string");
    }
    out.currentCompany = body.currentCompany.trim();
  }

  if (body.currentRole !== undefined) {
    if (typeof body.currentRole !== "string") {
      throw Errors.Validation("currentRole must be a string");
    }
    out.currentRole = body.currentRole.trim();
  }

  if (body.bioExtended !== undefined) {
    if (typeof body.bioExtended !== "string") {
      throw Errors.Validation("bioExtended must be a string");
    }
    out.bioExtended = body.bioExtended.trim();
  }

  return out;
};

export const validateAvailabilitySlots = (
  body: any
): MentorAvailabilitySlotInput[] => {
  if (!Array.isArray(body)) {
    throw Errors.Validation("Availability must be an array of slots");
  }

  const slots: MentorAvailabilitySlotInput[] = body.map((slot, index) => {
    if (typeof slot !== "object" || slot === null) {
      throw Errors.Validation(`Slot at index ${index} must be an object`);
    }

    const { dayOfWeek, startTime, endTime } = slot;

    if (
      typeof dayOfWeek !== "number" ||
      !Number.isInteger(dayOfWeek) ||
      dayOfWeek < 0 ||
      dayOfWeek > 6
    ) {
      throw Errors.Validation(
        `Invalid dayOfWeek at index ${index}. Must be integer 0-6`
      );
    }

    if (!startTime || typeof startTime !== "string") {
      throw Errors.Validation(`startTime is required at index ${index}`);
    }

    if (!endTime || typeof endTime !== "string") {
      throw Errors.Validation(`endTime is required at index ${index}`);
    }

    return {
      dayOfWeek,
      startTime: startTime.trim(),
      endTime: endTime.trim(),
    };
  });

  return slots;
};
