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

// Mock Users
export const MOCK_USERS: User[] = [
    {
        id: 1,
        name: 'Alice Student',
        email: 'alice@smu.edu',
        role: 'STUDENT',
        department: 'Computer Science',
        bio: 'Aspiring software engineer interested in AI.',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice',
        createdAt: '2023-01-15T10:00:00Z',
    },
    {
        id: 2,
        name: 'Dr. Neil Williams',
        email: 'neil@smu.edu',
        role: 'PROFESSOR',
        department: 'Computer Science',
        bio: 'Specialist in SDLC, distributed systems, and quality engineering.',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Neil',
        createdAt: '2023-01-10T10:00:00Z',
    },
    {
        id: 3,
        name: 'Jeevan',
        email: 'jeevan@alumni.smu.edu',
        role: 'MENTOR',
        department: 'Computer Science',
        bio: 'Full-stack development & cloud infrastructure.',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jeevan',
        createdAt: '2023-01-05T10:00:00Z',
    },
    {
        id: 4,
        name: 'Prof. Dann Penny',
        email: 'dann@smu.edu',
        role: 'PROFESSOR',
        department: 'Computer Science',
        bio: 'Expert in SDLC, requirements engineering, and software modeling.',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Dann',
        createdAt: '2023-01-05T10:00:00Z',
    },
    {
        id: 5,
        name: 'Rimaya Siddik',
        email: 'rimaya@alumni.smu.edu',
        role: 'MENTOR',
        department: 'Software Engineering',
        bio: 'API systems & backend engineering.',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rimaya',
        createdAt: '2023-01-05T10:00:00Z',
    },
    {
        id: 6,
        name: 'Nikola',
        email: 'nikola@alumni.smu.edu',
        role: 'MENTOR',
        department: 'Computer Science',
        bio: 'React, Next.js & UI performance.',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Nikola',
        createdAt: '2023-01-05T10:00:00Z',
    },
    {
        id: 7,
        name: 'Soundarya Venkataraman',
        email: 'soundarya@alumni.smu.edu',
        role: 'MENTOR',
        department: 'Computer Science',
        bio: 'Big data engineering & ETL pipelines.',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Soundarya',
        createdAt: '2023-01-05T10:00:00Z',
    },
    {
        id: 8,
        name: 'Mohd Thoufiq',
        email: 'thoufiq@alumni.smu.edu',
        role: 'MENTOR',
        department: 'Computing & Data Analytics',
        bio: 'RAG systems, automation pipelines & software architecture.',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Thoufiq',
        createdAt: '2023-01-05T10:00:00Z',
    },
    {
        id: 9,
        name: 'Pranay',
        email: 'pranay@alumni.smu.edu',
        role: 'MENTOR',
        department: 'Computer Science',
        bio: 'Microservices, CI/CD & cloud-native systems.',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Pranay',
        createdAt: '2023-01-05T10:00:00Z',
    },
];

// Mock Mentor Profiles
export const MOCK_MENTOR_PROFILES: MentorProfile[] = [
    {
        id: 1,
        userId: 2,
        currentRole: 'Professor',
        currentCompany: 'SMU',
        bioExtended: 'Specialist in SDLC, distributed systems, and quality engineering.',
        user: MOCK_USERS[1],
    },
    {
        id: 2,
        userId: 3,
        graduationYear: 2020,
        currentRole: 'Software Engineer',
        currentCompany: 'Microsoft',
        bioExtended: 'Full-stack development & cloud infrastructure.',
        user: MOCK_USERS[2],
    },
    {
        id: 3,
        userId: 4,
        currentRole: 'Professor',
        currentCompany: 'SMU',
        bioExtended: 'Expert in SDLC, requirements engineering, and software modeling.',
        user: MOCK_USERS[3],
    },
    {
        id: 4,
        userId: 5,
        graduationYear: 2021,
        currentRole: 'Backend Developer',
        currentCompany: 'Amazon',
        bioExtended: 'API systems & backend engineering.',
        user: MOCK_USERS[4],
    },
    {
        id: 5,
        userId: 6,
        graduationYear: 2022,
        currentRole: 'Frontend Engineer',
        currentCompany: 'Shopify',
        bioExtended: 'React, Next.js & UI performance.',
        user: MOCK_USERS[5],
    },
    {
        id: 6,
        userId: 7,
        graduationYear: 2019,
        currentRole: 'Data Engineer',
        currentCompany: 'IBM',
        bioExtended: 'Big data engineering & ETL pipelines.',
        user: MOCK_USERS[6],
    },
    {
        id: 7,
        userId: 8,
        graduationYear: 2023,
        currentRole: 'Data Engineer / AI Automation',
        currentCompany: 'Citco (Intelligent Automation)',
        bioExtended: 'RAG systems, automation pipelines & software architecture.',
        user: MOCK_USERS[7],
    },
    {
        id: 8,
        userId: 9,
        graduationYear: 2021,
        currentRole: 'Software Developer',
        currentCompany: 'Deloitte',
        bioExtended: 'Microservices, CI/CD & cloud-native systems.',
        user: MOCK_USERS[8],
    },
];

