"use client";

import Link from 'next/link';
import { SpotlightCard } from '@/components/ui/spotlight-card';
import { Calendar, ArrowRight, Layers } from 'lucide-react';
import { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { mapNotionPage } from '@/lib/notion-utils';
import notionData from '@/data/refs/notion-query-a-data-source.json';

// Use Notion data instead of local mock
const BLOG_POSTS = (notionData.results as unknown[])
    .map(mapNotionPage)
    .filter(post => post.category === 'Blog');

const DEFAULT_COVER = 'https://images.unsplash.com/photo-1519638831568-d9897f54ed69?q=80&w=800&auto=format&fit=crop';

export default function BlogsPage() {
    const [selectedId, setSelectedId] = useState<string>(BLOG_POSTS[0]?.id || '');
    const selectedPost = useMemo(() => BLOG_POSTS.find(p => p.id === selectedId), [selectedId]);

    return (
        <div className="min-h-screen pt-32 px-4 pb-32 max-w-7xl mx-auto">
            <header className="mb-12">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-blogs/10 border border-accent-blogs/20 text-xs font-mono text-accent-blogs mb-4">
                    <Layers size={14} />
                    <span>THOUGHTS & ARCHIVES</span>
                </div>
                <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground mb-4">Blog</h1>
                <p className="text-muted text-lg max-w-2xl">
                    Documenting the process, sharing insights, and building a second brain.
                </p>
            </header>

            <div className="flex flex-col lg:flex-row gap-8 h-[70vh]">
                {/* List View (Left) */}
                <div className="w-full lg:w-2/5 overflow-y-auto custom-scrollbar pr-4 space-y-4">
                    {BLOG_POSTS.map((postItem) => (
                        <SpotlightCard 
                            key={postItem.id}
                            onClick={() => setSelectedId(postItem.id)}
                            spotlightColor="rgba(var(--accent-blogs-rgb), 0.15)"
                            className={cn(
                                "group relative overflow-hidden rounded-2xl border transition-all duration-500 cursor-pointer h-32",
                                selectedId === postItem.id 
                                    ? "border-accent-blogs bg-accent-blogs/5 ring-1 ring-accent-blogs/50" 
                                    : "border-card-border hover:border-accent-blogs/30 bg-card hover:bg-accent-blogs/5"
                            )}
                        >
                            {/* Background Image (Darkened/Blurred) */}
                            <div className="absolute inset-0 z-0">
                                <motion.div layoutId={`cover-bg-${postItem.id}`} className="absolute inset-0">
                                    <Image 
                                        src={postItem.cover || DEFAULT_COVER} 
                                        alt="" 
                                        fill 
                                        className={cn(
                                            "object-cover transition-all duration-700 opacity-20 blur-sm",
                                            selectedId === postItem.id ? "scale-110 opacity-30 blur-none" : "group-hover:opacity-25"
                                        )}
                                    />
                                </motion.div>
                                <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
                            </div>

                            <div className="relative z-10 p-6 flex flex-col justify-center h-full">
                                <span className="text-[10px] font-mono text-muted mb-1">{postItem.date}</span>
                                <h3 className={cn(
                                    "text-lg font-bold leading-tight transition-colors",
                                    selectedId === postItem.id ? "text-accent-blogs" : "text-foreground group-hover:text-accent-blogs"
                                )}>
                                    {postItem.title}
                                </h3>
                            </div>
                        </SpotlightCard>
                    ))}
                </div>

                {/* Preview Pane (Right) */}
                <div className="hidden lg:flex flex-1 rounded-3xl border border-card-border bg-card/50 backdrop-blur-sm overflow-hidden relative shadow-2xl">
                    <AnimatePresence mode="wait">
                        {selectedPost && (
                            <motion.div
                                key={selectedPost.id}
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 1.02 }}
                                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                className="absolute inset-0 flex flex-col"
                            >
                                {/* Cover Header */}
                                <div className="relative h-1/2 w-full overflow-hidden">
                                    <motion.div layoutId={`cover-image-${selectedPost.id}`} className="absolute inset-0">
                                        <Image 
                                            src={selectedPost.cover || DEFAULT_COVER} 
                                            alt={selectedPost.title}
                                            fill
                                            className="object-cover"
                                        />
                                    </motion.div>
                                    <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />
                                    
                                    {/* Action Button */}
                                    <Link 
                                        href={`/blogs/${selectedPost.id}`}
                                        className="absolute bottom-6 right-6 group/btn flex items-center gap-2 px-6 py-3 bg-accent-blogs text-black font-bold rounded-full shadow-[0_0_20px_rgba(var(--accent-blogs),0.3)] hover:scale-105 transition-all active:scale-95"
                                    >
                                        Jump to Post
                                        <ArrowRight size={18} className="transition-transform group-hover/btn:translate-x-1" />
                                    </Link>
                                </div>

                                {/* Content Summary */}
                                <div className="flex-1 p-10 overflow-y-auto custom-scrollbar">
                                    <div className="flex gap-2 mb-6">
                                        {selectedPost.tags.map(tag => (
                                            <span key={tag} className="px-3 py-1 rounded-full bg-accent-blogs/10 border border-accent-blogs/20 text-[10px] font-mono text-accent-blogs uppercase tracking-wider">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                    <h2 className="text-3xl font-black text-foreground mb-4 leading-tight">
                                        {selectedPost.title}
                                    </h2>
                                    <p className="text-lg text-muted-foreground leading-relaxed font-light italic border-l-2 border-accent-blogs/30 pl-6">
                                        {selectedPost.summary}
                                    </p>
                                    
                                    <div className="mt-8 flex items-center gap-4 text-muted text-sm font-mono">
                                        <div className="flex items-center gap-2">
                                            <Calendar size={14} />
                                            <span>Published on {selectedPost.date}</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
