import Image from 'next/image';
import { SpotlightCard } from '@/components/ui/spotlight-card';

export function ProfileCard() {
  return (
    <SpotlightCard className="h-full w-full p-8 flex flex-col justify-between group">
      <div className="flex justify-between items-start">
        <div className="relative">
          <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-card-border shadow-2xl relative z-10">
            <Image
              src="/avatar.png"
              alt="Clement Chen"
              layout="fill"
              objectFit="cover"
              className="grayscale group-hover:grayscale-0 transition-all duration-500"
            />
          </div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-background rounded-full flex items-center justify-center z-20">
            <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-card border border-card-border backdrop-blur-sm">
          <div className="relative flex items-center justify-center w-2 h-2">
            <div className="absolute w-full h-full bg-emerald-500 rounded-full pulse-ring"></div>
            <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full relative z-10"></div>
          </div>
          <span className="text-xs font-mono text-muted">CODING</span>
        </div>
      </div>

      <div className="space-y-4 mt-8">
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight leading-tight text-foreground/90">
          Clement Chen
        </h1>
        <p className="text-lg text-muted font-light max-w-md leading-relaxed">
          Digital Craftsman & <br className="hidden md:block"/>Frontend Architect.
        </p>
      </div>

      <div className="flex gap-4 mt-auto pt-6">
        <a href="#" className="px-5 py-2.5 rounded-full bg-foreground text-background text-sm font-medium hover:opacity-80 transition-opacity">Resume</a>
        <a href="#" className="px-5 py-2.5 rounded-full bg-card border border-card-border text-foreground text-sm font-medium hover:bg-white/10 dark:hover:bg-white/10 transition-colors">Contact</a>
      </div>
    </SpotlightCard>
  );
}
