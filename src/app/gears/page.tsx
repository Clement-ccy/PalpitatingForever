'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Book, Camera, Cpu, Package, Settings, Shield, Star, Terminal } from 'lucide-react';
import { SpotlightCard } from '@/components/ui/spotlight-card';
import { cn } from '@/lib/utils';
import { getFallbackTheme } from '@/lib/notion/utils';
import { fetchNotionPages } from '@/lib/notion/client';

const themeTokens = {
  blue: 'text-blue-400 border-blue-500/20 bg-blue-500/10',
  purple: 'text-purple-400 border-purple-500/20 bg-purple-500/10',
  emerald: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/10',
  orange: 'text-orange-400 border-orange-500/20 bg-orange-500/10',
  pink: 'text-pink-400 border-pink-500/20 bg-pink-500/10',
  teal: 'text-teal-400 border-teal-500/20 bg-teal-500/10',
} as const;

type ThemeKey = keyof typeof themeTokens;
const themePool = Object.keys(themeTokens) as ThemeKey[];

const categoryIcons = [Cpu, Terminal, Camera, Package, Shield, Book];

interface GearItem {
  id: string;
  category: string;
  name: string;
  description: string;
  rating: number;
  theme: ThemeKey;
}

export default function GearsPage() {
  const [gears, setGears] = useState<GearItem[]>([]);

  useEffect(() => {
    let active = true;
    fetchNotionPages().then((pages) => {
      if (!active) return;
      const mapped = pages
        .filter((post) => post.category === 'Gears')
        .map((post, index) => ({
          id: post.id,
          category: post.tags[0] || 'Gear',
          name: post.title,
          description: post.summary,
          rating: post.rate ?? 0,
          theme: post.theme?.toLowerCase() && post.theme.toLowerCase() in themeTokens
            ? (post.theme.toLowerCase() as ThemeKey)
            : (getFallbackTheme(post.id + index.toString(), themePool) as ThemeKey),
        }));
      setGears(mapped);
    });
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="min-h-screen pt-32 px-4 pb-32 max-w-7xl mx-auto text-foreground relative">
      {/* Background Glow */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-[rgba(var(--accent-works-rgb),0.2)] blur-[140px] rounded-full -z-10" />
      <div className="absolute top-1/3 right-1/4 w-md h-112 bg-[rgba(var(--accent-blogs-rgb),0.2)] blur-[140px] rounded-full -z-10" />
      <div className="absolute bottom-10 left-1/3 w-104 h-104 bg-[rgba(var(--accent-gears-rgb),0.2)] blur-[140px] rounded-full -z-10" />

      <header className="mb-16 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-card border border-card-border text-xs font-mono text-muted mb-4">
            <Settings size={14} />
            <span>INVENTORY & TOOLS</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground mb-6">Gears</h1>
        <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
          The hardware, software, and tools I use to build, design, and survive. 
          A curated list of my daily drivers.
        </p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {gears.map((gear, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
          >
            <SpotlightCard className="h-full flex flex-col p-6 group bg-card border-card-border transition-all duration-500 shadow-sm hover:shadow-[0_0_30px_rgba(255,255,255,0.08)]">
                <div className="flex items-start justify-between mb-8">
                    <div className={cn("w-12 h-12 rounded-2xl border flex items-center justify-center transition-all duration-300", themeTokens[gear.theme])}>
                        {(() => {
                          const Icon = categoryIcons[idx % categoryIcons.length];
                          return <Icon size={20} />;
                        })()}
                    </div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground/50 border border-card-border px-2 py-1 rounded-full">
                        {gear.category}
                    </span>
                </div>

                <div className="mt-auto">
                    <h3 className="font-bold text-foreground mb-2 text-lg">{gear.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {gear.description}
                    </p>

                    <div className="flex gap-0.5 opacity-40 group-hover:opacity-100 transition-opacity">
                        {[...Array(5)].map((_, i) => (
                            <Star 
                                key={i} 
                                size={12} 
                                className={cn("transition-colors", i < gear.rating ? "fill-foreground text-foreground" : "text-foreground/10")} 
                            />
                        ))}
                    </div>
                </div>
            </SpotlightCard>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
