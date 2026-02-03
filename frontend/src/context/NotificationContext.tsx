'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

export interface Notification {
    id: string;
    message: string;
    type: NotificationType;
    duration?: number;
}

interface NotificationContextType {
    notifications: Notification[];
    showToast: (message: string, type: NotificationType, duration?: number) => void;
    removeNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const removeNotification = useCallback((id: string) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, []);

    const showToast = useCallback((message: string, type: NotificationType, duration = 5000) => {
        const id = uuidv4();
        setNotifications((prev) => [...prev, { id, message, type, duration }]);

        if (duration > 0) {
            setTimeout(() => {
                removeNotification(id);
            }, duration);
        }
    }, [removeNotification]);

    React.useEffect(() => {
        const handleApiNotification = (event: any) => {
            const { message, type, duration } = event.detail;
            showToast(message, type, duration);
        };

        window.addEventListener('api-notification', handleApiNotification);
        return () => window.removeEventListener('api-notification', handleApiNotification);
    }, [showToast]);

    return (
        <NotificationContext.Provider value={{ notifications, showToast, removeNotification }}>
            {children}
        </NotificationContext.Provider>
    );
}

export function useNotification() {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
}
