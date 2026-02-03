'use client';

import React, { useState, useEffect } from 'react';
import {
    PlusIcon,
    PencilSquareIcon,
    TrashIcon,
    ArrowLeftIcon,
    CloudArrowUpIcon,
    PhotoIcon,
    UserGroupIcon,
    ArrowsUpDownIcon
} from '@heroicons/react/24/outline';
import MediaLibrary from '@/components/media/MediaLibrary';
import UnsavedChangesAlert from '@/components/ui/UnsavedChangesAlert';
import { useNotification } from '@/context/NotificationContext';

export default function TeamPage() {
    const [view, setView] = useState<'list' | 'editor'>('list');
    const [team, setTeam] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [canManageContent, setCanManageContent] = useState(false);

    const defaultFormData = {
        name: '',
        role: '',
        bio: '',
        image: '',
        socialLinks: { linkedin: '', twitter: '', instagram: '' },
        order: 0
    };

    const [formData, setFormData] = useState<any>(defaultFormData);
    const [initialState, setInitialState] = useState<any>(defaultFormData);
    const [showUnsavedAlert, setShowUnsavedAlert] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [currentMemberId, setCurrentMemberId] = useState<string | null>(null);
    const [isMediaOpen, setIsMediaOpen] = useState(false);
    const { showToast } = useNotification();

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const [teamRes, profileRes] = await Promise.all([
                fetch('http://localhost:3001/team', { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch('http://localhost:3001/auth/profile', { headers: { 'Authorization': `Bearer ${token}` } })
            ]);

            const teamData = await teamRes.json();
            const profile = await profileRes.json();

            setTeam(Array.isArray(teamData) ? teamData : []);

            if (profile.role?.permissions?.manage_content || profile.role?.name === 'Super Admin' || profile.role?.name === 'Admin') {
                setCanManageContent(true);
            }
        } catch (error) {
            console.error('Failed to fetch data', error);
        } finally {
            setIsLoading(false);
        }
    };

    const isDirty = () => JSON.stringify(formData) !== JSON.stringify(initialState);

    const handleCreate = () => {
        setFormData({ ...defaultFormData, order: team.length });
        setInitialState({ ...defaultFormData, order: team.length });
        setCurrentMemberId(null);
        setView('editor');
    };

    const handleEdit = (member: any) => {
        const data = {
            name: member.name,
            role: member.role,
            bio: member.bio || '',
            image: member.image || '',
            socialLinks: member.socialLinks || { linkedin: '', twitter: '', instagram: '' },
            order: member.order
        };
        setFormData(data);
        setInitialState(data);
        setCurrentMemberId(member.id);
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
        const url = currentMemberId
            ? `http://localhost:3001/team/${currentMemberId}`
            : 'http://localhost:3001/team';
        const method = currentMemberId ? 'PATCH' : 'POST';

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
                showToast('Team member saved successfully!', 'success');
                fetchInitialData();
                setInitialState(formData);
                return true;
            } else {
                showToast('Failed to save team member.', 'error');
                return false;
            }
        } catch (error) {
            console.error(error);
            return false;
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this team member?')) return;

        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`http://localhost:3001/team/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (res.ok) {
                showToast('Team member deleted successfully!', 'success');
                fetchInitialData();
            } else {
                showToast('Failed to delete team member.', 'error');
            }
        } catch (error) {
            console.error(error);
        }
    };

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

                <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200/50 shadow-sm sticky top-4 z-10">
                    <div className="flex items-center gap-4">
                        <button onClick={handleBackClick} className="p-2 hover:bg-slate-50 rounded-xl text-slate-500 transition-colors">
                            <ArrowLeftIcon className="h-5 w-5" />
                        </button>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{currentMemberId ? 'Editing Team Member' : 'New Team Member'}</p>
                            <h1 className="text-xl font-bold text-slate-900 font-display">{formData.name || 'Untitled Member'}</h1>
                        </div>
                    </div>
                    <button onClick={() => handleSave()} className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 active:scale-95">
                        <CloudArrowUpIcon className="h-4 w-4" />
                        {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-2xl p-10 border border-slate-200/60 shadow-xl space-y-6">
                            <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-2">Full Name</label>
                                <input
                                    type="text"
                                    placeholder="Enter team member name..."
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full text-3xl font-bold text-slate-900 placeholder:text-slate-200 border-none focus:ring-0 p-0 font-display bg-transparent mt-2"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Role / Position</label>
                                <input
                                    type="text"
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-600/10 mt-2"
                                    placeholder="e.g., Principal Architect, Senior Designer"
                                />
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl p-6 border border-slate-200/50 shadow-sm space-y-4">
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Biography</h3>
                            <textarea
                                value={formData.bio}
                                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                rows={6}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-600/10 resize-none"
                                placeholder="Brief professional background and expertise..."
                            />
                        </div>

                        <div className="bg-white rounded-2xl p-6 border border-slate-200/50 shadow-sm space-y-4">
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Social Links</h3>
                            <div className="space-y-3">
                                <input
                                    type="text"
                                    value={formData.socialLinks.linkedin}
                                    onChange={(e) => setFormData({ ...formData, socialLinks: { ...formData.socialLinks, linkedin: e.target.value } })}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-600/10"
                                    placeholder="LinkedIn URL"
                                />
                                <input
                                    type="text"
                                    value={formData.socialLinks.twitter}
                                    onChange={(e) => setFormData({ ...formData, socialLinks: { ...formData.socialLinks, twitter: e.target.value } })}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-600/10"
                                    placeholder="Twitter URL"
                                />
                                <input
                                    type="text"
                                    value={formData.socialLinks.instagram}
                                    onChange={(e) => setFormData({ ...formData, socialLinks: { ...formData.socialLinks, instagram: e.target.value } })}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-600/10"
                                    placeholder="Instagram URL"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl p-6 border border-slate-200/50 shadow-sm space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Profile Photo</h3>
                                {formData.image && (
                                    <button onClick={() => setFormData({ ...formData, image: '' })} className="text-[10px] font-bold text-red-500 uppercase tracking-widest hover:text-red-600 transition-colors">Remove</button>
                                )}
                            </div>
                            <div
                                onClick={() => setIsMediaOpen(true)}
                                className="aspect-square bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 hover:bg-slate-100/50 hover:border-blue-400 hover:text-blue-500 transition-all cursor-pointer group overflow-hidden relative"
                            >
                                {formData.image ? (
                                    <img src={formData.image} className="w-full h-full object-cover" alt="" />
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
                                setFormData({ ...formData, image: url });
                                setIsMediaOpen(false);
                            }}
                        />

                        <div className="bg-white rounded-2xl p-6 border border-slate-200/50 shadow-sm space-y-4">
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Display Order</h3>
                            <input
                                type="number"
                                value={formData.order}
                                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-600/10"
                            />
                            <p className="text-[10px] text-slate-400">Lower numbers appear first</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 px-2">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight font-display">
                        Team <span className="text-blue-600 font-bold">Management</span>
                    </h1>
                    <p className="mt-1 text-xs text-slate-500 font-semibold tracking-tight">Manage your team members and their profiles.</p>
                </div>
                <div className="flex items-center gap-3">
                    {canManageContent && (
                        <button onClick={handleCreate} className="inline-flex items-center gap-x-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all active:scale-95 leading-none">
                            <PlusIcon className="h-4 w-4" strokeWidth={3} />
                            Add Member
                        </button>
                    )}
                </div>
            </div>

            <div className="mx-2 bg-white rounded-2xl shadow-sm border border-slate-200/50 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-100 bg-slate-50/30">
                                <th className="pl-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Member</th>
                                <th className="px-4 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Role</th>
                                <th className="px-4 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Order</th>
                                <th className="pr-8 py-4 text-right"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {isLoading ? (
                                [1, 2, 3].map(i => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={4} className="px-8 py-8"><div className="h-12 bg-slate-50 rounded-2xl" /></td>
                                    </tr>
                                ))
                            ) : team.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-8 py-20 text-center">
                                        <UserGroupIcon className="h-12 w-12 text-slate-200 mx-auto mb-4" />
                                        <p className="text-sm font-bold text-slate-500">No team members found. Add your first one!</p>
                                    </td>
                                </tr>
                            ) : (
                                team.map((member) => (
                                    <tr key={member.id} className="group hover:bg-slate-50/50 transition-colors">
                                        <td className="pl-8 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="h-12 w-12 rounded-full bg-slate-100 border border-slate-200 overflow-hidden flex-shrink-0">
                                                    {member.image ? (
                                                        <img src={member.image} alt="" className="h-full w-full object-cover" />
                                                    ) : (
                                                        <div className="h-full w-full flex items-center justify-center text-slate-300">
                                                            <UserGroupIcon className="h-6 w-6" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{member.name}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-5 font-bold text-slate-700 text-xs">{member.role}</td>
                                        <td className="px-4 py-5 text-xs font-semibold text-slate-500">{member.order}</td>
                                        <td className="pr-8 py-5 text-right">
                                            {canManageContent && (
                                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button onClick={() => handleEdit(member)} className="p-2 rounded-lg bg-white border border-slate-200 text-slate-400 hover:text-blue-600 hover:border-blue-200 transition-all">
                                                        <PencilSquareIcon className="h-4 w-4" />
                                                    </button>
                                                    <button onClick={() => handleDelete(member.id)} className="p-2 rounded-lg bg-white border border-slate-200 text-slate-400 hover:text-red-500 hover:border-red-200 transition-all">
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
