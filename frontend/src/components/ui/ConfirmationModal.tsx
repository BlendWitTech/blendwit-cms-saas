import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { ExclamationTriangleIcon, CheckCircleIcon, InformationCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm?: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    variant?: 'danger' | 'success' | 'info';
    isAlert?: boolean; // If true, only show one button (Close/OK)
}

export default function ConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    variant = 'danger',
    isAlert = false
}: ConfirmationModalProps) {
    const getIcon = () => {
        switch (variant) {
            case 'danger':
                return <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />;
            case 'success':
                return <CheckCircleIcon className="h-6 w-6 text-emerald-600" />;
            default:
                return <InformationCircleIcon className="h-6 w-6 text-blue-600" />;
        }
    };

    const getColors = () => {
        switch (variant) {
            case 'danger':
                return {
                    iconBg: 'bg-red-100',
                    button: 'bg-red-600 hover:bg-red-700 shadow-red-500/20',
                    title: 'text-red-900'
                };
            case 'success':
                return {
                    iconBg: 'bg-emerald-100',
                    button: 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20',
                    title: 'text-emerald-900'
                };
            default:
                return {
                    iconBg: 'bg-blue-100',
                    button: 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/20',
                    title: 'text-blue-900'
                };
        }
    };

    const colors = getColors();

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6">
            <div
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity animate-in fade-in duration-300"
                onClick={onClose}
            />

            <div className="relative w-full max-w-md overflow-hidden rounded-[2rem] bg-white shadow-2xl shadow-slate-900/20 animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 ring-1 ring-slate-900/5">
                <div className="p-6">
                    <div className="flex items-start gap-4">
                        <div className={`flex-shrink-0 p-3 rounded-2xl ${colors.iconBg} ring-1 ring-inset ring-black/5`}>
                            {getIcon()}
                        </div>
                        <div className="flex-1 pt-1">
                            <h3 className={`text-lg font-bold ${colors.title} font-display leading-6`}>
                                {title}
                            </h3>
                            <div className="mt-2">
                                <p className="text-sm font-medium text-slate-500 leading-relaxed">
                                    {message}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="flex-shrink-0 -mr-2 -mt-2 p-2 rounded-xl text-slate-400 hover:bg-slate-50 hover:text-slate-500 transition-colors"
                        >
                            <XMarkIcon className="h-5 w-5" />
                        </button>
                    </div>

                    <div className="mt-8 flex items-center justify-end gap-3">
                        {!isAlert && (
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors"
                            >
                                {cancelText}
                            </button>
                        )}
                        <button
                            type="button"
                            onClick={() => {
                                if (onConfirm) onConfirm();
                                if (isAlert) onClose();
                            }}
                            className={`px-5 py-2.5 rounded-xl text-xs font-bold text-white shadow-lg transition-all active:scale-95 ${colors.button}`}
                        >
                            {isAlert ? 'Okay, Got it' : confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
