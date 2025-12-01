import { Errors } from "../errors/ApiError.js";
import { LoginInput, RegisterInput } from "../types/auth.types.js";

export const validateRegisterInput = (body: any): RegisterInput => {
  const { name, email, password, role } = body;

  if (!name || typeof name !== "string") {
    throw Errors.Validation("Name is required");
  }

  if (!email || typeof email !== "string") {
    throw Errors.Validation("Email is required");
  }

  if (!password || typeof password !== "string" || password.length < 6) {
    throw Errors.Validation("Password must be at least 6 characters");
  }

  const allowedRoles = ["STUDENT", "MENTOR", "ADMIN","PROFESSOR"];
  if (role && !allowedRoles.includes(role)) {
    throw Errors.Validation("Invalid role");
  }

  return {
    name,
    email: email.toLowerCase().trim(),
    password,
    role: role || "STUDENT",
  };
};

export const validateLoginInput = (body: any): LoginInput => {
  const { email, password } = body;

  if (!email || typeof email !== "string") {
    throw Errors.Validation("Email is required");
  }

  if (!password || typeof password !== "string") {
    throw Errors.Validation("Password is required");
  }

  return {
    email: email.toLowerCase().trim(),
    password,
  };
};