// Mock Appointments
export const MOCK_APPOINTMENTS: Appointment[] = [
    {
        id: 1,
        studentId: 1,
        mentorId: 2,
        startsAt: '2025-11-27T14:00:00',
        endsAt: '2025-11-27T15:00:00',
        status: 'CONFIRMED',
        zoomJoinUrl: 'https://zoom.us/j/123456789',
        title: 'Want to discuss product management career paths',
        student: MOCK_USERS[0],
        mentor: MOCK_USERS[1], // Dr. Neil Williams
    },
    {
        id: 2,
        studentId: 1,
        mentorId: 3,
        startsAt: '2025-11-30T10:00:00',
        endsAt: '2025-11-30T11:00:00',
        status: 'CONFIRMED',
        zoomJoinUrl: 'https://zoom.us/j/987654321',
        title: 'Resume review session',
        student: MOCK_USERS[0],
        mentor: MOCK_USERS[2], // Jeevan
    },
    {
        id: 3,
        studentId: 1,
        mentorId: 2,
        startsAt: '2025-10-15T09:00:00',
        endsAt: '2025-10-15T09:30:00',
        status: 'COMPLETED',
        title: 'Initial consultation',
        student: MOCK_USERS[0],
        mentor: MOCK_USERS[1],
    },
];

// Mock Topics
// Mock Topics
export const MOCK_TOPICS: Topic[] = [
    {
        id: 1,
        title: 'Career Advice',
        description: 'Questions about career paths, job hunting, and professional development',
        createdAt: '2023-01-01T00:00:00Z',
        _count: { questions: 24 },
    },
    {
        id: 2,
        title: 'Academic Support',
        description: 'Course selection, study tips, and academic guidance',
        createdAt: '2023-01-01T00:00:00Z',
        _count: { questions: 18 },
    },
    {
        id: 3,
        title: 'Internship & Co-op',
        description: 'Finding and applying for internships and co-op positions',
        createdAt: '2023-01-01T00:00:00Z',
        _count: { questions: 31 },
    },
    {
        id: 4,
        title: 'Graduate School',
        description: 'Grad school applications, programs, and funding',
        createdAt: '2023-01-01T00:00:00Z',
        _count: { questions: 12 },
    },
];

// Mock Questions
export const MOCK_QUESTIONS: Question[] = [
    {
        id: 1,
        title: 'How to prepare for technical interviews?',
        body: 'I have a few interviews coming up. What are the best resources to practice?',
        topicId: 1,
        askedById: 1,
        createdAt: '2023-10-20T15:00:00Z',
        askedBy: MOCK_USERS[0],
        topic: MOCK_TOPICS[0],
        _count: { answers: 1 },
    },
];

// Mock Answers
export const MOCK_ANSWERS: Answer[] = [
    {
        id: 1,
        questionId: 1,
        answeredById: 2,
        body: 'LeetCode and Cracking the Coding Interview are your best friends. Also, practice mock interviews!',
        createdAt: '2023-10-21T09:00:00Z',
        isAccepted: true,
        answeredBy: MOCK_USERS[1],
    },
];

// Mock Conversations
export const MOCK_CONVERSATIONS: Conversation[] = [
    {
        id: 1,
        createdAt: '2025-11-25T10:00:00Z',
        participants: [MOCK_USERS[0], MOCK_USERS[1]], // Alice & Dr. Neil
        lastMessage: {
            id: 4,
            conversationId: 1,
            senderId: 1,
            content: 'Thanks for the advice! See you Friday.',
            createdAt: '2025-11-25T14:30:00',
        },
    },
    {
        id: 2,
        createdAt: '2025-11-24T09:00:00Z',
        participants: [MOCK_USERS[0], MOCK_USERS[2]], // Alice & Jeevan
        lastMessage: {
            id: 5,
            conversationId: 2,
            senderId: 3,
            content: 'I sent you the resume template we discussed.',
            createdAt: '2025-11-24T10:00:00',
        },
    },
    {
        id: 3,
        createdAt: '2025-11-23T08:00:00Z',
        participants: [MOCK_USERS[0], MOCK_USERS[3]], // Alice & Prof. Dann
        lastMessage: {
            id: 6,
            conversationId: 3,
            senderId: 4,
            content: 'The research paper deadline is next month.',
            createdAt: '2025-11-23T09:00:00',
        },
    },
];

// Mock Messages
export const MOCK_MESSAGES: Message[] = [
    // Conversation 1 (Dr. Neil)
    {
        id: 1,
        conversationId: 1,
        senderId: 2, // Dr. Neil
        content: 'Hi Alex! I saw your appointment request. Looking forward to discussing PM careers with you.',
        createdAt: '2025-11-25T13:00:00',
        sender: MOCK_USERS[1],
    },
    {
        id: 2,
        conversationId: 1,
        senderId: 1, // Alice
        content: "Thank you! I'm really excited to learn from your experience.",
        createdAt: '2025-11-25T13:15:00',
        sender: MOCK_USERS[0],
    },
    {
        id: 3,
        conversationId: 1,
        senderId: 2, // Dr. Neil
        content: 'Feel free to prepare any questions beforehand. It helps us make the most of our time together.',
        createdAt: '2025-11-25T14:00:00',
        sender: MOCK_USERS[1],
    },
    {
        id: 4,
        conversationId: 1,
        senderId: 1, // Alice
        content: 'Thanks for the advice! See you Friday.',
        createdAt: '2025-11-25T14:30:00',
        sender: MOCK_USERS[0],
    },
];
