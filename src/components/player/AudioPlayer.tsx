'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronDown, ChevronUp, Disc3, Pause, PlayCircle, SkipBack, SkipForward, Volume2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const DEFAULT_COVER = 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=400&auto=format&fit=crop';

export default function AudioPlayer() {
  const [expanded, setExpanded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <>
      {!expanded && (
        <div className="fixed z-50 right-6 bottom-6 w-[220px]">
          <div className="rounded-3xl border border-card-border bg-card/80 backdrop-blur-xl shadow-[0_0_40px_rgba(0,0,0,0.25)] overflow-hidden">
            <div className="flex items-center gap-4 p-4">
              <div className="relative rounded-2xl overflow-hidden bg-card w-12 h-12">
                <Image src={DEFAULT_COVER} alt="Now Playing" fill sizes="48px" className="object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-mono text-muted uppercase tracking-widest">Now Playing</p>
                <p className="text-sm font-semibold text-foreground truncate">Untitled Track</p>
                <p className="text-xs text-muted truncate">Unknown Artist</p>
              </div>
              <button
                type="button"
                onClick={() => setExpanded(true)}
                className="w-8 h-8 rounded-full border border-card-border flex items-center justify-center text-muted hover:text-foreground hover:bg-foreground/5 transition-colors"
              >
                <ChevronUp size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {expanded && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-6 py-10 bg-background/80 backdrop-blur-2xl">
          <div className="absolute inset-0" onClick={() => setExpanded(false)} />
          <div className="relative w-full max-w-5xl rounded-[32px] border border-card-border bg-card/90 shadow-[0_0_80px_rgba(0,0,0,0.35)] overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-card-border">
              <div>
                <p className="text-xs font-mono text-muted uppercase tracking-widest">Now Playing</p>
                <p className="text-lg font-semibold text-foreground">Untitled Track</p>
                <p className="text-xs text-muted">Unknown Artist</p>
              </div>
              <button
                type="button"
                onClick={() => setExpanded(false)}
                className="w-10 h-10 rounded-full border border-card-border flex items-center justify-center text-muted hover:text-foreground hover:bg-foreground/5 transition-colors"
              >
                <ChevronDown size={18} />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
              <div className="relative flex items-center justify-center">
                <div className="relative w-[280px] h-[280px] md:w-[360px] md:h-[360px]">
                  <div className={cn(
                    'absolute inset-0 rounded-full bg-black border border-white/5 p-2 shadow-2xl',
                    isPlaying ? 'animate-[spin_8s_linear_infinite]' : ''
                  )}>
                    <div className="w-full h-full rounded-full border border-card-border relative flex items-center justify-center bg-card bg-[radial-gradient(var(--card-border)_1px,transparent_1px)] bg-size-[4px_4px]">
                      <div className="w-1/3 h-1/3 rounded-full relative overflow-hidden flex items-center justify-center border-4 border-black/80">
                        <Image
                          src={DEFAULT_COVER}
                          alt="Album Center"
                          fill
                          sizes="(min-width: 1024px) 30vw, 40vw"
                          className="object-cover opacity-60 mix-blend-overlay"
                        />
                        <span className="relative z-10 font-mono text-[10px] text-black font-bold tracking-widest text-center leading-tight uppercase">SIDE A<br/>PF</span>
                      </div>
                    </div>
                  </div>
                  <div className="absolute -right-6 top-8 w-10 h-56 origin-top bg-linear-to-b from-neutral-500 to-neutral-700 rounded-full shadow-xl border border-card-border hidden md:block" />
                  <div className="absolute inset-0 rounded-full blur-3xl bg-accent-mlogs/30 opacity-40 -z-10" />
                </div>
              </div>

              <div className="flex flex-col justify-center space-y-6">
                <div className="h-16 flex items-end gap-1 opacity-80">
                  {[...Array(24)].map((_, i) => {
                    const height = ((i * 13) % 100) + 10;
                    const duration = 0.5 + ((i * 7) % 10) / 10;
                    return (
                      <div
                        key={i}
                        className="w-1 rounded-full bg-foreground transition-all duration-300"
                        style={{
                          height: isPlaying ? `${height}%` : '10%',
                          animation: isPlaying ? `equalize ${duration}s infinite ease-in-out` : 'none'
                        }}
                      />
                    );
                  })}
                </div>

                <div className="w-full h-1 bg-foreground/10 rounded-full relative">
                  <div className="absolute top-0 left-0 h-full w-1/3 rounded-full bg-foreground" />
                </div>
                <div className="flex items-center justify-between text-xs font-mono text-muted">
                  <span>01:24</span>
                  <span>04:12</span>
                </div>
                <div className="flex items-center justify-between">
                  <button className="text-muted hover:text-foreground transition-colors" type="button">
                    <SkipBack size={24} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsPlaying((prev) => !prev)}
                    className="w-14 h-14 bg-foreground text-background rounded-full flex items-center justify-center hover:scale-105 transition-transform"
                  >
                    {isPlaying ? <Pause size={26} fill="currentColor" /> : <PlayCircle size={26} fill="currentColor" />}
                  </button>
                  <button className="text-muted hover:text-foreground transition-colors" type="button">
                    <SkipForward size={24} />
                  </button>
                </div>
                <div className="flex items-center gap-2 text-muted">
                  <Volume2 size={18} />
                  <div className="w-full h-1 bg-foreground/10 rounded-full overflow-hidden">
                    <div className="w-2/3 h-full bg-foreground/50" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
