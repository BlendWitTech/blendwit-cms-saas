'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
    PlusIcon,
    PencilSquareIcon,
    TrashIcon,
    ArrowLeftIcon,
    CloudArrowUpIcon,
    PhotoIcon
} from '@heroicons/react/24/outline';
import { apiRequest } from '@/lib/api';
import { useNotification } from '@/context/NotificationContext';
import IconPicker, { iconMap } from '@/components/ui/IconPicker';
import MediaLibrary from '@/components/media/MediaLibrary';
import { useForm } from '@/context/FormContext';
import UnsavedChangesAlert from '@/components/ui/UnsavedChangesAlert';
import AlertDialog from '@/components/ui/AlertDialog';

interface Milestone {
    id: string;
    year: string;
    title: string;
    description: string;
    icon: string;
    image: string;
    order: number;
    updatedAt: string;
}

function TimelinePageContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { setIsDirty } = useForm();
    const { showToast } = useNotification();

    // Derived state
    const view = searchParams.get('action') === 'new' || searchParams.get('action') === 'edit' ? 'editor' : 'list';
    const actionId = searchParams.get('id');

    const [milestones, setMilestones] = useState<Milestone[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const defaultFormData = {
        year: '',
        title: '',
        description: '',
        icon: '',
        image: '',
        order: 0
    };

    const [formData, setFormData] = useState<any>(defaultFormData);
    const [initialState, setInitialState] = useState<any>(defaultFormData);
    const [currentId, setCurrentId] = useState<string | null>(null);
    const [isMediaOpen, setIsMediaOpen] = useState(false);
    const [showUnsavedAlert, setShowUnsavedAlert] = useState(false);
    const [deleteConfirmation, setDeleteConfirmation] = useState<{ isOpen: boolean; id: string | null }>({
        isOpen: false,
        id: null
    });

    useEffect(() => {
        fetchMilestones();
    }, []);

    useEffect(() => {
        const dirty = JSON.stringify(formData) !== JSON.stringify(initialState);
        setIsDirty(dirty);
    }, [formData, initialState, setIsDirty]);

    useEffect(() => {
        const action = searchParams.get('action');
        const id = searchParams.get('id');

        if (!isLoading) {
            if (action === 'new') {
                const initial = { ...defaultFormData, order: milestones.length + 1 };
                setFormData(initial);
                setInitialState(initial);
                setCurrentId(null);
            } else if (action === 'edit' && id) {
                const milestone = milestones.find(m => m.id === id);
                if (milestone) {
                    const data = {
                        year: milestone.year,
                        title: milestone.title,
                        description: milestone.description || '',
                        icon: milestone.icon || '',
                        image: milestone.image || '',
                        order: milestone.order
                    };
                    setFormData(data);
                    setInitialState(data);
                    setCurrentId(id);
                }
            }
        }
    }, [searchParams, isLoading, milestones]);

    const fetchMilestones = async () => {
        try {
            setIsLoading(true);
            const data = await apiRequest('/timeline');
            setMilestones(data || []);
        } catch (error) {
            console.error('Failed to fetch timeline:', error);
            showToast('Failed to load timeline', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreate = () => {
        router.push('/dashboard/timeline?action=new');
    };

    const handleEdit = (milestone: Milestone) => {
        router.push(`/dashboard/timeline?action=edit&id=${milestone.id}`);
    };

    const handleBack = () => {
        if (JSON.stringify(formData) !== JSON.stringify(initialState)) {
            setShowUnsavedAlert(true);
        } else {
            router.push('/dashboard/timeline');
        }
    };

    const handleSave = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        setIsSaving(true);
        const url = currentId ? `/timeline/${currentId}` : '/timeline';
        const method = currentId ? 'PATCH' : 'POST';

        try {
            await apiRequest(url, {
                method,
                body: { ...formData, order: Number(formData.order) },
                skipNotification: true
            });

            showToast(`Milestone ${currentId ? 'updated' : 'created'} successfully`, 'success');
            setIsDirty(false);
            router.push('/dashboard/timeline');
            fetchMilestones();
        } catch (error: any) {
            showToast(error.message || 'Failed to save milestone', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteClick = (id: string) => {
        setDeleteConfirmation({ isOpen: true, id });
    };

    const confirmDelete = async () => {
        if (!deleteConfirmation.id) return;

        try {
            await apiRequest(`/timeline/${deleteConfirmation.id}`, { method: 'DELETE' });
            showToast('Milestone deleted successfully', 'success');
            fetchMilestones();
            setDeleteConfirmation({ isOpen: false, id: null });
        } catch (error) {
            console.error('Failed to delete milestone:', error);
            showToast('Failed to delete milestone', 'error');
            setDeleteConfirmation({ isOpen: false, id: null });
        }
    };

    const cancelDelete = () => {
        setDeleteConfirmation({ isOpen: false, id: null });
    };

    if (view === 'editor') {
        return (
            <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500 max-w-2xl mx-auto">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <button
                            type="button"
                            onClick={handleBack}
                            className="p-2 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-200 transition-all"
                        >
                            <ArrowLeftIcon className="h-5 w-5" />
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900 font-display tracking-tight">
                                {currentId ? 'Edit Milestone' : 'New Milestone'}
                            </h1>
                            <p className="text-sm font-medium text-slate-500">Update timeline event details.</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200/50 space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">Year</label>
                            <input
                                type="text"
                                required
                                value={formData.year}
                                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white focus:border-blue-600 transition-all"
                                placeholder="e.g. 2023"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">Title</label>
                            <input
                                type="text"
                                required
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white focus:border-blue-600 transition-all"
                                placeholder="e.g. Company Founded"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Description</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows={3}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm font-medium text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white focus:border-blue-600 transition-all resize-none"
                            placeholder="Details about this milestone..."
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">Display Order</label>
                            <input
                                type="number"
                                value={formData.order}
                                onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white focus:border-blue-600 transition-all"
                            />
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-bold text-slate-700">Milestone Image</label>
                                {formData.image && (
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, image: '' })}
                                        className="text-[10px] font-bold text-red-500 uppercase tracking-widest hover:text-red-600 transition-colors"
                                    >
                                        Remove
                                    </button>
                                )}
                            </div>
                            <div
                                onClick={() => setIsMediaOpen(true)}
                                className="aspect-video bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 hover:bg-slate-100/50 hover:border-blue-400 hover:text-blue-500 transition-all cursor-pointer group overflow-hidden relative"
                            >
                                {formData.image ? (
                                    <img src={formData.image} className="w-full h-full object-cover" alt="" />
                                ) : (
                                    <>
                                        <PhotoIcon className="h-8 w-8 mb-2 group-hover:scale-110 transition-transform" />
                                        <span className="text-[10px] font-bold">Select Image</span>
                                    </>
                                )}
                            </div>
                            <MediaLibrary
                                isOpen={isMediaOpen}
                                onClose={() => setIsMediaOpen(false)}
                                onSelect={(url) => {
                                    setFormData({ ...formData, image: url });
                                    setIsMediaOpen(false);
                                }}
                            />
                        </div>
                    </div>

                    <IconPicker
                        value={formData.icon}
                        onChange={(icon) => setFormData({ ...formData, icon })}
                        label="Milestone Icon"
                    />

                    <div className="pt-4 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={handleBack}
                            className="px-6 py-2.5 rounded-xl text-sm font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => handleSave()}
                            disabled={isSaving}
                            className="inline-flex items-center gap-2 px-8 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-bold shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 hover:shadow-emerald-600/30 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isSaving ? (
                                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <CloudArrowUpIcon className="h-5 w-5" strokeWidth={2} />
                            )}
                            <span>{currentId ? 'Update Milestone' : 'Create Milestone'}</span>
                        </button>
                    </div>
                </div>

                <UnsavedChangesAlert
                    isOpen={showUnsavedAlert}
                    title="Unsaved Changes"
                    description="You have unsaved changes. Are you sure you want to leave? Your changes will be lost."
                    confirmLabel="Save & Exit"
                    secondaryLabel="Discard & Leave"
                    cancelLabel="Keep Editing"
                    onSaveAndExit={async () => {
                        await handleSave();
                    }}
                    onDiscardAndExit={() => {
                        setIsDirty(false);
                        setShowUnsavedAlert(false);
                        router.push('/dashboard/timeline');
                    }}
                    onCancel={() => setShowUnsavedAlert(false)}
                    variant="success"
                />
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <AlertDialog
                isOpen={deleteConfirmation.isOpen}
                title="Delete Milestone"
                description="Are you sure you want to delete this milestone? This action cannot be undone."
                confirmLabel="Delete Milestone"
                cancelLabel="Cancel"
                variant="danger"
                onConfirm={confirmDelete}
                onCancel={cancelDelete}
            />
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-display">
                        Timeline <span className="text-blue-600">Milestones</span>
                    </h1>
                    <p className="mt-1 text-xs text-slate-500 font-semibold tracking-tight">
                        Manage your company history and key milestones.
                    </p>
                </div>
                <button
                    onClick={handleCreate}
                    className="px-6 py-2.5 rounded-xl bg-emerald-600 shadow-lg shadow-emerald-600/30 text-white font-bold text-xs uppercase tracking-widest hover:bg-emerald-700 hover:-translate-y-0.5 transition-all active:translate-y-0 active:scale-95 flex items-center gap-2"
                >
                    <PlusIcon className="h-4 w-4" />
                    New Milestone
                </button>
            </div>

            {/* List */}
            <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] border border-slate-200/60 shadow-xl shadow-slate-200/20 overflow-hidden">
                {isLoading ? (
                    <div className="p-12 flex justify-center">
                        <div className="w-8 h-8 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin"></div>
                    </div>
                ) : milestones.length === 0 ? (
                    <div className="p-12 text-center">
                        <p className="text-slate-400 font-medium">No milestones found. Create one to get started.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-100 bg-slate-50/50">
                                    <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Year</th>
                                    <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest w-full">Milestone</th>
                                    <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Order</th>
                                    <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {milestones.map((milestone) => {
                                    const Icon = iconMap[milestone.icon] || null;
                                    return (
                                        <tr key={milestone.id} className="group hover:bg-blue-50/30 transition-colors">
                                            <td className="px-8 py-6">
                                                <div className="w-16 py-1 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                                                    {milestone.year}
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center shrink-0">
                                                        {Icon ? <Icon className="h-6 w-6" /> : <div className="w-2 h-2 rounded-full bg-slate-300" />}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-slate-900">{milestone.title}</p>
                                                        <p className="text-xs text-slate-500 line-clamp-1">{milestone.description}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="text-xs font-semibold text-slate-500">
                                                    {milestone.order}
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={() => handleEdit(milestone)}
                                                        className="p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                                                    >
                                                        <PencilSquareIcon className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteClick(milestone.id)}
                                                        className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                                                    >
                                                        <TrashIcon className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function TimelinePage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        }>
            <TimelinePageContent />
        </Suspense>
    );
}
