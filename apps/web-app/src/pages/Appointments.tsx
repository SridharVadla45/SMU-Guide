import React, { useEffect, useState } from 'react';
import { apiClient } from '../api/client';
import type { Appointment } from '../types';
import { AppointmentStatus } from '../types';
import { Calendar, Clock, Video, MessageSquare, X } from 'lucide-react';

const Appointments = () => {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'upcoming' | 'past' | 'all'>('upcoming');

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const data = await apiClient.getAppointmentsForUser(1); // Assume user 1
                setAppointments(data);
            } catch (error) {
                console.error('Error fetching appointments:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAppointments();
    }, []);

    const filteredAppointments = appointments.filter((apt) => {
        const now = new Date();
        const aptDate = new Date(apt.startsAt);

        if (activeTab === 'upcoming') {
            return aptDate >= now && apt.status !== AppointmentStatus.CANCELLED;
        } else if (activeTab === 'past') {
            return aptDate < now || apt.status === AppointmentStatus.COMPLETED;
        }
        return true;
    });

    const upcomingCount = appointments.filter(a => new Date(a.startsAt) >= new Date() && a.status !== AppointmentStatus.CANCELLED).length;
    const pastCount = appointments.filter(a => new Date(a.startsAt) < new Date() || a.status === AppointmentStatus.COMPLETED).length;
    const allCount = appointments.length;

    if (loading) {
        return <div className="flex items-center justify-center h-full">Loading...</div>;
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">My Appointments</h1>
                    <p className="text-gray-500 mt-1">Manage your mentorship sessions</p>
                </div>
                <button className="px-4 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors">
                    Book New Appointment
                </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 bg-gray-100 p-1 rounded-lg w-fit">
                <button
                    onClick={() => setActiveTab('upcoming')}
                    className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${activeTab === 'upcoming' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                        }`}
                >
                    Upcoming ({upcomingCount})
                </button>
                <button
                    onClick={() => setActiveTab('past')}
                    className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${activeTab === 'past' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                        }`}
                >
                    Past ({pastCount})
                </button>
                <button
                    onClick={() => setActiveTab('all')}
                    className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${activeTab === 'all' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                        }`}
                >
                    All ({allCount})
                </button>
            </div>

            {/* Appointment List */}
            <div className="space-y-4">
                {filteredAppointments.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                        <p className="text-gray-500">No appointments found.</p>
                    </div>
                ) : (
                    filteredAppointments.map((apt) => (
                        <div key={apt.id} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                            <div className="flex items-start justify-between">
                                <div className="flex gap-4">
                                    <img
                                        src={apt.mentor?.avatarUrl}
                                        alt={apt.mentor?.name}
                                        className="w-12 h-12 rounded-full object-cover border border-gray-100"
                                    />
                                    <div>
                                        <h3 className="font-medium text-gray-900 text-lg">{apt.mentor?.name}</h3>
                                        <p className="text-sm text-gray-500">{apt.mentor?.role === 'MENTOR' ? 'Mentor' : 'Professor'}</p>
                                        {/* Removed currentRole check as it is not on User type */}

                                        <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                                            <div className="flex items-center gap-1.5">
                                                <Calendar size={16} />
                                                {new Date(apt.startsAt).toLocaleDateString()}
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <Clock size={16} />
                                                {new Date(apt.startsAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(apt.endsAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </div>

                                        {apt.title && (
                                            <p className="mt-3 text-gray-600 font-medium">
                                                {apt.title}
                                            </p>
                                        )}

                                        {/* Action Buttons */}
                                        <div className="flex items-center gap-3 mt-6">
                                            <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                                View Details
                                            </button>

                                            {apt.zoomJoinUrl && (
                                                <a
                                                    href={apt.zoomJoinUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors"
                                                >
                                                    <Video size={16} />
                                                    Join Zoom
                                                </a>
                                            )}

                                            <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                                <MessageSquare size={16} />
                                                Message
                                            </button>

                                            <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors ml-2">
                                                <X size={16} />
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Status Badge */}
                                <div>
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-black text-white capitalize">
                                        {new Date(apt.startsAt) > new Date() ? 'upcoming' : apt.status.toLowerCase()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Appointments;
