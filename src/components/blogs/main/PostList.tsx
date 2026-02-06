'use client';

import Link from 'next/link';
import type { NotionPage } from '@/lib/notion/types';
import { cn } from '@/lib/utils';
import { BLOG_THEME_TOKENS } from '@/components/blogs/theme';

type BlogItem = NotionPage & { theme: string };

type PostListProps = {
  posts: BlogItem[];
  areaOptions: string[];
  areaFilter: string;
  onAreaChange: (area: string) => void;
};

export default function PostList({ posts, areaOptions, areaFilter, onAreaChange }: PostListProps) {
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
              areaFilter === area ? 'bg-foreground text-background border-foreground' : 'bg-card border-card-border text-muted hover:bg-foreground/5 hover:text-foreground'
            )}
          >
            {area}
          </button>
        ))}
      </div>

      <div className="space-y-6">
        {posts.map((post) => (
          <div
            key={post.id}
            className="rounded-3xl border border-card-border bg-card/50 p-6"
          >
            <div className="flex items-center gap-3 text-[11px] font-mono text-muted mb-2">
              <span>{post.date}</span>
              <span className="w-1 h-1 bg-card-border rounded-full" />
              <span className={cn('uppercase tracking-widest', BLOG_THEME_TOKENS[post.theme]?.accent)}>
                {post.area || post.category}
              </span>
            </div>
            <Link href={`/blogs/${post.id}`} className="text-2xl font-semibold text-foreground hover:text-accent-blogs transition-colors">
              {post.title}
            </Link>
            <p className="text-sm text-muted-foreground line-clamp-2 mt-2">{post.summary}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className={cn('px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider border', BLOG_THEME_TOKENS[post.theme]?.softBg, BLOG_THEME_TOKENS[post.theme]?.accent)}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
