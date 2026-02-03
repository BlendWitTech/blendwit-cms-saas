import React, { useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react/menus';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Typography from '@tiptap/extension-typography';
import Highlight from '@tiptap/extension-highlight';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { createLowlight, common } from 'lowlight';
import FontFamily from '@tiptap/extension-font-family';
import { TextStyle } from '@tiptap/extension-text-style';
import { Extension, Node } from '@tiptap/core';
import BubbleMenuExtension from '@tiptap/extension-bubble-menu';

// Custom Font Size Extension
const FontSize = Extension.create({
    name: 'fontSize',
    addOptions() {
        return {
            types: ['textStyle'],
        };
    },
    addGlobalAttributes() {
        return [
            {
                types: this.options.types,
                attributes: {
                    fontSize: {
                        default: null,
                        parseHTML: element => element.style.fontSize.replace(/['"]+/g, ''),
                        renderHTML: attributes => {
                            if (!attributes.fontSize) {
                                return {};
                            }
                            return {
                                style: `font-size: ${attributes.fontSize}`,
                            };
                        },
                    },
                },
            },
        ];
    },
    addCommands() {
        return {
            setFontSize: fontSize => ({ chain }) => {
                return chain()
                    .setMark('textStyle', { fontSize })
                    .run();
            },
            unsetFontSize: () => ({ chain }) => {
                return chain()
                    .setMark('textStyle', { fontSize: null })
                    .removeEmptyTextStyle()
                    .run();
            },
        };
    },
});

const lowlight = createLowlight(common);

import {
    BoldIcon,
    ItalicIcon,
    ListBulletIcon,
    PhotoIcon,
    LinkIcon,
    ArrowUturnLeftIcon,
    ArrowUturnRightIcon,
    Bars3BottomLeftIcon,
    Bars3Icon,
    Bars3BottomRightIcon,
    QueueListIcon,
    MinusIcon,
    CodeBracketIcon,
    PaintBrushIcon,
    ChatBubbleBottomCenterTextIcon,
    NoSymbolIcon,
    ListBulletIcon as UnorderedListIcon,
    QueueListIcon as OrderedListIcon,
    Bars3Icon as UnderlineIcon // We'll keep this but rename internally if needed, or find better
} from '@heroicons/react/24/outline';
import MediaLibrary from '../media/MediaLibrary';

// Custom icons for headings since Heroicons doesn't provide them
const H1Icon = () => <span className="text-[10px] font-black leading-none">H1</span>;
const H2Icon = () => <span className="text-[10px] font-black leading-none">H2</span>;
const H3Icon = () => <span className="text-[10px] font-black leading-none">H3</span>;

const MenuButton = ({ onClick, isActive = false, icon: Icon, title }: any) => (
    <button
        onClick={onClick}
        title={title}
        className={`p-2 rounded-xl transition-all duration-200 ${isActive
            ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20 scale-105'
            : 'hover:bg-slate-100 text-slate-500 hover:text-slate-900'
            }`}
    >
        <Icon className="h-4 w-4" strokeWidth={2.5} />
    </button>
);

const BubbleButton = ({ onClick, isActive = false, icon: Icon, label }: any) => (
    <button
        onClick={onClick}
        title={label}
        className={`p-2 rounded-xl transition-all duration-200 ${isActive
            ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/10'
            : 'hover:bg-slate-50 text-slate-400 hover:text-slate-900'
            }`}
    >
        <Icon className="h-3.5 w-3.5" strokeWidth={3} />
    </button>
);

const MenuBar = ({ editor, onOpenMedia }: { editor: any, onOpenMedia: () => void }) => {
    if (!editor) return null;

    const setLink = () => {
        const url = window.prompt('URL');
        if (url) editor.chain().focus().setLink({ href: url }).run();
    };

    const fontFamilies = [
        { label: 'Default', value: '' },
        { label: 'Inter', value: 'Inter, sans-serif' },
        { label: 'Serif', value: 'ui-serif, Georgia, serif' },
        { label: 'Mono', value: 'ui-monospace, SFMono-Regular, monospace' },
        { label: 'Outfit', value: 'Outfit, sans-serif' },
    ];

    const fontSizes = [
        { label: 'Small', value: '12px' },
        { label: 'Normal', value: '16px' },
        { label: 'Large', value: '20px' },
        { label: 'Extra Large', value: '24px' },
        { label: 'Title', value: '32px' },
    ];

    return (
        <div className="flex flex-wrap items-center gap-1.5 p-4 border-b border-slate-100 bg-slate-50/30 backdrop-blur-sm sticky top-0 z-20 rounded-t-[2.5rem]">
            {/* History */}
            <div className="flex items-center gap-1 pr-3 mr-3 border-r border-slate-200">
                <MenuButton onClick={() => editor.chain().focus().undo().run()} icon={ArrowUturnLeftIcon} title="Undo" />
                <MenuButton onClick={() => editor.chain().focus().redo().run()} icon={ArrowUturnRightIcon} title="Redo" />
            </div>

            {/* Typography Groups */}
            <div className="flex items-center gap-1 pr-3 mr-3 border-r border-slate-200">
                <MenuButton onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} isActive={editor.isActive('heading', { level: 1 })} icon={H1Icon} title="Heading 1" />
                <MenuButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} isActive={editor.isActive('heading', { level: 2 })} icon={H2Icon} title="Heading 2" />
                <MenuButton onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} isActive={editor.isActive('heading', { level: 3 })} icon={H3Icon} title="Heading 3" />
            </div>

            {/* Font Family */}
            <div className="flex items-center pr-3 mr-3 border-r border-slate-200">
                <select
                    onChange={(e) => editor.chain().focus().setFontFamily(e.target.value).run()}
                    value={editor.getAttributes('textStyle').fontFamily || ''}
                    className="bg-transparent text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-blue-600 outline-none cursor-pointer"
                >
                    {fontFamilies.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
                </select>
            </div>

            {/* Font Size */}
            <div className="flex items-center pr-3 mr-3 border-r border-slate-200">
                <select
                    onChange={(e) => editor.chain().focus().setFontSize(e.target.value).run()}
                    value={editor.getAttributes('textStyle').fontSize || ''}
                    className="bg-transparent text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-blue-600 outline-none cursor-pointer"
                >
                    <option value="">Size</option>
                    {fontSizes.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
            </div>

            {/* Text Style */}
            <div className="flex items-center gap-1 pr-3 mr-3 border-r border-slate-200">
                <MenuButton onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive('bold')} icon={BoldIcon} title="Bold" />
                <MenuButton onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive('italic')} icon={ItalicIcon} title="Italic" />
                <MenuButton onClick={() => editor.chain().focus().toggleUnderline().run()} isActive={editor.isActive('underline')} icon={UnderlineIcon} title="Underline" />
                <MenuButton onClick={() => editor.chain().focus().toggleHighlight().run()} isActive={editor.isActive('highlight')} icon={PaintBrushIcon} title="Highlight" />
            </div>

            {/* Alignment */}
            <div className="flex items-center gap-1 pr-3 mr-3 border-r border-slate-200">
                <MenuButton onClick={() => editor.chain().focus().setTextAlign('left').run()} isActive={editor.isActive({ textAlign: 'left' })} icon={Bars3BottomLeftIcon} title="Align Left" />
                <MenuButton onClick={() => editor.chain().focus().setTextAlign('center').run()} isActive={editor.isActive({ textAlign: 'center' })} icon={Bars3Icon} title="Align Center" />
                <MenuButton onClick={() => editor.chain().focus().setTextAlign('right').run()} isActive={editor.isActive({ textAlign: 'right' })} icon={Bars3BottomRightIcon} title="Align Right" />
            </div>

            {/* Blocks */}
            <div className="flex items-center gap-1 pr-3 mr-3 border-r border-slate-200">
                <MenuButton onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive('bulletList')} icon={UnorderedListIcon} title="Bullet List" />
                <MenuButton onClick={() => editor.chain().focus().toggleOrderedList().run()} isActive={editor.isActive('orderedList')} icon={OrderedListIcon} title="Ordered List" />
                <MenuButton onClick={() => editor.chain().focus().toggleBlockquote().run()} isActive={editor.isActive('blockquote')} icon={ChatBubbleBottomCenterTextIcon} title="Blockquote" />
                <MenuButton onClick={() => editor.chain().focus().toggleCodeBlock().run()} isActive={editor.isActive('codeBlock')} icon={CodeBracketIcon} title="Code Block" />
            </div>

            {/* Insertion & Clean */}
            <div className="flex items-center gap-1">
                <MenuButton onClick={onOpenMedia} icon={PhotoIcon} title="Insert Image from Media Library" />
                <MenuButton onClick={setLink} isActive={editor.isActive('link')} icon={LinkIcon} title="Set Link" />
                <MenuButton onClick={() => editor.chain().focus().setHorizontalRule().run()} icon={MinusIcon} title="Horizontal Rule" />
                <MenuButton onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()} icon={ArrowUturnLeftIcon} title="Clear Formatting" />
            </div>
        </div>
    );
};

