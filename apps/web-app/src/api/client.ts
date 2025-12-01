import { API_BASE_URL } from '../config';
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

const getAuthToken = () => localStorage.getItem('token');

const headers = () => {
    const token = getAuthToken();
    return {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
};

const handleResponse = async (response: Response) => {
    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'An error occurred' }));
        throw new Error(error.message || response.statusText);
    }
    return response.json();
};

export const apiClient = {
    // Auth
    login: async (credentials: any) => {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials),
        });
        return handleResponse(response);
    },
    register: async (data: any) => {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        return handleResponse(response);
    },
    getMe: async (): Promise<User> => {
        const response = await fetch(`${API_BASE_URL}/auth/me`, {
            headers: headers(),
        });
        return handleResponse(response);
    },

    // Users (Limited support in API, mostly for Mentors)
    getUsers: async (): Promise<User[]> => {
        // Fallback or implementation depends on API. 
        // For now returning empty or could fetch mentors as users.
        return [];
    },
    getUserById: async (id: number): Promise<User | undefined> => {
        // If it's the current user, use getMe. Otherwise, this might fail if not a mentor.
        // For now, we'll try to fetch me if id matches (hacky) or just return undefined.
        // Better: The Profile page should use getMe().
        return undefined;
    },

    // Mentors
    getMentorProfiles: async (): Promise<MentorProfile[]> => {
        const response = await fetch(`${API_BASE_URL}/mentors`, {
            headers: headers(),
        });
        return handleResponse(response);
    },
    getMentorProfileByUserId: async (userId: number): Promise<MentorProfile | undefined> => {
        // The API gets mentor by ID (which is likely the user ID in this context or mentor ID).
        // Postman says /api/mentors/:mentorId. Let's assume mentorId matches userId for simplicity or the API handles it.
        // Actually, usually mentorId is the ID of the MentorProfile, or the User ID. 
        // Looking at Postman: "Replace 1 with a real mentor user ID". So it uses User ID.
        const response = await fetch(`${API_BASE_URL}/mentors/${userId}`, {
            headers: headers(),
        });
        return handleResponse(response);
    },
    getMentorProfileById: async (id: number): Promise<MentorProfile | undefined> => {
        const response = await fetch(`${API_BASE_URL}/mentors/${id}`, {
            headers: headers(),
        });
        return handleResponse(response);
    },

    // Appointments
    getAppointments: async (): Promise<Appointment[]> => {
        const response = await fetch(`${API_BASE_URL}/appointments/my`, {
            headers: headers(),
        });
        return handleResponse(response);
    },
    getAppointmentsForUser: async (userId: number): Promise<Appointment[]> => {
        // The API /appointments/my returns appointments for the *authenticated* user.
        // We ignore userId here and assume the token belongs to the user.
        const response = await fetch(`${API_BASE_URL}/appointments/my`, {
            headers: headers(),
        });
        return handleResponse(response);
    },

    // Forum
    getTopics: async (): Promise<Topic[]> => {
        const response = await fetch(`${API_BASE_URL}/forum/topics`, {
            headers: headers(),
        });
        return handleResponse(response);
    },
    getQuestions: async (topicId?: number): Promise<Question[]> => {
        const url = new URL(`${API_BASE_URL}/forum/questions`);
        if (topicId) url.searchParams.append('topicId', topicId.toString());

        const response = await fetch(url.toString(), {
            headers: headers(),
        });
        return handleResponse(response);
    },
    getQuestionById: async (id: number): Promise<Question | undefined> => {
        const response = await fetch(`${API_BASE_URL}/forum/questions/${id}`, {
            headers: headers(),
        });
        return handleResponse(response);
    },
    getAnswers: async (questionId: number): Promise<Answer[]> => {
        // The API returns answers included in the question details usually, 
        // or we might need to fetch them. Postman says "including ... all answers" for GET question.
        // But let's check if there is a specific endpoint. 
        // Postman has POST /answers, but GET seems to be part of question.
        // We can fetch the question and return its answers.
        const question = await apiClient.getQuestionById(questionId);
        return question?.answers || [];
    },

    // Messaging
    getConversations: async (userId: number): Promise<Conversation[]> => {
        // Ignores userId, uses token
        const response = await fetch(`${API_BASE_URL}/messages/conversations`, {
            headers: headers(),
        });
        return handleResponse(response);
    },
    getMessages: async (conversationId: number): Promise<Message[]> => {
        const response = await fetch(`${API_BASE_URL}/messages/conversations/${conversationId}/messages`, {
            headers: headers(),
        });
        return handleResponse(response);
    },
};
