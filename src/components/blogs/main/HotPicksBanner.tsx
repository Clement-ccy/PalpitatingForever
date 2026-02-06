'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { NotionPage } from '@/lib/notion/types';
import { BLOG_THEME_HEX, BLOG_THEME_TOKENS } from '@/components/blogs/theme';

type BlogItem = NotionPage & { theme: string };

type HotPicksBannerProps = {
  posts: BlogItem[];
};

const DEFAULT_COVER = 'https://images.unsplash.com/photo-1519638831568-d9897f54ed69?q=80&w=800&auto=format&fit=crop';

export default function HotPicksBanner({ posts }: HotPicksBannerProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const items = useMemo(() => posts.slice(0, 5), [posts]);
  const active = items[activeIndex] ?? items[0];
  useEffect(() => {
    if (items.length <= 1) return undefined;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % items.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [items.length]);
  if (!active) return null;

  return (
    <div
      className="flex flex-row rounded-3xl border border-card-border bg-card/40 overflow-hidden"
      style={{
        ['--hot-theme' as string]: BLOG_THEME_HEX[active.theme] ?? '#7768f2',
      }}
    >
      <div className="flex-1 min-w-0">
        <div className="relative w-full h-full flex">
          <div className="absolute w-full h-full">
            <Image
              src={active.cover || DEFAULT_COVER}
              alt={active.title}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 60vw"
            />
            <div className="absolute inset-0 bg-linear-to-t from-background/90 via-background/20 to-transparent" />
          </div>
          <div className="relative inset-0 flex flex-col justify-end p-6">
            <Link href={`/blogs/${active.id}`} className="text-2xl md:text-3xl font-semibold text-foreground hover:text-accent-blogs transition-colors">
              {active.title}
            </Link>
            <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{active.summary}</p>
            <div className="mt-4 flex items-center gap-2">
              {Array.from({ length: Math.min(5, Math.max(1, Math.round(active.rate ?? 0))) }).map((_, i) => (
                <Star key={i} size={14} fill="currentColor" className="text-accent-blogs" />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="w-[320px] shrink-0 border-l border-card-border/60 bg-background/20">
        <div className="grid grid-cols-1 gap-px bg-card-border/60">
          {items.map((post, index) => (
            <button
              key={post.id}
              type="button"
              onMouseEnter={() => setActiveIndex(index)}
              onFocus={() => setActiveIndex(index)}
              className={cn(
                'w-full text-left px-6 py-4 flex items-center gap-4 transition-colors bg-background/10',
                index === activeIndex ? 'bg-card/60' : 'hover:bg-card/40'
              )}
            >
              <div className="relative w-12 h-12 rounded-2xl overflow-hidden border border-card-border bg-card">
                <Image src={post.cover || DEFAULT_COVER} alt={post.title} fill sizes="48px" className="object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">{post.title}</p>
                <p className="text-xs text-muted truncate">{post.date}</p>
              </div>
              <span className="text-[10px] font-mono text-muted">0{index + 1}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
