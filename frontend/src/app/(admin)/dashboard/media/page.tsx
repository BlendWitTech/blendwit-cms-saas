'use client';

import React from 'react';
import MediaLibrary from '@/components/media/MediaLibrary';

export default function MediaPage() {
    return (
        <div className="h-full">
            <MediaLibrary isStandalone />
        </div>
    );
}
