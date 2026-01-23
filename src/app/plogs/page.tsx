"use client";

import { SpotlightCard } from '@/components/ui/spotlight-card';
import { Camera, Aperture, Droplets, X, ArrowDown } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface Photo {
  id: string;
  title: string;
  url: string;
  camera: string;
  settings: string;
  iso?: string;
  theme: 'blue' | 'rose' | 'emerald' | 'orange' | 'purple';
}

const MOCK_PHOTOS: Photo[] = [
    {
        id: '1',
        title: 'Neon District',
        url: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=800&auto=format&fit=crop',
        camera: 'Sony A7IV',
        settings: 'f/1.4',
        iso: 'ISO 800',
        theme: 'blue'
    },
    {
        id: '2',
        title: 'Concrete Waves',
        url: 'https://images.unsplash.com/photo-1486718448742-163732cd1544?q=80&w=800&auto=format&fit=crop',
        camera: 'Leica Q2',
        settings: '28mm',
        theme: 'rose'
    },
    {
        id: '3',
        title: 'Morning Mist',
        url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=800&auto=format&fit=crop',
        camera: 'Fujifilm X-T4',
        settings: 'f/2.8',
        theme: 'emerald'
    },
    {
        id: '4',
        title: 'Golden Hour',
        url: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=800&auto=format&fit=crop',
        camera: 'Canon R5',
        settings: '85mm f/1.2',
        theme: 'orange'
    },
    {
        id: '5',
        title: 'Shinjuku Crossing',
        url: 'https://images.unsplash.com/photo-1519638831568-d9897f54ed69?q=80&w=800&auto=format&fit=crop',
        camera: 'Ricoh GR IIIx',
        settings: 'f/2.8',
        theme: 'purple'
    },
     {
        id: '6',
        title: 'Light Leak',
        url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=800&auto=format&fit=crop',
        camera: 'Analog',
        settings: 'Portra 400',
        theme: 'blue'
    },
    {
        id: '7',
        title: 'Night City',
        url: 'https://images.unsplash.com/photo-1515630278258-407f66498911?q=80&w=800&auto=format&fit=crop',
        camera: 'Sony A7SIII',
        settings: 'ISO 3200',
        theme: 'rose'
    },
     {
        id: '8',
        title: 'Raw Emotion',
        url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop',
        camera: 'Hasselblad',
        settings: '1/500s',
        theme: 'emerald'
    }
];

const glowThemes = {
    blue: 'hover:shadow-[0_0_40px_-10px_rgba(59,130,246,0.3)] hover:border-blue-500/30',
    rose: 'hover:shadow-[0_0_40px_-10px_rgba(244,63,94,0.3)] hover:border-rose-500/30',
    emerald: 'hover:shadow-[0_0_40px_-10px_rgba(16,185,129,0.3)] hover:border-emerald-500/30',
    orange: 'hover:shadow-[0_0_40px_-10px_rgba(249,115,22,0.3)] hover:border-orange-500/30',
    purple: 'hover:shadow-[0_0_40px_-10px_rgba(168,85,247,0.3)] hover:border-purple-500/30',
};

export default function PlogsPage() {
    const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  return (
    <div className="min-h-screen pt-32 px-4 pb-32 max-w-[1600px] mx-auto relative z-10 bg-background text-foreground">
       <header className="mb-12 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted border border-card-border text-xs font-mono text-accent-foreground mb-4">
                        <Aperture size={14} />
                        <span>VISUAL LOGS</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground mb-4">Captured Moments</h1>
                    <p className="text-muted-foreground max-w-lg text-sm md:text-base leading-relaxed">
                        A collection of frozen time. Exploring light, shadow, and the quiet spaces in between. 
                        Mainly shot on Sony Alpha & Fujifilm X-Series.
                    </p>
                </div>
                
                <div className="flex gap-4">
                    <div className="text-right hidden md:block">
                        <div className="text-2xl font-mono text-foreground">84</div>
                        <div className="text-xs text-muted-foreground font-mono uppercase tracking-wider">Photos</div>
                    </div>
                    <div className="h-12 w-px bg-card-border hidden md:block"></div>
                    <div className="text-right hidden md:block">
                        <div className="text-2xl font-mono text-foreground">12</div>
                        <div className="text-xs text-muted-foreground font-mono uppercase tracking-wider">Cities</div>
                    </div>
                </div>
            </div>
      </header>
      
      {/* Masonry Grid */}
      <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
        {MOCK_PHOTOS.map((photo, index) => (
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
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                        <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                            <h3 className="text-foreground font-medium text-lg mb-2">{photo.title}</h3>
                            <div className="flex flex-wrap gap-2">
                                <span className="px-2 py-1 bg-background/50 backdrop-blur-md border border-card-border rounded-md text-[10px] font-mono text-muted-foreground flex items-center gap-1.5">
                                    <Camera size={10} /> {photo.camera}
                                </span>
                                <span className="px-2 py-1 bg-background/50 backdrop-blur-md border border-card-border rounded-md text-[10px] font-mono text-muted-foreground flex items-center gap-1.5">
                                    <Aperture size={10} /> {photo.settings}
                                </span>
                                {photo.iso && (
                                    <span className="px-2 py-1 bg-background/50 backdrop-blur-md border border-card-border rounded-md text-[10px] font-mono text-muted-foreground flex items-center gap-1.5">
                                        <Droplets size={10} /> {photo.iso}
                                    </span>
                                )}
                            </div>
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
                className="fixed inset-0 z-[60] bg-background/95 backdrop-blur-xl flex items-center justify-center p-4"
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
                    
                    <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-background via-background/50 to-transparent">
                          <h2 className="text-2xl font-bold text-foreground mb-2">{selectedPhoto.title}</h2>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground font-mono">
                                <span>{selectedPhoto.camera}</span>
                                <span className="w-1 h-1 bg-muted-foreground/30 rounded-full"></span>
                                <span>{selectedPhoto.settings}</span>
                                {selectedPhoto.iso && (
                                    <>
                                        <span className="w-1 h-1 bg-muted-foreground/30 rounded-full"></span>
                                        <span>{selectedPhoto.iso}</span>
                                    </>
                                )}
                          </div>
                    </div>
                </div>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
