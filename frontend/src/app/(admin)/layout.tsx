'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const pathname = usePathname();
    const isMediaPage = pathname?.includes('/media');

    return (
        <div className="min-h-screen bg-[#F8FAFC] text-slate-900 selection:bg-blue-100 selection:text-blue-900">
            {/* Soft Ambient Glows */}
            <div className="fixed top-[-5%] left-[-5%] w-[40%] h-[40%] bg-blue-400/5 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="fixed bottom-[-5%] right-[-5%] w-[35%] h-[35%] bg-indigo-400/5 rounded-full blur-[100px] pointer-events-none"></div>

            {/* Sidebar - Desktop */}
            <div className={`fixed inset-y-0 left-0 z-50 hidden lg:flex lg:flex-col transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${isCollapsed ? 'lg:w-20' : 'lg:w-72'}`}>
                <Sidebar isCollapsed={isCollapsed} onToggle={() => setIsCollapsed(!isCollapsed)} />
            </div>

            {/* Main Content Area */}
            <div className={`relative flex min-h-screen flex-1 flex-col overflow-x-hidden bg-mesh custom-scrollbar transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${isCollapsed ? 'lg:pl-20' : 'lg:pl-72'}`}>
                <Header isCollapsed={isCollapsed} />
                <main className="flex-1 flex flex-col">
                    <div className={`relative flex-1 ${isMediaPage ? 'p-0' : 'p-8'}`}>
                        {/* Subtle background glow */}
                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-100/10 rounded-full blur-[120px] pointer-events-none" />
                        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-100/10 rounded-full blur-[120px] pointer-events-none" />

                        <div className="relative z-10 flex-1 h-full">
                            {children}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
