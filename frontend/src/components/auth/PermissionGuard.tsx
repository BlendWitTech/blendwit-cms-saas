'use client';

import React, { ReactNode } from 'react';
import { usePermissions } from '@/context/PermissionsContext';
import { LockClosedIcon } from '@heroicons/react/24/solid';

interface PermissionGuardProps {
    permission: string | string[];
    children: ReactNode;
    behavior?: 'hide' | 'disable' | 'lock';
    fallback?: ReactNode;
}

/**
 * Reusable component to wrap UI elements that require specific permissions.
 * behavior 'hide' (default): Removes the component entirely.
 * behavior 'disable': Disables the button/input (if applicable) and adds opacity.
 * behavior 'lock': Shows a lock icon overlay or next to the element.
 */
export default function PermissionGuard({
    permission,
    children,
    behavior = 'hide',
    fallback = null
}: PermissionGuardProps) {
    const { hasPermission, isLoading } = usePermissions();

    if (isLoading) return null;

    const permitted = hasPermission(permission);

    if (permitted) {
        return <>{children}</>;
    }

    if (behavior === 'hide') {
        return <>{fallback}</>;
    }

    if (behavior === 'disable' || behavior === 'lock') {
        const child = React.Children.only(children) as any;

        return React.cloneElement(child, {
            ...child.props,
            disabled: true,
            title: `You do not have permission to perform this action`,
            className: `${child.props.className || ''} opacity-50 cursor-not-allowed pointer-events-none relative`,
            children: (
                <>
                    {child.props.children}
                    {behavior === 'lock' && (
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                            <LockClosedIcon className="h-4 w-4 text-slate-400" />
                        </div>
                    )}
                </>
            )
        });
    }

    return null;
}
