const TiptapReact = require('@tiptap/react');
console.log('Has BubbleMenu:', 'BubbleMenu' in TiptapReact);
console.log('Has FloatingMenu:', 'FloatingMenu' in TiptapReact);
console.log('Keys starting with B:', Object.keys(TiptapReact).filter(k => k.startsWith('B')));
