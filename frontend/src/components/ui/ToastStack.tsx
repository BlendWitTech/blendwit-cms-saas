'use client';

import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { useNotification } from '@/context/NotificationContext';
import Toast from './Toast';

export default function ToastStack() {
    const { notifications, removeNotification } = useNotification();

    return (
        <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
            <AnimatePresence mode="popLayout">
                {notifications.map((notification) => (
                    <Toast
                        key={notification.id}
                        message={notification.message}
                        type={notification.type}
                        onClose={() => removeNotification(notification.id)}
                    />
                ))}
            </AnimatePresence>
        </div>
    );
}
