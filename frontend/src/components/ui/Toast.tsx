import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    CheckCircleIcon,
    XCircleIcon,
    ExclamationTriangleIcon,
    InformationCircleIcon,
    XMarkIcon
} from '@heroicons/react/24/outline';
import { NotificationType } from '@/context/NotificationContext';

interface ToastProps {
    message: string;
    type: NotificationType;
    duration?: number;
    onClose: () => void;
}

const icons = {
    success: <CheckCircleIcon className="h-6 w-6 text-emerald-500" />,
    error: <XCircleIcon className="h-6 w-6 text-red-500" />,
    warning: <ExclamationTriangleIcon className="h-6 w-6 text-amber-500" />,
    info: <InformationCircleIcon className="h-6 w-6 text-blue-500" />,
};

const styles = {
    success: 'bg-white border-emerald-100 shadow-emerald-500/10',
    error: 'bg-white border-red-100 shadow-red-500/10',
    warning: 'bg-white border-amber-100 shadow-amber-500/10',
    info: 'bg-white border-blue-100 shadow-blue-500/10',
};

export default function Toast({ message, type, duration = 5000, onClose }: ToastProps) {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className={`relative flex items-center gap-4 px-5 py-4 min-w-[320px] max-w-md rounded-[1.5rem] border shadow-2xl backdrop-blur-3xl overflow-hidden ${styles[type]} pointer-events-auto`}
        >
            {/* Progress Bar */}
            <motion.div
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{ duration: duration / 1000, ease: 'linear' }}
                className={`absolute bottom-0 left-0 h-1 ${type === 'success' ? 'bg-emerald-500' :
                    type === 'error' ? 'bg-red-500' :
                        type === 'warning' ? 'bg-amber-500' :
                            'bg-blue-500'
                    }`}
            />

            <div className="flex-shrink-0 p-2 bg-slate-50 rounded-full">
                {icons[type]}
            </div>
            <div className="flex-grow">
                <p className="font-display font-bold text-slate-900 text-sm">{message}</p>
            </div>
            <button
                onClick={onClose}
                className="flex-shrink-0 p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
            >
                <XMarkIcon className="h-4 w-4" />
            </button>
        </motion.div>
    );
}
