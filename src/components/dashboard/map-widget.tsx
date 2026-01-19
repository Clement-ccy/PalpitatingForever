import { SpotlightCard } from '@/components/ui/spotlight-card';
import { MapPin } from 'lucide-react';

export function MapWidget() {
  return (
    <SpotlightCard className="h-full w-full relative overflow-hidden group">
      {/* Mock Map Background */}
      <div 
        className="absolute inset-0 bg-neutral-900 opacity-60 mix-blend-overlay"
        style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)`,
            backgroundSize: '24px 24px'
        }}
      />
      
      {/* Map Content */}
      <div className="relative z-10 w-full h-full p-4 flex flex-col justify-between">
        <div className="flex justify-end">
            <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-full p-2 group-hover:bg-white/10 transition-colors">
                <MapPin className="text-white/80" size={16} />
            </div>
        </div>
        
        <div className="bg-black/30 backdrop-blur-md border border-white/5 rounded-lg p-3 self-start group-hover:bg-black/50 transition-colors">
            <p className="text-[10px] text-white/40 font-mono mb-1 tracking-wider uppercase">Live Location</p>
            <p className="text-sm font-medium text-white/90">Tokyo, Japan</p>
            <p className="text-xs text-white/50 font-mono">35.6762° N, 139.650° E</p>
        </div>
      </div>

       {/* Animated Pulse on Location */}
       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <span className="relative flex h-8 w-8">
                <span className="pulse-ring absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-20"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 m-auto bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]"></span>
            </span>
       </div>
    </SpotlightCard>
  );
}
