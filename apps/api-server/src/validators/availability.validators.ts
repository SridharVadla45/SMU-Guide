// src/modules/availability/availability.validators.ts
import { Errors } from "../errors/ApiError.js";
import {
  AvailabilitySlotInput,
  AvailabilitySlotUpdateInput,
} from "../types/availability.types.js";

export const validateCreateSlots = (body: any): AvailabilitySlotInput[] => {
  if (!Array.isArray(body)) {
    throw Errors.Validation("Availability must be an array of slots");
  }

  const slots: AvailabilitySlotInput[] = body.map((slot, index) => {
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
        `Invalid dayOfWeek at index ${index}. Must be integer 0–6`
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

export const validateUpdateSlot = (body: any): AvailabilitySlotUpdateInput => {
  const out: AvailabilitySlotUpdateInput = {};

  if (body.dayOfWeek !== undefined) {
    const n = Number(body.dayOfWeek);
    if (!Number.isInteger(n) || n < 0 || n > 6) {
      throw Errors.Validation("dayOfWeek must be integer 0–6");
    }
    out.dayOfWeek = n;
  }

  if (body.startTime !== undefined) {
    if (typeof body.startTime !== "string") {
      throw Errors.Validation("startTime must be a string");
    }
    out.startTime = body.startTime.trim();
  }

  if (body.endTime !== undefined) {
    if (typeof body.endTime !== "string") {
      throw Errors.Validation("endTime must be a string");
    }
    out.endTime = body.endTime.trim();
  }

  if (
    out.dayOfWeek === undefined &&
    out.startTime === undefined &&
    out.endTime === undefined
  ) {
    throw Errors.Validation("Nothing to update");
  }

  return out;
};
