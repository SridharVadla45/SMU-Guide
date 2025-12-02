export enum Role {
  STUDENT = 'STUDENT',
  MENTOR = 'MENTOR',
  PROFESSOR = 'PROFESSOR',
  ADMIN = 'ADMIN',
}

export enum AppointmentStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  department?: string;
  bio?: string;
  avatarUrl?: string;
  createdAt: string; // ISO Date string
}

export interface MentorProfile {
  id: number;
  userId: number;
  graduationYear?: number;
  currentCompany?: string;
  currentRole?: string;
  bioExtended?: string;
  user?: User;
}

export interface MentorAvailability {
  id: number;
  mentorProfileId: number;
  dayOfWeek: number; // 0-6
  startTime: string; // "09:00"
  endTime: string; // "11:00"
}

export interface Appointment {
  id: number;
  studentId: number;
  mentorId: number;
  startsAt: string; // ISO Date string
  endsAt: string; // ISO Date string
  status: AppointmentStatus;
  zoomMeetingId?: string;
  zoomJoinUrl?: string;
  zoomStartUrl?: string;
  title?: string;
  student?: User;
  mentor?: User;
}

export interface Topic {
  id: number;
  title: string;
  description?: string;
  createdAt: string;
  _count?: {
    questions: number;
  };
}

export interface Question {
  id: number;
  title: string;
  body: string;
  topicId: number;
  askedById: number;
  createdAt: string;
  topic?: Topic;
  askedBy?: User;
  answers?: Answer[];
  _count?: {
    answers: number;
  };
}

export interface Answer {
  id: number;
  questionId: number;
  answeredById: number;
  body: string;
  createdAt: string;
  isAccepted: boolean;
  answeredBy?: User;
}

export interface Conversation {
  id: number;
  createdAt: string;
  participants?: User[];
  lastMessage?: Message;
}

export interface Message {
  id: number;
  conversationId: number;
  senderId: number;
  content: string;
  createdAt: string;
  readAt?: string;
  sender?: User;
}
