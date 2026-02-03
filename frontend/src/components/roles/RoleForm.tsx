import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Changed from Link import
import UnsavedChangesAlert from '@/components/ui/UnsavedChangesAlert';
import {
    Cog6ToothIcon,
    BriefcaseIcon,
    AcademicCapIcon,
    BeakerIcon,
    GlobeAmericasIcon,
    BoltIcon,
    ChatBubbleBottomCenterTextIcon,
    RocketLaunchIcon,
    CommandLineIcon,
    ShieldCheckIcon,
    XMarkIcon,
    DocumentTextIcon,
    PhotoIcon,
    UsersIcon,
    PaintBrushIcon,
    PencilSquareIcon,
    IdentificationIcon,
    PresentationChartLineIcon,
    KeyIcon,
    ArchiveBoxIcon,
    UserGroupIcon,
    MagnifyingGlassIcon,
    MusicalNoteIcon,
    FilmIcon,
    ComputerDesktopIcon,
    SpeakerWaveIcon,
    QueueListIcon,
    BuildingOfficeIcon,
    CreditCardIcon,
    ArrowLeftIcon,
    CheckIcon
} from '@heroicons/react/24/outline';

interface RoleFormProps {
    initialData?: any;
    onSave: (data: any) => Promise<void>;
    isLoading?: boolean;
    title: string;
    subtitle?: string;
}

