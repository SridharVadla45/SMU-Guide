import { X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { apiClient } from '../api/client';
import type { User } from '../types';

interface BookAppointmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    mentorId?: number;
    mentorName?: string;
    onAppointmentBooked?: () => void;
}

export const BookAppointmentModal = ({ isOpen, onClose, mentorId: initialMentorId, mentorName, onAppointmentBooked }: BookAppointmentModalProps) => {
    const [mentors, setMentors] = useState<User[]>([]);
    const [formData, setFormData] = useState({
        mentorId: initialMentorId || 0,
        date: '',
        startTime: '',
        endTime: '',
        notes: '',
    });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchMentors = async () => {
            try {
                const data = await apiClient.getMentorProfiles();
                setMentors(data);
                if (!initialMentorId && data.length > 0) {
                    setFormData(prev => ({ ...prev, mentorId: data[0].id }));
                }
            } catch (error) {
                console.error('Error fetching mentors:', error);
            }
        };

        if (isOpen) {
            fetchMentors();
        }
    }, [isOpen, initialMentorId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.mentorId) {
            setError('Please select a mentor');
            return;
        }

        setError('');
        setSubmitting(true);

        try {
            const startsAt = new Date(`${formData.date}T${formData.startTime}`).toISOString();
            const endsAt = new Date(`${formData.date}T${formData.endTime}`).toISOString();

            await apiClient.createAppointment({
                mentorId: formData.mentorId,
                startsAt,
                endsAt,
                notes: formData.notes,
            });

            setFormData({ mentorId: initialMentorId || 0, date: '', startTime: '', endTime: '', notes: '' });
            onAppointmentBooked?.();
            onClose();
        } catch (err: any) {
            setError(err.message || 'Failed to book appointment');
        } finally {
            setSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-md w-full">
                <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">Book Appointment</h2>
                            {mentorName && (
                                <p className="text-sm text-gray-500 mt-1">with {mentorName}</p>
                            )}
                        </div>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {error && (
                        <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {!initialMentorId && mentors.length > 0 && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Select Mentor
                                </label>
                                <select
                                    value={formData.mentorId}
                                    onChange={(e) => setFormData({ ...formData, mentorId: Number(e.target.value) })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                >
                                    {mentors.map((mentor) => (
                                        <option key={mentor.id} value={mentor.id}>
                                            {mentor.name} - {mentor.department}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Date
                            </label>
                            <input
                                type="date"
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                min={new Date().toISOString().split('T')[0]}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Start Time
                                </label>
                                <input
                                    type="time"
                                    value={formData.startTime}
                                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    End Time
                                </label>
                                <input
                                    type="time"
                                    value={formData.endTime}
                                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Notes (Optional)
                            </label>
                            <textarea
                                value={formData.notes}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                placeholder="What would you like to discuss?"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                rows={3}
                            />
                        </div>

                        <div className="flex justify-end gap-3 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={submitting}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {submitting ? 'Booking...' : 'Book Appointment'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
