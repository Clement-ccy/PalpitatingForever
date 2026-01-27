import { SpotlightCard } from '@/components/ui/spotlight-card';
import { MapPin } from 'lucide-react';

export function MapWidget() {
  return (
    <SpotlightCard className="h-full w-full relative overflow-hidden group">
      {/* Map Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-30 group-hover:opacity-40 transition-opacity duration-700 grayscale group-hover:grayscale-0"
        style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=800&auto=format&fit=crop')`,
        }}
      />
      <div className="absolute inset-0 bg-background/20 mix-blend-multiply"></div>
      
      {/* Map Content */}
      <div className="relative z-10 w-full h-full p-4 flex flex-col justify-between">
        <div className="flex justify-end">
            <div className="bg-card backdrop-blur-md border border-card-border rounded-full p-2 group-hover:opacity-80 transition-opacity">
                <MapPin className="text-foreground/80" size={16} />
            </div>
        </div>
        
        <div className="bg-card backdrop-blur-md border border-card-border rounded-lg p-3 self-start group-hover:bg-background/50 transition-colors">
            <p className="text-[10px] text-muted font-mono mb-1 tracking-wider uppercase">Live Location</p>
            <p className="text-sm font-medium text-foreground/90">Tokyo, Japan</p>
            <p className="text-xs text-muted font-mono">35.6762° N, 139.650° E</p>
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
