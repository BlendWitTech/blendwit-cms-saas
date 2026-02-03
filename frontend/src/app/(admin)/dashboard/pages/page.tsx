'use client';

import React, { useState, useEffect } from 'react';
import {
    DocumentTextIcon,
    PencilSquareIcon,
    GlobeAltIcon,
    HashtagIcon,
    Square3Stack3DIcon,
    HomeIcon,
    MagnifyingGlassIcon,
    ArrowTopRightOnSquareIcon
} from '@heroicons/react/24/outline';
import { apiRequest } from '@/lib/api';
import { useNotification } from '@/context/NotificationContext';

interface PageItem {
    id: string;
    title: string;
    slug: string;
    type: 'static' | 'dynamic' | 'category' | 'tag';
    lastUpdated?: string;
    seo?: any;
}

export default function PagesIndex() {
    const [pages, setPages] = useState<PageItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [editingPage, setEditingPage] = useState<PageItem | null>(null);
    const [seoFormData, setSeoFormData] = useState({
        title: '',
        description: '',
        keywords: ''
    });
    const [isSaving, setIsSaving] = useState(false);
    const { showToast } = useNotification();

    useEffect(() => {
        fetchPages();
    }, []);

    const fetchPages = async () => {
        setIsLoading(true);
        try {
            // Define system static pages
            const systemPages: PageItem[] = [
                { id: 'home', title: 'Home Page', slug: '/', type: 'static' },
                { id: 'projects', title: 'Projects Portfolio', slug: '/projects', type: 'static' },
                { id: 'blog', title: 'Blog Engine', slug: '/blog', type: 'static' }
            ];

            // Fetch dynamic pages, categories, and tags
            const [dynamicPages, categories, tags] = await Promise.all([
                apiRequest('/pages'),
                apiRequest('/categories'),
                apiRequest('/tags')
            ]);

            const allPages: PageItem[] = [
                ...systemPages,
                ...(Array.isArray(dynamicPages) ? dynamicPages.map((p: any) => ({
                    id: p.id,
                    title: p.title,
                    slug: `/${p.slug}`,
                    type: 'dynamic' as const,
                    lastUpdated: p.updatedAt
                })) : []),
                ...(Array.isArray(categories) ? categories.map((c: any) => ({
                    id: c.id,
                    title: `Category: ${c.name}`,
                    slug: `/blog/category/${c.slug}`,
                    type: 'category' as const,
                    lastUpdated: c.updatedAt
                })) : []),
                ...(Array.isArray(tags) ? tags.map((t: any) => ({
                    id: t.id,
                    title: `Tag: ${t.name}`,
                    slug: `/blog/tag/${t.slug}`,
                    type: 'tag' as const,
                    lastUpdated: t.updatedAt
                })) : [])
            ];

            // Fetch SEO for all pages to show status
            // (In a real app, you might fetch this on demand or as an inclusion)
            setPages(allPages);
        } catch (error) {
            console.error('Failed to fetch pages', error);
            showToast('Failed to load pages.', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleEditSeo = async (page: PageItem) => {
        setEditingPage(page);
        try {
            const pageType = page.type === 'static' ? 'static' :
                page.type === 'dynamic' ? 'page' :
                    page.type === 'category' ? 'category' : 'tag';

            const seo = await apiRequest(`/seo-meta/${pageType}/${page.id}`);
            setSeoFormData({
                title: seo?.title || '',
                description: seo?.description || '',
                keywords: seo?.keywords?.join(', ') || ''
            });
        } catch (error) {
            setSeoFormData({ title: '', description: '', keywords: '' });
        }
    };

    const handleSaveSeo = async () => {
        if (!editingPage) return;
        setIsSaving(true);

        try {
            const pageType = editingPage.type === 'static' ? 'static' :
                editingPage.type === 'dynamic' ? 'page' :
                    editingPage.type === 'category' ? 'category' : 'tag';

            await apiRequest('/seo-meta', {
                method: 'POST',
                body: {
                    pageType,
                    pageId: editingPage.id,
                    title: seoFormData.title,
                    description: seoFormData.description,
                    keywords: seoFormData.keywords.split(',').map(k => k.trim()).filter(k => k)
                }
            });

            showToast('SEO settings saved!', 'success');
            setEditingPage(null);
        } catch (error: any) {
            showToast(error.message || 'Failed to save SEO.', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    const filteredPages = pages.filter(p =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.slug.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 px-2">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight font-display">
                        Site <span className="text-blue-600 font-bold">Pages</span>
                    </h1>
                    <p className="mt-1 text-xs text-slate-500 font-semibold tracking-tight">Manage SEO and meta information for all your website routes.</p>
                </div>
            </div>

            <div className="mx-2 bg-white rounded-2xl shadow-sm border border-slate-200/50 overflow-hidden">
                <div className="p-6 border-b border-slate-100 bg-slate-50/10">
                    <div className="relative group max-w-md">
                        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search routes..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600/20 transition-all"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-100 bg-slate-50/30">
                                <th className="pl-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center w-16">Icon</th>
                                <th className="px-4 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Page / Route</th>
                                <th className="px-4 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Type</th>
                                <th className="px-4 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Slug</th>
                                <th className="pr-8 py-4 text-right"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {isLoading ? (
                                [1, 2, 3].map(i => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={5} className="px-8 py-8"><div className="h-12 bg-slate-50 rounded-2xl" /></td>
                                    </tr>
                                ))
                            ) : filteredPages.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-8 py-20 text-center text-slate-400 text-sm font-bold">No pages found.</td>
                                </tr>
                            ) : (
                                filteredPages.map((page) => (
                                    <tr key={`${page.type}-${page.id}`} className="group hover:bg-slate-50/50 transition-colors">
                                        <td className="pl-8 py-5 flex justify-center">
                                            <div className={`p-2 rounded-xl ${page.type === 'static' ? 'bg-blue-50 text-blue-600' :
                                                page.type === 'dynamic' ? 'bg-emerald-50 text-emerald-600' :
                                                    page.type === 'category' ? 'bg-amber-50 text-amber-600' :
                                                        'bg-purple-50 text-purple-600'
                                                }`}>
                                                {page.type === 'static' ? <HomeIcon className="h-5 w-5" /> :
                                                    page.type === 'dynamic' ? <DocumentTextIcon className="h-5 w-5" /> :
                                                        page.type === 'category' ? <Square3Stack3DIcon className="h-5 w-5" /> :
                                                            <HashtagIcon className="h-5 w-5" />}
                                            </div>
                                        </td>
                                        <td className="px-4 py-5 font-bold text-slate-900 text-sm">{page.title}</td>
                                        <td className="px-4 py-5">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{page.type}</span>
                                        </td>
                                        <td className="px-4 py-5 font-mono text-[10px] text-blue-500 font-bold">{page.slug}</td>
                                        <td className="pr-8 py-5 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <a href={page.slug} target="_blank" className="p-2 rounded-lg bg-white border border-slate-200 text-slate-400 hover:text-blue-600 transition-all" title="View Page">
                                                    <ArrowTopRightOnSquareIcon className="h-4 w-4" />
                                                </a>
                                                <button onClick={() => handleEditSeo(page)} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-blue-600 hover:border-blue-200 transition-all font-bold text-[10px] uppercase tracking-widest">
                                                    <PencilSquareIcon className="h-4 w-4" />
                                                    Edit SEO
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* SEO Modal */}
            {editingPage && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                            <div>
                                <h3 className="text-base font-bold text-slate-900 font-display">Manage SEO</h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{editingPage.title}</p>
                            </div>
                            <button onClick={() => setEditingPage(null)} className="text-slate-400 hover:text-slate-600">×</button>
                        </div>
                        <div className="p-8 space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Meta Title</label>
                                <input
                                    type="text"
                                    value={seoFormData.title}
                                    onChange={(e) => setSeoFormData({ ...seoFormData, title: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-600/10"
                                    placeholder="Enter search engine title..."
                                />
                                <p className="text-[10px] text-slate-400 text-right">{seoFormData.title.length}/60</p>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Meta Description</label>
                                <textarea
                                    value={seoFormData.description}
                                    onChange={(e) => setSeoFormData({ ...seoFormData, description: e.target.value })}
                                    rows={4}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-600/10 resize-none"
                                    placeholder="Enter a brief, compelling summary..."
                                />
                                <p className="text-[10px] text-slate-400 text-right">{seoFormData.description.length}/160</p>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Keywords (Comma separated)</label>
                                <input
                                    type="text"
                                    value={seoFormData.keywords}
                                    onChange={(e) => setSeoFormData({ ...seoFormData, keywords: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-600/10"
                                    placeholder="architecture, buildings, design..."
                                />
                            </div>
                        </div>
                        <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
                            <button
                                onClick={() => setEditingPage(null)}
                                className="px-6 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveSeo}
                                disabled={isSaving}
                                className="px-8 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-xs shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all disabled:opacity-50"
                            >
                                {isSaving ? 'Saving...' : 'Save Meta Data'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
