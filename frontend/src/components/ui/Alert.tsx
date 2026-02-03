'use client';

import React from 'react';
import {
    CheckCircleIcon,
    XCircleIcon,
    ExclamationTriangleIcon,
    InformationCircleIcon
} from '@heroicons/react/24/outline';

type AlertType = 'success' | 'error' | 'info' | 'warning';

interface AlertProps {
    message: string;
    type: AlertType;
    className?: string;
}

const icons = {
    success: <CheckCircleIcon className="h-5 w-5" />,
    error: <XCircleIcon className="h-5 w-5" />,
    warning: <ExclamationTriangleIcon className="h-5 w-5" />,
    info: <InformationCircleIcon className="h-5 w-5" />,
};

const styles = {
    success: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    error: 'bg-red-50 text-red-700 border-red-100',
    warning: 'bg-amber-50 text-amber-700 border-amber-100',
    info: 'bg-blue-50 text-blue-700 border-blue-100',
};

export default function Alert({ message, type, className = '' }: AlertProps) {
    return (
        <div className={`flex items-start gap-3 p-4 rounded-2xl border ${styles[type]} ${className}`}>
            <div className="flex-shrink-0 mt-0.5">
                {icons[type]}
            </div>
            <div>
                <p className="text-sm font-bold leading-relaxed">{message}</p>
            </div>
        </div>
    );
}
