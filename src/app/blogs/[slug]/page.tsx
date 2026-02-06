'use client';

import { use, useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar, Tag, ChevronLeft, Share2, Bookmark } from 'lucide-react';
import { renderNotionBlocks } from '@/components/notion/NotionBlockRenderer';
import type { NotionBlock, NotionPage } from '@/lib/notion/types';
import { fetchNotionBlocks, fetchNotionPages } from '@/lib/notion/client';
import { trackEvent } from '@/lib/analytics/client';
import { Comments } from '@/components/comments/Comments';

const DEFAULT_COVER = 'https://images.unsplash.com/photo-1519638831568-d9897f54ed69?q=80&w=800&auto=format&fit=crop';

const NotionRenderer = ({ blocks }: { blocks: NotionBlock[] }) => {
    return (
        <div className="notion-content">
            {renderNotionBlocks(blocks)}
        </div>
    );
};

export default function BlogSlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [blocks, setBlocks] = useState<NotionBlock[]>([]);
  const [posts, setPosts] = useState<NotionPage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetchNotionPages().then((pages) => {
      if (!active) return;
      setPosts(pages.filter((page) => page.category === 'Blogs' || page.category === 'PF-AIGC'));
      setIsLoading(false);
    }).catch(() => {
      if (!active) return;
      setIsLoading(false);
    });
    return () => {
      active = false;
    };
  }, []);

  const post = posts.find((page) => page.id === slug);
  const postId = post?.id;

  useEffect(() => {
    if (!postId) return;
    let active = true;
    trackEvent({
      site: 'main',
      name: 'blog_detail_view',
      path: `/blogs/${postId}`,
      title: post?.title ?? null,
    });
    fetchNotionBlocks(postId).then((data) => {
      if (!active) return;
      setBlocks(data);
    });
    return () => {
      active = false;
    };
  }, [postId, post?.title]);

  if (!post) {
    if (isLoading) {
      return (
        <div className="min-h-[60vh] flex items-center justify-center text-muted">
          Loading...
        </div>
      );
    }

    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">404</h1>
          <p className="text-muted">Thought not found in the archives.</p>
          <Link href="/blogs" className="mt-8 text-accent-blogs hover:underline flex items-center gap-2">
            <ChevronLeft size={18} /> Back to Blogs
          </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative">
        {/* Progress Bar (Client Side logic could be added) */}
        <div className="fixed top-0 left-0 w-full h-1 bg-accent-blogs/10 z-100">
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
                <div className="absolute inset-0 bg-linear-to-t from-background via-background/60 to-transparent" />
            
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
            <div className="hidden xl:flex flex-col gap-4 absolute -left-20 top-20 h-fit">
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

            <Comments
              site="main"
              pageKey={post.id}
              pageUrl={`/blogs/${post.id}`}
              pageTitle={post.title}
              accentClassName="text-accent-blogs"
            />

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
