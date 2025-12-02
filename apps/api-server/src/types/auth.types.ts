export type UserRole = "STUDENT" | "MENTOR" | "ADMIN" | "PROFESSOR";

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  role?: UserRole; // default STUDENT
  avatarUrl?: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string | null;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}
