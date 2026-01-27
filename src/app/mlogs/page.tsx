"use client";

import { SpotlightCard } from '@/components/ui/spotlight-card';
import { Disc3, Pause, SkipBack, SkipForward, Volume2, Star, Clock, Mic2, PlayCircle, Music } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { mapNotionPage } from '@/lib/notion-utils';
import notionData from '@/data/refs/notion-query-a-data-source.json';

// Use Notion data instead of local mock
const MOCK_MLOGS = (notionData.results as unknown[])
    .map(mapNotionPage)
    .filter(post => post.category === 'Music')
    .map(post => ({
        id: post.id,
        title: post.title,
        artist: post.summary, // Summary as artist/subtitle for now
        cover: post.cover || 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=200&auto=format&fit=crop',
        type: 'REVIEW' as const, // Default to REVIEW
        date: post.date,
        description: post.summary,
        theme: 'rose' as const, // Default theme
        rating: 4.5, // Mock rating
        duration: '45 MIN', // Mock duration
    }));

const themeColors = {
    rose: 'text-rose-400 bg-rose-500/10 border-rose-500/20 group-hover:text-rose-400',
    indigo: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20 group-hover:text-indigo-400',
    emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20 group-hover:text-emerald-400',
    orange: 'text-orange-400 bg-orange-500/10 border-orange-500/20 group-hover:text-orange-400',
};

