'use client';

import MenuEditor from '../[id]/page';

export default function NewMenu() {
    return <MenuEditor params={Promise.resolve({ id: 'new' })} />;
}
