import { useEffect, useState } from 'react';
import { apiClient } from '../api/client';
import type { Appointment } from '../types';
import { Calendar, Clock, Video, MessageSquare, X, Check } from 'lucide-react';
import { BookAppointmentModal } from '../components/BookAppointmentModal';
import { AppointmentDetailModal } from '../components/AppointmentDetailModal';
import { showToast } from '../components/Toast';
import { API_URL } from '../config';

const Appointments = () => {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'upcoming' | 'past' | 'all'>('upcoming');
    const [actionLoading, setActionLoading] = useState<number | null>(null);
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
    const [showDetailModal, setShowDetailModal] = useState(false);

    const fetchAppointments = async () => {
        try {
            const data = await apiClient.getAppointments();
            setAppointments(data);
        } catch (error) {
            console.error('Error fetching appointments:', error);
            showToast('Failed to load appointments', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, []);

    const handleConfirm = async (appointmentId: number) => {
        setActionLoading(appointmentId);
        try {
            await fetch(`http://localhost:4000/api/appointments/${appointmentId}/confirm`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
            });
            await fetchAppointments();
            showToast('Appointment confirmed successfully!', 'success');
        } catch (error) {
            console.error('Error confirming appointment:', error);
            showToast('Failed to confirm appointment', 'error');
        } finally {
            setActionLoading(null);
        }
    };

    const handleCancel = async (appointmentId: number) => {
        if (!confirm('Are you sure you want to cancel this appointment?')) return;

        setActionLoading(appointmentId);
        try {
            await apiClient.cancelAppointment(appointmentId);
            await fetchAppointments();
            showToast('Appointment cancelled', 'info');
        } catch (error) {
            console.error('Error cancelling appointment:', error);
            showToast('Failed to cancel appointment', 'error');
        } finally {
            setActionLoading(null);
        }
    };

    const handleAppointmentBooked = () => {
        showToast('Appointment booked successfully!', 'success');
        fetchAppointments();
    };

    const filteredAppointments = appointments.filter((apt) => {
        const now = new Date();
        const aptDate = new Date(apt.startsAt);

        if (activeTab === 'upcoming') {
            return aptDate >= now && apt.status !== 'CANCELLED';
        } else if (activeTab === 'past') {
            return aptDate < now || apt.status === 'COMPLETED';
        }
        return true;
    });

    const upcomingCount = appointments.filter(a => new Date(a.startsAt) >= new Date() && a.status !== 'CANCELLED').length;
    const pastCount = appointments.filter(a => new Date(a.startsAt) < new Date() || a.status === 'COMPLETED').length;
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
                <button
                    onClick={() => setShowBookingModal(true)}
                    className="px-4 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
                >
                    Book New Appointment
                </button>
            </div>

            <BookAppointmentModal
                isOpen={showBookingModal}
                onClose={() => setShowBookingModal(false)}
                onAppointmentBooked={handleAppointmentBooked}
            />

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
                                        src={apt.mentor?.avatarUrl ? (apt.mentor.avatarUrl.startsWith('http') ? apt.mentor.avatarUrl : `${API_URL}${apt.mentor.avatarUrl}`) : `https://ui-avatars.com/api/?name=${encodeURIComponent(apt.mentor?.name || 'Mentor')}&background=random&color=fff`}
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
                                            <button
                                                onClick={() => {
                                                    setSelectedAppointment(apt);
                                                    setShowDetailModal(true);
                                                }}
                                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                                            >
                                                View Details
                                            </button>

                                            {apt.status === 'PENDING' && (
                                                <button
                                                    onClick={() => handleConfirm(apt.id)}
                                                    disabled={actionLoading === apt.id}
                                                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                                                >
                                                    <Check size={16} />
                                                    {actionLoading === apt.id ? 'Confirming...' : 'Confirm'}
                                                </button>
                                            )}

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

                                            {apt.status !== 'CANCELLED' && apt.status !== 'COMPLETED' && (
                                                <button
                                                    onClick={() => handleCancel(apt.id)}
                                                    disabled={actionLoading === apt.id}
                                                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors ml-2 disabled:opacity-50"
                                                >
                                                    <X size={16} />
                                                    {actionLoading === apt.id ? 'Cancelling...' : 'Cancel'}
                                                </button>
                                            )}
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

            <AppointmentDetailModal
                isOpen={showDetailModal}
                onClose={() => setShowDetailModal(false)}
                appointment={selectedAppointment}
                onConfirm={handleConfirm}
                onCancel={handleCancel}
            />
        </div>
    );
};

export default Appointments;
