'use client';

import Image from 'next/image';
import Link from 'next/link';
import { SpotlightCard } from '@/components/ui/spotlight-card';

type SidebarWidgetsProps = {
  wechatQrUrl: string;
  sponsorText: string;
  sponsorLink: string;
  hotPosts: { id: string; title: string }[];
  tagCounts: [string, number][];
  stats: {
    postCount: number;
    siteDays: number;
    wordTotal: number;
    commentTotal: number;
  };
};

export default function SidebarWidgets({
  wechatQrUrl,
  sponsorText,
  sponsorLink,
  hotPosts,
  tagCounts,
  stats,
}: SidebarWidgetsProps) {
  return (
    <div className="space-y-6 w-full">

      {/* 微信二维码卡片 */}
      <SpotlightCard className="group rounded-3xl border border-card-border bg-card/40 backdrop-blur-md transition-all hover:bg-card/60">
        {wechatQrUrl ? (
          <div className="relative aspect-[3/1] w-full rounded-xl overflow-hidden border border-card-border/50 bg-white/5">
            <Image
              src={wechatQrUrl}
              alt="WeChat QR"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        ) : (
          <div className="h-40 w-full bg-card-border/20 rounded-xl flex items-center justify-center text-xs text-muted">
            QR Placeholder
          </div>
        )}
      </SpotlightCard>

      {/* 赞助卡片 */}
      <SpotlightCard className="rounded-3xl border border-card-border bg-card/40 backdrop-blur-md p-6">
        <p className="text-[10px] font-mono text-muted uppercase tracking-widest mb-3">Support</p>
        <p className="text-sm text-muted-foreground leading-relaxed">{sponsorText || 'Fuel my creativity.'}</p>
        <a
            href={sponsorLink || "#"}
            target="_blank"
            rel="noreferrer"
            className="mt-4 w-full inline-flex justify-center items-center gap-2 px-4 py-2 rounded-xl bg-foreground text-background text-xs font-bold hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-foreground/10"
        >
            Sponsor
        </a>
      </SpotlightCard>

      {/* 热门文章 */}
      <SpotlightCard className="rounded-3xl border border-card-border bg-card/40 backdrop-blur-md p-6">
        <p className="text-[10px] font-mono text-muted uppercase tracking-widest mb-4">Trending</p>
        <div className="flex flex-col gap-4">
          {hotPosts.map((post, index) => (
            <Link key={post.id} href={`/blogs/${post.id}`} className="group block">
              <div className="flex items-baseline gap-3">
                  <span className="text-xs font-mono text-muted/40 group-hover:text-accent-blogs transition-colors">
                    0{index + 1}
                  </span>
                  <span className="text-sm font-medium text-foreground/80 group-hover:text-accent-blogs transition-colors line-clamp-2 leading-snug">
                    {post.title}
                  </span>
              </div>
            </Link>
          ))}
        </div>
      </SpotlightCard>

      {/* Tags - 这里是关键修复点 */}
      <SpotlightCard className="rounded-3xl border border-card-border bg-card/40 backdrop-blur-md p-6">
        <p className="text-[10px] font-mono text-muted uppercase tracking-widest mb-4">Topics</p>
        {/* CRITICAL FIX: flex-wrap 允许标签换行，防止撑开宽度 */}
        <div className="flex flex-wrap gap-2">
          {tagCounts.map(([tag, count]) => (
            <span key={tag} className="px-3 py-1 rounded-full border border-card-border text-[10px] font-mono text-muted">
              {tag} · {count}
            </span>
          ))}
        </div>
      </SpotlightCard>

      {/* 统计信息 */}
      <SpotlightCard className="rounded-3xl border border-card-border bg-card/60 p-6 backdrop-blur-md">
        <p className="text-xs font-mono text-muted uppercase tracking-widest mb-3">Stats</p>
        <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-sm">
          <div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Posts</p>
            <p className="text-xl font-medium text-foreground font-mono">{stats.postCount}</p>
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Days</p>
            <p className="text-xl font-medium text-foreground font-mono">{stats.siteDays}</p>
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Words</p>
            <p className="text-xl font-medium text-foreground font-mono">{(stats.wordTotal / 1000).toFixed(1)}k</p>
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Comments</p>
            <p className="text-xl font-medium text-foreground font-mono">{stats.commentTotal}</p>
          </div>
        </div>
      </SpotlightCard>
    </div>
  );
}
