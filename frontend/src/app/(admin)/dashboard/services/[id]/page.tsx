'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import {
    ArrowLeftIcon,
    PaperAirplaneIcon,
    ExclamationCircleIcon
} from '@heroicons/react/24/outline';
import { apiRequest } from '@/lib/api';
import { useNotification } from '@/context/NotificationContext';
import { use } from 'react';

interface ServiceFormData {
    title: string;
    description: string;
    icon: string;
    order: number;
}

export default function EditServicePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const { showToast } = useNotification();
    const router = useRouter();
    const { register, handleSubmit, setValue, formState: { errors } } = useForm<ServiceFormData>();

    useEffect(() => {
        fetchService();
    }, [id]);

    const fetchService = async () => {
        try {
            setIsLoading(true);
            const data = await apiRequest(`/services/${id}`);
            if (data) {
                setValue('title', data.title);
                setValue('description', data.description || '');
                setValue('icon', data.icon || '');
                setValue('order', data.order || 0);
            }
        } catch (error) {
            console.error('Failed to fetch service:', error);
            showToast('Failed to load service details', 'error');
            router.push('/dashboard/services');
        } finally {
            setIsLoading(false);
        }
    };

    const onSubmit = async (data: ServiceFormData) => {
        setIsSubmitting(true);
        try {
            await apiRequest(`/services/${id}`, {
                method: 'PATCH',
                body: JSON.stringify({
                    ...data,
                    order: Number(data.order)
                })
            });
            showToast('Service updated successfully', 'success');
            router.push('/dashboard/services');
        } catch (error) {
            console.error('Failed to update service:', error);
            showToast('Failed to update service', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <div className="w-8 h-8 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link
                    href="/dashboard/services"
                    className="p-2 rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm hover:shadow-md"
                >
                    <ArrowLeftIcon className="h-5 w-5" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-display">
                        Edit <span className="text-blue-600">Service</span>
                    </h1>
                    <p className="mt-1 text-xs text-slate-500 font-semibold tracking-tight">
                        Update service details.
                    </p>
                </div>
            </div>

            {/* Form */}
            <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] border border-slate-200/60 shadow-xl shadow-slate-200/20 p-8">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-5">
                        <div className="space-y-1.5">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center justify-between">
                                Title <span className="text-blue-500 font-bold">*</span>
                            </label>
                            <input
                                type="text"
                                {...register('title', { required: 'Title is required' })}
                                className={`w-full bg-slate-50 border-2 rounded-2xl px-5 py-4 text-sm font-medium transition-all ${errors.title
                                    ? 'border-red-200 focus:border-red-500 focus:ring-red-500/10'
                                    : 'border-slate-100 focus:border-blue-500 focus:ring-blue-500/10'
                                    }`}
                                placeholder="e.g. Architectural Design"
                            />
                            {errors.title && (
                                <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest mt-1 flex items-center gap-1">
                                    <ExclamationCircleIcon className="h-3 w-3" />
                                    {errors.title.message}
                                </p>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">
                                Description
                            </label>
                            <textarea
                                {...register('description')}
                                rows={4}
                                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 text-sm font-medium transition-all focus:border-blue-500 focus:ring-blue-500/10"
                                placeholder="Brief description of the service..."
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-1.5">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">
                                    Icon Class
                                </label>
                                <input
                                    type="text"
                                    {...register('icon')}
                                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 text-sm font-medium transition-all focus:border-blue-500 focus:ring-blue-500/10"
                                    placeholder="e.g. pencil-circle"
                                />
                                <p className="text-[9px] font-bold text-slate-300 uppercase tracking-wide">Phosphor Icons class name</p>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">
                                    Sort Order
                                </label>
                                <input
                                    type="number"
                                    {...register('order')}
                                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 text-sm font-medium transition-all focus:border-blue-500 focus:ring-blue-500/10"
                                    placeholder="0"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-slate-900 text-white py-5 rounded-[2rem] font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-slate-900/20 hover:bg-black hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                        >
                            {isSubmitting ? (
                                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    Update Service
                                    <PaperAirplaneIcon className="h-4 w-4 text-blue-400 -rotate-45" />
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
