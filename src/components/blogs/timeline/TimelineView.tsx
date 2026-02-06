'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { NotionPage } from '@/lib/notion/types';
import { BLOG_THEME_TOKENS } from '@/components/blogs/theme';

type BlogItem = NotionPage & { theme: string };

type TimelineViewProps = {
  posts: BlogItem[];
  selectedId: string;
  onSelect: (id: string) => void;
};

const DEFAULT_COVER = 'https://images.unsplash.com/photo-1519638831568-d9897f54ed69?q=80&w=800&auto=format&fit=crop';

export default function TimelineView({ posts, selectedId, onSelect }: TimelineViewProps) {
  const activePost = posts.find((post) => post.id === (selectedId || posts[0]?.id));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
      <div className="lg:col-span-7 relative">
        <div className="absolute left-3 top-0 bottom-0 w-px bg-card-border/70" />
        <div className="space-y-8">
          {posts.map((post) => (
            <motion.button
              key={post.id}
              onClick={() => onSelect(post.id)}
              className={cn(
                'relative w-full text-left pl-12 pr-4 py-4 rounded-2xl transition-all',
                selectedId === post.id ? 'bg-card/60 border border-card-border' : 'hover:bg-card/40'
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
                <span className={cn('uppercase tracking-widest', BLOG_THEME_TOKENS[post.theme]?.accent)}>
                  {post.category}
                </span>
              </div>
              <h3 className={cn('text-xl md:text-2xl font-semibold text-foreground mb-2', selectedId === post.id && BLOG_THEME_TOKENS[post.theme]?.accent)}>
                {post.title}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-2">{post.summary}</p>
            </motion.button>
          ))}
        </div>
      </div>

      <aside className="lg:col-span-5">
        {activePost && (
          <div className="sticky top-28 rounded-3xl border border-card-border bg-card/60 overflow-hidden">
            <div className="relative h-64 w-full">
              <Image
                src={activePost.cover || DEFAULT_COVER}
                alt={activePost.title || 'Blog'}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                loading="eager"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-background/80 via-background/20 to-transparent" />
              <div className="absolute bottom-4 right-4">
                <Link
                  href={`/blogs/${activePost.id}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-foreground text-background text-sm font-semibold hover:opacity-80 transition-opacity"
                >
                  Read
                </Link>
              </div>
            </div>
            <div className="p-8 space-y-5">
              <div className="flex flex-wrap gap-2">
                {(activePost.tags ?? []).map((tag) => (
                  <span
                    key={tag}
                    className={cn('px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider border', BLOG_THEME_TOKENS[activePost.theme]?.softBg, BLOG_THEME_TOKENS[activePost.theme]?.accent)}
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <h2 className="text-3xl font-bold text-foreground">{activePost.title}</h2>
              <p className="text-muted-foreground leading-relaxed">{activePost.summary}</p>
              <div className="flex items-center gap-2 text-xs font-mono text-muted">
                <Calendar size={12} />
                <span>{activePost.date}</span>
              </div>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
