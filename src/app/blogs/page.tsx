"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, Layers } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getFallbackTheme, type NotionPage } from '@/lib/notion-utils';
import { fetchNotionPages } from '@/lib/notion-data';

const DEFAULT_COVER = 'https://images.unsplash.com/photo-1519638831568-d9897f54ed69?q=80&w=800&auto=format&fit=crop';
const themePool = ['blue', 'purple', 'emerald', 'orange', 'pink', 'teal'];

const themeTokens: Record<string, { accent: string; softBg: string }> = {
    blue: { accent: 'text-blue-400', softBg: 'bg-blue-500/10' },
    purple: { accent: 'text-purple-400', softBg: 'bg-purple-500/10' },
    emerald: { accent: 'text-emerald-400', softBg: 'bg-emerald-500/10' },
    orange: { accent: 'text-orange-400', softBg: 'bg-orange-500/10' },
    pink: { accent: 'text-pink-400', softBg: 'bg-pink-500/10' },
    teal: { accent: 'text-teal-400', softBg: 'bg-teal-500/10' },
};

const resolveTheme = (theme: string | null, id: string): string => {
    const normalized = theme?.toLowerCase() ?? '';
    if (normalized && themeTokens[normalized]) return normalized;
    return getFallbackTheme(id, themePool);
};

type BlogItem = NotionPage & { theme: string };

export default function BlogsPage() {
    const [posts, setPosts] = useState<BlogItem[]>([]);
    const [selectedId, setSelectedId] = useState<string>('');

    useEffect(() => {
        let active = true;
        fetchNotionPages().then((pages) => {
            if (!active) return;
            const mapped = pages
                .filter((post) => post.category === 'Blogs' || post.category === 'PF-AIGC')
                .map((post) => ({
                    ...post,
                    theme: resolveTheme(post.theme, post.id),
                }))
                .sort((a, b) => (a.date < b.date ? 1 : -1));
            setPosts(mapped);
        });
        return () => {
            active = false;
        };
    }, []);

    const activeId = selectedId || posts[0]?.id || '';
    const selectedPost = posts.find((post) => post.id === activeId) ?? posts[0];

    return (
        <div className="min-h-screen pt-32 px-4 pb-32 max-w-7xl mx-auto relative">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-[rgba(var(--accent-works-rgb),0.2)] blur-[140px] rounded-full -z-10" />
            <div className="absolute top-1/3 right-1/4 w-md h-112 bg-[rgba(var(--accent-blogs-rgb),0.2)] blur-[140px] rounded-full -z-10" />
            <div className="absolute bottom-10 left-1/3 w-104 h-104 bg-[rgba(var(--accent-mlogs-rgb),0.2)] blur-[140px] rounded-full -z-10" />

            <header className="mb-12">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-card border border-card-border text-xs font-mono text-muted mb-4">
                    <Layers size={14} />
                    <span>THOUGHTS & ARCHIVES</span>
                </div>
                <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground mb-4">Blog</h1>
                <p className="text-muted-foreground text-lg max-w-2xl">
                    Documenting the process, sharing insights, and building a second brain.
                </p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-7 relative">
                    <div className="absolute left-3 top-0 bottom-0 w-px bg-card-border/70" />
                    <div className="space-y-8">
                        {posts.map((post) => (
                            <motion.button
                                key={post.id}
                                onClick={() => setSelectedId(post.id)}
                                className={cn(
                                    "relative w-full text-left pl-12 pr-4 py-4 rounded-2xl transition-all",
                                    activeId === post.id ? "bg-card/60 border border-card-border" : "hover:bg-card/40"
                                )}
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4 }}
                                type="button"
                            >
                                <span className="absolute left-1.5 top-4.5 w-3 h-3 rounded-full border border-card-border bg-background" />
                                <div className="flex items-center gap-3 text-[11px] font-mono text-muted mb-2">
                                    <span>{post.date}</span>
                                    <span className="w-1 h-1 bg-card-border rounded-full" />
                                    <span className={cn("uppercase tracking-widest", themeTokens[post.theme].accent)}>
                                        {post.category}
                                    </span>
                                </div>
                                <h3 className={cn("text-xl md:text-2xl font-semibold text-foreground mb-2", activeId === post.id && themeTokens[post.theme].accent)}>
                                    {post.title}
                                </h3>
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                    {post.summary}
                                </p>
                            </motion.button>
                        ))}
                    </div>
                </div>

                <aside className="lg:col-span-5">
                    {selectedPost && (
                        <div className="sticky top-28 rounded-3xl border border-card-border bg-card/60 overflow-hidden">
                            <div className="relative h-64 w-full">
                                <Image
                                    src={selectedPost.cover || DEFAULT_COVER}
                                    alt={selectedPost.title}
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-linear-to-t from-background/80 via-background/20 to-transparent" />
                                <div className="absolute bottom-4 right-4">
                                    <Link
                                        href={`/blogs/${selectedPost.id}`}
                                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-foreground text-background text-sm font-semibold hover:opacity-80 transition-opacity"
                                    >
                                        Read
                                        <ArrowRight size={16} />
                                    </Link>
                                </div>
                            </div>
                            <div className="p-8 space-y-5">
                                <div className="flex flex-wrap gap-2">
                                    {selectedPost.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className={cn("px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider border", themeTokens[selectedPost.theme].softBg, themeTokens[selectedPost.theme].accent)}
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                                <h2 className="text-3xl font-bold text-foreground">{selectedPost.title}</h2>
                                <p className="text-muted-foreground leading-relaxed">{selectedPost.summary}</p>
                                <div className="flex items-center gap-2 text-xs font-mono text-muted">
                                    <Calendar size={12} />
                                    <span>{selectedPost.date}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </aside>
            </div>
        </div>
    );
}
