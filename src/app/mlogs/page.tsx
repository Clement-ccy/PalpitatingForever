"use client";

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Clock, Music, PlayCircle, PlusCircle, Star } from 'lucide-react';
import { SpotlightCard } from '@/components/ui/spotlight-card';
import { cn } from '@/lib/utils';
import { getFallbackTheme } from '@/lib/notion/utils';
import type { NotionBlock, NotionPage } from '@/lib/notion/types';
import { fetchNotionBlocks, fetchNotionPages } from '@/lib/notion/client';
import { trackEvent } from '@/lib/analytics/client';
import { usePlayer } from '@/components/player/PlayerProvider';
import type { AudioTrack } from '@/lib/player/types';

const themeTokens = {
    rose: {
        accent: 'text-rose-400',
        softBg: 'bg-rose-500/10',
        border: 'border-rose-500/20',
        bar: 'bg-rose-400',
        glow: 'bg-rose-500/20',
        spotlight: 'rgba(244,63,94,0.15)'
    },
    indigo: {
        accent: 'text-indigo-400',
        softBg: 'bg-indigo-500/10',
        border: 'border-indigo-500/20',
        bar: 'bg-indigo-400',
        glow: 'bg-indigo-500/20',
        spotlight: 'rgba(99,102,241,0.15)'
    },
    emerald: {
        accent: 'text-emerald-400',
        softBg: 'bg-emerald-500/10',
        border: 'border-emerald-500/20',
        bar: 'bg-emerald-400',
        glow: 'bg-emerald-500/20',
        spotlight: 'rgba(16,185,129,0.15)'
    },
    orange: {
        accent: 'text-orange-400',
        softBg: 'bg-orange-500/10',
        border: 'border-orange-500/20',
        bar: 'bg-orange-400',
        glow: 'bg-orange-500/20',
        spotlight: 'rgba(249,115,22,0.15)'
    },
    blue: {
        accent: 'text-blue-400',
        softBg: 'bg-blue-500/10',
        border: 'border-blue-500/20',
        bar: 'bg-blue-400',
        glow: 'bg-blue-500/20',
        spotlight: 'rgba(59,130,246,0.15)'
    },
    purple: {
        accent: 'text-purple-400',
        softBg: 'bg-purple-500/10',
        border: 'border-purple-500/20',
        bar: 'bg-purple-400',
        glow: 'bg-purple-500/20',
        spotlight: 'rgba(168,85,247,0.15)'
    },
} as const;

type ThemeKey = keyof typeof themeTokens;
type MlogType = 'PODCAST' | 'MUSIC';

const themePool = Object.keys(themeTokens) as ThemeKey[];
const DEFAULT_COVER = 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=200&auto=format&fit=crop';

interface MlogItem {
    id: string;
    title: string;
    artist: string;
    cover: string;
    type: MlogType;
    date: string;
    description: string;
    theme: ThemeKey;
    rating: number | null;
    duration?: string;
    audioSrc?: string;
}

const resolveTheme = (theme: string | null, id: string): ThemeKey => {
    const normalized = theme?.toLowerCase() ?? '';
    if (normalized && normalized in themeTokens) {
        return normalized as ThemeKey;
    }
    return getFallbackTheme(id, themePool) as ThemeKey;
};

const getMlogType = (area: string): MlogType => {
    const normalized = area.trim().toLowerCase();
    if (normalized === 'podcast') return 'PODCAST';
    if (normalized === 'music') return 'MUSIC';
    return normalized.includes('podcast') ? 'PODCAST' : 'MUSIC';
};

const getThemeToken = (theme: ThemeKey) => themeTokens[theme];

