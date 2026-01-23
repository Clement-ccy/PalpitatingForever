import { SpotlightCard } from '@/components/ui/spotlight-card';
import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

export function LatestThought() {
  return (
    <Link href="/blogs" className="block h-full">
      <SpotlightCard className="h-full w-full p-8 flex flex-col justify-center relative group overflow-hidden">
        {/* Subtle Gradient */}
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#000] to-transparent z-10 md:block hidden pointer-events-none"></div>

        <div className="relative z-20 flex justify-between items-center h-full">
            <div className="flex-1 pr-4">
                <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs font-mono text-muted">NOV 24, 2023</span>
                    <span className="w-1 h-1 bg-card-border rounded-full"></span>
                    <span className="text-xs font-mono text-orange-500">THOUGHTS</span>
                </div>
                <h3 className="text-xl md:text-2xl font-medium text-foreground mb-2 group-hover:text-orange-500 transition-colors">
                    The Future of Interfaces is Invisible
                </h3>
                <p className="text-sm text-muted line-clamp-1 group-hover:opacity-80 transition-colors">
                    Why we are moving away from screens towards ambient computing.
                </p>
            </div>
            <div className="w-12 h-12 rounded-full border border-card-border flex items-center justify-center group-hover:bg-foreground group-hover:text-background transition-all duration-300 shrink-0">
                <ArrowUpRight className="text-xl" />
            </div>
        </div>
      </SpotlightCard>
    </Link>
  );
}
