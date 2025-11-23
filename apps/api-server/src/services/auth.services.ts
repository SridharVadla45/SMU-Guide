import { authRepository } from "../repositories/auth.repository.js";
import { AuthResponse, AuthUser, LoginInput, RegisterInput } from "../types/auth.types.js";
import { comparePassword, hashPassword } from "../lib/password.js";
import { Errors } from "../errors/ApiError.js";
import { signToken } from "../lib/jwt.js";

const toAuthUser = (user: any): AuthUser => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
});

export const authService = {
  register: async (input: RegisterInput): Promise<AuthResponse> => {
    const existing = await authRepository.findUserByEmail(input.email);
    if (existing) {
      throw Errors.Conflict("Email already in use", "EMAIL_ALREADY_EXISTS");
    }

    const passwordHash = await hashPassword(input.password);

    const user = await authRepository.createUser({
      name: input.name,
      email: input.email,
      password:passwordHash,
      role: input.role || "STUDENT",
    });

    const authUser = toAuthUser(user);

    const token = signToken({
      userId: authUser.id,
      email: authUser.email,
      role: authUser.role,
    });

    return { token, user: authUser };
  },

  login: async (input: LoginInput): Promise<AuthResponse> => {
    const user = await authRepository.findUserByEmail(input.email);
    // console.log(user);
    if (!user) {
      throw Errors.Unauthorized("Invalid email or password", "INVALID_CREDENTIALS");
    }

    const isValid = await comparePassword(input.password, user.password);
    if (!isValid) {
      throw Errors.Unauthorized("Invalid email or password", "INVALID_CREDENTIALS");
    }

    const authUser = toAuthUser(user);

    const token = signToken({
      userId: authUser.id,
      email: authUser.email,
      role: authUser.role,
    });

    return { token, user: authUser };
  },

  getMe: async (userId: number): Promise<AuthUser> => {
    const user = await authRepository.findUserById(userId);
    if (!user) {
      throw Errors.NotFound("User not found", "USER_NOT_FOUND");
    }
    return toAuthUser(user);
  },
};
