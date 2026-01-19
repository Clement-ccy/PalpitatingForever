'use client';

import { MOCK_BLOGS } from '@/data/mock-blogs';
import { motion } from 'framer-motion';
// Using markdown renderer for content
import ReactMarkdown from 'react-markdown';
import { use } from 'react';


export default function BlogSlugPage({ params }: { params: Promise<{ slug: string }> }) {
  // In Next.js App Router, params are async in some versions, but standard here.
  // We'll just grab it directly.
  const { slug } = use(params);
  const post = MOCK_BLOGS.find(p => p.slug === slug);

  if (!post) {
      return (
          <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
              <h1 className="text-4xl font-bold text-white mb-4">404</h1>
              <p className="text-gray-400">Thought not found in the archives.</p>
          </div>
      )
  }

  return (
    <div className="min-h-screen pt-32 px-4 pb-32 max-w-4xl mx-auto">
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
             <header className="mb-12 border-b border-white/10 pb-12">
                <div className="flex gap-2 mb-6">
                    {post.tags.map(tag => (
                        <span key={tag} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-emerald-400 font-mono">
                            {tag}
                        </span>
                    ))}
                </div>
                <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight tracking-tight">{post.title}</h1>
                 <div className="flex items-center gap-4 text-gray-400 font-mono text-sm">
                    <span>{post.date}</span>
                    <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                    <span>12 MIN READ</span>
                </div>
            </header>

            <article className="prose prose-invert prose-lg max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-emerald-400 hover:prose-a:text-emerald-300 prose-code:text-emerald-300 prose-code:bg-white/5 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-pre:bg-[#050505] prose-pre:border prose-pre:border-white/10 prose-img:rounded-2xl prose-img:border prose-img:border-white/10">
                <ReactMarkdown>{post.content}</ReactMarkdown>
            </article>

            {/* Knowledge Graph Placeholder */}
             <div className="mt-20 pt-12 border-t border-white/10">
                <div className="bg-[#0A0A0A] border border-white/5 rounded-2xl p-8 flex flex-col items-center text-center">
                    <div className="text-emerald-500/50 mb-4 animate-pulse">
                         {/* Abstract Graph Icon */}
                         <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="3"></circle>
                            <path d="M12 16c-3.1 0-5.8-1.5-7.5-3.9-.4-.6-.4-1.5 0-2.1C6.2 7.5 8.9 6 12 6s5.8 1.5 7.5 3.9c.4.6.4 1.5 0 2.1-1.7 2.4-4.4 3.9-7.5 3.9z"></path>
                         </svg>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">Knowledge Graph</h3>
                    <p className="text-gray-500 max-w-md text-sm">
                        This thought is connected to <span className="text-white">System Design</span>, <span className="text-white">Entropy</span>, and <span className="text-white">React Server Components</span>.
                    </p>
                </div>
            </div>
        </motion.div>
    </div>
  );
}
