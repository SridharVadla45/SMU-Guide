// src/config/env.ts
import dotenv from "dotenv";

dotenv.config();

if (!process.env.JWT_SECRET) {
  // In real app, you'd throw or exit; for now we just log.
  console.error("JWT_SECRET is not set in environment variables");
}

export const env = {
  port: Number(process.env.PORT) || 4000,
  jwtSecret: process.env.JWT_SECRET || "dev-secret-key-change-me",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
};
