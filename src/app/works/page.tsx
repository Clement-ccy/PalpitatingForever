'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, ArrowUpRight, Briefcase } from 'lucide-react';
import { MOCK_WORKS, Work } from '@/data/mock-works';
import { cn } from '@/lib/utils';
import { SpotlightCard } from '@/components/ui/spotlight-card';
import Image from 'next/image';

const themeColors = {
    emerald: 'text-emerald-400',
    purple: 'text-purple-400',
    blue: 'text-blue-400',
    orange: 'text-orange-400',
    pink: 'text-pink-400',
    teal: 'text-teal-400',
};

const themeHoverColors = {
    emerald: 'group-hover:text-emerald-300',
    purple: 'group-hover:text-purple-300',
    blue: 'group-hover:text-blue-300',
    orange: 'group-hover:text-orange-300',
    pink: 'group-hover:text-pink-300',
    teal: 'group-hover:text-teal-300',
};

const themeGradients = {
    emerald: 'from-emerald-500/20',
    purple: 'from-purple-500/20',
    blue: 'from-blue-500/20',
    orange: 'from-orange-500/20',
    pink: 'from-pink-500/20',
    teal: 'from-teal-500/20',
};

export default function WorksPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedWork = MOCK_WORKS.find((w) => w.id === selectedId);

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 md:px-8 max-w-7xl mx-auto relative z-10 w-full">
      {/* Background Rainbow Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 pointer-events-none opacity-20">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 blur-[120px] rounded-full" />
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-purple-500/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-emerald-500/20 blur-[120px] rounded-full" />
      </div>

      {/* Header Section */}
      <div className="mb-16 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 border border-white/10 text-xs font-mono mb-4">
                    <Briefcase size={14} className="text-blue-400" />
                    <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">PORTFOLIO</span>
                </div>
                <h1 className="text-5xl md:text-7xl font-semibold tracking-tight text-foreground mb-6">
                    Works
                </h1>
                <p className="text-lg text-muted max-w-2xl leading-relaxed">
                    A collection of digital products, interactive experiences, and open source contributions. 
                    Building the intersection of design and engineering.
                </p>
            </div>
            
            {/* Filter Buttons */}
            <div className="flex gap-2 flex-wrap">
                    <button className="px-4 py-2 rounded-full bg-foreground text-background text-sm font-medium hover:opacity-80 transition-opacity">All</button>
                    <button className="px-4 py-2 rounded-full bg-card border border-card-border text-muted text-sm font-medium hover:bg-foreground/5 hover:text-foreground transition-colors">React</button>
                    <button className="px-4 py-2 rounded-full bg-card border border-card-border text-muted text-sm font-medium hover:bg-foreground/5 hover:text-foreground transition-colors">WebGL</button>
                    <button className="px-4 py-2 rounded-full bg-card border border-card-border text-muted text-sm font-medium hover:bg-foreground/5 hover:text-foreground transition-colors">Mobile</button>
            </div>
        </div>
      </div>
      
      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_WORKS.map((work, index) => (
          <motion.div
            key={work.id}
            layoutId={`card-container-${work.id}`}
            onClick={() => setSelectedId(work.id)}
            className="cursor-pointer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <SpotlightCard className="group h-full flex flex-col p-0 overflow-hidden">
                {/* Image Section */}
                <div className="aspect-[4/3] relative overflow-hidden bg-muted/20">
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-60 z-10 pointer-events-none"></div>
                     <Image 
                        src={work.imageUrl} 
                        alt={work.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                     />
                    <div className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="w-10 h-10 rounded-full bg-background/50 backdrop-blur-md flex items-center justify-center border border-card-border">
                            <ArrowUpRight className="text-foreground" size={18} />
                            </div>
                    </div>
                </div>

                {/* Content Section */}
                <div className="p-6 relative z-10 flex flex-col flex-grow">
                    <motion.div layoutId={`card-content-${work.id}`}>
                        <div className="flex items-center gap-2 mb-3">
                            <span className={cn("text-xs font-mono", themeColors[work.theme])}>{work.year}</span>
                            <span className="w-1 h-1 bg-card-border rounded-full"></span>
                            <span className="text-xs font-mono text-muted uppercase tracking-wider">{work.category}</span>
                        </div>
                        <h3 className={cn("text-2xl font-semibold text-foreground mb-2 transition-colors", themeHoverColors[work.theme])}>
                            {work.title}
                        </h3>
                        <p className="text-sm text-muted line-clamp-2 mb-4">
                            {work.description}
                        </p>
                        <div className="flex gap-2 flex-wrap mt-auto">
                            {work.tech.map(t => (
                                <span key={t} className="px-2 py-1 rounded-md bg-card border border-card-border text-xs text-muted font-mono">
                                    {t}
                                </span>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </SpotlightCard>
          </motion.div>
        ))}
      </div>

       {/* Bottom CTA */}
       <div className="mt-20 text-center pb-8">
            <p className="text-muted mb-6">Interested in collaborating on a project?</p>
            <a href="#" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-foreground text-background font-medium hover:opacity-80 transition-opacity">
                <ExternalLink size={18} />
                <span>Get in Touch</span>
            </a>
        </div>

      {/* Expanded View (Modal) */}
      <AnimatePresence>
        {selectedId && selectedWork && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center px-4 pointer-events-none">
             {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedId(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md pointer-events-auto"
            />
            
            {/* Expanded Card */}
            <motion.div
              layoutId={`card-container-${selectedId}`}
              className="w-full max-w-3xl bg-background rounded-3xl border border-card-border overflow-hidden relative pointer-events-auto shadow-2xl max-h-[90vh] flex flex-col"
            >
                {/* Close Button */}
                <button 
                    onClick={(e) => { e.stopPropagation(); setSelectedId(null); }}
                    className="absolute top-4 right-4 p-2 bg-background/50 rounded-full border border-card-border hover:bg-foreground/10 transition-colors z-30 text-foreground"
                >
                    <X size={20} />
                </button>

                 <div className="relative w-full aspect-video bg-muted/20 border-b border-card-border flex items-center justify-center overflow-hidden shrink-0">
                     <Image 
                        src={selectedWork.imageUrl} 
                        alt={selectedWork.title}
                        fill
                        className="object-cover"
                     />
                     <div className="absolute inset-0 bg-background/40"></div>
                     {/* Gradient Overlay */}
                      <div 
                        className={cn("absolute inset-0 opacity-40 bg-gradient-to-br", themeGradients[selectedWork.theme], "to-transparent")}
                    />

                    <motion.div layoutId={`card-title-${selectedId}`} className="relative z-10 text-center p-4">
                        <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-2">{selectedWork.title}</h2>
                        <p className="text-foreground/80 font-mono uppercase tracking-widest text-sm">{selectedWork.category} — {selectedWork.year}</p>
                    </motion.div>
                 </div>

              <div className="p-8 overflow-y-auto custom-scrollbar">
                <motion.div layoutId={`card-content-${selectedId}`}>
                   <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                             {/* User Avatar Placeholder */}
                             <div className="w-10 h-10 rounded-full bg-card border border-card-border overflow-hidden relative">
                                <Image src="/avatar.png" alt="Author" fill className="object-cover" />
                             </div>
                             <div>
                                <p className="text-sm font-medium text-foreground">Clement Chen</p>
                                <p className="text-xs text-muted">Lead Designer</p>
                             </div>
                        </div>
                        <a href={selectedWork.link} className="flex items-center gap-2 px-5 py-2.5 bg-foreground text-background text-sm font-bold rounded-full hover:opacity-80 transition-opacity">
                            View Live <ExternalLink size={14} />
                        </a>
                   </div>
                  
                   <div className="prose dark:prose-invert max-w-none">
                       <p className="text-foreground/80 text-lg leading-relaxed mb-8">
                        {selectedWork.description}
                       </p>
                       
                       <p className="text-muted">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                       </p>
                   </div>

                   <div className="mt-8 pt-8 border-t border-card-border">
                      <h3 className="text-sm font-bold text-foreground mb-4 uppercase tracking-wider">Technologies Used</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedWork.tech.map(t => (
                            <span key={t} className="px-3 py-1 bg-card border border-card-border rounded-full text-xs text-muted font-mono">
                                {t}
                            </span>
                        ))}
                      </div>
                   </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