export default function RoleForm({ initialData, onSave, isLoading: externalLoading, title, subtitle }: RoleFormProps) {
    const router = useRouter();
    const [name, setName] = useState('');
    const [permissions, setPermissions] = useState({
        manage_content: false,
        manage_media: false,
        manage_users: false,
        manage_settings: false,
    });
    const [icon, setIcon] = useState('ShieldCheckIcon');
    const [isSaving, setIsSaving] = useState(false);
    const [showUnsavedAlert, setShowUnsavedAlert] = useState(false);

    // Capture initial state for comparison
    const [initialState, setInitialState] = useState<{ name: string, icon: string, permissions: any }>({
        name: '',
        icon: 'ShieldCheckIcon',
        permissions: {
            manage_content: false,
            manage_media: false,
            manage_users: false,
            manage_settings: false,
        }
    });

    useEffect(() => {
        if (initialData) {
            const loadedName = initialData.name || '';
            const loadedIcon = initialData.icon || 'ShieldCheckIcon';
            let loadedPermissions;

            if (initialData.name === 'Super Admin') {
                loadedPermissions = {
                    manage_content: true,
                    manage_media: true,
                    manage_users: true,
                    manage_settings: true,
                };
            } else {
                loadedPermissions = {
                    manage_content: initialData.permissions?.manage_content || false,
                    manage_media: initialData.permissions?.manage_media || false,
                    manage_users: initialData.permissions?.manage_users || false,
                    manage_settings: initialData.permissions?.manage_settings || false,
                };
            }

            setName(loadedName);
            setIcon(loadedIcon);
            setPermissions(loadedPermissions);
            setInitialState({ name: loadedName, icon: loadedIcon, permissions: loadedPermissions });
        }
    }, [initialData]);

    const isDirty = () => {
        const currentPermissions = JSON.stringify(permissions);
        const initialPermissions = JSON.stringify(initialState.permissions);
        return name !== initialState.name || icon !== initialState.icon || currentPermissions !== initialPermissions;
    };

    const handleCancelClick = () => {
        if (isDirty()) {
            setShowUnsavedAlert(true);
        } else {
            router.push('/dashboard/roles');
        }
    };

    const saveChanges = async () => {
        setIsSaving(true);
        try {
            await onSave({ name, icon, ...permissions });
        } catch (error) {
            console.error(error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await saveChanges();
    };

    const togglePermission = (key: keyof typeof permissions) => {
        setPermissions(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const permissionConfig = [
        { key: 'manage_content', label: 'Content Management', icon: DocumentTextIcon, desc: 'Create, edit, and publish blog posts, pages, and other content types.' },
        { key: 'manage_media', label: 'Media Library', icon: PhotoIcon, desc: 'Upload, organize, and manage images, videos, and documents.' },
        { key: 'manage_users', label: 'User Management', icon: UsersIcon, desc: 'Invite new users, manage roles, and configure access levels.' },
        { key: 'manage_settings', label: 'System Settings', icon: Cog6ToothIcon, desc: 'Configure global settings, integrations, and system preferences.' },
    ];

    const icons = [
        { name: 'ShieldCheckIcon', icon: ShieldCheckIcon, label: 'Admin/Security' },
        { name: 'PencilSquareIcon', icon: PencilSquareIcon, label: 'Editor/Writer' },
        { name: 'PaintBrushIcon', icon: PaintBrushIcon, label: 'Designer/UI' },
        { name: 'UsersIcon', icon: UsersIcon, label: 'HR/People' },
        { name: 'UserGroupIcon', icon: UserGroupIcon, label: 'Community/Support' },
        { name: 'PresentationChartLineIcon', icon: PresentationChartLineIcon, label: 'Marketing/Growth' },
        { name: 'MagnifyingGlassIcon', icon: MagnifyingGlassIcon, label: 'SEO/Analyst' },
        { name: 'CommandLineIcon', icon: CommandLineIcon, label: 'Developer/IT' },
        { name: 'ComputerDesktopIcon', icon: ComputerDesktopIcon, label: 'System Admin' },
        { name: 'SpeakerWaveIcon', icon: SpeakerWaveIcon, label: 'Comms/PR' },
        { name: 'QueueListIcon', icon: QueueListIcon, label: 'DevOps/Ops' },
        { name: 'BuildingOfficeIcon', icon: BuildingOfficeIcon, label: 'Corporate' },
        { name: 'CreditCardIcon', icon: CreditCardIcon, label: 'Finance/Billing' },
        { name: 'DocumentTextIcon', icon: DocumentTextIcon, label: 'Content Creator' },
        { name: 'PhotoIcon', icon: PhotoIcon, label: 'Media Manager' },
        { name: 'FilmIcon', icon: FilmIcon, label: 'Video Editor' },
        { name: 'MusicalNoteIcon', icon: MusicalNoteIcon, label: 'Audio Engineer' },
        { name: 'BriefcaseIcon', icon: BriefcaseIcon, label: 'Business' },
        { name: 'AcademicCapIcon', icon: AcademicCapIcon, label: 'Legal/Compliance' },
        { name: 'RocketLaunchIcon', icon: RocketLaunchIcon, label: 'Owner/Founder' },
    ];

    const CurrentIcon = icons.find(i => i.name === icon)?.icon || ShieldCheckIcon;
    const isLoading = externalLoading || isSaving;

    return (
        <form onSubmit={handleSubmit} className="max-w-5xl mx-auto pb-20">
            <UnsavedChangesAlert
                isOpen={showUnsavedAlert}
                onSaveAndExit={async () => {
                    await saveChanges();
                    // Assumes onSave redirects. If not, we might need router.push here if successful.
                    // But onSave typically keeps us on page or redirects. 
                    // Let's assume onSave handles it.
                }}
                onDiscardAndExit={() => router.push('/dashboard/roles')}
                onCancel={() => setShowUnsavedAlert(false)}
                isSaving={isSaving}
            />

            {/* Header / Nav */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-4">
                    <button
                        type="button"
                        onClick={handleCancelClick}
                        className="p-2 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-200 transition-all"
                    >
                        <ArrowLeftIcon className="h-5 w-5" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 font-display tracking-tight">{title}</h1>
                        {subtitle && <p className="text-sm font-medium text-slate-500">{subtitle}</p>}
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={handleCancelClick}
                        className="px-6 py-2.5 rounded-xl text-sm font-bold text-slate-600 hover:text-slate-900 hover:bg-white transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="inline-flex items-center gap-2 px-8 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-bold shadow-lg shadow-slate-900/20 hover:bg-blue-600 hover:shadow-blue-600/20 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <CheckIcon className="h-5 w-5" strokeWidth={3} />
                        )}
                        <span>Save Role</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Basic Info */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/50">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Role Details</h3>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700">Role Name</label>
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    disabled={initialData?.name === 'Super Admin' || initialData?.name === 'Admin'}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white focus:border-blue-600 transition-all"
                                    placeholder="e.g. Content Moderator"
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="text-sm font-bold text-slate-700">Role Icon</label>
                                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-center mb-4">
                                    <CurrentIcon className="h-12 w-12 text-blue-600" />
                                </div>
                                <div className="grid grid-cols-5 gap-2">
                                    {icons.map((item) => (
                                        <button
                                            key={item.name}
                                            type="button"
                                            title={item.label}
                                            onClick={() => setIcon(item.name)}
                                            className={`p-2 rounded-xl flex items-center justify-center transition-all aspect-square ${icon === item.name
                                                ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20 scale-110 ring-2 ring-white'
                                                : 'bg-white border border-slate-200 text-slate-400 hover:text-slate-600 hover:border-slate-300'
                                                }`}
                                        >
                                            <item.icon className="h-5 w-5" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Permissions */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200/50">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 font-display">Permissions</h3>
                                <p className="text-sm text-slate-500">Configure what users with this role can access.</p>
                            </div>
                            <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-lg uppercase tracking-wider">
                                {Object.values(permissions).filter(Boolean).length} Active
                            </span>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            {permissionConfig.map((perm) => (
                                <div
                                    key={perm.key}
                                    onClick={() => togglePermission(perm.key as any)}
                                    className={`relative group flex items-start gap-5 p-5 rounded-2xl border cursor-pointer transition-all duration-300 ${permissions[perm.key as keyof typeof permissions]
                                        ? 'bg-blue-50/50 border-blue-200 shadow-sm'
                                        : 'bg-white border-slate-100 hover:bg-slate-50 hover:border-slate-200'
                                        }`}
                                >
                                    <div className={`mt-1 p-3 rounded-2xl transition-colors ${permissions[perm.key as keyof typeof permissions]
                                        ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
                                        : 'bg-slate-100 text-slate-400 group-hover:bg-white group-hover:text-slate-600 group-hover:shadow-md'
                                        }`}>
                                        <perm.icon className="h-6 w-6" />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-4">
                                            <h4 className={`text-base font-bold ${permissions[perm.key as keyof typeof permissions] ? 'text-blue-900' : 'text-slate-900'}`}>
                                                {perm.label}
                                            </h4>
                                            <div className={`relative flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${permissions[perm.key as keyof typeof permissions] ? 'bg-blue-600' : 'bg-slate-200'}`}>
                                                <span className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${permissions[perm.key as keyof typeof permissions] ? 'translate-x-5' : 'translate-x-0'}`} />
                                            </div>
                                        </div>
                                        <p className="mt-1 text-sm text-slate-500 leading-relaxed max-w-lg">
                                            {perm.desc}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}
