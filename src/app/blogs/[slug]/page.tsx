'use client';

import { motion } from 'framer-motion';
import { use, useMemo } from 'react';
import Image from 'next/image';
import { Calendar, Tag, ChevronLeft, Share2, Bookmark, Info } from 'lucide-react';
import Link from 'next/link';
import { mapNotionPage } from '@/lib/notion-utils';
import { mapNotionBlock } from '@/lib/notion-mappers';
import notionData from '@/data/refs/notion-query-a-data-source.json';
import { NotionBlock } from '@/lib/notion-utils';

const DEFAULT_COVER = 'https://images.unsplash.com/photo-1620712943543-bcc4628c6820?q=80&w=800&auto=format&fit=crop';

const NotionRenderer = ({ blocks }: { blocks: NotionBlock[] }) => {
    return (
        <div className="space-y-6">
            {blocks.map((block, idx) => {
                switch (block.type) {
                    case 'heading_1':
                        return <h1 key={idx} className="text-4xl font-bold text-foreground mt-12 mb-6">{block.content}</h1>;
                    case 'heading_2':
                        return <h2 key={idx} className="text-2xl font-bold text-foreground mt-8 mb-4 border-l-4 border-accent-blogs pl-4">{block.content}</h2>;
                    case 'heading_3':
                        return <h3 key={idx} className="text-xl font-bold text-foreground mt-6 mb-3">{block.content}</h3>;
                    case 'paragraph':
                        return <p key={idx} className="text-lg text-muted-foreground leading-relaxed">{block.content}</p>;
                    case 'bulleted_list_item':
                        return (
                            <li key={idx} className="flex gap-3 text-muted-foreground text-lg">
                                <span className="text-accent-blogs mt-1.5">•</span>
                                <span>{block.content}</span>
                            </li>
                        );
                    case 'numbered_list_item':
                        return (
                            <li key={idx} className="flex gap-3 text-muted-foreground text-lg list-decimal list-inside">
                                <span>{block.content}</span>
                            </li>
                        );
                    case 'code':
                        return (
                            <div key={idx} className="relative group">
                                {block.content.language && (
                                    <div className="absolute top-0 right-6 px-2 py-1 bg-card-border/50 text-[10px] font-mono rounded-b-md uppercase text-muted tracking-widest">
                                        {block.content.language}
                                    </div>
                                )}
                                <pre className="p-6 rounded-2xl bg-card border border-card-border overflow-x-auto custom-scrollbar">
                                    <code className="text-sm font-mono text-accent-blogs/90">{block.content.text}</code>
                                </pre>
                                {block.content.caption && (
                                    <div className="mt-2 text-xs text-muted italic text-center">
                                        {block.content.caption}
                                    </div>
                                )}
                            </div>
                        );
                    case 'image':
                        return (
                            <figure key={idx} className="my-10 space-y-3">
                                <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-card-border">
                                    <Image src={block.content.url} alt={block.content.caption || ''} fill className="object-cover" />
                                </div>
                                {block.content.caption && (
                                    <figcaption className="text-center text-sm text-muted italic">
                                        {block.content.caption}
                                    </figcaption>
                                )}
                            </figure>
                        );
                    case 'callout':
                        return (
                            <div key={idx} className="p-6 rounded-2xl bg-accent-blogs/5 border border-accent-blogs/20 flex gap-4 items-start">
                                <div className="text-2xl pt-1">
                                    {block.content.icon && typeof block.content.icon === 'string' && block.content.icon.startsWith('http') ? (
                                        <div className="relative w-6 h-6">
                                            <Image src={block.content.icon} alt="" fill className="object-contain" />
                                        </div>
                                    ) : (
                                        <span>{block.content.icon || <Info size={24} className="text-accent-blogs" />}</span>
                                    )}
                                </div>
                                <div className="text-lg text-foreground/90 italic">
                                    {block.content.text}
                                </div>
                            </div>
                        );
                    case 'equation':
                        return (
                            <div key={idx} className="my-8 p-8 bg-card/30 rounded-2xl border border-card-border flex justify-center overflow-x-auto">
                                <div className="text-2xl font-serif text-accent-blogs">
                                    {/* For real LaTeX, we'd use something like react-katex */}
                                    $${block.content}$$
                                </div>
                            </div>
                        );
                    case 'divider':
                        return <hr key={idx} className="my-12 border-card-border" />;
                    default:
                        return null;
                }
            })}
        </div>
    );
};

