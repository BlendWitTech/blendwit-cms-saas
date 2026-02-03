'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    HomeIcon,
    DocumentTextIcon,
    PhotoIcon,
    UserGroupIcon,
    Cog6ToothIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    ChevronDownIcon,
    ChartBarIcon,
    Bars3Icon,
    CodeBracketIcon,
    SwatchIcon
} from '@heroicons/react/24/outline';
import { apiRequest } from '@/lib/api';
import { useSettings } from '@/context/SettingsContext';

const initialNavigation = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    {
        name: 'Site Pages',
        icon: DocumentTextIcon,
        id: 'site-pages', // Add ID to easily find it
        children: [
            {
                name: 'Static Pages',
                children: [
                    { name: 'Home', href: '/dashboard/pages/home' },
                    { name: 'About', href: '/dashboard/pages/about' },
                    { name: 'Contact', href: '/dashboard/pages/contact' }
                ]
            },
            {
                name: 'Dynamic Pages',
                children: [
                    { name: 'Blog List', href: '/dashboard/pages/blog-list' },
                    { name: 'Blog Details', href: '/dashboard/pages/blog-details' },
                    { name: 'Project List', href: '/dashboard/pages/project-list' },
                    { name: 'Project Details', href: '/dashboard/pages/project-details' }
                ]
            }
        ]
    },
    {
        name: 'Content',
        icon: DocumentTextIcon,
        children: [
            { name: 'Menus', href: '/dashboard/menus', icon: Bars3Icon },
            { name: 'Projects', href: '/dashboard/projects' },
            { name: 'Services', href: '/dashboard/services' },
            { name: 'Team', href: '/dashboard/team' },
            { name: 'Timeline', href: '/dashboard/timeline' },
            { name: 'Testimonials', href: '/dashboard/testimonials' },
            { name: 'Blog Posts', href: '/dashboard/blog' },
            { name: 'Categories', href: '/dashboard/categories' },
        ]
    },
    { name: 'Media', href: '/dashboard/media', icon: PhotoIcon },
    {
        name: 'User Management',
        icon: UserGroupIcon,
        children: [
            { name: 'All Users', href: '/dashboard/users' },
            { name: 'Roles & Permissions', href: '/dashboard/roles' },
        ]
    },
    {
        name: 'SEO & Analytics',
        icon: ChartBarIcon,
        children: [
            { name: 'Analytics', href: '/dashboard/analytics' },
            { name: 'SEO Manager', href: '/dashboard/seo' },
        ]
    },
    { name: 'Themes', href: '/dashboard/themes', icon: SwatchIcon },
    { name: 'Settings', href: '/dashboard/settings', icon: Cog6ToothIcon },
];

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ');
}

