// prisma/seed.ts

import { PrismaClient, Role, AppointmentStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding database...');

    // -----------------------------------
    // 1. Clear existing data (FK order)
    // -----------------------------------
    await prisma.message.deleteMany();
    await prisma.conversationParticipant.deleteMany();
    await prisma.conversation.deleteMany();

    await prisma.answer.deleteMany();
    await prisma.question.deleteMany();
    await prisma.topic.deleteMany();

    await prisma.appointment.deleteMany();
    await prisma.zoomCredential.deleteMany();
    await prisma.mentorAvailability.deleteMany();
    await prisma.mentorProfile.deleteMany();

    await prisma.user.deleteMany();

    // -----------------------------------
    // 2. Create Users
    // -----------------------------------
    const admin = await prisma.user.create({
        data: {
            name: 'System Admin',
            email: 'admin@smu-guide.test',
            password: await bcrypt.hash('admin123', 10),
            role: Role.ADMIN,
            department: 'IT Services',
            bio: 'Platform administrator for SMU Guide.',
            avatarUrl: null,
        },
    });

    const professor = await prisma.user.create({
        data: {
            name: 'Dr. Jane Professor',
            email: 'jane.professor@smu-guide.test',
            password: await bcrypt.hash('prof123', 10),
            role: Role.PROFESSOR,
            department: 'Computer Science',
            bio: 'Professor in Computer Science, mentoring students in AI and Data.',
            avatarUrl: null,
        },
    });

    const mentor1 = await prisma.user.create({
        data: {
            name: 'Alex Mentor',
            email: 'alex.mentor@smu-guide.test',
            password: await bcrypt.hash('mentor123', 10),
            role: Role.MENTOR,
            department: 'Computer Science',
            bio: 'SMU alumnus working as a Software Engineer.',
            avatarUrl: null,
        },
    });

    const mentor2 = await prisma.user.create({
        data: {
            name: 'Priya Mentor',
            email: 'priya.mentor@smu-guide.test',
            password: await bcrypt.hash('mentor123', 10),
            role: Role.MENTOR,
            department: 'Data Analytics',
            bio: 'Data Analyst mentoring students transitioning into analytics roles.',
            avatarUrl: null,
        },
    });

    const student = await prisma.user.create({
        data: {
            name: 'Sridhar Student',
            email: 'sridhar.student@smu-guide.test',
            password: await bcrypt.hash('student123', 10),
            role: Role.STUDENT,
            department: 'MCDA',
            bio: 'Graduate student exploring software engineering and data.',
            avatarUrl: null,
        },
    });

    console.log('✅ Users created');

    // -----------------------------------
    // 3. Mentor Profiles + Availability
    // -----------------------------------
    const mentorProfile1 = await prisma.mentorProfile.create({
        data: {
            userId: mentor1.id,
            graduationYear: 2021,
            currentCompany: 'TechCorp Inc.',
            currentRole: 'Backend Engineer',
            bioExtended:
                'Alex is passionate about backend development, TypeScript, and mentoring students entering the industry.',
        },
    });

    const mentorProfile2 = await prisma.mentorProfile.create({
        data: {
            userId: mentor2.id,
            graduationYear: 2020,
            currentCompany: 'DataWorks Analytics',
            currentRole: 'Data Analyst',
            bioExtended:
                'Priya focuses on analytics, BI, and helping students pivot into data roles.',
        },
    });

    await prisma.mentorAvailability.createMany({
        data: [
            // Alex Mentor: Monday & Wednesday mornings
            {
                mentorProfileId: mentorProfile1.id,
                dayOfWeek: 1, // Monday
                startTime: '09:00',
                endTime: '11:00',
            },
            {
                mentorProfileId: mentorProfile1.id,
                dayOfWeek: 3, // Wednesday
                startTime: '14:00',
                endTime: '16:00',
            },

            // Priya Mentor: Tuesday & Thursday evenings
            {
                mentorProfileId: mentorProfile2.id,
                dayOfWeek: 2, // Tuesday
                startTime: '18:00',
                endTime: '20:00',
            },
            {
                mentorProfileId: mentorProfile2.id,
                dayOfWeek: 4, // Thursday
                startTime: '18:00',
                endTime: '20:00',
            },
        ],
    });

    console.log('✅ Mentor profiles & availability created');

    // -----------------------------------
    // 4. Zoom Credential (for one mentor)
    // -----------------------------------
    await prisma.zoomCredential.create({
        data: {
            mentorProfileId: mentorProfile1.id,
            zoomUserId: 'zoom_user_alex_123',
            accessToken: 'dev-access-token-placeholder',
            refreshToken: 'dev-refresh-token-placeholder',
            expiresAt: new Date(Date.now() + 1000 * 60 * 60), // +1 hour
        },
    });

    console.log('✅ Zoom credential created');

    // -----------------------------------
    // 5. Forum: Topics, Questions, Answers
    // -----------------------------------
    const topicCareers = await prisma.topic.create({
        data: {
            title: 'Career Guidance & Internships',
            description: 'Discussions about career paths, internships, and job search strategies.',
        },
    });

    const topicCourses = await prisma.topic.create({
        data: {
            title: 'Course Selection & Academics',
            description: 'Help with choosing courses, managing workload, and academic planning.',
        },
    });

    const question1 = await prisma.question.create({
        data: {
            title: 'How to prepare for backend developer interviews?',
            body: 'I am interested in Node.js and TypeScript roles. What should I focus on to prepare for interviews?',
            topicId: topicCareers.id,
            askedById: student.id,
        },
    });

    const question2 = await prisma.question.create({
        data: {
            title: 'Which electives are useful for a data engineering career?',
            body: 'I am in MCDA and want to focus on data engineering. Any course recommendations?',
            topicId: topicCourses.id,
            askedById: student.id,
        },
    });

    await prisma.answer.create({
        data: {
            questionId: question1.id,
            answeredById: mentor1.id,
            body:
                'Focus on data structures, algorithms basics, system design, REST APIs, databases, and writing clean TypeScript. Build 1–2 solid backend projects.',
            isAccepted: true,
        },
    });

    await prisma.answer.create({
        data: {
            questionId: question2.id,
            answeredById: professor.id,
            body:
                'Consider courses in databases, distributed systems, big data platforms, and cloud computing. Practical projects with ETL pipelines are very helpful.',
            isAccepted: false,
        },
    });

    console.log('✅ Forum topics, questions & answers created');

    // -----------------------------------
    // 6. Conversations & Messages
    // -----------------------------------
    const conversation = await prisma.conversation.create({
        data: {
            participants: {
                create: [
                    {
                        userId: student.id,
                    },
                    {
                        userId: mentor1.id,
                    },
                ],
            },
        },
    });

    await prisma.message.createMany({
        data: [
            {
                conversationId: conversation.id,
                senderId: student.id,
                content: 'Hi Alex, thanks for agreeing to mentor me!',
            },
            {
                conversationId: conversation.id,
                senderId: mentor1.id,
                content: 'Hi Sridhar, happy to help. Let’s schedule a Zoom call this week.',
            },
        ],
    });

    console.log('✅ Conversations & messages created');

    // -----------------------------------
    // 7. Appointments (Student ↔ Mentor)
    // -----------------------------------
    const now = new Date();
    const oneDayMs = 24 * 60 * 60 * 1000;

    const upcomingStart = new Date(now.getTime() + oneDayMs); // +1 day
    upcomingStart.setHours(10, 0, 0, 0);
    const upcomingEnd = new Date(upcomingStart.getTime() + 60 * 60 * 1000); // +1h

    const pastStart = new Date(now.getTime() - 7 * oneDayMs); // -7 days
    pastStart.setHours(15, 0, 0, 0);
    const pastEnd = new Date(pastStart.getTime() + 60 * 60 * 1000);

    await prisma.appointment.createMany({
        data: [
            // Upcoming, confirmed
            {
                studentId: student.id,
                mentorId: mentor1.id,
                startsAt: upcomingStart,
                endsAt: upcomingEnd,
                status: AppointmentStatus.CONFIRMED,
                zoomMeetingId: 'zoom-meeting-123',
                zoomJoinUrl: 'https://zoom.us/j/meeting-join-link',
                zoomStartUrl: 'https://zoom.us/j/meeting-start-link',
            },
            // Past, completed
            {
                studentId: student.id,
                mentorId: mentor2.id,
                startsAt: pastStart,
                endsAt: pastEnd,
                status: AppointmentStatus.COMPLETED,
                zoomMeetingId: 'zoom-meeting-456',
                zoomJoinUrl: 'https://zoom.us/j/meeting-join-link-2',
                zoomStartUrl: 'https://zoom.us/j/meeting-start-link-2',
            },
        ],
    });

    console.log('✅ Appointments created');

    console.log('🌱 Seeding completed successfully!');
}

main()
    .catch((e) => {
        console.error('❌ Seeding error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
