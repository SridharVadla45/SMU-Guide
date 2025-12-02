import React, { useEffect, useState } from 'react';
import { apiClient } from '../api/client';
import type { User } from '../types';
import { Mail, BookOpen, Calendar, MapPin } from 'lucide-react';

const Profile = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const data = await apiClient.getMe();
                setUser(data || null);
            } catch (error) {
                console.error('Error fetching user profile:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    if (loading) {
        return <div className="flex items-center justify-center h-full">Loading...</div>;
    }

    if (!user) {
        return <div>User not found</div>;
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                {/* Cover Image Banner */}
                <div className="h-32 bg-gradient-to-r from-blue-500 to-blue-600"></div>

                <div className="px-8 pb-8">
                    <div className="relative flex justify-between items-end -mt-12 mb-6">
                        <img
                            src={user.avatarUrl}
                            alt={user.name}
                            className="w-24 h-24 rounded-full border-4 border-white bg-white object-cover"
                        />
                        <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                            Edit Profile
                        </button>
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
                        <p className="text-gray-500 font-medium">{user.role === 'STUDENT' ? 'Student' : user.role} • {user.department}</p>

                        <div className="mt-6 space-y-4">
                            <div className="flex items-center gap-2 text-gray-600">
                                <Mail size={18} />
                                <span>{user.email}</span>
                            </div>
                            {user.department && (
                                <div className="flex items-center gap-2 text-gray-600">
                                    <BookOpen size={18} />
                                    <span>{user.department}</span>
                                </div>
                            )}
                            <div className="flex items-center gap-2 text-gray-600">
                                <Calendar size={18} />
                                <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                                <MapPin size={18} />
                                <span>SMU Campus</span>
                            </div>
                        </div>

                        <div className="mt-8">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">About Me</h3>
                            <p className="text-gray-600 leading-relaxed">
                                {user.bio || "No bio available."}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
