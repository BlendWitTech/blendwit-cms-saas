'use client';

import React from 'react';
import {
    ShieldCheckIcon,
    PencilSquareIcon,
    PaintBrushIcon,
    UsersIcon,
    UserGroupIcon,
    PresentationChartLineIcon,
    MagnifyingGlassIcon,
    KeyIcon,
    PhotoIcon,
    FilmIcon,
    MusicalNoteIcon,
    DocumentTextIcon,
    CommandLineIcon,
    BriefcaseIcon,
    RocketLaunchIcon,
    AcademicCapIcon,
    BeakerIcon,
    GlobeAmericasIcon,
    BoltIcon,
    ChatBubbleBottomCenterTextIcon,
    ComputerDesktopIcon,
    SpeakerWaveIcon,
    QueueListIcon,
    BuildingOfficeIcon,
    CreditCardIcon,
    Cog6ToothIcon,
    GlobeAltIcon,
    CheckIcon,
    XMarkIcon,
    TrashIcon,
    PlusIcon,
    ArrowLeftIcon,
    LockClosedIcon
} from '@heroicons/react/24/outline';

export const iconMap: Record<string, any> = {
    ShieldCheckIcon,
    PencilSquareIcon,
    PaintBrushIcon,
    UsersIcon,
    UserGroupIcon,
    PresentationChartLineIcon,
    MagnifyingGlassIcon,
    KeyIcon,
    PhotoIcon,
    FilmIcon,
    MusicalNoteIcon,
    DocumentTextIcon,
    CommandLineIcon,
    BriefcaseIcon,
    RocketLaunchIcon,
    AcademicCapIcon,
    BeakerIcon,
    GlobeAmericasIcon,
    BoltIcon,
    ChatBubbleBottomCenterTextIcon,
    ComputerDesktopIcon,
    SpeakerWaveIcon,
    QueueListIcon,
    BuildingOfficeIcon,
    CreditCardIcon,
    Cog6ToothIcon,
    GlobeAltIcon
};

export const icons = [
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

interface IconPickerProps {
    value: string;
    onChange: (iconName: string) => void;
    label?: string;
}

export default function IconPicker({ value, onChange, label = "Select Icon" }: IconPickerProps) {
    const CurrentIcon = iconMap[value] || ShieldCheckIcon;

    return (
        <div className="space-y-3">
            <label className="text-sm font-bold text-slate-700">{label}</label>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-center mb-4">
                <CurrentIcon className="h-12 w-12 text-blue-600" />
            </div>
            <div className="grid grid-cols-5 gap-2">
                {icons.map((item) => (
                    <button
                        key={item.name}
                        type="button"
                        title={item.label}
                        onClick={() => onChange(item.name)}
                        className={`p-2 rounded-xl flex items-center justify-center transition-all aspect-square ${value === item.name
                            ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20 scale-110 ring-2 ring-white'
                            : 'bg-white border border-slate-200 text-slate-400 hover:text-slate-600 hover:border-slate-300'
                            }`}
                    >
                        <item.icon className="h-5 w-5" />
                    </button>
                ))}
            </div>
        </div>
    );
}