// Recursive Sidebar Item Component
const SidebarItem = ({ item, isCollapsed, isActive, pathname, level = 0 }: any) => {
    const [isOpen, setIsOpen] = useState(false);
    const hasChildren = item.children && item.children.length > 0;

    // Auto-expand if active child
    useEffect(() => {
        if (hasChildren && item.children.some((child: any) =>
            child.href === pathname ||
            (child.children && child.children.some((c: any) => c.href === pathname))
        )) {
            setIsOpen(true);
        }
    }, [pathname, hasChildren, item.children]);

    const toggleOpen = () => setIsOpen(!isOpen);

    // If level > 0 (nested), render simpler link
    if (level > 0) {
        if (hasChildren) {
            return (
                <li className="select-none">
                    <button
                        onClick={toggleOpen}
                        className={classNames(
                            isOpen ? "text-slate-900" : "text-slate-500",
                            "flex w-full items-center justify-between py-1.5 pr-2 text-xs font-bold hover:text-blue-600 transition-colors ml-3"
                        )}
                    >
                        <span>{item.name}</span>
                        <ChevronDownIcon className={classNames("h-3 w-3 transition-transform", isOpen ? "rotate-180" : "")} />
                    </button>
                    {isOpen && (
                        <ul className="mt-1 ml-3 border-l-2 border-slate-100 pl-3 space-y-1">
                            {item.children.map((child: any) => (
                                <SidebarItem
                                    key={child.name}
                                    item={child}
                                    isCollapsed={isCollapsed}
                                    isActive={child.href === pathname}
                                    pathname={pathname}
                                    level={level + 1}
                                />
                            ))}
                        </ul>
                    )}
                </li>
            );
        }
        return (
            <li>
                <Link
                    href={item.href || '#'}
                    className={classNames(
                        pathname === item.href ? 'text-blue-600 font-bold bg-blue-50/50' : 'text-slate-500 hover:text-slate-900',
                        'block rounded-lg px-2 py-1.5 text-xs font-semibold transition-all ml-1'
                    )}
                >
                    {item.name}
                </Link>
            </li>
        );
    }

    // Top Level Item (Icon + Text)
    return (
        <li className="relative group/item px-2">
            {hasChildren ? (
                <>
                    <button
                        onClick={toggleOpen}
                        className={classNames(
                            isActive || isOpen
                                ? 'text-blue-600 bg-blue-50/50'
                                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80',
                            'group flex w-full items-center gap-x-3 rounded-xl p-2.5 text-sm font-bold transition-all duration-300 ease-out relative overflow-hidden',
                            isCollapsed ? 'justify-center' : ''
                        )}
                    >
                        {isActive && !isCollapsed && (
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-blue-600 rounded-r-full shadow-[0_0_8px_rgba(37,99,235,0.4)]" />
                        )}
                        {item.icon && (
                            <item.icon
                                className={classNames(
                                    isActive || isOpen ? 'text-blue-600 drop-shadow-[0_0_8px_rgba(37,99,235,0.2)]' : 'text-slate-500 group-hover:text-blue-600',
                                    'h-5 w-5 shrink-0 transition-all duration-300'
                                )}
                                aria-hidden="true"
                            />
                        )}
                        {!isCollapsed && (
                            <>
                                <span className="animate-in fade-in duration-500 font-bold flex-1 text-left">{item.name}</span>
                                <ChevronDownIcon className={classNames(
                                    "ml-auto h-3 w-3 transition-transform duration-300 text-slate-400 opacity-70",
                                    isOpen ? "rotate-180 text-blue-600 opacity-100" : ""
                                )} />
                            </>
                        )}
                    </button>
                    {!isCollapsed && isOpen && (
                        <ul className="mt-1 ml-4 space-y-1 border-l border-slate-100 pl-4 animate-in slide-in-from-top-1 fade-in duration-300">
                            {item.children.map((child: any) => (
                                <SidebarItem
                                    key={child.name}
                                    item={child}
                                    isCollapsed={false}
                                    isActive={child.href === pathname}
                                    pathname={pathname}
                                    level={level + 1}
                                />
                            ))}
                        </ul>
                    )}
                </>
            ) : (
                <Link
                    href={item.href || '#'}
                    className={classNames(
                        isActive
                            ? 'text-blue-600 bg-blue-50/50'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80',
                        'group flex items-center gap-x-3 rounded-xl p-2.5 text-sm font-bold transition-all duration-300 ease-out relative overflow-hidden',
                        isCollapsed ? 'justify-center' : ''
                    )}
                >
                    {isActive && !isCollapsed && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-blue-600 rounded-r-full shadow-[0_0_8px_rgba(37,99,235,0.4)]" />
                    )}
                    {item.icon && (
                        <item.icon
                            className={classNames(
                                isActive ? 'text-blue-600 drop-shadow-[0_0_8px_rgba(37,99,235,0.2)]' : 'text-slate-500 group-hover:text-blue-600',
                                'h-5 w-5 shrink-0 transition-all duration-300 group-hover:scale-110'
                            )}
                            aria-hidden="true"
                        />
                    )}
                    {!isCollapsed && (
                        <span className="animate-in fade-in duration-500 font-bold">{item.name}</span>
                    )}
                </Link>
            )}
        </li>
    );
};

interface SidebarProps {
    isCollapsed: boolean;
    onToggle: () => void;
}

