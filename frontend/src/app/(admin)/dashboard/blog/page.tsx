'use client';

import React, { useState, useEffect } from 'react';
import {
    PlusIcon,
    PencilSquareIcon,
    TrashIcon,
    DocumentTextIcon,
    EyeIcon,
    ChatBubbleLeftRightIcon,
    ArrowUpRightIcon,
    MagnifyingGlassIcon,
    FunnelIcon,
    ArrowLeftIcon,
    CloudArrowUpIcon,
    PhotoIcon,
    CalendarIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import PostEditor from '@/components/blog/PostEditor';
import MediaLibrary from '@/components/media/MediaLibrary';
import UnsavedChangesAlert from '@/components/ui/UnsavedChangesAlert';
import { useNotification } from '@/context/NotificationContext';

export default function BlogPage() {
    const [view, setView] = useState<'list' | 'editor'>('list');
    const [posts, setPosts] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [tags, setTags] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [canManageContent, setCanManageContent] = useState(false);

    // Form and State
    const defaultFormData = {
        title: '',
        slug: '',
        content: '',
        excerpt: '',
        coverImage: '',
        status: 'DRAFT',
        categories: [],
        tags: [],
        publishedAt: '',
        seo: { title: '', description: '' }
    };
    const [formData, setFormData] = useState<any>(defaultFormData);
    const [initialState, setInitialState] = useState<any>(defaultFormData);
    const [showUnsavedAlert, setShowUnsavedAlert] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const [currentPostId, setCurrentPostId] = useState<string | null>(null);
    const [isMediaOpen, setIsMediaOpen] = useState(false);
    const [tagSearch, setTagSearch] = useState('');
    const [showTagSuggestions, setShowTagSuggestions] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const { showToast } = useNotification();

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const [postsRes, catsRes, tagsRes, profileRes] = await Promise.all([
                fetch('http://localhost:3001/blogs', { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch('http://localhost:3001/categories', { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch('http://localhost:3001/tags', { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch('http://localhost:3001/auth/profile', { headers: { 'Authorization': `Bearer ${token}` } })
            ]);

            const postsData = await postsRes.json();
            const catsData = await catsRes.json();
            const tagsData = await tagsRes.json();
            const profile = await profileRes.json();

            setPosts(Array.isArray(postsData) ? postsData : []);
            setCategories(Array.isArray(catsData) ? catsData : []);
            setTags(Array.isArray(tagsData) ? tagsData : []);

            if (profile.role?.permissions?.manage_content || profile.role?.name === 'Super Admin' || profile.role?.name === 'Admin') {
                setCanManageContent(true);
            }
        } catch (error) {
            console.error('Failed to fetch data', error);
        } finally {
            setIsLoading(false);
        }
    };

    const isDirty = () => {
        return JSON.stringify(formData) !== JSON.stringify(initialState);
    };

    const handleCreate = () => {
        setFormData(defaultFormData);
        setInitialState(defaultFormData);
        setCurrentPostId(null);
        setView('editor');
    };

    const handleEdit = (post: any) => {
        const data = {
            title: post.title,
            slug: post.slug,
            content: post.content,
            excerpt: post.excerpt,
            coverImage: post.coverImage,
            status: post.status,
            categories: post.categories?.map((c: any) => c.id) || [],
            tags: post.tags?.map((t: any) => t.name) || [],
            publishedAt: post.publishedAt || '',
            seo: { title: post.seo?.title || '', description: post.seo?.description || '' }
        };
        setFormData(data);
        setInitialState(data);
        setCurrentPostId(post.id);
        setView('editor');
    };

    const handleBackClick = () => {
        if (isDirty()) {
            setShowUnsavedAlert(true);
        } else {
            setView('list');
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        const token = localStorage.getItem('token');
        const url = currentPostId
            ? `http://localhost:3001/blogs/${currentPostId}`
            : 'http://localhost:3001/blogs';
        const method = currentPostId ? 'PATCH' : 'POST';

        try {
            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                showToast('Post saved successfully!', 'success');
                fetchInitialData();
                setInitialState(formData); // Update initial state to match saved
                // If integrated with alert, we might want to close view too if implicit save & exit
                // But usually Save button just saves.
                // However, if called from Alert's "Save & Exit", we should exit.
                // We'll return true if success to let caller know.
                return true;
            } else {
                showToast('Failed to save post.', 'error');
                return false;
            }
        } catch (error) {
            console.error(error);
            return false;
        } finally {
            setIsSaving(false);
        }
    };

    const handleCategoryToggle = (id: string) => {
        setFormData((prev: any) => {
            const exists = prev.categories.includes(id);
            const newCategories = exists
                ? prev.categories.filter((c: string) => c !== id)
                : [...prev.categories, id];
            return { ...prev, categories: newCategories };
        });
    };

    const handleTagInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const val = e.currentTarget.value.trim();
            if (val && !formData.tags.includes(val)) {
                setFormData((prev: any) => ({ ...prev, tags: [...prev.tags, val] }));
                e.currentTarget.value = '';
            }
        }
    };

    // Ensure we reset alert state when view changes
    useEffect(() => {
        setShowUnsavedAlert(false);
    }, [view]);


    if (view === 'editor') {
        return (
            <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                <UnsavedChangesAlert
                    isOpen={showUnsavedAlert}
                    onSaveAndExit={async () => {
                        const success = await handleSave();
                        if (success) setView('list');
                    }}
                    onDiscardAndExit={() => setView('list')}
                    onCancel={() => setShowUnsavedAlert(false)}
                    isSaving={isSaving}
                />

                {/* Editor Header */}
                <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200/50 shadow-sm sticky top-4 z-10">
                    <div className="flex items-center gap-4">
                        <button onClick={handleBackClick} className="p-2 hover:bg-slate-50 rounded-xl text-slate-500 transition-colors">
                            <ArrowLeftIcon className="h-5 w-5" />
                        </button>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{currentPostId ? 'Editing Post' : 'New Post'}</p>
                            <h1 className="text-xl font-bold text-slate-900 font-display">{formData.title || 'Untitled Post'}</h1>
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
                            <option value="ARCHIVED">Archived</option>
                        </select>
                        <button onClick={() => handleSave()} className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 active:scale-95">
                            <CloudArrowUpIcon className="h-4 w-4" />
                            {isSaving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Premium Title & Slug Area */}
                        <div className="bg-white rounded-2xl p-10 border border-slate-200/60 shadow-xl shadow-slate-200/20 space-y-8 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/30 rounded-full blur-3xl -z-10 group-hover:bg-blue-100/30 transition-colors duration-1000"></div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-2">Master Article Title</label>
                                <input
                                    type="text"
                                    placeholder="Enter a captivating headline..."
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value, slug: e.target.value.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '') })}
                                    className="w-full text-4xl lg:text-5xl font-bold text-slate-900 placeholder:text-slate-200 border-none focus:ring-0 p-0 font-display bg-transparent transition-all decoration-blue-600/30 hover:decoration-blue-600/50"
                                />
                            </div>

                            <div className="pt-6 border-t border-slate-100 flex items-center gap-4">
                                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                                <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 group/slug hover:border-blue-200 transition-all">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Live Permalink</span>
                                    <span className="text-slate-300 font-mono text-xs">/blog/</span>
                                    <input
                                        value={formData.slug}
                                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                        className="bg-transparent border-none focus:ring-0 p-0 text-blue-600 font-bold text-xs min-w-[200px]"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Rich Text Editor */}
                        <PostEditor content={formData.content} onChange={(html) => setFormData({ ...formData, content: html })} />
                    </div>

                    {/* Sidebar Metadata */}
                    <div className="space-y-6">
                        {/* Cover Image */}
                        <div className="bg-white rounded-2xl p-6 border border-slate-200/50 shadow-sm space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Cover Image</h3>
                                {formData.coverImage && (
                                    <button onClick={() => setFormData({ ...formData, coverImage: '' })} className="text-[10px] font-bold text-red-500 uppercase tracking-widest hover:text-red-600 transition-colors">Remove</button>
                                )}
                            </div>
                            <div
                                onClick={() => setIsMediaOpen(true)}
                                className="aspect-video bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 hover:bg-slate-100/50 hover:border-blue-400 hover:text-blue-500 transition-all cursor-pointer group overflow-hidden relative"
                            >
                                {formData.coverImage ? (
                                    <img src={formData.coverImage} className="w-full h-full object-cover" />
                                ) : (
                                    <>
                                        <PhotoIcon className="h-8 w-8 mb-2 group-hover:scale-110 transition-transform" />
                                        <span className="text-[10px] font-bold">Select from Library</span>
                                    </>
                                )}
                            </div>
                        </div>

                        <MediaLibrary
                            isOpen={isMediaOpen}
                            onClose={() => setIsMediaOpen(false)}
                            onSelect={(url) => {
                                setFormData({ ...formData, coverImage: url });
                                setIsMediaOpen(false);
                            }}
                        />

                        {/* Categories */}
                        <div className="bg-white rounded-2xl p-6 border border-slate-200/50 shadow-sm space-y-4">
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Categories</h3>
                            <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                                {categories.map(cat => (
                                    <label key={cat.id} className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors">
                                        <input
                                            type="checkbox"
                                            checked={formData.categories.includes(cat.id)}
                                            onChange={() => handleCategoryToggle(cat.id)}
                                            className="rounded-md border-slate-300 text-blue-600 focus:ring-blue-600"
                                        />
                                        <span className="text-xs font-bold text-slate-700">{cat.name}</span>
                                    </label>
                                ))}
                                {categories.length === 0 && <p className="text-xs text-slate-400 italic">No categories found.</p>}
                            </div>
                        </div>

                        {/* Tags */}
                        <div className="bg-white rounded-2xl rounded-b-none p-6 border border-slate-200/50 shadow-sm space-y-4 relative">
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Tags</h3>
                            <div className="flex flex-wrap gap-2 mb-3">
                                {formData.tags.map((tag: string) => (
                                    <span key={tag} className="px-2 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-widest rounded-lg flex items-center gap-1">
                                        {tag}
                                        <button onClick={() => setFormData({ ...formData, tags: formData.tags.filter((t: string) => t !== tag) })} className="hover:text-blue-800">×</button>
                                    </span>
                                ))}
                            </div>
                            <div className="relative">
                                <input
                                    type="text"
                                    className="w-full bg-slate-50 border-none rounded-xl text-xs font-bold px-4 py-3 focus:ring-2 focus:ring-blue-600/10"
                                    placeholder="Search or add tag..."
                                    value={tagSearch}
                                    onChange={(e) => {
                                        setTagSearch(e.target.value);
                                        setShowTagSuggestions(true);
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            const val = tagSearch.trim();
                                            if (val && !formData.tags.includes(val)) {
                                                setFormData((prev: any) => ({ ...prev, tags: [...prev.tags, val] }));
                                                setTagSearch('');
                                                setShowTagSuggestions(false);
                                            }
                                        }
                                    }}
                                    onFocus={() => setShowTagSuggestions(true)}
                                />
                                {showTagSuggestions && (
                                    <div className="absolute z-20 w-full mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 max-h-48 overflow-y-auto custom-scrollbar p-2">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest p-2">Suggestions</p>
                                        {tags
                                            .filter(t => t.name.toLowerCase().includes(tagSearch.toLowerCase()) && !formData.tags.includes(t.name))
                                            .map(tag => (
                                                <button
                                                    key={tag.id}
                                                    onClick={() => {
                                                        setFormData((prev: any) => ({ ...prev, tags: [...prev.tags, tag.name] }));
                                                        setTagSearch('');
                                                        setShowTagSuggestions(false);
                                                    }}
                                                    className="w-full text-left px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-blue-600 rounded-xl transition-all"
                                                >
                                                    {tag.name}
                                                </button>
                                            ))}
                                        {tags.filter(t => t.name.toLowerCase().includes(tagSearch.toLowerCase()) && !formData.tags.includes(t.name)).length === 0 && (
                                            <p className="p-2 text-xs text-slate-400 italic font-medium">No other tags found.</p>
                                        )}
                                        {tagSearch && !tags.some(t => t.name.toLowerCase() === tagSearch.toLowerCase()) && (
                                            <button
                                                onClick={() => {
                                                    setFormData((prev: any) => ({ ...prev, tags: [...prev.tags, tagSearch] }));
                                                    setTagSearch('');
                                                    setShowTagSuggestions(false);
                                                }}
                                                className="w-full text-left px-3 py-2 text-xs font-bold text-blue-600 bg-blue-50/50 hover:bg-blue-50 rounded-xl transition-all border border-blue-100/50 mt-1"
                                            >
                                                Create "{tagSearch}"
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* SEO Metadata */}
                        <div className="bg-white rounded-2xl p-6 border border-slate-200/50 shadow-sm space-y-4">
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">SEO Metadata</h3>
                            <div className="space-y-3">
                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Meta Title</label>
                                    <input
                                        type="text"
                                        value={formData.seo.title}
                                        onChange={(e) => setFormData({ ...formData, seo: { ...formData.seo, title: e.target.value } })}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-600/10"
                                        placeholder="Title for search engines"
                                    />
                                    <p className="text-[10px] text-slate-400 mt-1 text-right">{formData.seo.title.length}/60</p>
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Meta Description</label>
                                    <textarea
                                        value={formData.seo.description}
                                        onChange={(e) => setFormData({ ...formData, seo: { ...formData.seo, description: e.target.value } })}
                                        rows={3}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-600/10 resize-none"
                                        placeholder="Brief description for search results"
                                    />
                                    <p className="text-[10px] text-slate-400 mt-1 text-right">{formData.seo.description.length}/160</p>
                                </div>
                            </div>
                        </div>

                        {/* Scheduling */}
                        <div className="bg-white rounded-2xl p-6 border border-slate-200/50 shadow-sm space-y-4">
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Publishing</h3>
                            <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Publish Date</label>
                                <div className="relative">
                                    <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                    <input
                                        type="datetime-local"
                                        value={formData.publishedAt ? new Date(formData.publishedAt).toISOString().slice(0, 16) : ''}
                                        onChange={(e) => setFormData({ ...formData, publishedAt: e.target.value })}
                                        className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-600/10"
                                    />
                                </div>
                                <p className="text-[10px] text-slate-400 mt-2 ml-1">
                                    {formData.publishedAt && new Date(formData.publishedAt) > new Date()
                                        ? 'Post will be scheduled for this date.'
                                        : 'Leave empty to publish immediately.'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 px-2">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight font-display">
                        Content <span className="text-blue-600 font-bold">Engine</span>
                    </h1>
                    <p className="mt-1 text-xs text-slate-500 font-semibold tracking-tight">Create, edit and manage your blog posts and articles.</p>
                </div>
                <div className="flex items-center gap-3">
                    {canManageContent && (
                        <button onClick={handleCreate} className="inline-flex items-center gap-x-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all active:scale-95 leading-none">
                            <PlusIcon className="h-4 w-4" strokeWidth={3} />
                            New Post
                        </button>
                    )}
                </div>
            </div>

            {/* Posts List */}
            <div className="mx-2 bg-white rounded-2xl shadow-sm border border-slate-200/50 overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row items-center gap-4 bg-slate-50/10">
                    <div className="relative flex-1 group">
                        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search posts by title or slug..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600/20 transition-all"
                        />
                    </div>
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <div className="relative flex-1 md:w-48 group">
                            <FunnelIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-600 transition-all" />
                            <select
                                value={categoryFilter}
                                onChange={(e) => setCategoryFilter(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600/20 transition-all appearance-none cursor-pointer"
                            >
                                <option value="">All Categories</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="relative flex-1 md:w-40 group">
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600/20 transition-all appearance-none cursor-pointer"
                            >
                                <option value="">All Status</option>
                                <option value="PUBLISHED">Published</option>
                                <option value="DRAFT">Draft</option>
                                <option value="ARCHIVED">Archived</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-100 bg-slate-50/30">
                                <th className="pl-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Article</th>
                                <th className="px-4 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                                <th className="px-4 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Author</th>
                                <th className="px-4 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Date</th>
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
                            ) : posts.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-8 py-20 text-center">
                                        <DocumentTextIcon className="h-12 w-12 text-slate-200 mx-auto mb-4" />
                                        <p className="text-sm font-bold text-slate-500">No posts found. Create your first one!</p>
                                    </td>
                                </tr>
                            ) : (
                                posts
                                    .filter(post => {
                                        const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                            post.slug.toLowerCase().includes(searchQuery.toLowerCase());
                                        const matchesCategory = !categoryFilter || post.categories.some((c: any) => c.id === categoryFilter);
                                        const matchesStatus = !statusFilter || post.status === statusFilter;
                                        return matchesSearch && matchesCategory && matchesStatus;
                                    })
                                    .map((post) => (
                                        <tr key={post.id} className="group hover:bg-slate-50/50 transition-colors">
                                            <td className="pl-8 py-5">
                                                <div className="flex items-center gap-4">
                                                    <div className="h-12 w-12 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden flex-shrink-0 relative">
                                                        {post.coverImage ? (
                                                            <img src={post.coverImage} alt="" className="h-full w-full object-cover" />
                                                        ) : (
                                                            <div className="h-full w-full flex items-center justify-center text-slate-300">
                                                                <DocumentTextIcon className="h-6 w-6" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{post.title}</p>
                                                        <p className="text-[10px] font-semibold text-slate-500 mt-1">/blog/{post.slug}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-5">
                                                <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ring-1 ring-inset ${post.status === 'PUBLISHED' ? 'bg-emerald-50 text-emerald-600 ring-emerald-600/20' :
                                                    post.status === 'DRAFT' ? 'bg-amber-50 text-amber-600 ring-amber-600/20' :
                                                        'bg-slate-50 text-slate-600 ring-slate-600/20'
                                                    }`}>
                                                    {post.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-5 font-bold text-slate-700 text-xs">
                                                {post.author?.name || 'Unknown'}
                                            </td>
                                            <td className="px-4 py-5 text-xs font-semibold text-slate-500">
                                                {new Date(post.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="pr-8 py-5 text-right">
                                                {canManageContent && (
                                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <Link href={`/dashboard/comments?postId=${post.id}`} className="p-2 rounded-lg bg-white border border-slate-200 text-slate-400 hover:text-emerald-500 hover:border-emerald-200 transition-all" title="View Comments">
                                                            <ChatBubbleLeftRightIcon className="h-4 w-4" />
                                                        </Link>
                                                        <button onClick={() => handleEdit(post)} className="p-2 rounded-lg bg-white border border-slate-200 text-slate-400 hover:text-blue-600 hover:border-blue-200 transition-all">
                                                            <PencilSquareIcon className="h-4 w-4" />
                                                        </button>
                                                        <button className="p-2 rounded-lg bg-white border border-slate-200 text-slate-400 hover:text-red-500 hover:border-red-200 transition-all">
                                                            <TrashIcon className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
