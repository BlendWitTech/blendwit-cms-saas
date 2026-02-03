try {
    const Menus = require('@tiptap/react/menus'); // This might fail if node doesn't respect exports field in require without flag, but let's try.
    // actually, require might not support subpath exports in older node, but we are in dev env.
    console.log('Exports from @tiptap/react/menus:', Object.keys(Menus));
} catch (e) {
    console.log('Failed to require @tiptap/react/menus', e.message);

    // Try finding the file directly?
    try {
        const MenusDist = require('d:/Blendwit Product/cms/node_modules/@tiptap/react/dist/menus/index.cjs');
        console.log('Exports from direct dist cjs:', Object.keys(MenusDist));
    } catch (e2) {
        console.log('Failed direct dist load', e2.message);
    }
}
