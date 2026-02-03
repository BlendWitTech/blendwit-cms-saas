'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    PlusIcon,
    PencilSquareIcon,
    TrashIcon
} from '@heroicons/react/24/outline';
import { apiRequest } from '@/lib/api';
import { useNotification } from '@/context/NotificationContext';

interface Milestone {
    id: string;
    year: string;
    title: string;
    description: string;
    icon: string;
    order: number;
    updatedAt: string;
}

export default function TimelinePage() {
    const [milestones, setMilestones] = useState<Milestone[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { showToast } = useNotification();

    useEffect(() => {
        fetchMilestones();
    }, []);

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

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this milestone?')) return;

        try {
            await apiRequest(`/timeline/${id}`, { method: 'DELETE' });
            showToast('Milestone deleted successfully', 'success');
            fetchMilestones();
        } catch (error) {
            console.error('Failed to delete milestone:', error);
            showToast('Failed to delete milestone', 'error');
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
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
                <Link
                    href="/dashboard/timeline/new"
                    className="px-6 py-2.5 rounded-xl bg-blue-600 shadow-lg shadow-blue-600/30 text-white font-bold text-xs uppercase tracking-widest hover:bg-blue-700 hover:-translate-y-0.5 transition-all active:translate-y-0 active:scale-95 flex items-center gap-2"
                >
                    <PlusIcon className="h-4 w-4" />
                    New Milestone
                </Link>
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
                                {milestones.map((milestone) => (
                                    <tr key={milestone.id} className="group hover:bg-blue-50/30 transition-colors">
                                        <td className="px-8 py-6">
                                            <div className="w-16 py-1 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                                                {milestone.year}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center shrink-0">
                                                    {milestone.icon ? <i className={`ph ph-${milestone.icon} text-lg`} /> : <div className="w-2 h-2 rounded-full bg-slate-300" />}
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
                                                <Link
                                                    href={`/dashboard/timeline/${milestone.id}`}
                                                    className="p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                                                >
                                                    <PencilSquareIcon className="h-4 w-4" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(milestone.id)}
                                                    className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                                                >
                                                    <TrashIcon className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
