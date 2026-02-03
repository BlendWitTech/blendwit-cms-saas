import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeftIcon, MapPinIcon, CalendarIcon, UserIcon } from '@heroicons/react/24/outline';

async function getProject(slug: string) {
    // In production, use an environment variable for the URL
    const res = await fetch(`http://localhost:3001/projects/public/${slug}`, { cache: 'no-store' });
    if (!res.ok) return null;
    return res.json();
}

export default async function ProjectPage({ params }: { params: { slug: string } }) {
    const project = await getProject(params.slug);

    if (!project) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-white text-slate-900 selection:bg-blue-600 selection:text-white">
            {/* Navigation / Back Button - Minimal */}
            <nav className="fixed top-0 left-0 w-full z-50 px-6 py-6 mix-blend-difference text-white pointer-events-none">
                <div className="flex justify-between items-center pointer-events-auto">
                    <Link href="/" className="text-xs font-black uppercase tracking-[0.2em] hover:opacity-70 transition-opacity">
                        Blendwit Arch
                    </Link>
                    <Link href="/projects" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest hover:text-blue-400 transition-colors">
                        <ArrowLeftIcon className="h-4 w-4" />
                        Back to Works
                    </Link>
                </div>
            </nav>

            {/* 1. Banner Section */}
            {project.bannerImage && (
                <div className="relative w-full h-[60vh] lg:h-[80vh] overflow-hidden">
                    <img
                        src={project.bannerImage}
                        alt={project.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 w-full p-8 lg:p-20">
                        <span className="inline-block px-3 py-1 mb-4 border border-white/30 rounded-full text-[10px] font-black uppercase tracking-widest text-white backdrop-blur-sm">
                            {project.category}
                        </span>
                        <h1 className="text-5xl lg:text-8xl font-bold text-white font-display uppercase tracking-tight leading-none">
                            {project.title}
                        </h1>
                    </div>
                </div>
            )}

            {!project.bannerImage && (
                <div className="pt-32 pb-10 px-6 lg:px-20">
                    <span className="inline-block px-3 py-1 mb-4 border border-slate-200 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-500">
                        {project.category}
                    </span>
                    <h1 className="text-5xl lg:text-7xl font-bold text-slate-900 font-display uppercase tracking-tight leading-none">
                        {project.title}
                    </h1>
                </div>
            )}

            {/* 2. Split Section: Media (35%) & Content (65%) */}
            <div className="px-6 lg:px-20 py-20 flex flex-col lg:flex-row gap-12 lg:gap-24">
                {/* 35% Slot - Video or Feature Image */}
                <div className="lg:w-[35%] w-full flex-shrink-0">
                    <div className="sticky top-24 space-y-8">
                        {project.heroVideo ? (
                            <div className="aspect-[3/4] w-full bg-slate-100 rounded-2xl overflow-hidden relative shadow-2xl">
                                {/* If it's a direct video file */}
                                {project.heroVideo.match(/\.(mp4|webm)$/i) ? (
                                    <video src={project.heroVideo} autoPlay loop muted playsInline className="w-full h-full object-cover" />
                                ) : (
                                    // Assuming generic URL (youtube/vimeo requires embed logic, falling back to simple iframe or placeholder)
                                    // For simplicity, treating as direct or sticking to simple handling. 
                                    // If it's an image URL by mistake, show image.
                                    <div className="w-full h-full flex items-center justify-center bg-slate-900 text-white p-4 text-center text-xs">
                                        VIDEO SOURCE: {project.heroVideo}
                                    </div>
                                )}
                            </div>
                        ) : project.coverImage ? (
                            <div className="aspect-[3/4] w-full bg-slate-100 rounded-2xl overflow-hidden shadow-2xl">
                                <img src={project.coverImage} alt="Feature" className="w-full h-full object-cover" />
                            </div>
                        ) : null}

                        {/* 3. Other Info - Metadata Grid */}
                        <div className="grid grid-cols-1 gap-6 pt-6 border-t border-slate-200">
                            <div>
                                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-2">
                                    <UserIcon className="h-3 w-3" /> Client
                                </h3>
                                <p className="text-sm font-bold text-slate-900">{project.client || 'Private Client'}</p>
                            </div>
                            <div>
                                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-2">
                                    <MapPinIcon className="h-3 w-3" /> Location
                                </h3>
                                <p className="text-sm font-bold text-slate-900">{project.location || 'Confidential'}</p>
                            </div>
                            <div>
                                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-2">
                                    <CalendarIcon className="h-3 w-3" /> Completion
                                </h3>
                                <p className="text-sm font-bold text-slate-900">
                                    {project.completionDate ? new Date(project.completionDate).getFullYear() : 'Ongoing'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 65% Slot - Description */}
                <div className="flex-1 pt-2">
                    <h2 className="text-2xl font-bold mb-8 font-display">Project Vision</h2>
                    <div className="prose prose-slate prose-lg max-w-none text-slate-600 leading-relaxed font-light">
                        {project.description?.split('\n').map((paragraph: string, i: number) => (
                            <p key={i} className="mb-4">{paragraph}</p>
                        ))}
                    </div>
                </div>
            </div>

            {/* 4. 3D Video / Model Section */}
            {project.model3dUrl && (
                <div className="w-full bg-slate-900 py-32 px-6 lg:px-20 relative overflow-hidden">
                    <div className="max-w-7xl mx-auto space-y-8">
                        <div className="flex items-center justify-between text-white border-b border-white/10 pb-4">
                            <h2 className="text-3xl font-display font-bold">Immersive View</h2>
                            <span className="text-[10px] font-black uppercase tracking-widest opacity-50">3D Interaction</span>
                        </div>
                        <div className="aspect-video w-full bg-black/50 rounded-3xl overflow-hidden border border-white/10 relative">
                            {/* Placeholder for 3D Viewer or Video */}
                            <iframe
                                src={project.model3dUrl}
                                className="w-full h-full border-none"
                                title="3D Viewer"
                            ></iframe>
                            {/* Fallback overlay if regular URL */}
                            <div className="absolute inset-0 pointer-events-none flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity">
                                <span className="px-6 py-3 bg-white text-black text-xs font-bold uppercase tracking-widest rounded-full">Explore 3D Model</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* 5. Gallery Section */}
            {project.gallery && project.gallery.length > 0 && (
                <div className="px-6 lg:px-20 py-32 bg-slate-50">
                    <div className="max-w-7xl mx-auto space-y-12">
                        <div className="text-center">
                            <h2 className="text-4xl font-display font-bold mb-2">Visual Gallery</h2>
                            <p className="text-slate-400 text-xs font-black uppercase tracking-widest">Selected Perspectives</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {project.gallery.map((img: string, i: number) => (
                                <div
                                    key={i}
                                    className={`relative group overflow-hidden rounded-2xl ${i % 3 === 0 ? 'md:col-span-2 aspect-[16/9]' : 'aspect-square'}`}
                                >
                                    <img
                                        src={img}
                                        alt={`Gallery ${i}`}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Footer / Contact CTA (Simple placeholders as per "Architecture" vibe) */}
            <footer className="bg-white py-20 px-6 border-t border-slate-100 text-center">
                <h3 className="text-2xl font-display font-bold mb-6">Interested in this project?</h3>
                <Link href="/contact" className="inline-block px-8 py-4 bg-slate-900 text-white text-xs font-black uppercase tracking-[0.2em] hover:bg-blue-600 transition-colors">
                    Contact Us
                </Link>
            </footer>
        </main>
    );
}
