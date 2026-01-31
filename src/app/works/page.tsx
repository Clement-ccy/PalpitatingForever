'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Briefcase, ExternalLink, X } from 'lucide-react';
import { SpotlightCard } from '@/components/ui/spotlight-card';
import { cn } from '@/lib/utils';
import { getFallbackTheme, mapNotionPage } from '@/lib/notion-utils';
import notionData from '@/data/refs/notion-pages.json';

const themeTokens = {
    emerald: {
        text: 'text-emerald-400',
        hover: 'group-hover:text-emerald-300',
        gradient: 'from-emerald-500/20',
    },
    purple: {
        text: 'text-purple-400',
        hover: 'group-hover:text-purple-300',
        gradient: 'from-purple-500/20',
    },
    blue: {
        text: 'text-blue-400',
        hover: 'group-hover:text-blue-300',
        gradient: 'from-blue-500/20',
    },
    orange: {
        text: 'text-orange-400',
        hover: 'group-hover:text-orange-300',
        gradient: 'from-orange-500/20',
    },
    pink: {
        text: 'text-pink-400',
        hover: 'group-hover:text-pink-300',
        gradient: 'from-pink-500/20',
    },
    teal: {
        text: 'text-teal-400',
        hover: 'group-hover:text-teal-300',
        gradient: 'from-teal-500/20',
    },
} as const;

const themePool = Object.keys(themeTokens) as Array<keyof typeof themeTokens>;
const DEFAULT_COVER = 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop';

interface WorkCard {
    id: string;
    title: string;
    category: string;
    year: string;
    description: string;
    tech: string[];
    imageUrl: string;
    link: string;
    role: string;
    theme: keyof typeof themeTokens;
}

const resolveTheme = (theme: string | null, id: string): keyof typeof themeTokens => {
    const normalized = theme?.toLowerCase() ?? '';
    if (normalized && normalized in themeTokens) {
        return normalized as keyof typeof themeTokens;
    }
    return getFallbackTheme(id, themePool) as keyof typeof themeTokens;
};

export default function WorksPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const works = useMemo<WorkCard[]>(() => (
    (notionData.results as unknown[])
        .map(mapNotionPage)
        .filter((post) => post.category === 'Works')
        .map((post) => ({
            id: post.id,
            title: post.title,
            category: post.platforms[0] || 'Project',
            year: post.date.split('-')[0],
            description: post.summary,
            tech: post.tags,
            imageUrl: post.cover || DEFAULT_COVER,
            link: post.url,
            role: post.role || 'Creator',
            theme: resolveTheme(post.theme, post.id),
        }))
  ), []);

  const selectedWork = works.find((work) => work.id === selectedId);

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 md:px-8 max-w-7xl mx-auto relative z-10 w-full">
      {/* Background Rainbow Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 pointer-events-none opacity-20">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[rgba(var(--accent-works-rgb),0.25)] blur-[120px] rounded-full" />
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-[rgba(var(--accent-blogs-rgb),0.22)] blur-[120px] rounded-full" />
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-[rgba(var(--accent-mlogs-rgb),0.22)] blur-[120px] rounded-full" />
      </div>

      {/* Header Section */}
      <div className="mb-16 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-linear-to-r from-[rgba(var(--accent-works-rgb),0.2)] via-[rgba(var(--accent-blogs-rgb),0.2)] to-[rgba(var(--accent-mlogs-rgb),0.2)] border border-card-border text-xs font-mono mb-4">
                    <Briefcase size={14} className="text-[color:var(--accent-works)]" />
                    <span className="bg-linear-to-r from-[color:var(--accent-works)] via-[color:var(--accent-blogs)] to-[color:var(--accent-mlogs)] bg-clip-text text-transparent">PORTFOLIO</span>
                </div>
                <h1 className="text-5xl md:text-7xl font-semibold tracking-tight text-foreground mb-6">
                    Works
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
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
        {works.map((work, index) => (
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
                            <div className="absolute inset-0 bg-linear-to-t from-background/80 via-transparent to-transparent opacity-60 z-10 pointer-events-none"></div>
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
                            <span className={cn("text-xs font-mono", themeTokens[work.theme].text)}>{work.year}</span>
                            <span className="w-1 h-1 bg-card-border rounded-full"></span>
                            <span className="text-xs font-mono text-muted uppercase tracking-wider">{work.category}</span>
                        </div>
                        <h3 className={cn("text-2xl font-semibold text-foreground mb-2 transition-colors", themeTokens[work.theme].hover)}>
                            {work.title}
                        </h3>
                        <p className="text-sm text-muted line-clamp-2 mb-4">
                            {work.description}
                        </p>
                        <div className="flex gap-2 flex-wrap mt-auto">
                            {work.tech.map((tech) => (
                                <span key={tech} className="px-2 py-1 rounded-md bg-card border border-card-border text-xs text-muted font-mono">
                                    {tech}
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
                        className={cn("absolute inset-0 opacity-40 bg-linear-to-br", themeTokens[selectedWork.theme].gradient, "to-transparent")}
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
                                <p className="text-xs text-muted">{selectedWork.role}</p>
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
                        {selectedWork.tech.map((tech) => (
                            <span key={tech} className="px-3 py-1 bg-card border border-card-border rounded-full text-xs text-muted font-mono">
                                {tech}
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
