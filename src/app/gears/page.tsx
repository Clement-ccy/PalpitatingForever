'use client';

import { SpotlightCard } from '@/components/ui/spotlight-card';
import { Star, Package, Cpu, Camera, Terminal, Shield, Book, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const GEARS = [
    { category: 'Hardware', icon: Cpu, name: 'MacBook Pro 16"', description: 'M3 Max, 64GB RAM. The powerhouse.', rating: 5 },
    { category: 'Hardware', icon: Terminal, name: 'HHKB Pro Hybrid', description: 'Topre switches. A lifestyle choice.', rating: 5 },
    { category: 'Photography', icon: Camera, name: 'Sony A7M4', description: 'My primary camera for everything.', rating: 4 },
    { category: 'Software', icon: Terminal, name: 'VS Code', description: 'I live here. Custom theme & font.', rating: 5 },
    { category: 'Software', icon: Package, name: 'Raycast', description: 'Spotlight on steroids. Essential.', rating: 5 },
    { category: 'Design', icon: Package, name: 'Figma', description: 'Where ideas start. Infinite canvas.', rating: 4 },
    { category: 'EDC', icon: Shield, name: 'Aer City Pack', description: 'The perfect daily carry backpack.', rating: 5 },
    { category: 'Lifestyle', icon: Book, name: 'Kindle Paperwhite', description: 'Distraction-free reading device.', rating: 4 },
];

export default function GearsPage() {
  return (
    <div className="min-h-screen pt-32 px-4 pb-32 max-w-7xl mx-auto bg-background text-foreground relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 -right-20 w-96 h-96 bg-accent-gears/5 blur-[120px] rounded-full -z-10" />

      <header className="mb-16 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-gears/10 border border-accent-gears/20 text-xs font-mono text-accent-gears mb-4">
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
        {GEARS.map((gear, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
          >
            <SpotlightCard className="h-full flex flex-col p-6 group bg-card border-card-border hover:border-accent-gears/50 transition-all duration-500 shadow-sm hover:shadow-[0_0_30px_rgba(var(--accent-gears),0.1)]">
                <div className="flex items-start justify-between mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-muted border border-card-border flex items-center justify-center text-muted-foreground group-hover:text-accent-gears group-hover:bg-accent-gears/10 group-hover:border-accent-gears/20 transition-all duration-300">
                        <gear.icon size={20} />
                    </div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground/50 border border-card-border px-2 py-1 rounded-full group-hover:border-accent-gears/30 transition-colors">
                        {gear.category}
                    </span>
                </div>

                <div className="mt-auto">
                    <h3 className="font-bold text-foreground mb-2 text-lg group-hover:text-accent-gears transition-colors">{gear.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {gear.description}
                    </p>

                    <div className="flex gap-0.5 opacity-40 group-hover:opacity-100 transition-opacity">
                        {[...Array(5)].map((_, i) => (
                            <Star 
                                key={i} 
                                size={12} 
                                className={cn("transition-colors", i < gear.rating ? "fill-accent-gears text-accent-gears" : "text-foreground/10")} 
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
