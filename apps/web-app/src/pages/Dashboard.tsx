import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../api/client';
import type { User, Appointment, Question } from '../types';
import { Calendar, Clock, ArrowRight, MessageSquare } from 'lucide-react';
import { API_URL } from '../config';

const Dashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState<User | null>(null);
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [mentors, setMentors] = useState<User[]>([]);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [usersData, appointmentsResponse, mentorsResponse, questionsResponse] = await Promise.all([
                    apiClient.getMe(),
                    apiClient.getAppointments(),
                    apiClient.getMentorProfiles(),
                    apiClient.getQuestions(),
                ]);

                setUser(usersData || null);
                // Handle paginated response for appointments
                const appointmentsArray = Array.isArray(appointmentsResponse) ? appointmentsResponse : (appointmentsResponse as any)?.data || [];
                setAppointments(appointmentsArray);
                // Handle paginated response - extract data array
                const mentorsArray = Array.isArray(mentorsResponse) ? mentorsResponse : (mentorsResponse as any)?.data || [];
                const questionsArray = Array.isArray(questionsResponse) ? questionsResponse : (questionsResponse as any)?.data || [];
                setMentors(mentorsArray.slice(0, 3)); // Show top 3
                setQuestions(questionsArray.slice(0, 3)); // Show top 3
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <div className="flex items-center justify-center h-full">Loading...</div>;
    }

    return (
        <div className="space-y-8">
            {/* Welcome Section */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    Hello, {user?.name} <span className="text-2xl">👋</span>
                </h1>
                <p className="text-gray-500 mt-1">
                    {user?.role === 'STUDENT' ? 'Student' : user?.role} • {user?.department}
                </p>
            </div>

            {/* Upcoming Appointments */}
            <section className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900">Upcoming Appointments</h2>
                        <p className="text-sm text-gray-500">Your scheduled mentorship sessions</p>
                    </div>
                    <button
                        onClick={() => navigate('/appointments')}
                        className="text-sm font-medium text-blue-600 hover:text-blue-700"
                    >
                        View All
                    </button>
                </div>

                <div className="space-y-4">
                    {appointments.filter(apt => new Date(apt.startsAt) > new Date()).slice(0, 3).length === 0 ? (
                        <p className="text-gray-500 text-sm">No upcoming appointments.</p>
                    ) : (
                        appointments
                            .filter(apt => new Date(apt.startsAt) > new Date())
                            .slice(0, 3)
                            .map((apt) => (
                                <div key={apt.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
                                    <div className="flex items-center gap-4">
                                        <img
                                            src={apt.mentor?.avatarUrl ? (apt.mentor.avatarUrl.startsWith('http') ? apt.mentor.avatarUrl : `${API_URL}${apt.mentor.avatarUrl}`) : `https://ui-avatars.com/api/?name=${encodeURIComponent(apt.mentor?.name || 'Mentor')}&background=random&color=fff`}
                                            alt={apt.mentor?.name || 'Mentor'}
                                            className="w-12 h-12 rounded-full object-cover"
                                        />
                                        <div>
                                            <h3 className="font-medium text-gray-900">{apt.mentor?.name || 'Mentor'}</h3>
                                            <p className="text-xs text-gray-500">{apt.mentor?.department || 'Department'}</p>
                                            <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                                                <div className="flex items-center gap-1">
                                                    <Calendar size={12} />
                                                    {new Date(apt.startsAt).toLocaleDateString()}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Clock size={12} />
                                                    {new Date(apt.startsAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => navigate('/appointments')}
                                        className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors"
                                    >
                                        View
                                    </button>
                                </div>
                            ))
                    )}
                </div>
            </section>

            {/* Suggested Mentors */}
            <section>
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900">Suggested Mentors</h2>
                        <p className="text-sm text-gray-500">Connect with experienced professionals</p>
                    </div>
                    <button
                        onClick={() => window.location.href = '/mentors'}
                        className="text-sm font-medium text-blue-600 hover:text-blue-700"
                    >
                        Browse All
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {mentors.map((mentor) => (
                        <div key={mentor.id} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-start gap-4 mb-4">
                                <img
                                    src={mentor.avatarUrl ? (mentor.avatarUrl.startsWith('http') ? mentor.avatarUrl : `${API_URL}${mentor.avatarUrl}`) : `https://ui-avatars.com/api/?name=${encodeURIComponent(mentor.name)}&background=random&color=fff`}
                                    alt={mentor.name}
                                    className="w-12 h-12 rounded-full object-cover"
                                />
                                <div>
                                    <h3 className="font-medium text-gray-900">{mentor.name}</h3>
                                    <p className="text-xs text-blue-600 font-medium">{mentor.department}</p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {(mentor as any).mentorProfile?.currentRole} at {(mentor as any).mentorProfile?.currentCompany}
                                    </p>
                                </div>
                            </div>
                            <p className="text-sm text-gray-600 line-clamp-2 mb-4 h-10">
                                {(mentor as any).mentorProfile?.bioExtended || mentor.bio}
                            </p>
                            <button
                                onClick={() => window.location.href = `/mentors/${mentor.id}`}
                                className="w-full py-2 text-sm font-medium text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200"
                            >
                                View Profile
                            </button>
                        </div>
                    ))}
                </div>
            </section>

            {/* Forum Highlights */}
            <section className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900">Forum Highlights</h2>
                        <p className="text-sm text-gray-500">Recent questions from the community</p>
                    </div>
                    <button
                        onClick={() => navigate('/forum')}
                        className="text-sm font-medium text-blue-600 hover:text-blue-700"
                    >
                        Go to Forum
                    </button>
                </div>

                <div className="space-y-4">
                    {questions.map((q) => (
                        <div key={q.id} className="p-4 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer group">
                            <div className="flex items-start justify-between">
                                <div className="space-y-1">
                                    <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                                        {q.title}
                                    </h3>
                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                        <span>{q.askedBy?.name}</span>
                                        <span>•</span>
                                        <span>{new Date(q.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
                            </div>
                            <div className="mt-3 flex items-center gap-2">
                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-medium">
                                    <MessageSquare size={12} />
                                    {q._count?.answers || 0} answers
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Dashboard;
