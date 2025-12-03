import React, { useEffect, useState } from 'react';
import { apiClient } from '../api/client';
import { CreditCard, DollarSign, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { CardIcon } from '../components/CardIcon';

interface Payment {
    id: number;
    amount: number;
    currency: string;
    status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
    createdAt: string;
    appointment?: {
        mentor?: {
            name: string;
        };
    };
}

const Billing = () => {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAddCardOpen, setIsAddCardOpen] = useState(false);
    const [newCard, setNewCard] = useState({ number: '', expiry: '', cvc: '' });

    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        try {
            setError(null);
            const [paymentsData, methodsData] = await Promise.all([
                apiClient.getUserPayments(),
                apiClient.getPaymentMethods()
            ]);
            setPayments(paymentsData as any);
            setPaymentMethods(methodsData as any);
        } catch (error: any) {
            console.error('Error fetching billing data:', error);
            setError(error.message || 'Failed to load billing data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

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

    const handleAddCard = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Basic Validation
            const cleanCardNumber = newCard.number.replace(/\D/g, '');
            if (!luhnCheck(cleanCardNumber)) {
                alert('Invalid card number');
                return;
            }

            const [expMonth, expYear] = newCard.expiry.split('/').map(n => parseInt(n));
            if (!expMonth || !expYear || expMonth < 1 || expMonth > 12) {
                alert('Invalid expiry date');
                return;
            }

            const fullExpYear = expYear < 100 ? 2000 + expYear : expYear;

            // Check if expired
            const now = new Date();
            const currentYear = now.getFullYear();
            const currentMonth = now.getMonth() + 1; // 0-indexed

            if (fullExpYear < currentYear || (fullExpYear === currentYear && expMonth < currentMonth)) {
                alert('Card has expired');
                return;
            }

            const brand = detectCardBrand(cleanCardNumber);
            const last4 = cleanCardNumber.slice(-4);

            await apiClient.addPaymentMethod({
                brand: brand,
                last4,
                expMonth: expMonth,
                expYear: fullExpYear
            });

            setIsAddCardOpen(false);
            setNewCard({ number: '', expiry: '', cvc: '' });
            fetchData(); // Refresh list
        } catch (error) {
            console.error('Error adding card:', error);
            alert('Failed to add card');
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'COMPLETED': return 'text-green-600 bg-green-50';
            case 'PENDING': return 'text-yellow-600 bg-yellow-50';
            case 'FAILED': return 'text-red-600 bg-red-50';
            default: return 'text-gray-600 bg-gray-50';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'COMPLETED': return <CheckCircle size={16} />;
            case 'PENDING': return <Clock size={16} />;
            case 'FAILED': return <AlertCircle size={16} />;
            default: return <DollarSign size={16} />;
        }
    };

    if (loading) {
        return <div className="flex items-center justify-center h-full">Loading...</div>;
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-full gap-4">
                <div className="text-red-600 font-medium">{error}</div>
                <button
                    onClick={() => { setLoading(true); fetchData(); }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Billing & Payments</h1>

            {/* Payment Methods */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">Payment Methods</h2>
                    <button
                        onClick={() => setIsAddCardOpen(true)}
                        className="text-sm text-blue-600 font-medium hover:text-blue-700"
                    >
                        + Add New Card
                    </button>
                </div>

                <div className="space-y-3">
                    {paymentMethods.length === 0 ? (
                        <p className="text-gray-500 text-sm">No saved payment methods.</p>
                    ) : (
                        paymentMethods.map((method) => (
                            <div key={method.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-gray-50">
                                <div className="flex items-center gap-4">
                                    <CardIcon brand={method.brand} className="w-12 h-8" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-900 capitalize">{method.brand} ending in {method.last4}</p>
                                        <p className="text-xs text-gray-500">Expires {method.expMonth}/{method.expYear}</p>
                                    </div>
                                </div>
                                {method.isDefault && (
                                    <span className="text-xs font-medium text-gray-500 bg-white px-2 py-1 rounded border border-gray-200">Default</span>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Transaction History */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Transaction History</h2>

                {payments.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        No transactions found.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-gray-100 text-xs text-gray-500 uppercase">
                                    <th className="pb-3 font-semibold">Date</th>
                                    <th className="pb-3 font-semibold">Description</th>
                                    <th className="pb-3 font-semibold">Amount</th>
                                    <th className="pb-3 font-semibold">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {payments.map((payment) => (
                                    <tr key={payment.id} className="text-sm">
                                        <td className="py-4 text-gray-600">
                                            {new Date(payment.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="py-4 font-medium text-gray-900">
                                            {payment.appointment?.mentor?.name
                                                ? `Session with ${payment.appointment.mentor.name}`
                                                : 'Mentorship Session'}
                                        </td>
                                        <td className="py-4 text-gray-900 font-semibold">
                                            ${payment.amount.toFixed(2)}
                                        </td>
                                        <td className="py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                                                {getStatusIcon(payment.status)}
                                                {payment.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Add Card Modal */}
            {isAddCardOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-md w-full p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Add New Card</h3>
                        <form onSubmit={handleAddCard} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                                <div className="relative">
                                    <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type="text"
                                        placeholder="0000 0000 0000 0000"
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        value={newCard.number}
                                        onChange={(e) => setNewCard({ ...newCard, number: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                                    <input
                                        type="text"
                                        placeholder="MM/YY"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        value={newCard.expiry}
                                        onChange={(e) => setNewCard({ ...newCard, expiry: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">CVC</label>
                                    <input
                                        type="text"
                                        placeholder="123"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        value={newCard.cvc}
                                        onChange={(e) => setNewCard({ ...newCard, cvc: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="flex gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setIsAddCardOpen(false)}
                                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                                >
                                    Save Card
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Billing;
