'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import {
    ArrowLeftIcon,
    PaperAirplaneIcon,
    ExclamationCircleIcon,
    StarIcon as StarIconOutline
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { apiRequest } from '@/lib/api';
import { useNotification } from '@/context/NotificationContext';

interface TestimonialFormData {
    clientName: string;
    clientRole: string;
    content: string;
    rating: number;
    image: string;
}

export default function NewTestimonialPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { showToast } = useNotification();
    const router = useRouter();
    const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<TestimonialFormData>({
        defaultValues: {
            rating: 5
        }
    });

    const currentRating = watch('rating');

    const onSubmit = async (data: TestimonialFormData) => {
        setIsSubmitting(true);
        try {
            await apiRequest('/testimonials', {
                method: 'POST',
                body: JSON.stringify({
                    ...data,
                    rating: Number(data.rating)
                })
            });
            showToast('Testimonial created successfully', 'success');
            router.push('/dashboard/testimonials');
        } catch (error) {
            console.error('Failed to create testimonial:', error);
            showToast('Failed to create testimonial', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link
                    href="/dashboard/testimonials"
                    className="p-2 rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm hover:shadow-md"
                >
                    <ArrowLeftIcon className="h-5 w-5" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-display">
                        New <span className="text-blue-600">Testimonial</span>
                    </h1>
                    <p className="mt-1 text-xs text-slate-500 font-semibold tracking-tight">
                        Add a new client review.
                    </p>
                </div>
            </div>

            {/* Form */}
            <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] border border-slate-200/60 shadow-xl shadow-slate-200/20 p-8">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-5">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-1.5">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center justify-between">
                                    Client Name <span className="text-blue-500 font-bold">*</span>
                                </label>
                                <input
                                    type="text"
                                    {...register('clientName', { required: 'Client Name is required' })}
                                    className={`w-full bg-slate-50 border-2 rounded-2xl px-5 py-4 text-sm font-medium transition-all ${errors.clientName
                                        ? 'border-red-200 focus:border-red-500 focus:ring-red-500/10'
                                        : 'border-slate-100 focus:border-blue-500 focus:ring-blue-500/10'
                                        }`}
                                    placeholder="e.g. John Doe"
                                />
                                {errors.clientName && (
                                    <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest mt-1 flex items-center gap-1">
                                        <ExclamationCircleIcon className="h-3 w-3" />
                                        {errors.clientName.message}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center justify-between">
                                    Client Role
                                </label>
                                <input
                                    type="text"
                                    {...register('clientRole')}
                                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 text-sm font-medium transition-all focus:border-blue-500 focus:ring-blue-500/10"
                                    placeholder="e.g. CEO, Tech Corp"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">
                                Testimonial Content <span className="text-blue-500 font-bold">*</span>
                            </label>
                            <textarea
                                {...register('content', { required: 'Content is required' })}
                                rows={4}
                                className={`w-full bg-slate-50 border-2 rounded-2xl px-5 py-4 text-sm font-medium transition-all ${errors.content
                                    ? 'border-red-200 focus:border-red-500 focus:ring-red-500/10'
                                    : 'border-slate-100 focus:border-blue-500 focus:ring-blue-500/10'
                                    }`}
                                placeholder="What did they say?"
                            />
                            {errors.content && (
                                <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest mt-1 flex items-center gap-1">
                                    <ExclamationCircleIcon className="h-3 w-3" />
                                    {errors.content.message}
                                </p>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">
                                Rating
                            </label>
                            <div className="flex items-center gap-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setValue('rating', star)}
                                        className="focus:outline-none transition-transform active:scale-90"
                                    >
                                        {star <= currentRating ? (
                                            <StarIconSolid className="h-8 w-8 text-yellow-400" />
                                        ) : (
                                            <StarIconOutline className="h-8 w-8 text-slate-300 hover:text-yellow-400 transition-colors" />
                                        )}
                                    </button>
                                ))}
                            </div>
                            <input type="hidden" {...register('rating')} />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">
                                Client Image URL
                            </label>
                            <input
                                type="text"
                                {...register('image')}
                                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 text-sm font-medium transition-all focus:border-blue-500 focus:ring-blue-500/10"
                                placeholder="https://..."
                            />
                            <p className="text-[9px] font-bold text-slate-300 uppercase tracking-wide">Enter the URL of the image from your media library</p>
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
                                    Create Testimonial
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
