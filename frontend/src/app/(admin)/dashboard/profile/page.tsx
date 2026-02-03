'use client';

import React, { useState, useEffect } from 'react';
import {
    UserCircleIcon,
    EnvelopeIcon,
    ShieldCheckIcon,
    CameraIcon,
    KeyIcon,
    BellIcon,
    FingerPrintIcon,
    Cog6ToothIcon,
    ChevronRightIcon,
    CalendarIcon,
    IdentificationIcon,
    LockClosedIcon,
    ExclamationTriangleIcon,
    CheckCircleIcon,
    InformationCircleIcon
} from '@heroicons/react/24/outline';
import { apiRequest } from '@/lib/api';
import Alert from '@/components/ui/Alert';

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ');
}

export default function ProfilePage() {
    const [user, setUser] = useState<any>(null);
    const [logs, setLogs] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('general');
    const [is2FAModalOpen, setIs2FAModalOpen] = useState(false);
    const [qrCodeUrl, setQrCodeUrl] = useState('');
    const [twoFactorToken, setTwoFactorToken] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        bio: '',
        email: '',
        preferences: {
            timezone: 'UTC+0',
            language: 'English',
            notifications: true
        }
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const [userData, logsData] = await Promise.all([
                    apiRequest('/auth/profile'),
                    apiRequest('/users/profile/logs')
                ]);

                setUser(userData);
                setLogs(Array.isArray(logsData) ? logsData : []);
                setFormData({
                    name: userData.name || '',
                    bio: userData.bio || '',
                    email: userData.email || '',
                    preferences: userData.preferences || {
                        timezone: 'UTC+0',
                        language: 'English',
                        notifications: true
                    }
                });
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleEnable2FA = async () => {
        try {
            const data = await apiRequest('/auth/2fa/generate');
            setQrCodeUrl(data.qrCode);
            setIs2FAModalOpen(true);
        } catch (error) {
            console.error('Failed to generate 2FA', error);
        }
    };

    const handleVerify2FA = async () => {
        try {
            const data = await apiRequest('/auth/2fa/verify', {
                method: 'POST',
                body: { token: twoFactorToken }
            });
            if (data.success) {
                setIs2FAModalOpen(false);
                setUser({ ...user, twoFactorEnabled: true });
            }
        } catch (error) {
            console.error('Failed to verify 2FA', error);
        }
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await apiRequest('/users/profile', {
                method: 'PATCH',
                body: formData,
            });
        } catch (error) {
            console.error('Update failed:', error);
        }
    };

    const getLogIcon = (status: string, action: string) => {
        if (status === 'DANGER') return ExclamationTriangleIcon;
        if (status === 'WARNING') return LockClosedIcon;
        if (action === 'LOGIN_SUCCESS') return FingerPrintIcon;
        return InformationCircleIcon;
    };

    const getLogStyles = (status: string) => {
        switch (status) {
            case 'DANGER': return 'bg-red-50 text-red-600 ring-red-100';
            case 'WARNING': return 'bg-amber-50 text-amber-600 ring-amber-100';
            default: return 'bg-slate-50 text-slate-600 ring-slate-100';
        }
    };

    if (isLoading) return <div className="space-y-4 animate-pulse"><div className="h-64 bg-slate-100 rounded-[2rem]" /><div className="h-96 bg-slate-100 rounded-[2rem]" /></div>;

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-20">
            {/* 2FA Modal */}
            {is2FAModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl space-y-6 scale-in-center">
                        <div className="text-center">
                            <h3 className="text-xl font-bold text-slate-900">Scan QR Code</h3>
                            <p className="text-sm text-slate-500 mt-2">Use Google Authenticator to scan this code.</p>
                        </div>
                        <div className="flex justify-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
                            {qrCodeUrl && <img src={qrCodeUrl} alt="2FA" className="h-40 w-40 object-contain" />}
                        </div>
                        <input
                            type="text"
                            placeholder="000 000"
                            value={twoFactorToken}
                            onChange={(e) => setTwoFactorToken(e.target.value)}
                            className="w-full text-center text-xl font-mono py-3 border rounded-xl"
                        />
                        <div className="flex gap-3">
                            <button onClick={() => setIs2FAModalOpen(false)} className="flex-1 py-3 text-sm font-bold text-slate-500 hover:bg-slate-50 rounded-xl">Cancel</button>
                            <button onClick={handleVerify2FA} className="flex-1 py-3 text-sm font-bold bg-blue-600 text-white rounded-xl hover:bg-blue-700">Verify</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Profile Header Card */}
            <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden relative">
                {/* Cover Gradient */}
                <div className="h-48 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 relative">
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                </div>

                <div className="px-10 pb-10 flex flex-col lg:flex-row items-end lg:items-center gap-8 -mt-16 relative z-10">
                    {/* Avatar */}
                    <div className="relative group">
                        <div className="h-32 w-32 rounded-[2rem] bg-white p-1.5 shadow-xl ring-1 ring-slate-100 rotate-3 transition-transform group-hover:rotate-0 duration-300">
                            <div className="h-full w-full rounded-[1.7rem] bg-slate-100 flex items-center justify-center text-4xl font-bold text-slate-400 overflow-hidden">
                                {user?.avatar ? <img src={user.avatar} className="w-full h-full object-cover" /> : formData.name.charAt(0)}
                            </div>
                        </div>
                        <button className="absolute bottom-0 right-0 p-2.5 bg-slate-900 text-white rounded-xl shadow-lg hover:scale-110 transition-transform">
                            <CameraIcon className="h-4 w-4" />
                        </button>
                    </div>

                    <div className="flex-1 mb-2">
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-bold text-slate-900">{formData.name}</h1>
                            {user?.twoFactorEnabled && <ShieldCheckIcon className="h-6 w-6 text-emerald-500" title="2FA Enabled" />}
                        </div>
                        <p className="text-slate-500 font-medium">{formData.email}</p>
                    </div>

                    <div className="flex gap-3 mb-2">
                        {!user?.twoFactorEnabled && (
                            <button
                                onClick={handleEnable2FA}
                                className="px-5 py-2.5 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-bold border border-emerald-100 hover:bg-emerald-100 transition-colors flex items-center gap-2"
                            >
                                <ShieldCheckIcon className="h-4 w-4" />
                                Enable 2FA
                            </button>
                        )}
                        <span className="px-5 py-2.5 bg-slate-50 text-slate-600 rounded-xl text-xs font-bold border border-slate-200 flex items-center gap-2">
                            <IdentificationIcon className="h-4 w-4" />
                            {user?.role?.name || 'Member'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Content Tabs */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Sidebar Nav */}
                <div className="lg:col-span-1 space-y-2">
                    {[
                        { id: 'general', label: 'General Profile', icon: UserCircleIcon },
                        { id: 'preferences', label: 'Preferences', icon: Cog6ToothIcon },
                        { id: 'activity', label: 'Audit Logs', icon: LockClosedIcon },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={classNames(
                                "w-full flex items-center gap-3 p-4 rounded-2xl transition-all text-sm font-bold",
                                activeTab === tab.id
                                    ? "bg-slate-900 text-white shadow-lg shadow-slate-900/10"
                                    : "bg-white text-slate-500 hover:text-slate-900 hover:bg-slate-50 border border-slate-200"
                            )}
                        >
                            <tab.icon className="h-5 w-5" />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Main Content Area */}
                <div className="lg:col-span-3">
                    {activeTab === 'general' && (
                        <div className="bg-white rounded-[2.5rem] p-10 border border-slate-200 shadow-sm space-y-8 animate-in slide-in-from-bottom-4 duration-500">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Full Name</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Email Address</label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        disabled
                                        className="w-full bg-slate-100 border border-slate-200 text-slate-500 rounded-2xl p-4 text-sm font-bold cursor-not-allowed"
                                    />
                                </div>
                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Bio</label>
                                    <textarea
                                        rows={4}
                                        value={formData.bio}
                                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm font-medium focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all resize-none"
                                        placeholder="Tell us about yourself..."
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end pt-4 border-t border-slate-100">
                                <button onClick={handleUpdate} className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold text-sm hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20 active:scale-95">
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'preferences' && (
                        <div className="bg-white rounded-[2.5rem] p-10 border border-slate-200 shadow-sm space-y-8 animate-in slide-in-from-bottom-4 duration-500">
                            <div className="space-y-6">
                                <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-4">Application Settings</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Timezone</label>
                                        <select
                                            value={formData.preferences.timezone}
                                            onChange={(e) => setFormData({ ...formData, preferences: { ...formData.preferences, timezone: e.target.value } })}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm font-bold outline-none"
                                        >
                                            <option>UTC+0 (London)</option>
                                            <option>UTC+5:30 (Mumbai)</option>
                                            <option>UTC-8 (Pacific)</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Language</label>
                                        <select
                                            value={formData.preferences.language}
                                            onChange={(e) => setFormData({ ...formData, preferences: { ...formData.preferences, language: e.target.value } })}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm font-bold outline-none"
                                        >
                                            <option>English</option>
                                            <option>Spanish</option>
                                            <option>French</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-end pt-4 border-t border-slate-100">
                                <button onClick={handleUpdate} className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold text-sm hover:bg-slate-800 transition-colors">
                                    Update Preferences
                                </button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'activity' && (
                        <div className="bg-white rounded-[2.5rem] overflow-hidden border border-slate-200 shadow-sm animate-in slide-in-from-bottom-4 duration-500">
                            <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                                <h3 className="text-lg font-bold text-slate-900">Security Audit Log</h3>
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{logs.length} Events</span>
                            </div>
                            <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
                                {logs.length === 0 ? (
                                    <div className="p-20 text-center text-slate-400">
                                        <FingerPrintIcon className="h-12 w-12 mx-auto opacity-20 mb-4" />
                                        <p className="font-medium">No activity recorded yet.</p>
                                    </div>
                                ) : (
                                    logs.map((log) => {
                                        const Icon = getLogIcon(log.status, log.action);
                                        const style = getLogStyles(log.status);

                                        return (
                                            <div key={log.id} className="p-6 flex items-center gap-4 hover:bg-slate-50 transition-colors group">
                                                <div className={`h-12 w-12 rounded-2xl flex items-center justify-center ring-1 ${style}`}>
                                                    <Icon className="h-6 w-6" />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between">
                                                        <p className="text-sm font-bold text-slate-900">{log.action.replace(/_/g, ' ')}</p>
                                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-100 px-2 py-1 rounded-lg">
                                                            {new Date(log.createdAt).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        {log.status === 'DANGER' && <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />}
                                                        <p className="text-xs font-medium text-slate-500">
                                                            {new Date(log.createdAt).toLocaleTimeString()}
                                                            {log.metadata?.attempts ? ` • ${log.metadata.attempts} Failed Attempts` : ''}
                                                            {log.metadata?.ip ? ` • IP: ${log.metadata.ip}` : ''}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
