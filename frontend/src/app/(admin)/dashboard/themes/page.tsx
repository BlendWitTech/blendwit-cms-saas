'use client';

import { useState, useEffect } from 'react';
import {
    CloudArrowUpIcon,
    SwatchIcon,
    CheckCircleIcon
} from '@heroicons/react/24/outline';
import { apiRequest } from '@/lib/api';
import { useNotification } from '@/context/NotificationContext';

export default function ThemesPage() {
    const [themes, setThemes] = useState<string[]>([]);
    const [activeTheme, setActiveTheme] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const [isSettingUp, setIsSettingUp] = useState<string | null>(null);
    const { showToast } = useNotification();

    useEffect(() => {
        fetchThemes();
    }, []);

    const fetchThemes = async () => {
        try {
            setIsLoading(true);
            const [themesData, activeData] = await Promise.all([
                apiRequest('/themes'),
                apiRequest('/themes/active')
            ]);
            setThemes(themesData || []);
            setActiveTheme(activeData?.activeTheme || null);
        } catch (error) {
            console.error('Failed to fetch themes:', error);
            showToast('Failed to load themes', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (!file.name.endsWith('.zip')) {
            showToast('Please upload a .zip file', 'error');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            setIsUploading(true);
            // We need to use fetch directly here because apiRequest might not handle FormData correctly 
            // if it assumes JSON by default (depending on implementation).
            // Checking apiRequest implementation would be ideal, but standard fetch is safe for FormData.
            // Assuming apiRequest typically handles JSON headers.

            // Let's try to use the token from localStorage if apiRequest uses it.
            const token = localStorage.getItem('token');
            const headers: HeadersInit = {};
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const response = await fetch('http://127.0.0.1:3001/themes/upload', {
                method: 'POST',
                headers: headers,
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Upload failed');
            }

            const data = await response.json();
            showToast('Theme uploaded successfully', 'success');
            fetchThemes();
        } catch (error) {
            console.error('Failed to upload theme:', error);
            showToast('Failed to upload theme', 'error');
        } finally {
            setIsUploading(false);
            // Reset input
            event.target.value = '';
        }
    };

    const handleSetup = async (themeName: string) => {
        try {
            setIsSettingUp(themeName);
            const token = localStorage.getItem('token');
            const response = await fetch(`http://127.0.0.1:3001/themes/${themeName}/setup`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Setup failed');
            }

            const r = data.results || {};
            const summary = [
                r.pages ? `${r.pages} Pages` : null,
                r.menus ? `${r.menus} Menus` : null,
                r.projects ? `${r.projects} Projects` : null,
                r.services ? `${r.services} Services` : null,
                r.team ? `${r.team} Team Members` : null,
            ].filter(Boolean).join(', ');

            showToast(`Theme ${themeName} setup successfully! Created: ${summary}`, 'success');
        } catch (error: any) {
            console.error('Setup failed:', error);
            showToast(error.message, 'error');
        } finally {
            setIsSettingUp(null);
        }
    };

    const handleActivate = async (themeName: string) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://127.0.0.1:3001/themes/${themeName}/activate`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Activation failed');
            }

            setActiveTheme(themeName);
            showToast(`Theme ${themeName} activated!`, 'success');
        } catch (error: any) {
            console.error('Activation failed:', error);
            showToast(error.message, 'error');
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-display">
                        Theme <span className="text-blue-600">Management</span>
                    </h1>
                    <p className="mt-1 text-xs text-slate-500 font-semibold tracking-tight">
                        Upload and manage your site themes.
                    </p>
                </div>
                <div className="relative">
                    <input
                        type="file"
                        accept=".zip"
                        onChange={handleFileUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        disabled={isUploading}
                    />
                    <button
                        className="px-6 py-2.5 rounded-xl bg-blue-600 shadow-lg shadow-blue-600/30 text-white font-bold text-xs uppercase tracking-widest hover:bg-blue-700 hover:-translate-y-0.5 transition-all active:translate-y-0 active:scale-95 flex items-center gap-2"
                        disabled={isUploading}
                    >
                        {isUploading ? (
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <CloudArrowUpIcon className="h-4 w-4" />
                        )}
                        {isUploading ? 'Uploading...' : 'Upload Theme'}
                    </button>
                </div>
            </div>

            {/* List */}
            <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] border border-slate-200/60 shadow-xl shadow-slate-200/20 overflow-hidden">
                {isLoading ? (
                    <div className="p-12 flex justify-center">
                        <div className="w-8 h-8 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin"></div>
                    </div>
                ) : themes.length === 0 ? (
                    <div className="p-12 text-center">
                        <div className="w-16 h-16 rounded-2xl bg-slate-50 text-slate-300 flex items-center justify-center mx-auto mb-4">
                            <SwatchIcon className="w-8 h-8" />
                        </div>
                        <p className="text-slate-400 font-medium">No themes found. Upload a .zip file to get started.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-8">
                        {themes.map((themeName) => (
                            <div key={themeName} className="group relative bg-white border border-slate-100 rounded-3xl p-6 hover:shadow-xl hover:shadow-blue-900/5 hover:border-blue-100 transition-all duration-300">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 text-blue-600 flex items-center justify-center shadow-sm">
                                        <SwatchIcon className="w-6 h-6" />
                                    </div>
                                    <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-opacity ${activeTheme === themeName ? 'bg-blue-600 text-white' : 'bg-green-50 text-green-600 opacity-0 group-hover:opacity-100'}`}>
                                        <CheckCircleIcon className="w-3.5 h-3.5" />
                                        {activeTheme === themeName ? 'Active' : 'Installed'}
                                    </div>
                                </div>

                                <h3 className="text-lg font-bold text-slate-900 mb-1">{themeName}</h3>
                                <p className="text-xs text-slate-500 mb-6">Installed theme folder</p>

                                <div className="flex items-center gap-2 pt-4 border-t border-slate-50">
                                    <button
                                        className="flex-1 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                                        onClick={() => handleSetup(themeName)}
                                        disabled={isSettingUp === themeName}
                                    >
                                        {isSettingUp === themeName && <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                                        {isSettingUp === themeName ? 'Setting Up...' : 'Setup'}
                                    </button>
                                    <button
                                        className={`flex-1 px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTheme === themeName ? 'bg-blue-50 text-blue-600 border border-blue-100 cursor-default' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'}`}
                                        onClick={() => activeTheme !== themeName && handleActivate(themeName)}
                                        disabled={activeTheme === themeName}
                                    >
                                        {activeTheme === themeName ? 'Active' : 'Activate'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
