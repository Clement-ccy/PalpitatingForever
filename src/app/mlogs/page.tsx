"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Disc3, Pause, SkipBack, SkipForward, Volume2, Star, Clock, Mic2, PlayCircle, Music } from 'lucide-react';
import { SpotlightCard } from '@/components/ui/spotlight-card';
import { renderNotionBlocks } from '@/components/notion/NotionBlockRenderer';
import { cn } from '@/lib/utils';
import { getFallbackTheme, type NotionBlock } from '@/lib/notion-utils';
import { fetchNotionBlocks, fetchNotionPages } from '@/lib/notion-data';

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
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedId, setSelectedId] = useState<string>('');
  const [selectedBlocks, setSelectedBlocks] = useState<NotionBlock[]>([]);
  const [mlogs, setMlogs] = useState<MlogItem[]>([]);

  useEffect(() => {
    let active = true;
    fetchNotionPages().then((pages) => {
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
      setMlogs(mapped);
    });
    return () => {
      active = false;
    };
  }, []);

  const activeId = selectedId || mlogs[0]?.id || '';
  const selectedLog = mlogs.find((log) => log.id === activeId) ?? mlogs[0];
  const selectedTheme = selectedLog?.theme ?? 'blue';
  const selectedThemeTokens = getThemeToken(selectedTheme);

  useEffect(() => {
    if (!activeId) return;
    let active = true;
    fetchNotionBlocks(activeId).then((blocks) => {
      if (!active) return;
      setSelectedBlocks(blocks);
    });
    return () => {
      active = false;
    };
  }, [activeId]);

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
      
      {/* Hero: The Player */}
      <section className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center animate-in fade-in slide-in-from-bottom-4 duration-1000">
          {/* Turntable Visual */}
          <div className="lg:col-span-5 relative group flex justify-center">
              <div className="relative aspect-square w-full max-w-100">
                    {/* Vinyl Record */}
                    <div className={cn(
                        "absolute inset-0 rounded-full bg-black shadow-2xl border border-white/5 p-2 transition-transform duration-1000",
                        isPlaying ? "animate-[spin_8s_linear_infinite]" : ""
                    )}>
                        <div className="w-full h-full rounded-full border border-card-border relative flex items-center justify-center bg-card bg-[radial-gradient(var(--card-border)_1px,transparent_1px)] bg-size-[4px_4px]">
                             {/* Label */}
                              <div className={cn(
                                  "w-1/3 h-1/3 rounded-full relative overflow-hidden flex items-center justify-center border-4 border-black/80",
                                  selectedThemeTokens.softBg,
                                  selectedThemeTokens.border
                              )}>
                                  <Image 
                                     src="https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=400&auto=format&fit=crop" 
                                     alt="Album Center"
                                     fill
                                     className="object-cover opacity-60 mix-blend-overlay"
                                  />
                                 <span className="relative z-10 font-mono text-[10px] text-black font-bold tracking-widest text-center leading-tight uppercase">SIDE A<br/>Clement</span>
                             </div>
                        </div>
                    </div>

                    {/* Tonearm (Decorative) */}
                    <div className={cn(
                      "absolute top-0 right-0 w-8 h-48 origin-top bg-linear-to-b from-neutral-500 to-neutral-700 rounded-full shadow-xl z-10 border border-card-border hidden md:block transition-transform duration-700",
                        isPlaying ? "rotate-6" : "rotate-12"
                    )} />

                    {/* Center Glow */}
                     <div className={cn(
                         "absolute inset-0 rounded-full blur-3xl -z-10 transition-opacity duration-700",
                         selectedThemeTokens.glow,
                         isPlaying ? "opacity-60" : "opacity-20"
                     )} />
                </div>
           </div>

           {/* Player Controls & Info */}
           <div className="lg:col-span-7 flex flex-col justify-center space-y-8">
                <div className="space-y-2">
                     <div className={cn("flex items-center gap-3", selectedLog ? selectedThemeTokens.accent : 'text-muted')}>
                          <Disc3 className={cn("w-4 h-4", isPlaying ? "animate-spin" : "")} />
                          <span className="text-xs font-mono tracking-widest uppercase">Now Spinning</span>
                     </div>
                     <h1 className="text-5xl md:text-7xl font-bold text-foreground tracking-tight leading-none">
                         {selectedLog?.title || 'Untitled'}
                     </h1>
                     <p className="text-lg text-muted-foreground font-light">{selectedLog?.artist || 'Unknown Artist'} • {selectedLog?.date}</p>
                 </div>

                {/* Visualizer */}
                <div className="h-16 flex items-end gap-1 opacity-80">
                    {[...Array(24)].map((_, i) => {
                        // Deterministic random-like values based on index
                        const height = ((i * 13) % 100) + 10;
                        const duration = 0.5 + ((i * 7) % 10) / 10;
                        
                        return (
                             <div
                              key={i}
                              className={cn("w-1 rounded-full transition-all duration-300", selectedThemeTokens.bar)}
                              style={{
                                  height: isPlaying ? `${height}%` : '10%',
                                  animation: isPlaying ? `equalize ${duration}s infinite ease-in-out` : 'none'
                              }}
                             />
                        );
                    })}
                </div>

                {/* Controls */}
                 <div className="bg-card border border-card-border rounded-2xl p-6 backdrop-blur-sm shadow-[0_0_50px_rgba(255,255,255,0.06)]">
                    <div className="w-full h-1 bg-foreground/10 rounded-full mb-4 relative group cursor-pointer">
                         <div className={cn("absolute top-0 left-0 h-full w-1/3 rounded-full", selectedThemeTokens.bar)}></div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                         <div className="font-mono text-xs text-muted">01:24 <span className="text-card-border">/</span> 04:12</div>
                         
                          <div className="flex items-center gap-6">
                              <button className="text-muted hover:text-foreground transition-colors" type="button"><SkipBack size={24} /></button>
                              <button 
                                  onClick={() => setIsPlaying(!isPlaying)}
                                  className="w-12 h-12 bg-foreground text-background rounded-full flex items-center justify-center hover:scale-105 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.15)]"
                                  type="button"
                              >
                                  {isPlaying ? <Pause size={24} fill="currentColor" /> : <PlayCircle size={24} fill="currentColor" />}
                              </button>
                              <button className="text-muted hover:text-foreground transition-colors" type="button"><SkipForward size={24} /></button>
                           </div>

                         <div className="flex items-center gap-2 text-muted">
                             <Volume2 size={16} />
                              <div className="w-16 h-1 bg-foreground/10 rounded-full overflow-hidden">
                                  <div className="w-3/4 h-full bg-foreground/50"></div>
                              </div>
                          </div>
                     </div>
                 </div>
            </div>
       </section>

                      <div className="h-px w-full bg-linear-to-r from-transparent via-card-border to-transparent"></div>

       {/* Collection Grid */}
       <section className="space-y-6">
          <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-foreground">Music Logs</h2>
              <div className="flex gap-2">
                  <span className="px-3 py-1.5 rounded-lg text-xs font-mono bg-card border border-card-border text-muted">Podcast • Music</span>
              </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mlogs.map((log) => (
                  <SpotlightCard 
                      key={log.id} 
                      spotlightColor={themeTokens[log.theme].spotlight}
                      onClick={() => setSelectedId(log.id)}
                      className={cn(
                          "p-4 flex gap-4 group cursor-pointer rounded-2xl border-card-border transition-all shadow-sm",
                          activeId === log.id ? "border-foreground/50 bg-card" : "hover:border-card-border/80"
                      )}
                  >

                     <div className="w-24 h-24 rounded-lg bg-card overflow-hidden relative shrink-0">
                         {log.cover ? (
                              <Image src={log.cover} alt={log.title} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                         ) : (
                          <div className="w-full h-full bg-linear-to-br from-card to-background flex items-center justify-center border border-card-border">
                                 <Mic2 className="text-muted" size={32} />
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
                              {log.type === 'PODCAST' && (
                                  <div className="flex items-center gap-1">
                                      <PlayCircle size={10} />
                                      <span>READ</span>
                                  </div>
                              )}

                          </div>
                      </div>
                  </SpotlightCard>
              ))}
          </div>
       </section>

       {selectedLog && (
         <section className="mt-12 rounded-3xl border border-card-border bg-card/40 p-8">
            <div className="flex items-center gap-3 mb-6">
                <div className={cn("w-10 h-10 rounded-2xl border flex items-center justify-center", themeTokens[selectedLog.theme])}>
                    {selectedLog.type === 'PODCAST' ? <Mic2 size={18} /> : <Disc3 size={18} />}
                </div>
                <div>
                    <p className="text-xs font-mono text-muted uppercase tracking-widest">Content Blocks</p>
                    <h3 className="text-2xl font-semibold text-foreground">{selectedLog.title}</h3>
                </div>
            </div>
            <div className="prose prose-invert max-w-none">
                {selectedBlocks.length > 0 ? renderNotionBlocks(selectedBlocks) : (
                    <p className="text-muted">暂无内容。</p>
                )}
            </div>
         </section>
       )}
    </div>
  );
}