export default function PostEditor({ content, onChange }: { content: string, onChange: (html: string) => void }) {
    const [isMediaOpen, setIsMediaOpen] = useState(false);

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                bulletList: {
                    keepMarks: true,
                    keepAttributes: false,
                },
                orderedList: {
                    keepMarks: true,
                    keepAttributes: false,
                },
                codeBlock: false,
                // link and underline are not usually in StarterKit, but if the user has a custom one, disabling here is safe
                // or maybe they are added by mistake elsewhere.
            }),
            Image.extend({
                draggable: true,
                addAttributes() {
                    return {
                        ...this.parent?.(),
                        width: {
                            default: '100%',
                            renderHTML: attributes => ({
                                style: `width: ${attributes.width};`,
                            }),
                        },
                        align: {
                            default: 'center',
                            renderHTML: attributes => ({
                                'data-align': attributes.align,
                                class: `image-align-${attributes.align}`,
                            }),
                        },
                    };
                },
            }).configure({
                HTMLAttributes: {
                    class: 'bg-transparent my-8 mx-auto transition-all duration-300'
                }
            }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-blue-600 font-bold underline decoration-blue-600/30'
                }
            }),
            Placeholder.configure({ placeholder: 'Tell your story here...' }),
            Underline,
            TextAlign.configure({ types: ['heading', 'paragraph'] }),
            Typography,
            Highlight.configure({ multicolor: true }),
            Subscript,
            Superscript,
            TaskList,
            TaskItem.configure({ nested: true }),
            CodeBlockLowlight.configure({
                lowlight,
                HTMLAttributes: {
                    class: 'rounded-2xl bg-slate-900 text-slate-100 p-6 font-mono text-sm my-6'
                }
            }),
            TextStyle,
            FontFamily,
            FontSize,
            BubbleMenuExtension,
            // Simple Video Node
            Node.create({
                name: 'video',
                group: 'block',
                draggable: true,
                addAttributes() {
                    return {
                        src: { default: null },
                        width: { default: '100%' },
                        align: { default: 'center' }
                    }
                },
                parseHTML() { return [{ tag: 'video' }] },
                renderHTML({ HTMLAttributes }: { HTMLAttributes: Record<string, any> }) {
                    return ['div', { class: `video-wrapper align-${HTMLAttributes.align}`, style: `text-align: ${HTMLAttributes.align}` },
                        ['video', { ...HTMLAttributes, controls: true, class: 'rounded-xl shadow-xl w-full max-w-4xl mx-auto' }]
                    ]
                },
                addCommands() {
                    return {
                        setVideo: (options: any) => ({ commands }: any) => {
                            return commands.insertContent({ type: 'video', attrs: options })
                        }
                    } as any;
                }
            })
        ],
        content,
        // ... (rest of configuration)
        editorProps: {
            attributes: {
                class: 'prose prose-slate lg:prose-xl max-w-none focus:outline-none min-h-[500px] p-10 lg:p-14 leading-relaxed font-medium text-slate-700',
            },
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        immediatelyRender: false,
    });

    const handleSelectImage = (url: string) => {
        if (editor) {
            const isVideo = url.match(/\.(mp4|webm|ogg)$/i);
            if (isVideo) {
                // @ts-ignore
                editor.chain().focus().setVideo({ src: url }).run();
            } else {
                editor.chain().focus().setImage({ src: url }).run();
            }
            setIsMediaOpen(false);
        }
    };

    return (
        <div className="border border-slate-200 rounded-2xl bg-white shadow-2xl shadow-slate-200/40 focus-within:ring-8 focus-within:ring-blue-600/5 transition-all duration-500 overflow-hidden">
            {editor && (
                <BubbleMenu
                    editor={editor}
                    shouldShow={({ editor }) => editor.isActive('image')}

                >
                    <div className="flex items-center gap-1 p-1 bg-white rounded-2xl shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200 overflow-hidden">
                        {/* Alignment */}
                        <div className="flex items-center gap-0.5 border-r border-slate-100 pr-1 mr-1">
                            <BubbleButton
                                onClick={() => {
                                    const currentWidthStr = editor.getAttributes('image').width || '100%';
                                    const currentWidth = parseInt(currentWidthStr);
                                    const updates: any = { align: 'left' };
                                    // If current width is greater than 60, auto-resize to 50% for better wrapping
                                    if (currentWidth > 60) updates.width = '50%';
                                    editor.chain().focus().updateAttributes('image', updates).run();
                                }}
                                isActive={editor.getAttributes('image').align === 'left'}
                                icon={Bars3BottomLeftIcon}
                                label="Left (Wrap)"
                            />
                            <BubbleButton
                                onClick={() => editor.chain().focus().updateAttributes('image', { align: 'center', width: '75%' }).run()}
                                isActive={editor.getAttributes('image').align === 'center' || editor.getAttributes('image').align === 'full'}
                                icon={Bars3Icon}
                                label="Center"
                            />
                            <BubbleButton
                                onClick={() => {
                                    const currentWidthStr = editor.getAttributes('image').width || '100%';
                                    const currentWidth = parseInt(currentWidthStr);
                                    const updates: any = { align: 'right' };
                                    // If current width is greater than 60, auto-resize to 50% for better wrapping
                                    if (currentWidth > 60) updates.width = '50%';
                                    editor.chain().focus().updateAttributes('image', updates).run();
                                }}
                                isActive={editor.getAttributes('image').align === 'right'}
                                icon={Bars3BottomRightIcon}
                                label="Right (Wrap)"
                            />
                        </div>
                        {/* Sizing */}
                        <div className="flex items-center gap-1 px-1">
                            {(() => {
                                const align = editor.getAttributes('image').align;
                                const isWrap = align === 'left' || align === 'right';
                                const sizes = isWrap ? [25, 35, 50, 60] : [25, 50, 75, 100];

                                return sizes.map(size => (
                                    <button
                                        key={size}
                                        onClick={() => editor.chain().focus().updateAttributes('image', { width: `${size}%` }).run()}
                                        className={`px-2 py-1.5 text-[10px] font-black rounded-lg transition-all ${editor.getAttributes('image').width === `${size}%`
                                            ? 'bg-blue-600 text-white'
                                            : 'hover:bg-slate-50 text-slate-500'
                                            }`}
                                    >
                                        {size}%
                                    </button>
                                ));
                            })()}
                        </div>
                    </div>
                </BubbleMenu>
            )
            }

            <MenuBar editor={editor} onOpenMedia={() => setIsMediaOpen(true)} />
            <div className="custom-scrollbar overflow-y-auto max-h-[800px] prose-img-custom">
                <style jsx global>{`
                    .prose-img-custom .image-align-left {
                        float: left;
                        margin-right: 2rem;
                        margin-top: 0.5rem;
                        margin-bottom: 0.5rem;
                    }
                    .prose-img-custom .image-align-right {
                        float: right;
                        margin-left: 2rem;
                        margin-top: 0.5rem;
                        margin-bottom: 0.5rem;
                    }
                    .prose-img-custom .image-align-center {
                        display: block;
                        margin-left: auto;
                        margin-right: auto;
                    }
                    .prose-img-custom .image-align-full {
                        display: block;
                        width: 100% !important;
                        max-width: none;
                        margin-top: 2rem;
                        margin-bottom: 2rem;
                    }
                    .prose-img-custom .ProseMirror:after {
                        content: "";
                        display: table;
                        clear: both;
                    }
                `}</style>
                <EditorContent editor={editor} />
            </div>

            <MediaLibrary
                isOpen={isMediaOpen}
                onClose={() => setIsMediaOpen(false)}
                onSelect={handleSelectImage}
            />
        </div >
    );
}
