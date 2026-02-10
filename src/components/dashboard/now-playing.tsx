import Image from 'next/image';
import { Music, PlayCircle, Pause } from 'lucide-react';
import { SpotlightCard } from '@/components/ui/spotlight-card';
import { usePlayer } from '@/components/player/PlayerProvider';

export function NowPlaying() {
  const { queue, currentIndex, isPlaying, setPlaying } = usePlayer();
  const currentTrack = queue[currentIndex];
  const trackTitle = currentTrack?.title ?? 'No track queued';
  const trackArtist = currentTrack?.artist ?? '—';
  const trackCover = currentTrack?.cover ?? 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=400&auto=format&fit=crop';
  const canControl = Boolean(currentTrack?.src);
  return (
    <SpotlightCard className="h-full w-full p-6 flex flex-col justify-between group overflow-hidden">
      <div className="flex justify-between items-start z-10">
        <div className="flex items-center gap-3">
          <div className="relative w-12 h-12 rounded-2xl overflow-hidden border border-card-border bg-card">
            <Image src={trackCover} alt={trackTitle} fill sizes="48px" className="object-cover" />
          </div>
          <div>
            <p className="text-xs font-mono text-muted">Now Playing</p>
            <h3 className="font-medium text-foreground/90 truncate max-w-[140px] group-hover:text-green-500 transition-colors">
              {trackTitle}
            </h3>
            <p className="text-xs text-muted truncate max-w-[140px]">{trackArtist}</p>
          </div>
        </div>
        <div className="flex gap-1 h-4 items-end">
          {[1, 2, 3, 4].map((bar) => (
            <div
              key={bar}
              className={`w-1 rounded-full ${isPlaying ? 'bg-green-500 equalizer-bar' : 'bg-foreground/30'}`}
            />
          ))}
        </div>
      </div>

      <div className="z-10 mt-auto flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-mono text-muted">
          <Music size={12} /> {canControl ? 'Live session' : 'Queue empty'}
        </div>
        <button
          type="button"
          onClick={() => setPlaying(!isPlaying)}
          disabled={!canControl}
          className="inline-flex items-center gap-2 rounded-full border border-card-border px-3 py-1.5 text-[10px] font-mono text-foreground hover:bg-foreground/5 transition-colors disabled:opacity-50"
        >
          {isPlaying ? <Pause size={12} /> : <PlayCircle size={12} />}
          {isPlaying ? 'Pause' : 'Play'}
        </button>
      </div>
      
      {/* Background decoration */}
      <div className="absolute -bottom-8 -right-8 z-[-5] w-24 h-24 bg-green-500/10 blur-2xl rounded-full group-hover:bg-green-500/20 transition-all duration-500" />
    </SpotlightCard>
  );
}
