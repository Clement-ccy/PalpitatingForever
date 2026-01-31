"use client";

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowDown, Camera, X } from 'lucide-react';
import { SpotlightCard } from '@/components/ui/spotlight-card';
import { cn } from '@/lib/utils';
import { getFallbackTheme, type NotionBlock } from '@/lib/notion-utils';
import { fetchNotionBlocks, fetchNotionPages } from '@/lib/notion-data';

interface Photo {
  id: string;
  title: string;
  url: string;
  caption: string;
  theme: 'blue' | 'rose' | 'emerald' | 'orange' | 'purple' | 'teal';
}

type ImageContent = {
  url?: string;
  caption?: { plain_text: string }[];
};

const getImageContent = (value: unknown): ImageContent => (
  value && typeof value === 'object' ? value as ImageContent : {}
);

const glowThemes = {
    blue: 'hover:shadow-[0_0_40px_-10px_rgba(59,130,246,0.3)] hover:border-blue-500/30',
    rose: 'hover:shadow-[0_0_40px_-10px_rgba(244,63,94,0.3)] hover:border-rose-500/30',
    emerald: 'hover:shadow-[0_0_40px_-10px_rgba(16,185,129,0.3)] hover:border-emerald-500/30',
    orange: 'hover:shadow-[0_0_40px_-10px_rgba(249,115,22,0.3)] hover:border-orange-500/30',
    purple: 'hover:shadow-[0_0_40px_-10px_rgba(168,85,247,0.3)] hover:border-purple-500/30',
    teal: 'hover:shadow-[0_0_40px_-10px_rgba(20,184,166,0.3)] hover:border-teal-500/30',
};

const themePool = Object.keys(glowThemes) as Array<keyof typeof glowThemes>;

interface PlogItem {
    id: string;
    title: string;
    summary: string;
    date: string;
    cover: string | null;
    theme: keyof typeof glowThemes;
}

