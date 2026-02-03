'use client';

import React from 'react';
import AlertDialog from '@/components/ui/AlertDialog';

interface UnsavedChangesAlertProps {
    isOpen: boolean;
    onSaveAndExit?: () => void;
    onDiscardAndExit: () => void;
    onCancel: () => void;
    title?: string;
    description?: string;
    isSaving?: boolean;
    confirmLabel?: string;
    secondaryLabel?: string;
    cancelLabel?: string;
}

export default function UnsavedChangesAlert({
    isOpen,
    onSaveAndExit,
    onDiscardAndExit,
    onCancel,
    title = 'Unsaved Changes',
    description = 'You have unsaved changes. Do you want to save them before leaving?',
    isSaving = false,
    confirmLabel,
    secondaryLabel,
    cancelLabel,
}: UnsavedChangesAlertProps) {
    return (
        <AlertDialog
            isOpen={isOpen}
            title={title}
            description={description}
            variant="info"
            confirmLabel={isSaving ? 'Saving...' : (confirmLabel || 'Save & Exit')}
            onConfirm={onSaveAndExit || (() => { })}
            secondaryLabel={secondaryLabel || "Discard Changes"}
            onSecondary={onDiscardAndExit}
            cancelLabel={cancelLabel || "Keep Editing"}
            onCancel={onCancel}
        />
    );
}
