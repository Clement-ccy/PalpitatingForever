import { SpotlightCard } from '@/components/ui/spotlight-card';
import { Music } from 'lucide-react';

export function NowPlaying() {
  return (
    <SpotlightCard className="h-full w-full p-6 flex flex-col justify-between group overflow-hidden">
      <div className="flex justify-between items-start z-10">
        <Music className="text-foreground/40" size={20} />
        <div className="flex gap-1 h-4 items-end">
          {[1, 2, 3, 4].map((bar) => (
            <div
              key={bar}
              className="w-1 bg-green-500 rounded-full equalizer-bar"
            />
          ))}
        </div>
      </div>

      <div className="z-10 mt-auto">
        <p className="text-xs font-mono text-muted mb-1">Now Playing</p>
        <div className="relative overflow-hidden w-full">
            <h3 className="font-medium truncate text-foreground/90 group-hover:text-green-500 transition-colors">
            Endless Fantasy
            </h3>
            <p className="text-sm text-muted truncate">Anamanaguchi</p>
        </div>
      </div>
      
      {/* Background decoration */}
      <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-green-500/10 blur-2xl rounded-full group-hover:bg-green-500/20 transition-all duration-500" />
    </SpotlightCard>
  );
}