export default function MusicPage() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="min-h-screen pt-32 px-4 pb-32 max-w-7xl mx-auto flex flex-col gap-12 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/4 -right-20 w-96 h-96 bg-accent-mlogs/10 blur-[120px] rounded-full -z-10" />
      <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-accent-mlogs/5 blur-[120px] rounded-full -z-10" />

      <header className="mb-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-mlogs/10 border border-accent-mlogs/20 text-xs font-mono text-accent-mlogs mb-4">
              <Music size={14} />
              <span>AUDITORY ARCHIVES</span>
          </div>
      </header>
      
      {/* Hero: The Player */}
      <section className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center animate-in fade-in slide-in-from-bottom-4 duration-1000">
          {/* Turntable Visual */}
          <div className="lg:col-span-5 relative group flex justify-center">
              <div className="relative aspect-square w-full max-w-[400px]">
                    {/* Vinyl Record */}
                    <div className={cn(
                        "absolute inset-0 rounded-full bg-black shadow-2xl border border-white/5 p-2 transition-transform duration-1000",
                        isPlaying ? "animate-[spin_8s_linear_infinite]" : ""
                    )}>
                        <div className="w-full h-full rounded-full border border-card-border relative flex items-center justify-center bg-card bg-[radial-gradient(var(--card-border)_1px,transparent_1px)] bg-[length:4px_4px]">
                             {/* Label */}
                             <div className="w-1/3 h-1/3 rounded-full bg-accent-mlogs relative overflow-hidden flex items-center justify-center border-4 border-black/80">
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
                        "absolute top-0 right-0 w-8 h-48 origin-top bg-gradient-to-b from-neutral-500 to-neutral-700 rounded-full shadow-xl z-10 border border-card-border hidden md:block transition-transform duration-700",
                        isPlaying ? "rotate-[6deg]" : "rotate-[12deg]"
                    )} />

                    {/* Center Glow */}
                    <div className={cn(
                        "absolute inset-0 rounded-full bg-accent-mlogs/20 blur-3xl -z-10 transition-opacity duration-700",
                        isPlaying ? "opacity-60" : "opacity-20"
                    )} />
                </div>
           </div>

           {/* Player Controls & Info */}
           <div className="lg:col-span-7 flex flex-col justify-center space-y-8">
                <div className="space-y-2">
                    <div className="flex items-center gap-3 text-accent-mlogs">
                         <Disc3 className={cn("w-4 h-4", isPlaying ? "animate-spin" : "")} />
                         <span className="text-xs font-mono tracking-widest uppercase">Now Spinning</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold text-foreground tracking-tight leading-none">
                        Midnight <br className="md:hidden"/> Odyssey
                    </h1>
                    <p className="text-xl text-muted font-light">Synthetic Dreams • 2024</p>
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
                             className="w-1 bg-accent-mlogs rounded-full transition-all duration-300"
                             style={{
                                 height: isPlaying ? `${height}%` : '10%',
                                 animation: isPlaying ? `equalize ${duration}s infinite ease-in-out` : 'none'
                             }}
                            />
                        );
                    })}
                </div>

                {/* Controls */}
                <div className="bg-card border border-card-border rounded-2xl p-6 backdrop-blur-sm shadow-[0_0_50px_rgba(var(--accent-mlogs),0.05)]">
                    <div className="w-full h-1 bg-foreground/10 rounded-full mb-4 relative group cursor-pointer">
                         <div className="absolute top-0 left-0 h-full w-1/3 bg-accent-mlogs rounded-full"></div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                         <div className="font-mono text-xs text-muted">01:24 <span className="text-card-border">/</span> 04:12</div>
                         
                          <div className="flex items-center gap-6">
                             <button className="text-muted hover:text-accent-mlogs transition-colors" type="button"><SkipBack size={24} /></button>
                             <button 
                                 onClick={() => setIsPlaying(!isPlaying)}
                                 className="w-12 h-12 bg-accent-mlogs text-black rounded-full flex items-center justify-center hover:scale-105 transition-transform shadow-[0_0_20px_rgba(var(--accent-mlogs),0.3)]"
                                 type="button"
                             >
                                 {isPlaying ? <Pause size={24} fill="currentColor" /> : <PlayCircle size={24} fill="currentColor" />}
                             </button>
                             <button className="text-muted hover:text-accent-mlogs transition-colors" type="button"><SkipForward size={24} /></button>
                          </div>

                         <div className="flex items-center gap-2 text-muted">
                             <Volume2 size={16} />
                             <div className="w-16 h-1 bg-foreground/10 rounded-full overflow-hidden">
                                 <div className="w-3/4 h-full bg-accent-mlogs/50"></div>
                             </div>
                         </div>
                    </div>
                </div>
           </div>
       </section>

       <div className="h-px w-full bg-gradient-to-r from-transparent via-card-border to-transparent"></div>

       {/* Collection Grid */}
       <section className="space-y-6">
          <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-foreground">Music Logs</h2>
              <div className="flex gap-2">
                  <button className="px-3 py-1.5 rounded-lg text-xs font-mono bg-accent-mlogs/10 text-accent-mlogs border border-accent-mlogs/20">REVIEWS</button>
                  <button className="px-3 py-1.5 rounded-lg text-xs font-mono text-muted hover:text-foreground transition-colors">PLAYLISTS</button>
              </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {MOCK_MLOGS.map((log) => (
                  <SpotlightCard 
                      key={log.id} 
                      spotlightColor="rgba(var(--accent-mlogs-rgb), 0.15)"
                      className="p-4 flex gap-4 group cursor-pointer rounded-2xl border-card-border hover:border-accent-mlogs/30 transition-all shadow-sm hover:shadow-[0_0_30px_rgba(var(--accent-mlogs),0.05)]"
                  >

                     <div className="w-24 h-24 rounded-lg bg-card overflow-hidden relative shrink-0">
                         {log.cover ? (
                             <Image src={log.cover} alt={log.title} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                         ) : (
                             <div className="w-full h-full bg-gradient-to-br from-card to-background flex items-center justify-center border border-card-border">
                                 <Mic2 className="text-muted" size={32} />
                             </div>
                         )}
                     </div>
                     
                     <div className="flex flex-col justify-between py-1 flex-grow">
                         <div>
                             <div className="flex items-center gap-2 mb-1">
                                 <span className={cn("px-1.5 py-0.5 rounded text-[10px] font-mono border bg-opacity-10", themeColors[log.theme].split(' ').slice(0,3).join(' '))}>
                                     {log.type}
                                 </span>
                                 <span className="text-[10px] text-muted font-mono">{log.date}</span>
                             </div>
                             <h3 className={cn("text-lg font-medium text-foreground leading-tight mb-1 transition-colors group-hover:text-accent-mlogs")}>
                                 {log.title}
                             </h3>
                             <p className="text-sm text-muted line-clamp-1">{log.description}</p>
                         </div>
                         
                         <div className="flex items-center gap-1 text-xs text-muted font-mono mt-2">
                             {log.rating && (
                                 <div className="flex text-accent-mlogs gap-0.5">
                                     {[...Array(Math.floor(log.rating))].map((_, i) => <Star key={i} size={10} fill="currentColor" />)}
                                 </div>
                             )}
                             {log.duration && (
                                 <div className="flex items-center gap-1">
                                     <Clock size={10} />
                                     <span>{log.duration}</span>
                                 </div>
                             )}
                              {(log.type as string) === 'PODCAST' && (
                                  <div className="flex items-center gap-1">
                                      <PlayCircle size={10} />
                                      <span>LISTEN NOW</span>
                                  </div>
                              )}

                         </div>
                     </div>
                 </SpotlightCard>
             ))}
          </div>
       </section>
    </div>
  );
}
