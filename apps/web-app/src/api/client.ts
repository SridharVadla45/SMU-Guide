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
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
    };
};

const handleResponse = async (response: Response) => {
    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Something went wrong' }));
        throw new Error(error.message || response.statusText);
    }
    const json = await response.json();
    // Backend returns {data: ...} or {success: true, data: ...}
    // Extract the data property if it exists
    return json.data !== undefined ? json.data : json;
};

export const apiClient = {
    // Auth
    login: async (credentials: { email: string; password: string }) => {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials),
        });
        const result = await handleResponse(response);
        // Login returns {token, user}, store token
        if (result.token) {
            localStorage.setItem('token', result.token);
        }
        return result;
    },

    register: async (data: any) => {
        const isFormData = data instanceof FormData;
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: isFormData ? {} : { 'Content-Type': 'application/json' },
            body: isFormData ? data : JSON.stringify(data),
        });
        const result = await handleResponse(response);
        // Register returns {token, user}, store token
        if (result.token) {
            localStorage.setItem('token', result.token);
        }
        return result;
    },

    updateProfile: async (data: any): Promise<User> => {
        const isFormData = data instanceof FormData;
        const response = await fetch(`${API_BASE_URL}/users/profile`, {
            method: 'PUT',
            headers: {
                ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
                'Authorization': `Bearer ${getAuthToken()}`,
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0',
            },
            body: isFormData ? data : JSON.stringify(data),
        });
        return handleResponse(response);
    },

    getMe: async (): Promise<User> => {
        const response = await fetch(`${API_BASE_URL}/auth/me`, {
            headers: headers(),
        });
        return handleResponse(response);
    },

    // Mentors
    getMentorProfiles: async (): Promise<User[]> => {
        const response = await fetch(`${API_BASE_URL}/mentors?limit=100`, {
            headers: headers(),
        });
        const result = await handleResponse(response);
        // Backend returns paginated: {data: [], total, page, limit}
        return Array.isArray(result) ? result : result;
    },

    getMentorProfileById: async (id: number): Promise<MentorProfile | undefined> => {
        const response = await fetch(`${API_BASE_URL}/mentors/${id}`, {
            headers: headers(),
        });
        return handleResponse(response);
    },

    // Appointments
    getAppointments: async (): Promise<Appointment[]> => {
        const response = await fetch(`${API_BASE_URL}/appointments`, {
            headers: headers(),
        });
        const result = await handleResponse(response);
        // Backend returns paginated: {data: [], meta: {}}
        return Array.isArray(result) ? result : result;
    },

    createAppointment: async (data: {
        mentorId: number;
        startsAt: string;
        endsAt: string;
        notes?: string;
    }): Promise<Appointment> => {
        const response = await fetch(`${API_BASE_URL}/appointments`, {
            method: 'POST',
            headers: headers(),
            body: JSON.stringify(data),
        });
        return handleResponse(response);
    },

    cancelAppointment: async (id: number): Promise<Appointment> => {
        const response = await fetch(`${API_BASE_URL}/appointments/${id}/cancel`, {
            method: 'PATCH',
            headers: headers(),
        });
        return handleResponse(response);
    },

    // Forum
    getTopics: async (): Promise<Topic[]> => {
        const response = await fetch(`${API_BASE_URL}/forum/topics`, {
            headers: headers(),
        });
        const result = await handleResponse(response);
        return Array.isArray(result) ? result : result;
    },

    getQuestions: async (topicId?: number): Promise<Question[]> => {
        const url = new URL(`${API_BASE_URL}/forum/questions`);
        if (topicId) url.searchParams.append('topicId', topicId.toString());

        const response = await fetch(url.toString(), {
            headers: headers(),
        });
        const result = await handleResponse(response);
        // Backend returns paginated: {data: [], meta: {}}
        return Array.isArray(result) ? result : result;
    },

    getQuestionById: async (id: number): Promise<Question | undefined> => {
        const response = await fetch(`${API_BASE_URL}/forum/questions/${id}`, {
            headers: headers(),
        });
        return handleResponse(response);
    },

    createQuestion: async (data: {
        topicId: number;
        title: string;
        body: string;
    }): Promise<Question> => {
        const response = await fetch(`${API_BASE_URL}/forum/questions`, {
            method: 'POST',
            headers: headers(),
            body: JSON.stringify(data),
        });
        return handleResponse(response);
    },

    createAnswer: async (questionId: number, body: string): Promise<Answer> => {
        const response = await fetch(`${API_BASE_URL}/forum/questions/${questionId}/answers`, {
            method: 'POST',
            headers: headers(),
            body: JSON.stringify({ body }),
        });
        return handleResponse(response);
    },

    // Messaging
    createConversation: async (otherUserId: number): Promise<Conversation> => {
        const response = await fetch(`${API_BASE_URL}/messages/conversations`, {
            method: 'POST',
            headers: headers(),
            body: JSON.stringify({ otherUserId }),
        });
        return handleResponse(response);
    },
};