export default function MusicPage() {
  const [mlogs, setMlogs] = useState<MlogItem[]>([]);
  const { queue, setQueue, addTracks, playTrackById } = usePlayer();

  useEffect(() => {
    let active = true;
    fetchNotionPages().then(async (pages) => {
      if (!active) return;
      const mapped = pages
        .filter((post) => post.category === 'Mlogs')
        .map((post) => {
          const [trackTitle, artistName] = post.title.split(' - ');
          const type = getMlogType(post.area);
          return {
            id: post.id,
            title: trackTitle || post.title,
            artist: artistName || post.summary || 'Unknown Artist',
            cover: post.cover || DEFAULT_COVER,
            type,
            date: post.date,
            description: post.summary,
            theme: resolveTheme(post.theme, post.id),
            rating: post.rate,
          };
        });
      const audioBlocks = await Promise.all(
        mapped.map(async (log) => {
          const blocks = await fetchNotionBlocks(log.id);
          const audioBlock = blocks.find((block) => block.type === 'audio');
          const content = (audioBlock?.content && typeof audioBlock.content === 'object'
            ? (audioBlock.content as { url?: string })
            : undefined);
          return { id: log.id, audioSrc: content?.url };
        })
      );
      const audioMap = new Map(audioBlocks.map((item) => [item.id, item.audioSrc]));
      const enriched = mapped.map((log) => ({ ...log, audioSrc: audioMap.get(log.id) }));
      setMlogs(enriched);
    });
    return () => {
      active = false;
    };
  }, []);

  const musicLogs = useMemo(() => (
    mlogs.filter((log) => log.type === 'MUSIC')
  ), [mlogs]);

  const addToPlaylist = (log: MlogItem) => {
    if (!log.audioSrc) return;
    addTracks([
      {
        id: log.id,
        title: log.title,
        artist: log.artist,
        cover: log.cover,
        src: log.audioSrc,
        kind: 'mlog',
      },
    ]);
    trackEvent({
      site: 'main',
      name: 'mlog_add_to_playlist',
      path: `/mlogs/${log.id}`,
      title: log.title,
    });
  };

  useEffect(() => {
    if (mlogs.length === 0) return;
    const sorted = [...mlogs].sort((a, b) => (a.date < b.date ? 1 : -1));
    const topFive = sorted.filter((log) => log.audioSrc).slice(0, 5);
    if (topFive.length === 0) return;
    const tracks: AudioTrack[] = topFive.map((log) => ({
      id: log.id,
      title: log.title,
      artist: log.artist,
      cover: log.cover,
      src: log.audioSrc as string,
      kind: 'mlog',
    }));
    setQueue(tracks, 0);
  }, [mlogs, setQueue]);

  return (
    <div className="min-h-screen pt-32 px-4 pb-32 max-w-7xl mx-auto flex flex-col gap-12 relative">
      {/* Background Glow */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-[rgba(var(--accent-works-rgb),0.2)] blur-[140px] rounded-full -z-10" />
      <div className="absolute top-1/3 right-1/4 w-md h-112 bg-[rgba(var(--accent-blogs-rgb),0.2)] blur-[140px] rounded-full -z-10" />
      <div className="absolute bottom-10 left-1/3 w-104 h-104 bg-[rgba(var(--accent-mlogs-rgb),0.2)] blur-[140px] rounded-full -z-10" />

      <header className="mb-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-card border border-card-border text-xs font-mono text-muted mb-4">
              <Music size={14} />
              <span>AUDITORY ARCHIVES</span>
          </div>
      </header>
      
      <div className="h-px w-full bg-linear-to-r from-transparent via-card-border to-transparent" />

      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-foreground">Music Logs</h2>
          <div className="flex gap-2">
            <span className="px-3 py-1.5 rounded-lg text-xs font-mono bg-card border border-card-border text-muted">Music Only</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {musicLogs.map((log) => (
            <SpotlightCard
              key={log.id}
              spotlightColor={themeTokens[log.theme].spotlight}
              className="p-4 flex gap-4 group rounded-2xl border-card-border transition-all shadow-sm"
            >
              <div className="w-24 h-24 rounded-lg bg-card overflow-hidden relative shrink-0">
                {log.cover ? (
                  <Image
                    src={log.cover}
                    alt={log.title}
                    fill
                    sizes="(min-width: 1024px) 20vw, (min-width: 768px) 33vw, 50vw"
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-linear-to-br from-card to-background flex items-center justify-center border border-card-border">
                    <Music className="text-muted" size={32} />
                  </div>
                )}
              </div>

              <div className="flex flex-col justify-between py-1 grow">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={cn("px-1.5 py-0.5 rounded text-[10px] font-mono border", themeTokens[log.theme].softBg, themeTokens[log.theme].border, themeTokens[log.theme].accent)}>
                      {log.type}
                    </span>
                    <span className="text-[10px] text-muted font-mono">{log.date}</span>
                  </div>
                  <h3 className={cn("text-lg font-medium text-foreground leading-tight mb-1 transition-colors", themeTokens[log.theme].accent)}>
                    {log.title}
                  </h3>
                  <p className="text-sm text-muted line-clamp-1">{log.description}</p>
                </div>

                <div className="flex items-center gap-2 text-xs text-muted font-mono mt-2">
                  {log.rating !== null && (
                    <div className="flex text-foreground gap-0.5">
                      {[...Array(Math.floor(log.rating))].map((_, i) => <Star key={i} size={10} fill="currentColor" />)}
                    </div>
                  )}
                  {log.duration && (
                    <div className="flex items-center gap-1">
                      <Clock size={10} />
                      <span>{log.duration}</span>
                    </div>
                  )}
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                   <button
                     type="button"
                     onClick={() => addToPlaylist(log)}
                     className="inline-flex items-center gap-2 rounded-full border border-card-border px-3 py-1.5 text-[10px] font-mono text-foreground hover:bg-foreground/5 transition-colors"
                   >
                     <PlusCircle size={12} /> Add to Playlist
                   </button>
                   <button
                     type="button"
                     onClick={() => log.audioSrc && playTrackById(log.id)}
                     className="inline-flex items-center gap-2 rounded-full border border-card-border px-3 py-1.5 text-[10px] font-mono text-foreground hover:bg-foreground/5 transition-colors"
                   >
                     <PlayCircle size={12} /> Play
                   </button>
                   <Link
                     href={`/mlogs/${log.id}`}
                     className="inline-flex items-center gap-2 rounded-full bg-foreground text-background px-3 py-1.5 text-[10px] font-bold hover:opacity-80 transition-opacity"
                   >
                    View Detail <PlayCircle size={12} />
                  </Link>
                </div>
              </div>
            </SpotlightCard>
          ))}
        </div>
      </section>

      {queue.length > 0 && (
        <section className="mt-10 rounded-3xl border border-card-border bg-card/40 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Playlist</h3>
            <span className="text-xs font-mono text-muted">{queue.length} tracks</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {queue.map((item) => (
              <div key={item.id} className="flex items-center gap-3 rounded-2xl border border-card-border bg-background/40 p-3">
                <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-card">
                  <Image src={item.cover || DEFAULT_COVER} alt={item.title} fill sizes="48px" className="object-cover" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{item.title}</p>
                  <p className="text-xs text-muted">{item.artist || 'Unknown Artist'}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