export default function BlogSlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  
  // Get all blogs from Notion data
  const BLOG_POSTS = useMemo(() => 
    (notionData.results as unknown[])
        .map(mapNotionPage)
        .filter(post => post.category === 'Blog')
  , []);

  const post = BLOG_POSTS.find(p => p.id === slug);
  
  // Note: In a real app, we'd fetch blocks for the specific slug.
  // Since we only have mock JSONs in refs, let's try to load the block children if they exist for this slug
  // or fallback to the generic retrieve-block-children.json
  const rawBlocks = (notionData as unknown as { results: unknown[] }).results;
  const blocks = useMemo(() => rawBlocks.map(mapNotionBlock), [rawBlocks]);

  if (!post) {
      return (
          <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
              <h1 className="text-4xl font-bold text-foreground mb-4">404</h1>
              <p className="text-muted">Thought not found in the archives.</p>
              <Link href="/blogs" className="mt-8 text-accent-blogs hover:underline flex items-center gap-2">
                <ChevronLeft size={18} /> Back to Blogs
              </Link>
          </div>
      )
  }

  return (
    <div className="min-h-screen bg-background relative">
        {/* Progress Bar (Client Side logic could be added) */}
        <div className="fixed top-0 left-0 w-full h-1 bg-accent-blogs/10 z-[100]">
            <motion.div className="h-full bg-accent-blogs origin-left" style={{ scaleX: 0 }} />
        </div>

        {/* Hero Section */}
        <div className="relative h-[60vh] w-full overflow-hidden">
            <motion.div layoutId={`cover-image-${post.id}`} className="absolute inset-0">
                <Image 
                    src={post.cover || DEFAULT_COVER} 
                    alt={post.title}
                    fill
                    className="object-cover"
                    priority
                />
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
            
            <div className="absolute inset-0 flex items-end">
                <div className="max-w-4xl mx-auto px-6 pb-12 w-full">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <Link href="/blogs" className="inline-flex items-center gap-2 text-accent-blogs font-mono text-sm mb-8 hover:gap-3 transition-all">
                            <ChevronLeft size={16} /> BACK TO ARCHIVE
                        </Link>
                        
                        <div className="flex gap-2 mb-6">
                            {post.tags.map(tag => (
                                <span key={tag} className="px-3 py-1 rounded-full bg-accent-blogs/10 border border-accent-blogs/20 text-[10px] font-mono text-accent-blogs uppercase tracking-wider">
                                    {tag}
                                </span>
                            ))}
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black text-foreground mb-6 leading-tight tracking-tighter">
                            {post.title}
                        </h1>
                        <div className="flex items-center gap-6 text-muted font-mono text-xs">
                            <div className="flex items-center gap-2">
                                <Calendar size={14} />
                                <span>{post.date}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Tag size={14} />
                                <span>12 MIN READ</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-6 py-20 relative">
            {/* Sidebar Actions */}
            <div className="hidden xl:flex flex-col gap-4 absolute -left-20 top-20 sticky top-32 h-fit">
                <button className="p-3 rounded-full border border-card-border bg-card text-muted hover:text-accent-blogs transition-colors" type="button">
                    <Share2 size={20} />
                </button>
                <button className="p-3 rounded-full border border-card-border bg-card text-muted hover:text-accent-blogs transition-colors" type="button">
                    <Bookmark size={20} />
                </button>
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="prose prose-invert prose-lg max-w-none"
            >
                <NotionRenderer blocks={blocks} />
            </motion.div>

            {/* Footer Navigation */}
            <footer className="mt-32 pt-12 border-t border-card-border">
                <div className="flex justify-between items-center">
                    <div className="space-y-1">
                        <p className="text-xs font-mono text-muted uppercase">Written by</p>
                        <p className="text-lg font-bold text-foreground">Clement Chen</p>
                    </div>
                    <Link href="/blogs" className="px-8 py-3 rounded-full border border-accent-blogs text-accent-blogs hover:bg-accent-blogs hover:text-black transition-all font-bold">
                        More Thoughts
                    </Link>
                </div>
            </footer>
        </div>
    </div>
  );
}
