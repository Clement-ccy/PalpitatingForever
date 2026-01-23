"use client";

import Link from 'next/link';
import { MOCK_BLOGS } from '@/data/mock-blogs';
import { SpotlightCard } from '@/components/ui/spotlight-card';
import { Calendar, Tag } from 'lucide-react';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export default function BlogsPage() {
    const [selectedSlug, setSelectedSlug] = useState<string | null>(null);

    // In a real app, you might fetch content based on slug. 
    // Here we find it from mock data.
    const selectedPost = MOCK_BLOGS.find(p => p.slug === selectedSlug);

    return (
        <div className="min-h-screen pt-32 px-4 pb-32 max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
            
            {/* Timeline Column (Left) */}
            <div className="w-full md:w-1/3 flex-shrink-0">
                <header className="mb-12">
                    <h1 className="text-4xl font-bold tracking-tight mb-4 text-foreground">Thoughts</h1>
                    <p className="text-muted text-lg">
                        Exploring software, design, and the spaces in between.
                    </p>
                </header>

                <div className="relative border-l border-card-border ml-3 space-y-8 pl-8 py-2">
                    {MOCK_BLOGS.map((post, index) => (
                        <div key={post.id} className="relative group">
                            {/* Timeline Dot */}
                            <div className={cn(
                                "absolute -left-[39px] top-6 w-5 h-5 rounded-full border border-card-border transition-all flex items-center justify-center bg-background z-10",
                                selectedSlug === post.slug 
                                    ? "border-green-500 bg-green-500/10 scale-110" 
                                    : "group-hover:border-green-500/50 group-hover:bg-green-500/10"
                            )}>
                                <div className={cn(
                                    "w-1.5 h-1.5 rounded-full transition-colors",
                                    selectedSlug === post.slug ? "bg-green-500" : "bg-muted group-hover:bg-green-500"
                                )} />
                            </div>

                            <div onClick={() => setSelectedSlug(post.slug)} className="cursor-pointer">
                                <SpotlightCard className={cn(
                                    "p-6 transition-all duration-300",
                                    selectedSlug === post.slug 
                                        ? "bg-card border-green-500/30" 
                                        : "hover:bg-card/50"
                                )}>
                                    <div className="flex flex-col gap-2 mb-3">
                                        <div className="flex items-center gap-2 text-xs text-muted font-mono uppercase tracking-wider">
                                            <span>{post.date}</span>
                                            <span className="w-1 h-1 bg-card-border rounded-full" />
                                            <span>{post.tags[0]}</span>
                                        </div>
                                    </div>

                                    <h2 className={cn(
                                        "text-xl font-bold mb-2 transition-colors",
                                        selectedSlug === post.slug ? "text-green-500" : "group-hover:text-green-500"
                                    )}>
                                        {post.title}
                                    </h2>
                                    <p className="text-muted text-sm line-clamp-2">
                                        {post.summary}
                                    </p>
                                </SpotlightCard>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Reading Pane (Right) */}
            <div className="hidden md:block w-full md:w-2/3 sticky top-32 h-[calc(100vh-10rem)] overflow-hidden rounded-2xl border border-card-border bg-card relative">
                 <AnimatePresence mode="wait">
                    {selectedPost ? (
                         <motion.div 
                            key={selectedPost.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            className="h-full overflow-y-auto custom-scrollbar p-12"
                         >
                            <div className="max-w-3xl mx-auto">
                                <div className="mb-8 border-b border-card-border pb-8">
                                    <div className="flex gap-2 mb-6">
                                        {selectedPost.tags.map(tag => (
                                            <span key={tag} className="px-2 py-1 rounded-md bg-background border border-card-border text-xs text-muted font-mono">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                    <h1 className="text-4xl md:text-5xl font-black text-foreground mb-4 leading-tight">{selectedPost.title}</h1>
                                    <p className="text-xl text-muted leading-relaxed font-light">{selectedPost.summary}</p>
                                </div>
                                
                                {/* Prose Content (Styled Markdown) */}
                                <article className="prose dark:prose-invert prose-lg max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-green-500 hover:prose-a:text-green-600 prose-code:text-green-600 dark:prose-code:text-green-400 prose-code:bg-foreground/5 prose-code:px-1 prose-code:rounded prose-pre:bg-background prose-pre:border prose-pre:border-card-border">
                                    <ReactMarkdown>{selectedPost.content}</ReactMarkdown>
                                </article>
                            </div>
                         </motion.div>
                    ) : (
                         <div className="h-full flex flex-col items-center justify-center text-muted/20">
                            <Calendar size={48} strokeWidth={1} className="mb-4 opacity-50"/>
                            <p className="text-lg font-mono">Select a post to read</p>
                        </div>
                    )}
                 </AnimatePresence>
            </div>
        </div>
    );
}
