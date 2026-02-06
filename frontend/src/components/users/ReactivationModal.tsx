import React, { useState, useEffect } from 'react';
import {
    XMarkIcon,
    ArrowPathIcon,
    EnvelopeIcon,
    ShieldCheckIcon,
    ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

interface ReactivationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onReactivate: (data: { newEmail?: string }) => void;
    user: any;
    currentUser: any;
}

export default function ReactivationModal({ isOpen, onClose, onReactivate, user, currentUser }: ReactivationModalProps) {
    const [newEmail, setNewEmail] = useState('');
    const [confirmEmail, setConfirmEmail] = useState('');
    const [changeEmail, setChangeEmail] = useState(false);
    const [error, setError] = useState('');

    const [mounted, setMounted] = React.useState(false);

    const isSuperAdmin = currentUser?.role?.name === 'Super Admin';

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (changeEmail) {
            if (newEmail !== confirmEmail) {
                setError('Emails do not match.');
                return;
            }
            if (!newEmail.includes('@')) {
                setError('Invalid email address.');
                return;
            }
            onReactivate({ newEmail });
        } else {
            onReactivate({});
        }
    };

    useEffect(() => {
        setMounted(true);
        if (!isOpen) {
            setNewEmail('');
            setConfirmEmail('');
            setChangeEmail(false);
            setError('');
        }
        return () => setMounted(false);
    }, [isOpen]);

    if (!isOpen || !mounted || !user) return null;

    const { createPortal } = require('react-dom');

    const modalContent = (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-md overflow-hidden rounded-[2rem] bg-white shadow-2xl animate-in zoom-in-95 duration-300 border border-slate-100">
                <div className="p-8">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="p-3 bg-emerald-100 rounded-2xl">
                            <ArrowPathIcon className="h-6 w-6 text-emerald-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-900 font-display">Reactivate Account</h2>
                            <p className="text-xs font-semibold text-slate-500">Restoring access for {user.name || user.email}</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {isSuperAdmin && (
                            <div className="space-y-4">
                                <label className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 cursor-pointer group transition-all hover:bg-white hover:shadow-sm">
                                    <input
                                        type="checkbox"
                                        checked={changeEmail}
                                        onChange={(e) => setChangeEmail(e.target.checked)}
                                        className="h-5 w-5 rounded-lg border-slate-300 text-blue-600 focus:ring-blue-600/20"
                                    />
                                    <div>
                                        <p className="text-sm font-bold text-slate-900">Change Email Address</p>
                                        <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-tight italic">Recommended if the user has lost access to their old email.</p>
                                    </div>
                                </label>

                                {changeEmail && (
                                    <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
                                        <div className="relative group">
                                            <EnvelopeIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                                            <input
                                                type="email"
                                                required
                                                value={newEmail}
                                                onChange={(e) => setNewEmail(e.target.value)}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-11 pr-4 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white focus:border-blue-600 transition-all"
                                                placeholder="New Email Address"
                                            />
                                        </div>
                                        <div className="relative group">
                                            <EnvelopeIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                                            <input
                                                type="email"
                                                required
                                                value={confirmEmail}
                                                onChange={(e) => setConfirmEmail(e.target.value)}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-11 pr-4 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white focus:border-blue-600 transition-all"
                                                placeholder="Confirm New Email"
                                            />
                                        </div>
                                        {error && <p className="text-[10px] font-bold text-red-600 uppercase tracking-widest text-center">{error}</p>}
                                    </div>
                                )}
                            </div>
                        )}

                        {!isSuperAdmin && (
                            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex gap-3">
                                <ExclamationTriangleIcon className="h-5 w-5 text-amber-600 shrink-0" />
                                <p className="text-[11px] font-medium text-amber-800 leading-relaxed italic">
                                    You can restore this account, but only a **Super Admin** can change the email address during reactivation.
                                </p>
                            </div>
                        )}

                        <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 flex gap-3">
                            <ShieldCheckIcon className="h-5 w-5 text-blue-600 shrink-0" />
                            <p className="text-[11px] font-medium text-blue-800 leading-relaxed italic">
                                Reactivating this account will instantly restore all associated data and permissions.
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 py-3 text-sm font-bold text-slate-500 hover:text-slate-900 transition-all font-display"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="flex-[2] bg-emerald-600 text-white py-3 rounded-2xl font-bold text-sm shadow-lg shadow-emerald-500/20 hover:bg-emerald-700 transition-all active:scale-95 font-display"
                            >
                                Restore Account
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
}
