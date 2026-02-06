'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ProfileCard } from '@/components/dashboard/profile-card';

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
    <div className="space-y-6 sticky top-24">
      <div className="rounded-3xl border border-card-border bg-card/60 p-6">
        <p className="text-xs font-mono text-muted uppercase tracking-widest mb-3">WeChat</p>
        <div className="relative w-full h-48 rounded-2xl border border-card-border bg-background/40 flex items-center justify-center text-xs text-muted overflow-hidden">
          {wechatQrUrl ? (
            <Image src={wechatQrUrl} alt="WeChat QR" fill className="object-cover" />
          ) : (
            '公众号二维码占位'
          )}
        </div>
      </div>


      <div className="rounded-3xl border border-card-border bg-card/60 p-6">
        <p className="text-xs font-mono text-muted uppercase tracking-widest mb-3">Sponsor</p>
        <p className="text-sm text-muted-foreground">{sponsorText || '如果你喜欢这些内容，欢迎支持创作。'}</p>
        {sponsorLink ? (
          <a
            href={sponsorLink}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-foreground text-background text-xs font-bold hover:opacity-80 transition-opacity"
          >
            Support
          </a>
        ) : (
          <button className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-foreground text-background text-xs font-bold hover:opacity-80 transition-opacity">
            Support
          </button>
        )}
      </div>

      <div className="rounded-3xl border border-card-border bg-card/60 p-6">
        <p className="text-xs font-mono text-muted uppercase tracking-widest mb-3">今日热门</p>
        <div className="space-y-3">
          {hotPosts.map((post) => (
            <Link key={post.id} href={`/blogs/${post.id}`} className="block text-sm text-foreground hover:text-accent-blogs transition-colors">
              {post.title}
            </Link>
          ))}
        </div>
      </div>

      <div className="rounded-3xl border border-card-border bg-card/60 p-6">
        <p className="text-xs font-mono text-muted uppercase tracking-widest mb-3">Tags</p>
        <div className="flex flex-wrap gap-2">
          {tagCounts.map(([tag, count]) => (
            <span key={tag} className="px-3 py-1 rounded-full border border-card-border text-[10px] font-mono text-muted">
              {tag} · {count}
            </span>
          ))}
        </div>
      </div>

      <div className="rounded-3xl border border-card-border bg-card/60 p-6">
        <p className="text-xs font-mono text-muted uppercase tracking-widest mb-3">站点统计</p>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">文章总数</p>
            <p className="text-2xl font-semibold text-foreground">{stats.postCount}</p>
          </div>
          <div>
            <p className="text-muted-foreground">建站天数</p>
            <p className="text-2xl font-semibold text-foreground">{stats.siteDays}</p>
          </div>
          <div>
            <p className="text-muted-foreground">全站字数</p>
            <p className="text-2xl font-semibold text-foreground">{stats.wordTotal.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-muted-foreground">评论总数</p>
            <p className="text-2xl font-semibold text-foreground">{stats.commentTotal.toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
