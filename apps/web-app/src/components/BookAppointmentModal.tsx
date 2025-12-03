import { X, CreditCard, Plus } from 'lucide-react';
import { useState, useEffect } from 'react';
import { apiClient } from '../api/client';
import { CardIcon } from './CardIcon';
import type { User, PaymentMethod } from '../types';

interface BookAppointmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    mentorId?: number;
    mentorName?: string;
    onAppointmentBooked?: () => void;
}

export const BookAppointmentModal = ({ isOpen, onClose, mentorId: initialMentorId, mentorName, onAppointmentBooked }: BookAppointmentModalProps) => {
    const [mentors, setMentors] = useState<User[]>([]);
    const [step, setStep] = useState<'details' | 'payment'>('details');
    const [formData, setFormData] = useState({
        mentorId: initialMentorId || 0,
        date: '',
        startTime: '',
        endTime: '',
        notes: '',
    });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    // Payment state
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
    const [selectedMethodId, setSelectedMethodId] = useState<number | 'new'>('new');
    const [loadingMethods, setLoadingMethods] = useState(false);

    // New card state
    const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvc, setCvc] = useState('');

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
            setStep('details'); // Reset step on open
        }
    }, [isOpen, initialMentorId]);

    // Fetch payment methods when entering payment step
    useEffect(() => {
        if (isOpen && step === 'payment') {
            setLoadingMethods(true);
            apiClient.getPaymentMethods()
                .then(methods => {
                    setPaymentMethods(methods);
                    if (methods.length > 0) {
                        const defaultMethod = methods.find(m => m.isDefault);
                        setSelectedMethodId(defaultMethod ? defaultMethod.id : methods[0].id);
                    } else {
                        setSelectedMethodId('new');
                    }
                })
                .catch(err => {
                    console.error('Error fetching payment methods:', err);
                    // Don't block the user, just default to new card
                    setSelectedMethodId('new');
                })
                .finally(() => setLoadingMethods(false));
        }
    }, [isOpen, step]);

    const handleDetailsSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.mentorId) {
            setError('Please select a mentor');
            return;
        }
        setError('');
        setStep('payment');
    };

    const luhnCheck = (val: string) => {
        let checksum = 0;
        let j = 1;
        for (let i = val.length - 1; i >= 0; i--) {
            let calc = 0;
            calc = Number(val.charAt(i)) * j;
            if (calc > 9) {
                checksum = checksum + 1;
                calc = calc - 10;
            }
            checksum = checksum + calc;
            j = (j == 1) ? 2 : 1;
        }
        return (checksum % 10) == 0;
    };

    const detectCardBrand = (number: string): string => {
        const patterns = {
            visa: /^4/,
            mastercard: /^5[1-5]|^2[2-7]/,
            amex: /^3[47]/,
            discover: /^6(?:011|5)/,
            diners: /^3(?:0[0-5]|[68])/,
            jcb: /^35/
        };

        for (const [brand, pattern] of Object.entries(patterns)) {
            if (pattern.test(number)) return brand;
        }
        return 'unknown';
    };

    const handlePaymentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSubmitting(true);

        try {
            // 1. If new card, save it first (Mock)
            if (selectedMethodId === 'new') {
                console.log('Processing new card...');
                const [expMonthStr, expYearStr] = expiry.split('/').map(s => s.trim());
                const expMonth = parseInt(expMonthStr);
                let expYear = parseInt(expYearStr);

                // Handle 2-digit year
                if (expYear < 100) expYear += 2000;

                console.log('Adding payment method:', { expMonth, expYear });

                // Basic Validation
                const cleanCardNumber = cardNumber.replace(/\D/g, '');
                if (!luhnCheck(cleanCardNumber)) {
                    throw new Error('Invalid card number');
                }

                if (!expMonth || !expYear || expMonth < 1 || expMonth > 12) {
                    throw new Error('Invalid expiry date');
                }

                // Handle 2-digit year
                if (expYear < 100) expYear += 2000;

                // Check if expired
                const now = new Date();
                const currentYear = now.getFullYear();
                const currentMonth = now.getMonth() + 1; // 0-indexed

                if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
                    throw new Error('Card has expired');
                }

                const brand = detectCardBrand(cleanCardNumber);

                await apiClient.addPaymentMethod({
                    brand: brand,
                    last4: cleanCardNumber.slice(-4),
                    expMonth: expMonth,
                    expYear: expYear,
                });
                console.log('Payment method added successfully');
            }

            // 2. Create Payment Intent (Mock)
            console.log('Creating payment intent...');
            // In a real app, amount would be dynamic based on mentor's rate
            const amount = 50;
            const intent = await apiClient.createPaymentIntent(amount);

            // 3. Confirm Payment (Mock)
            console.log('Confirming payment...');
            // In a real app, Stripe Elements handles this securely
            await apiClient.confirmPayment(intent.paymentIntentId, amount);

            // 3. Create Appointment
            const startsAt = new Date(`${formData.date}T${formData.startTime}`).toISOString();
            const endsAt = new Date(`${formData.date}T${formData.endTime}`).toISOString();

            await apiClient.createAppointment({
                mentorId: formData.mentorId,
                startsAt,
                endsAt,
                notes: formData.notes,
            });

            setFormData({ mentorId: initialMentorId || 0, date: '', startTime: '', endTime: '', notes: '' });
            setCardNumber('');
            setExpiry('');
            setCvc('');
            onAppointmentBooked?.();
            onClose();
        } catch (err: any) {
            setError(err.message || 'Failed to process payment and book appointment');
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
                            <h2 className="text-2xl font-bold text-gray-900">
                                {step === 'details' ? 'Book Appointment' : 'Payment Details'}
                            </h2>
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

                    {step === 'details' ? (
                        <form onSubmit={handleDetailsSubmit} className="space-y-4">
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
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Next: Payment
                                </button>
                            </div>
                        </form>
                    ) : (
                        <form onSubmit={handlePaymentSubmit} className="space-y-4">
                            <div className="bg-blue-50 p-4 rounded-lg mb-4 flex items-center gap-3">
                                <CreditCard className="text-blue-600 w-5 h-5" />
                                <div>
                                    <p className="text-sm font-medium text-blue-900">Session Fee</p>
                                    <p className="text-lg font-bold text-blue-700">$50.00</p>
                                </div>
                            </div>

                            {loadingMethods ? (
                                <div className="text-center py-4 text-gray-500">Loading payment methods...</div>
                            ) : (
                                <div className="space-y-3 mb-4">
                                    {paymentMethods.map((method) => (
                                        <div
                                            key={method.id}
                                            onClick={() => setSelectedMethodId(method.id)}
                                            className={`p-3 border rounded-lg cursor-pointer flex items-center gap-3 transition-colors ${selectedMethodId === method.id
                                                ? 'border-blue-500 bg-blue-50'
                                                : 'border-gray-200 hover:border-blue-300'
                                                }`}
                                        >
                                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${selectedMethodId === method.id ? 'border-blue-600' : 'border-gray-400'
                                                }`}>
                                                {selectedMethodId === method.id && (
                                                    <div className="w-2 h-2 rounded-full bg-blue-600" />
                                                )}
                                            </div>
                                            <CardIcon brand={method.brand} className="w-8 h-5" />
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-gray-900 capitalize">
                                                    {method.brand} •••• {method.last4}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    Expires {method.expMonth}/{method.expYear}
                                                </p>
                                            </div>
                                        </div>
                                    ))}

                                    <div
                                        onClick={() => setSelectedMethodId('new')}
                                        className={`p-3 border rounded-lg cursor-pointer flex items-center gap-3 transition-colors ${selectedMethodId === 'new'
                                            ? 'border-blue-500 bg-blue-50'
                                            : 'border-gray-200 hover:border-blue-300'
                                            }`}
                                    >
                                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${selectedMethodId === 'new' ? 'border-blue-600' : 'border-gray-400'
                                            }`}>
                                            {selectedMethodId === 'new' && (
                                                <div className="w-2 h-2 rounded-full bg-blue-600" />
                                            )}
                                        </div>
                                        <Plus className="text-gray-600 w-5 h-5" />
                                        <span className="text-sm font-medium text-gray-900">Add New Card</span>
                                    </div>
                                </div>
                            )}

                            {selectedMethodId === 'new' && (
                                <div className="space-y-4 pt-2 border-t border-gray-100">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Card Number
                                        </label>
                                        <input
                                            type="text"
                                            value={cardNumber}
                                            onChange={(e) => setCardNumber(e.target.value)}
                                            placeholder="0000 0000 0000 0000"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            required={selectedMethodId === 'new'}
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Expiry Date
                                            </label>
                                            <input
                                                type="text"
                                                value={expiry}
                                                onChange={(e) => setExpiry(e.target.value)}
                                                placeholder="MM/YY"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                required={selectedMethodId === 'new'}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                CVC
                                            </label>
                                            <input
                                                type="text"
                                                value={cvc}
                                                onChange={(e) => setCvc(e.target.value)}
                                                placeholder="123"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                required={selectedMethodId === 'new'}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setStep('details')}
                                    className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                                >
                                    Back
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    {submitting ? 'Processing...' : 'Pay & Book'}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};
