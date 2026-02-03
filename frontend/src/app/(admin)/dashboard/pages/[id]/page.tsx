'use client';

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import {
    ArrowLeftIcon,
    CloudArrowUpIcon,
    ExclamationTriangleIcon,
    SwatchIcon
} from '@heroicons/react/24/outline';
import UnsavedChangesAlert from '@/components/ui/UnsavedChangesAlert';
import ThemeNotDetected from '@/components/admin/pages/ThemeNotDetected';
import { useNotification } from '@/context/NotificationContext';
import { apiRequest } from '@/lib/api';

export default function EditPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const { showToast } = useNotification();
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [showUnsavedAlert, setShowUnsavedAlert] = useState(false);
    const [isMissingTheme, setIsMissingTheme] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        content: '',
        description: '',
        status: 'DRAFT'
    });

    useEffect(() => {
        fetchPage();
    }, []);

    const fetchPage = async () => {
        try {
            const data = await apiRequest(`/pages/${id}`, { skipNotification: true });
            setFormData({
                title: data.title,
                slug: data.slug,
                content: data.content || '',
                description: data.description || '',
                status: data.status
            });
        } catch (error: any) {
            // If 404, it means the page doesn't exist, which in this workflow implies 
            // the theme hasn't been uploaded/imported to generate these pages.
            // We swallow the console error for 404s to avoid alarming logs.
            const errorMessage = error?.message?.toLowerCase() || '';
            if (error?.status === 404 || errorMessage.includes('not found') || errorMessage.includes('404')) {
                setIsMissingTheme(true);
            } else {
                console.error(error);
                showToast('Failed to fetch page data', 'error');
                router.back();
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await apiRequest(`/pages/${id}`, {
                method: 'PATCH',
                body: formData,
                skipNotification: true
            });
            showToast('Page updated successfully', 'success');
        } catch (error: any) {
            showToast(error.message || 'Failed to update page', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return <div className="p-8 text-center text-slate-500 font-bold">Loading editor...</div>;
    }

    // Missing Theme / Page Not Found UI
    if (isMissingTheme) {
        return <ThemeNotDetected />;
    }

    return (
        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
            <UnsavedChangesAlert
                isOpen={showUnsavedAlert}
                onSaveAndExit={async () => {
                    await handleSave();
                }}
                onDiscardAndExit={() => router.back()}
                onCancel={() => setShowUnsavedAlert(false)}
                isSaving={isSaving}
            />

            {/* Header */}
            <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200/50 shadow-sm sticky top-4 z-10">
                <div className="flex items-center gap-4">
                    <button onClick={() => router.back()} className="p-2 hover:bg-slate-50 rounded-xl text-slate-500 transition-colors">
                        <ArrowLeftIcon className="h-5 w-5" />
                    </button>
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Editing Page</p>
                        <h1 className="text-xl font-bold text-slate-900 font-display">{formData.title || 'Untitled Page'}</h1>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <select
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        className="bg-slate-50 border-none text-xs font-bold text-slate-600 py-2.5 px-4 rounded-xl focus:ring-0 cursor-pointer"
                    >
                        <option value="DRAFT">Draft</option>
                        <option value="PUBLISHED">Published</option>
                    </select>
                    <button onClick={handleSave} disabled={isSaving} className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">
                        <CloudArrowUpIcon className="h-4 w-4" />
                        {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    {/* Title & Slug */}
                    <div className="bg-white rounded-2xl p-8 border border-slate-200/50 shadow-sm space-y-6">
                        <div className="space-y-3">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-2">Page Title</label>
                            <input
                                type="text"
                                placeholder="Enter page title..."
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value, slug: e.target.value.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '') })}
                                className="w-full text-3xl font-bold text-slate-900 placeholder:text-slate-200 border-none focus:ring-0 p-0 font-display bg-transparent"
                            />
                        </div>
                        <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 w-fit">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">URL Slug</span>
                            <span className="text-slate-300 font-mono text-xs">/</span>
                            <input
                                value={formData.slug}
                                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                className="bg-transparent border-none focus:ring-0 p-0 text-blue-600 font-bold text-xs min-w-[200px]"
                            />
                        </div>
                    </div>

                    {/* Content */}
                    <div className="bg-white rounded-2xl p-6 border border-slate-200/50 shadow-sm space-y-4 min-h-[500px]">
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Page Content</h3>
                        <textarea
                            value={formData.content}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                            className="w-full h-[400px] bg-slate-50 border border-slate-200 rounded-xl py-4 px-5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-600/10 resize-none font-mono leading-relaxed"
                            placeholder="Type page content here (HTML/Markdown support pending)..."
                        />
                    </div>
                </div>

                <div className="space-y-6">
                    {/* SEO Settings */}
                    <div className="bg-white rounded-2xl p-6 border border-slate-200/50 shadow-sm space-y-4">
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            Metadata
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Meta Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    rows={4}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-600/10 resize-none mt-2"
                                    placeholder="Brief description for search engines..."
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