export default function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
    const pathname = usePathname();
    const [navItems, setNavItems] = useState(initialNavigation);

    // Keyboard Shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === '[') onToggle();
            if (e.key === ']') onToggle();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onToggle]);

    useEffect(() => {
        checkThemeStatus();
    }, []);

    const checkThemeStatus = async () => {
        try {
            // Check if any pages exist (implies theme is active/imported)
            const pages = await apiRequest('/pages', { skipNotification: true });
            const hasTheme = Array.isArray(pages) && pages.length > 0;

            if (hasTheme) {
                // If theme exists, populate the "Static Pages" submenu with actual pages
                setNavItems(prev => prev.map((item: any) => {
                    if (item.name === 'Site Pages') {
                        return {
                            ...item,
                            children: item.children?.map((subItem: any) => {
                                if (subItem.name === 'Static Pages') {
                                    return {
                                        ...subItem,
                                        children: pages.map((page: any) => ({
                                            name: page.title,
                                            href: `/dashboard/pages/${page.id}` // Use ID for editing
                                        }))
                                    };
                                }
                                return subItem;
                            })
                        };
                    }
                    return item;
                }) as any);
            } else {
                // If no theme, modify navigation to make "Site Pages" a direct link (alert trigger)
                setNavItems(prev => prev.map((item: any) => {
                    if (item.name === 'Site Pages') {
                        const { children, ...rest } = item;
                        return {
                            ...rest,
                            href: '/dashboard/pages'
                        };
                    }
                    return item;
                }) as any);
            }
        } catch (error) {
            console.error('Failed to check theme status:', error);
            // Fallback: Assume no theme if error
            setNavItems(prev => prev.map((item: any) => {
                if (item.name === 'Site Pages') {
                    const { children, ...rest } = item;
                    return {
                        ...rest,
                        href: '/dashboard/pages'
                    };
                }
                return item;
            }) as any);
        }
    };

    const { settings } = useSettings();

    return (
        <div className="relative flex grow flex-col border-r border-slate-200/40 bg-white/70 backdrop-blur-3xl transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] shadow-[1px_0_10px_rgba(0,0,0,0.02)] isolate">
            {/* Informative Floating Toggle Button */}
            <div className="fixed lg:absolute -right-3 top-8 z-[100] group/toggle">
                <button
                    onClick={onToggle}
                    className="relative flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 bg-white shadow-lg shadow-slate-200 text-slate-400 hover:text-blue-600 hover:border-blue-200 hover:scale-110 active:scale-95 transition-all duration-500"
                >
                    <ChevronLeftIcon className={classNames(
                        "h-3.5 w-3.5 transition-transform duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
                        isCollapsed ? "rotate-180" : ""
                    )} />
                </button>
                <div className="absolute left-full ml-3 px-2 py-1.5 bg-slate-900/95 backdrop-blur-sm text-white rounded-lg opacity-0 group-hover/toggle:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap shadow-xl border border-white/10 flex flex-col gap-1">
                    <p className="text-[10px] font-bold uppercase tracking-widest">{isCollapsed ? "Expand ([)" : "Collapse (])"}</p>
                    <p className="text-[8px] font-medium text-slate-400 uppercase tracking-[0.2em]">System: Active</p>
                </div>
            </div>

            {/* Scrollable Content Container */}
            <div className="flex flex-col grow overflow-y-auto px-1.5 pb-4 custom-scrollbar overflow-x-visible">
                <div className="flex h-16 shrink-0 items-center px-3.5 pt-4">
                    {!isCollapsed ? (
                        <div className="flex flex-col">
                            <span className="text-lg font-black tracking-tight text-slate-900 animate-in fade-in zoom-in duration-500 font-display leading-none">
                                {settings['site_title']?.toUpperCase() || 'BLENDWIT'}
                                <span className="text-blue-600 ml-0.5 font-bold">CMS</span>
                            </span>
                            {settings['site_tagline'] && (
                                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1 animate-in fade-in slide-in-from-left-2 duration-700">
                                    {settings['site_tagline']}
                                </span>
                            )}
                        </div>
                    ) : (
                        <div className="mx-auto w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 shadow-lg shadow-blue-500/30 flex items-center justify-center text-white font-bold text-sm animate-in fade-in zoom-in spin-in-12 duration-700">
                            {settings['site_title'] ? settings['site_title'].charAt(0).toUpperCase() : 'B'}
                        </div>
                    )}
                </div>

                <nav className="flex flex-1 flex-col mt-4">
                    <ul role="list" className="flex flex-1 flex-col gap-y-6">
                        <li>
                            <div className={`text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-3.5 flex items-center transition-all duration-500 font-display ${isCollapsed ? 'justify-center opacity-0 scale-50' : 'opacity-100'}`}>
                                {!isCollapsed ? 'Management' : '•••'}
                            </div>
                            <ul role="list" className="flex flex-1 flex-col gap-y-1 px-3">
                                {navItems.map((item) => (
                                    <SidebarItem
                                        key={item.name}
                                        item={item}
                                        isCollapsed={isCollapsed}
                                        isActive={
                                            item.href === pathname ||
                                            (item.children && item.children.some((child: any) =>
                                                child.href === pathname ||
                                                (child.children && child.children.some((c: any) => c.href === pathname))
                                            ))
                                        }
                                        pathname={pathname}
                                    />
                                ))}
                            </ul>
                        </li>
                    </ul>
                </nav>

                <div className="mt-auto px-2 pt-6 pb-2">
                    {!isCollapsed && (
                        <div className="relative overflow-hidden rounded-2xl bg-slate-900 p-5 shadow-2xl transition-all duration-500 shadow-slate-900/20 animate-in fade-in zoom-in duration-700 group/widget">
                            <div className="absolute -top-6 -right-6 w-20 h-20 bg-blue-500/10 rounded-full blur-2xl group-hover/widget:bg-blue-500/20 transition-all duration-700"></div>
                            <div className="flex items-center gap-2 mb-3">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse"></span>
                                <p className="text-[9px] font-bold text-blue-400 uppercase tracking-widest leading-none font-display">Hub Sync Active</p>
                            </div>
                            <p className="text-[11px] text-white/90 font-semibold leading-relaxed">
                                System is fully optimized and synchronized.
                            </p>
                            <button className="mt-4 w-full bg-white/5 hover:bg-white/10 text-white/80 hover:text-white py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-[0.15em] transition-all active:scale-95 border border-white/5 hover:border-white/10">
                                Management Hub
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
