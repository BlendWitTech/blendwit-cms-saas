'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    PlusIcon,
    PencilSquareIcon,
    TrashIcon,
    StarIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { apiRequest } from '@/lib/api';
import { useNotification } from '@/context/NotificationContext';

interface Testimonial {
    id: string;
    clientName: string;
    clientRole: string;
    content: string;
    rating: number;
    image: string;
    updatedAt: string;
}

export default function TestimonialsPage() {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { showToast } = useNotification();

    useEffect(() => {
        fetchTestimonials();
    }, []);

    const fetchTestimonials = async () => {
        try {
            setIsLoading(true);
            const data = await apiRequest('/testimonials');
            setTestimonials(data || []);
        } catch (error) {
            console.error('Failed to fetch testimonials:', error);
            showToast('Failed to load testimonials', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this testimonial?')) return;

        try {
            await apiRequest(`/testimonials/${id}`, { method: 'DELETE' });
            showToast('Testimonial deleted successfully', 'success');
            fetchTestimonials();
        } catch (error) {
            console.error('Failed to delete testimonial:', error);
            showToast('Failed to delete testimonial', 'error');
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-display">
                        Client <span className="text-blue-600">Testimonials</span>
                    </h1>
                    <p className="mt-1 text-xs text-slate-500 font-semibold tracking-tight">
                        Manage customer reviews and feedback.
                    </p>
                </div>
                <Link
                    href="/dashboard/testimonials/new"
                    className="px-6 py-2.5 rounded-xl bg-blue-600 shadow-lg shadow-blue-600/30 text-white font-bold text-xs uppercase tracking-widest hover:bg-blue-700 hover:-translate-y-0.5 transition-all active:translate-y-0 active:scale-95 flex items-center gap-2"
                >
                    <PlusIcon className="h-4 w-4" />
                    New Testimonial
                </Link>
            </div>

            {/* List */}
            <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] border border-slate-200/60 shadow-xl shadow-slate-200/20 overflow-hidden">
                {isLoading ? (
                    <div className="p-12 flex justify-center">
                        <div className="w-8 h-8 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin"></div>
                    </div>
                ) : testimonials.length === 0 ? (
                    <div className="p-12 text-center">
                        <p className="text-slate-400 font-medium">No testimonials found. Create one to get started.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-100 bg-slate-50/50">
                                    <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest w-full">Client</th>
                                    <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Rating</th>
                                    <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Date</th>
                                    <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {testimonials.map((testimonial) => (
                                    <tr key={testimonial.id} className="group hover:bg-blue-50/30 transition-colors">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden shrink-0 ring-2 ring-white shadow-sm">
                                                    {testimonial.image ? (
                                                        <img src={testimonial.image} alt={testimonial.clientName} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-600 font-bold text-xs uppercase">
                                                            {testimonial.clientName.charAt(0)}
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-900">{testimonial.clientName}</p>
                                                    <p className="text-xs text-slate-500">{testimonial.clientRole}</p>
                                                    <p className="text-xs text-slate-400 mt-1 line-clamp-1 italic">"{testimonial.content}"</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex text-yellow-400">
                                                {[...Array(5)].map((_, i) => (
                                                    <StarIconSolid key={i} className={`h-4 w-4 ${i < testimonial.rating ? 'text-yellow-400' : 'text-slate-200'}`} />
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <p className="text-xs font-semibold text-slate-500">
                                                {new Date(testimonial.updatedAt).toLocaleDateString()}
                                            </p>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Link
                                                    href={`/dashboard/testimonials/${testimonial.id}`}
                                                    className="p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                                                >
                                                    <PencilSquareIcon className="h-4 w-4" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(testimonial.id)}
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