export default function PlogsPage() {
    const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
    const [selectedPlogId, setSelectedPlogId] = useState<string>('');
    const [plogBlocks, setPlogBlocks] = useState<NotionBlock[]>([]);
    const [plogs, setPlogs] = useState<PlogItem[]>([]);

    useEffect(() => {
        let active = true;
        fetchNotionPages().then((pages) => {
            if (!active) return;
            const mapped = pages
                .filter((post) => post.category === 'Plogs')
                .map((post) => ({
                    id: post.id,
                    title: post.title,
                    summary: post.summary,
                    date: post.date,
                    cover: post.cover,
                    theme: (post.theme?.toLowerCase() && post.theme.toLowerCase() in glowThemes)
                        ? (post.theme.toLowerCase() as keyof typeof glowThemes)
                        : (getFallbackTheme(post.id, themePool) as keyof typeof glowThemes),
                }));
            setPlogs(mapped);
        });
        return () => {
            active = false;
        };
    }, []);

    const activePlogId = selectedPlogId || plogs[0]?.id || '';
    const selectedPlog = plogs.find((plog) => plog.id === activePlogId) ?? plogs[0];

    useEffect(() => {
        if (!activePlogId) return;
        let active = true;
        fetchNotionBlocks(activePlogId).then((blocks) => {
            if (!active) return;
            setPlogBlocks(blocks);
        });
        return () => {
            active = false;
        };
    }, [activePlogId]);

    const photos = useMemo<Photo[]>(() => (
        plogBlocks
            .filter((block) => block.type === 'image')
            .map((block) => {
                const imageContent = getImageContent(block.content);
                const caption = Array.isArray(imageContent.caption)
                    ? imageContent.caption.map((t) => t.plain_text).join('')
                    : '';

                return {
                    id: block.id,
                    title: selectedPlog?.title || 'Plog',
                    url: imageContent.url ?? '',
                    caption,
                    theme: selectedPlog?.theme ?? 'blue',
                };
            })
            .filter((photo) => photo.url.length > 0)
    ), [plogBlocks, selectedPlog]);

  return (
     <div className="min-h-screen pt-32 px-4 pb-32 max-w-400 mx-auto relative z-10 text-foreground">
        {/* Background Glow */}
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-[rgba(var(--accent-works-rgb),0.2)] blur-[160px] rounded-full -z-10" />
        <div className="absolute top-1/3 right-1/4 w-md h-112 bg-[rgba(var(--accent-blogs-rgb),0.2)] blur-[160px] rounded-full -z-10" />
        <div className="absolute bottom-10 left-1/3 w-104 h-104 bg-[rgba(var(--accent-plogs-rgb),0.2)] blur-[160px] rounded-full -z-10" />

       <header className="mb-12 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-card border border-card-border text-xs font-mono text-muted mb-4">
                        <Camera size={14} />
                        <span>VISUAL LOGS</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground mb-4">Plogs</h1>
                    <p className="text-muted-foreground max-w-lg text-lg leading-relaxed">
                        {selectedPlog?.summary || 'A collection of visual logs grouped by journey and theme.'}
                    </p>
                </div>
                
                <div className="flex gap-4">
                    <div className="text-right hidden md:block">
                        <div className="text-2xl font-mono text-foreground">{photos.length}</div>
                        <div className="text-xs text-muted-foreground font-mono uppercase tracking-wider">Photos</div>
                    </div>
                    <div className="h-12 w-px bg-card-border hidden md:block"></div>
                    <div className="text-right hidden md:block">
                        <div className="text-2xl font-mono text-foreground">{plogs.length}</div>
                        <div className="text-xs text-muted-foreground font-mono uppercase tracking-wider">Collections</div>
                    </div>
                </div>
            </div>
      </header>

      <section className="mb-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {plogs.map((plog) => (
            <SpotlightCard
                key={plog.id}
                onClick={() => setSelectedPlogId(plog.id)}
                className={cn(
                    "p-4 rounded-2xl border border-card-border cursor-pointer transition-all",
                    activePlogId === plog.id ? "bg-card/60" : "hover:bg-card/40",
                    glowThemes[plog.theme]
                )}
            >
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-card-border/30 relative">
                        {plog.cover ? (
                            <Image src={plog.cover} alt={plog.title} fill className="object-cover" />
                        ) : null}
                    </div>
                    <div>
                        <p className="text-xs font-mono text-muted">{plog.date}</p>
                        <h3 className="text-lg font-semibold text-foreground">{plog.title}</h3>
                        <p className="text-xs text-muted line-clamp-1">{plog.summary || 'Visual log collection'}</p>
                    </div>
                </div>
            </SpotlightCard>
        ))}
      </section>
      
      {/* Masonry Grid */}
      <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
        {photos.map((photo, index) => (
            <motion.div
                key={photo.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                onClick={() => setSelectedPhoto(photo)}
                className="break-inside-avoid relative group cursor-zoom-in mb-6"
            >
                <div className={cn(
                    "rounded-2xl overflow-hidden border border-card-border transition-all duration-300 bg-card",
                    glowThemes[photo.theme]
                )}>
                    {/* Image */}
                    <Image
                        src={photo.url}
                        alt={photo.title}
                        width={800}
                        height={600}
                        className={cn("w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105", photo.theme === 'rose' || photo.theme === 'emerald' ? "grayscale group-hover:grayscale-0" : "")}
                    />

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-linear-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                        <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                            <h3 className="text-foreground font-medium text-lg mb-2">{photo.title}</h3>
                            {photo.caption && (
                                <span className="px-2 py-1 bg-background/50 backdrop-blur-md border border-card-border rounded-md text-[10px] font-mono text-muted-foreground inline-flex items-center gap-1.5">
                                    <Camera size={10} /> {photo.caption}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </motion.div>
        ))}
      </div>

       {/* Load More Indicator */}
       <div className="flex justify-center mt-12 mb-12">
            <button className="group flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-full border border-card-border flex items-center justify-center group-hover:bg-foreground group-hover:text-background transition-all duration-300">
                    <ArrowDown className="text-xl" />
                </div>
                <span className="text-xs font-mono text-muted-foreground group-hover:text-foreground transition-colors">LOAD ARCHIVES</span>
            </button>
        </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedPhoto && (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-60 bg-background/95 backdrop-blur-xl flex items-center justify-center p-4"
                onClick={() => setSelectedPhoto(null)}
            >
                <button 
                    className="absolute top-6 right-6 text-muted-foreground hover:text-foreground transition-colors z-50 p-2 bg-background/20 rounded-full"
                    onClick={() => setSelectedPhoto(null)}
                >
                    <X size={32} />
                </button>

                <div 
                    className="relative max-w-7xl w-full h-full flex items-center justify-center" 
                    onClick={(e) => e.stopPropagation()}
                >
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="relative w-full h-full flex items-center justify-center"
                    >
                         <Image 
                            src={selectedPhoto.url} 
                            alt={selectedPhoto.title}
                            fill
                            className="object-contain"
                            quality={100}
                         />
                    </motion.div>
                    
                    <div className="absolute bottom-0 left-0 w-full p-6 bg-linear-to-t from-background via-background/50 to-transparent">
                          <h2 className="text-2xl font-bold text-foreground mb-2">{selectedPhoto.title}</h2>
                          {selectedPhoto.caption && (
                              <div className="text-sm text-muted-foreground font-mono">{selectedPhoto.caption}</div>
                          )}
                    </div>
                </div>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
