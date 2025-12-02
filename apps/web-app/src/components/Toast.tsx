import { useEffect, useState } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
    id: number;
    message: string;
    type: ToastType;
}

let toastId = 0;
const toastListeners: Array<(toast: Toast) => void> = [];

export const showToast = (message: string, type: ToastType = 'info') => {
    const toast: Toast = {
        id: toastId++,
        message,
        type,
    };
    toastListeners.forEach(listener => listener(toast));
};

export const ToastContainer = () => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    useEffect(() => {
        const listener = (toast: Toast) => {
            setToasts(prev => [...prev, toast]);
            setTimeout(() => {
                setToasts(prev => prev.filter(t => t.id !== toast.id));
            }, 5000);
        };

        toastListeners.push(listener);
        return () => {
            const index = toastListeners.indexOf(listener);
            if (index > -1) toastListeners.splice(index, 1);
        };
    }, []);

    const removeToast = (id: number) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    };

    return (
        <div className="fixed top-4 right-4 z-50 space-y-2">
            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg min-w-[300px] max-w-md animate-slide-in ${toast.type === 'success'
                            ? 'bg-green-50 border border-green-200 text-green-800'
                            : toast.type === 'error'
                                ? 'bg-red-50 border border-red-200 text-red-800'
                                : 'bg-blue-50 border border-blue-200 text-blue-800'
                        }`}
                >
                    {toast.type === 'success' && <CheckCircle size={20} className="flex-shrink-0" />}
                    {toast.type === 'error' && <AlertCircle size={20} className="flex-shrink-0" />}
                    {toast.type === 'info' && <Info size={20} className="flex-shrink-0" />}
                    <p className="flex-1 text-sm font-medium">{toast.message}</p>
                    <button
                        onClick={() => removeToast(toast.id)}
                        className="flex-shrink-0 hover:opacity-70 transition-opacity"
                    >
                        <X size={16} />
                    </button>
                </div>
            ))}
        </div>
    );
};
