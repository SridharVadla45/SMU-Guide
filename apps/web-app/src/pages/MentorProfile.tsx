import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiClient } from '../api/client';
import type { MentorProfile } from '../types';
import { Briefcase, GraduationCap, Building, ArrowLeft, Calendar } from 'lucide-react';

const MentorProfilePage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [profile, setProfile] = useState<MentorProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            if (!id) return;
            try {
                const data = await apiClient.getMentorProfileById(parseInt(id));
                setProfile(data || null);
            } catch (error) {
                console.error('Error fetching mentor profile:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [id]);

    if (loading) {
        return <div className="flex items-center justify-center h-full">Loading...</div>;
    }

    if (!profile) {
        return <div>Mentor not found</div>;
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
                <ArrowLeft size={20} />
                Back to Mentors
            </button>

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-700"></div>

                <div className="px-8 pb-8">
                    <div className="relative flex justify-between items-end -mt-12 mb-6">
                        <img
                            src={profile.user?.avatarUrl}
                            alt={profile.user?.name}
                            className="w-24 h-24 rounded-full border-4 border-white bg-white object-cover"
                        />
                        <button className="px-6 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors shadow-sm">
                            Book Appointment
                        </button>
                    </div>

                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h1 className="text-2xl font-bold text-gray-900">{profile.user?.name}</h1>
                            <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${profile.user?.role === 'PROFESSOR'
                                    ? 'bg-purple-50 text-purple-700'
                                    : 'bg-blue-50 text-blue-700'
                                }`}>
                                {profile.user?.role === 'PROFESSOR' ? 'Professor' : 'Alumni'}
                            </span>
                        </div>

                        <p className="text-gray-500 font-medium mb-6">
                            {profile.currentRole} at {profile.currentCompany}
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <div className="flex items-center gap-3 text-gray-600 bg-gray-50 p-3 rounded-lg">
                                <Building size={20} className="text-gray-400" />
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-semibold">Department</p>
                                    <p className="text-sm font-medium text-gray-900">{profile.user?.department}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 text-gray-600 bg-gray-50 p-3 rounded-lg">
                                <Briefcase size={20} className="text-gray-400" />
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-semibold">Company</p>
                                    <p className="text-sm font-medium text-gray-900">{profile.currentCompany || 'N/A'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 text-gray-600 bg-gray-50 p-3 rounded-lg">
                                <GraduationCap size={20} className="text-gray-400" />
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-semibold">Graduation</p>
                                    <p className="text-sm font-medium text-gray-900">{profile.graduationYear || 'N/A'}</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <section>
                                <h2 className="text-lg font-semibold text-gray-900 mb-3">About</h2>
                                <p className="text-gray-600 leading-relaxed">
                                    {profile.bioExtended || profile.user?.bio || "No bio available."}
                                </p>
                            </section>

                            <section>
                                <h2 className="text-lg font-semibold text-gray-900 mb-3">Availability</h2>
                                <div className="bg-green-50 border border-green-100 rounded-lg p-4 flex items-start gap-3">
                                    <Calendar className="text-green-600 w-5 h-5 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium text-green-800">Open for new mentees</p>
                                        <p className="text-sm text-green-700 mt-1">
                                            Usually available on weekday evenings and weekends. Check calendar for specific slots.
                                        </p>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MentorProfilePage;
