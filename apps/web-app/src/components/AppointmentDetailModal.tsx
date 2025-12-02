import { X } from 'lucide-react';
import type { Appointment } from '../types';
import { Calendar, Clock, Video, User, FileText } from 'lucide-react';

interface AppointmentDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    appointment: Appointment | null;
    onCancel?: (id: number) => void;
    onConfirm?: (id: number) => void;
}

export const AppointmentDetailModal = ({ isOpen, onClose, appointment, onCancel, onConfirm }: AppointmentDetailModalProps) => {
    if (!isOpen || !appointment) return null;

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'CONFIRMED':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'PENDING':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'CANCELLED':
                return 'bg-red-100 text-red-800 border-red-200';
            case 'COMPLETED':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-6">
                        <div className="flex-1">
                            <h2 className="text-2xl font-bold text-gray-900">Appointment Details</h2>
                            <span className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(appointment.status)}`}>
                                {appointment.status}
                            </span>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* Mentor Info */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                        <div className="flex items-center gap-4">
                            <img
                                src={appointment.mentor?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${appointment.mentor?.name}`}
                                alt={appointment.mentor?.name}
                                className="w-16 h-16 rounded-full object-cover border-2 border-white shadow"
                            />
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">{appointment.mentor?.name}</h3>
                                <p className="text-sm text-gray-600">{appointment.mentor?.department}</p>
                                <p className="text-sm text-gray-500">{appointment.mentor?.role}</p>
                            </div>
                        </div>
                    </div>

                    {/* Appointment Info */}
                    <div className="space-y-4 mb-6">
                        <div className="flex items-start gap-3">
                            <Calendar className="text-gray-400 mt-1" size={20} />
                            <div>
                                <p className="text-sm font-medium text-gray-700">Date</p>
                                <p className="text-gray-900">{new Date(appointment.startsAt).toLocaleDateString('en-US', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <Clock className="text-gray-400 mt-1" size={20} />
                            <div>
                                <p className="text-sm font-medium text-gray-700">Time</p>
                                <p className="text-gray-900">
                                    {new Date(appointment.startsAt).toLocaleTimeString('en-US', {
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })} - {new Date(appointment.endsAt).toLocaleTimeString('en-US', {
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </p>
                            </div>
                        </div>

                        {appointment.title && (
                            <div className="flex items-start gap-3">
                                <FileText className="text-gray-400 mt-1" size={20} />
                                <div>
                                    <p className="text-sm font-medium text-gray-700">Title</p>
                                    <p className="text-gray-900">{appointment.title}</p>
                                </div>
                            </div>
                        )}

                        {appointment.notes && (
                            <div className="flex items-start gap-3">
                                <FileText className="text-gray-400 mt-1" size={20} />
                                <div>
                                    <p className="text-sm font-medium text-gray-700">Notes</p>
                                    <p className="text-gray-900 whitespace-pre-wrap">{appointment.notes}</p>
                                </div>
                            </div>
                        )}

                        {appointment.zoomJoinUrl && (
                            <div className="flex items-start gap-3">
                                <Video className="text-gray-400 mt-1" size={20} />
                                <div>
                                    <p className="text-sm font-medium text-gray-700">Meeting Link</p>
                                    <a
                                        href={appointment.zoomJoinUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:text-blue-700 underline"
                                    >
                                        Join Zoom Meeting
                                    </a>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                        {appointment.status === 'PENDING' && onConfirm && (
                            <button
                                onClick={() => {
                                    onConfirm(appointment.id);
                                    onClose();
                                }}
                                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                            >
                                Confirm Appointment
                            </button>
                        )}

                        {appointment.status !== 'CANCELLED' && appointment.status !== 'COMPLETED' && onCancel && (
                            <button
                                onClick={() => {
                                    onCancel(appointment.id);
                                    onClose();
                                }}
                                className="px-6 py-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                            >
                                Cancel Appointment
                            </button>
                        )}

                        <button
                            onClick={onClose}
                            className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
