'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import type { NotionPage } from '@/lib/notion/types';
import { cn } from '@/lib/utils';
import { BLOG_THEME_TOKENS } from '@/components/blogs/theme';
import { BentoGrid, BentoItem } from '@/components/ui/bento-grid';
import { SpotlightCard } from '@/components/ui/spotlight-card';

type BlogItem = NotionPage & { theme: string };

type PostListProps = {
  posts: BlogItem[];
  areaOptions: string[];
  areaFilter: string;
  onAreaChange: (area: string) => void;
  currentPage: number;
  pageCount: number;
  onPageChange: (page: number) => void;
};

const DEFAULT_COVER = 'https://images.unsplash.com/photo-1519638831568-d9897f54ed69?q=80&w=800&auto=format&fit=crop';

export default function PostList({
  posts,
  areaOptions,
  areaFilter,
  onAreaChange,
  currentPage,
  pageCount,
  onPageChange,
}: PostListProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {areaOptions.map((area) => (
          <button
            key={area}
            type="button"
            onClick={() => onAreaChange(area)}
            className={cn(
              'px-4 py-2 rounded-full text-xs font-mono border transition-colors',
              areaFilter === area
                ? 'bg-foreground text-background border-foreground'
                : 'bg-card border-card-border text-muted hover:bg-foreground/5 hover:text-foreground'
            )}
          >
            {area}
          </button>
        ))}
      </div>

      <BentoGrid className="max-w-none grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6 auto-rows-[minmax(240px,auto)]">
        {posts.map((post) => (
          <BentoItem key={post.id} className="border border-card-border bg-card/50">
            <SpotlightCard className="h-full w-full p-0 rounded-3xl border-card-border bg-card/50">
              <div className="flex flex-col h-full">
              <div className="relative h-48 w-full">
                <Image
                  src={post.cover || DEFAULT_COVER}
                  alt={post.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-background/80 via-background/10 to-transparent" />
              </div>
              <div className="p-5 flex flex-col gap-3">
                <div className="flex items-center gap-3 text-[11px] font-mono text-muted">
                  <span>{post.date}</span>
                  <span className="w-1 h-1 bg-card-border rounded-full" />
                  <span className={cn('uppercase tracking-widest', BLOG_THEME_TOKENS[post.theme]?.accent)}>
                    {post.area || post.category}
                  </span>
                </div>
                <Link
                  href={`/blogs/${post.id}`}
                  className="text-lg font-semibold text-foreground hover:text-accent-blogs transition-colors"
                >
                  {post.title}
                </Link>
                <p className="text-sm text-muted-foreground line-clamp-2">{post.summary}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className={cn(
                        'px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider border',
                        BLOG_THEME_TOKENS[post.theme]?.softBg,
                        BLOG_THEME_TOKENS[post.theme]?.accent
                      )}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            </SpotlightCard>
          </BentoItem>
        ))}
      </BentoGrid>

      {pageCount > 1 && (
        <div className="flex items-center justify-center gap-4 pt-4">
          <button
            type="button"
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className={cn(
              'inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-mono border transition-colors',
              currentPage === 1
                ? 'border-card-border text-muted opacity-60'
                : 'border-card-border text-foreground hover:bg-foreground/5'
            )}
          >
            <ArrowLeft size={12} /> 上一页
          </button>
          <span className="text-xs font-mono text-muted">
            {currentPage} / {pageCount}
          </span>
          <button
            type="button"
            onClick={() => onPageChange(Math.min(pageCount, currentPage + 1))}
            disabled={currentPage === pageCount}
            className={cn(
              'inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-mono border transition-colors',
              currentPage === pageCount
                ? 'border-card-border text-muted opacity-60'
                : 'border-card-border text-foreground hover:bg-foreground/5'
            )}
          >
            下一页 <ArrowRight size={12} />
          </button>
        </div>
      )}
    </div>
  );
}
