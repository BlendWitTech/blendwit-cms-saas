const TiptapReact = require('@tiptap/react');
console.log('Exports from @tiptap/react:', Object.keys(TiptapReact));
try {
    const BubbleMenu = require('@tiptap/extension-bubble-menu');
    console.log('BubbleMenu Extension found:', !!BubbleMenu);
} catch (e) {
    console.log('BubbleMenu Extension NOT found');
}
