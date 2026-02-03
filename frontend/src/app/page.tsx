import Link from 'next/link';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

async function getFeaturedProjects() {
  try {
    const res = await fetch('http://localhost:3001/projects/public/featured', { cache: 'no-store' });
    if (!res.ok) return [];
    return res.json();
  } catch (e) {
    console.error(e);
    return [];
  }
}

async function getFeaturedPosts() {
  try {
    const res = await fetch('http://localhost:3001/posts/public?featured=true&limit=3', { cache: 'no-store' });
    if (!res.ok) return { posts: [] };
    return res.json();
  } catch (e) {
    console.error(e);
    return { posts: [] };
  }
}

export default async function Home() {
  const projects = await getFeaturedProjects();
  const { posts } = await getFeaturedPosts();

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="relative bg-slate-900 text-white py-32 overflow-hidden">
        <div className="absolute inset-0 bg-blue-600/10 blur-3xl rounded-full scale-150 translate-x-1/2 -translate-y-1/2"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-5xl md:text-7xl font-bold font-display tracking-tight mb-6">
            Crafting Digital <span className="text-blue-500">Excellence</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            We build premium digital experiences that elevate brands. Explore our featured work and insights below.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/projects" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-2xl font-bold transition-all hover:scale-105 active:scale-95 shadow-lg shadow-blue-500/25">
              View Work
            </Link>
            <Link href="/login" className="bg-white/10 hover:bg-white/20 text-white px-8 py-3.5 rounded-2xl font-bold backdrop-blur-md transition-all border border-white/10">
              Admin Login
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 font-display">Featured Projects</h2>
            <p className="text-slate-500 mt-2">Our finest architectural and digital work.</p>
          </div>
          <Link href="/projects" className="flex items-center gap-2 text-blue-600 font-bold hover:gap-3 transition-all">
            All Projects <ArrowRightIcon className="h-5 w-5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.length > 0 ? (
            projects.map((project: any) => (
              <Link key={project.id} href={`/projects/${project.slug}`} className="group relative aspect-video bg-slate-200 rounded-3xl overflow-hidden block">
                {project.coverImage ? (
                  <img src={project.coverImage} alt={project.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold">No Image</div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>
                <div className="absolute bottom-0 left-0 p-8 w-full transform translate-y-2 group-hover:translate-y-0 transition-transform">
                  <p className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-2">{project.category?.name || 'Project'}</p>
                  <h3 className="text-3xl font-bold text-white font-display mb-2">{project.title}</h3>
                  <p className="text-slate-300 line-clamp-2 text-sm">{project.description}</p>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-2 text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
              <p className="text-slate-400 font-bold">No featured projects found.</p>
            </div>
          )}
        </div>
      </section>

      {/* Latest Insights (Featured Blogs) */}
      <section className="py-24 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 font-display">Latest Insights</h2>
              <p className="text-slate-500 mt-2">Thoughts on design, architecture, and technology.</p>
            </div>
            <Link href="/blog" className="flex items-center gap-2 text-blue-600 font-bold hover:gap-3 transition-all">
              Read Blog <ArrowRightIcon className="h-5 w-5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {posts.length > 0 ? (
              posts.map((post: any) => (
                <Link key={post.id} href={`/blog/${post.slug}`} className="group block space-y-4">
                  <div className="aspect-[4/3] bg-slate-100 rounded-2xl overflow-hidden relative">
                    {post.coverImage ? (
                      <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300 bg-slate-50">Image</div>
                    )}
                    <div className="absolute top-4 left-4">
                      <span className="bg-white/90 backdrop-blur px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest text-slate-800 shadow-sm">
                        {post.categories?.[0]?.name || 'Article'}
                      </span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2">{post.title}</h3>
                    <div className="flex items-center gap-3 mt-3 text-xs font-semibold text-slate-500">
                      <span>{new Date(post.publishedAt || post.createdAt).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>{post.author?.name || 'Editor'}</span>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-3 text-center py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                <p className="text-slate-400 font-bold">No featured posts found.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer Simple */}
      <footer className="bg-slate-900 text-slate-400 py-12 text-center text-sm">
        <p>&copy; {new Date().getFullYear()} Blendwit CMS. All rights reserved.</p>
      </footer>
    </div>
  );
}
