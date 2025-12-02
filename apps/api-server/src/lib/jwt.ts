import jwt, { Secret } from "jsonwebtoken";
import { env } from "../config/env.js";

export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
  avatarUrl?: string | null;
}

export const signToken = (payload: JwtPayload): string => {
  return jwt.sign(
    payload as object,
    env.jwtSecret as jwt.Secret,
    {
      expiresIn: 60 * 60 * 24 * 7, // 7 days
    }
  );
};

export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, env.jwtSecret) as JwtPayload;
};
