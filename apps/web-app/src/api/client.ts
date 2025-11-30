import {
    MOCK_USERS,
    MOCK_MENTOR_PROFILES,
    MOCK_APPOINTMENTS,
    MOCK_TOPICS,
    MOCK_QUESTIONS,
    MOCK_ANSWERS,
    MOCK_CONVERSATIONS,
    MOCK_MESSAGES,
} from './mockData';
import type {
    User,
    MentorProfile,
    Appointment,
    Topic,
    Question,
    Answer,
    Conversation,
    Message,
} from '../types';

const SIMULATED_DELAY_MS = 500;

const delay = <T>(data: T): Promise<T> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(data);
        }, SIMULATED_DELAY_MS);
    });
};

export const apiClient = {
    // Users
    getUsers: (): Promise<User[]> => delay(MOCK_USERS),
    getUserById: (id: number): Promise<User | undefined> =>
        delay(MOCK_USERS.find((u) => u.id === id)),

    // Mentors
    getMentorProfiles: (): Promise<MentorProfile[]> => delay(MOCK_MENTOR_PROFILES),
    getMentorProfileByUserId: (userId: number): Promise<MentorProfile | undefined> =>
        delay(MOCK_MENTOR_PROFILES.find((p) => p.userId === userId)),
    getMentorProfileById: (id: number): Promise<MentorProfile | undefined> =>
        delay(MOCK_MENTOR_PROFILES.find((p) => p.id === id)),

    // Appointments
    getAppointments: (): Promise<Appointment[]> => delay(MOCK_APPOINTMENTS),
    getAppointmentsForUser: (userId: number): Promise<Appointment[]> =>
        delay(
            MOCK_APPOINTMENTS.filter(
                (a) => a.studentId === userId || a.mentorId === userId
            )
        ),

    // Forum
    getTopics: (): Promise<Topic[]> => delay(MOCK_TOPICS),
    getQuestions: (topicId?: number): Promise<Question[]> => {
        let questions = MOCK_QUESTIONS;
        if (topicId) {
            questions = questions.filter((q) => q.topicId === topicId);
        }
        return delay(questions);
    },
    getQuestionById: (id: number): Promise<Question | undefined> =>
        delay(MOCK_QUESTIONS.find((q) => q.id === id)),
    getAnswers: (questionId: number): Promise<Answer[]> =>
        delay(MOCK_ANSWERS.filter((a) => a.questionId === questionId)),

    // Messaging
    getConversations: (userId: number): Promise<Conversation[]> =>
        delay(
            MOCK_CONVERSATIONS.filter((c) =>
                c.participants?.some((p) => p.id === userId)
            )
        ),
    getMessages: (conversationId: number): Promise<Message[]> =>
        delay(MOCK_MESSAGES.filter((m) => m.conversationId === conversationId)),
};
