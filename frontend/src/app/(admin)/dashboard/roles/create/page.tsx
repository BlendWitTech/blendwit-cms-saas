'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import RoleForm from '@/components/roles/RoleForm';
import { useNotification } from '@/context/NotificationContext';
import { apiRequest } from '@/lib/api';

export default function CreateRolePage() {
    const router = useRouter();
    const { showToast } = useNotification();

    const handleSave = async (data: any) => {
        try {
            await apiRequest('/roles', {
                method: 'POST',
                body: data,
                skipNotification: true
            });
            showToast('Role created successfully', 'success');
            router.push('/dashboard/roles');
        } catch (error: any) {
            showToast(error.message || 'Failed to create role', 'error');
            throw error;
        }
    };

    return (
        <RoleForm
            title="Create New Role"
            subtitle="Define a new role and its permissions."
            onSave={handleSave}
        />
    );
}
