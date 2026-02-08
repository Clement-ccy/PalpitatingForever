'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { ChevronDown, ChevronUp, Maximize2, Pause, Pin, PinOff, PlayCircle, Repeat, Repeat1, SkipBack, SkipForward, Volume2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePlayer } from '@/components/player/PlayerProvider';

const DEFAULT_COVER = 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=400&auto=format&fit=crop';

export default function AudioPlayer() {
  const [expanded, setExpanded] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { queue, currentIndex, isPlaying, setPlaying, next, prev, playTrackById } = usePlayer();
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [loopMode, setLoopMode] = useState<'none' | 'all' | 'one'>('none');
  const [pinned, setPinned] = useState(false);
  const [hovered, setHovered] = useState(false);

  const currentTrack = queue[currentIndex];
  const trackTitle = currentTrack?.title || 'Untitled Track';
  const trackArtist = currentTrack?.artist || 'Unknown Artist';
  const trackCover = currentTrack?.cover || DEFAULT_COVER;
  const showCompactPanel = pinned || hovered;
  const canControl = Boolean(currentTrack?.src);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = volume;
  }, [volume]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.loop = loopMode === 'one';
  }, [loopMode]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying && currentTrack?.src) {
      void audio.play();
    } else {
      audio.pause();
    }
  }, [isPlaying, currentTrack?.src]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const handleTimeUpdate = () => {
      setProgress(audio.currentTime || 0);
      setDuration(audio.duration || 0);
    };
    const handleLoaded = () => {
      setDuration(audio.duration || 0);
    };
    const handleEnded = () => {
      if (loopMode === 'one') return;
      if (loopMode === 'all') {
        next();
        return;
      }
      if (currentIndex < queue.length - 1) {
        next();
      } else {
        setPlaying(false);
      }
    };
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoaded);
    audio.addEventListener('ended', handleEnded);
    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoaded);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentIndex, loopMode, next, queue.length, setPlaying]);

  const formatTime = (value: number) => {
    if (!Number.isFinite(value) || value <= 0) return '00:00';
    const minutes = Math.floor(value / 60);
    const seconds = Math.floor(value % 60);
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  return (
    <>
      {!expanded && (
        <div className="fixed z-50 right-6 bottom-6">
          <div
            className="relative flex items-center overflow-visible"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            <div
              className={cn(
                'absolute right-16 flex items-center gap-2 rounded-full border border-card-border bg-card/80 backdrop-blur-xl px-3 py-2 shadow-[0_0_30px_rgba(0,0,0,0.25)] transition-all duration-300',
                showCompactPanel
                  ? 'opacity-100 translate-x-0 pointer-events-auto'
                  : 'opacity-0 translate-x-4 pointer-events-none'
              )}
            >
              <button
                type="button"
                onClick={prev}
                disabled={!canControl}
                className="w-8 h-8 rounded-full border border-card-border flex items-center justify-center text-muted hover:text-foreground hover:bg-foreground/5 transition-colors disabled:opacity-40"
                aria-label="Previous"
              >
                <SkipBack size={16} />
              </button>
              <button
                type="button"
                onClick={() => setPlaying(!isPlaying)}
                disabled={!canControl}
                className="w-8 h-8 rounded-full border border-card-border flex items-center justify-center text-muted hover:text-foreground hover:bg-foreground/5 transition-colors disabled:opacity-40"
                aria-label="Play or pause"
              >
                {isPlaying ? <Pause size={16} /> : <PlayCircle size={16} />}
              </button>
              <button
                type="button"
                onClick={next}
                disabled={!canControl}
                className="w-8 h-8 rounded-full border border-card-border flex items-center justify-center text-muted hover:text-foreground hover:bg-foreground/5 transition-colors disabled:opacity-40"
                aria-label="Next"
              >
                <SkipForward size={16} />
              </button>
              <button
                type="button"
                onClick={() => setPinned((prev) => !prev)}
                className={cn(
                  'w-8 h-8 rounded-full border border-card-border flex items-center justify-center transition-colors',
                  pinned ? 'text-foreground bg-foreground/10' : 'text-muted hover:text-foreground hover:bg-foreground/5'
                )}
                aria-pressed={pinned}
                aria-label="Pin"
              >
                {pinned ? <PinOff size={14} /> : <Pin size={14} />}
              </button>
            </div>

            <button
              type="button"
              onClick={() => setExpanded(true)}
              className="relative w-16 h-16 rounded-full border border-card-border bg-black/80 shadow-[0_0_30px_rgba(0,0,0,0.35)] overflow-hidden"
              aria-label="Expand player"
            >
              <div
                className={cn(
                  'absolute inset-1 rounded-full border border-card-border bg-card/40',
                  isPlaying ? 'animate-[spin_6s_linear_infinite]' : ''
                )}
              >
                <div className="absolute inset-0 bg-[radial-gradient(var(--card-border)_1px,transparent_1px)] bg-size-[4px_4px]" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-5 h-5 rounded-full overflow-hidden bg-card border border-card-border">
                    <Image src={trackCover} alt={trackTitle} fill sizes="20px" className="object-cover" />
                  </div>
                </div>
              </div>
              <div className={cn(
                'absolute inset-0 flex items-center justify-center text-white/80 transition-opacity duration-500',
                hovered ? 'opacity-100' : 'opacity-0'
              )}>
                <Maximize2 size={16} />
              </div>
            </button>
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
                <p className="text-lg font-semibold text-foreground">{trackTitle}</p>
                <p className="text-xs text-muted">{trackArtist}</p>
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
                          src={trackCover}
                          alt="Album Center"
                          fill
                          sizes="(min-width: 1024px) 30vw, 40vw"
                          className="object-cover opacity-80 mix-blend-normal"
                        />
                        <span className="relative z-10 font-mono text-[10px] text-black font-bold tracking-widest text-center leading-tight uppercase">SIDE A<br/>PF</span>
                      </div>
                    </div>
                  </div>
                   <div
                     className={cn(
                       'absolute -right-6 top-8 w-10 h-56 origin-top bg-linear-to-b from-neutral-500 to-neutral-700 rounded-full shadow-xl border border-card-border hidden md:block transition-transform duration-500',
                       isPlaying ? 'rotate-[12deg]' : 'rotate-[-6deg]'
                     )}
                   />
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

                <div className="space-y-2">
                  <input
                    type="range"
                    min={0}
                    max={Math.max(duration, 1)}
                    step={0.1}
                    value={progress}
                    onChange={(event) => {
                      const audio = audioRef.current;
                      if (!audio) return;
                      const nextTime = Number(event.target.value);
                      audio.currentTime = nextTime;
                      setProgress(nextTime);
                    }}
                    className="w-full h-1 accent-foreground"
                  />
                  <div className="flex items-center justify-between text-xs font-mono text-muted">
                    <span>{formatTime(progress)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <button className="text-muted hover:text-foreground transition-colors" type="button" onClick={prev}>
                    <SkipBack size={24} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setPlaying(!isPlaying)}
                    className="w-14 h-14 bg-foreground text-background rounded-full flex items-center justify-center hover:scale-105 transition-transform"
                  >
                    {isPlaying ? <Pause size={26} fill="currentColor" /> : <PlayCircle size={26} fill="currentColor" />}
                  </button>
                  <button className="text-muted hover:text-foreground transition-colors" type="button" onClick={next}>
                    <SkipForward size={24} />
                  </button>
                </div>
                <div className="flex items-center gap-2 text-muted">
                  <Volume2 size={18} />
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.01}
                    value={volume}
                    onChange={(event) => setVolume(Number(event.target.value))}
                    className="w-full h-1 accent-foreground"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setLoopMode((prev) => (prev === 'none' ? 'all' : prev === 'all' ? 'one' : 'none'))}
                    className={cn(
                      'inline-flex items-center gap-2 rounded-full border border-card-border px-3 py-1 text-xs font-mono transition-colors',
                      loopMode === 'none' ? 'text-muted' : 'text-foreground'
                    )}
                  >
                    {loopMode === 'one' ? <Repeat1 size={14} /> : <Repeat size={14} />}
                    {loopMode === 'none' ? 'Loop Off' : loopMode === 'all' ? 'Loop All' : 'Loop One'}
                  </button>
                </div>
              </div>
            </div>

            <div className="border-t border-card-border bg-background/40">
              <div className="px-6 py-4 flex items-center justify-between">
                <p className="text-xs font-mono text-muted uppercase tracking-widest">Queue</p>
                <span className="text-xs font-mono text-muted">{queue.length} tracks</span>
              </div>
              <div className="max-h-56 overflow-y-auto custom-scrollbar px-4 pb-4">
                <div className="space-y-2">
                  {queue.map((track, index) => (
                    <button
                      key={track.id}
                      type="button"
                      onClick={() => playTrackById(track.id)}
                      className={cn(
                        'w-full flex items-center gap-3 rounded-2xl border border-card-border px-4 py-3 text-left transition-colors',
                        index === currentIndex ? 'bg-foreground/10 border-foreground/40' : 'bg-card/40 hover:bg-card/60'
                      )}
                    >
                      <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-card">
                        <Image src={track.cover || DEFAULT_COVER} alt={track.title} fill sizes="40px" className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{track.title}</p>
                        <p className="text-xs text-muted truncate">{track.artist || 'Unknown Artist'}</p>
                      </div>
                      <span className="text-[10px] font-mono text-muted uppercase tracking-wider">{track.kind}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <audio ref={audioRef} src={currentTrack?.src || undefined} preload="metadata" />
    </>
  );
}
