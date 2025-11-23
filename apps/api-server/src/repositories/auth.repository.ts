// src/modules/auth/auth.repository.ts
import { prisma } from "../lib/prisma.js";
import { RegisterInput } from "../types/auth.types.js";
import {UserRole} from "../types/auth.types.js"

export const authRepository = {
  findUserByEmail: async (email: string) => {
    return prisma.user.findUnique({
      where: { email },
    });
  },

  createUser: async (data: {
    name: string;
    email: string;
    password: string;
    role: UserRole;
  }) => {
    return prisma.user.create({
      data,
    });
  },

  findUserById: async (id: number) => {
    return prisma.user.findUnique({
      where: { id },
    });
  },
};
