"use client";

import { SpotlightCard } from '@/components/ui/spotlight-card';
import { Disc3, Pause, SkipBack, SkipForward, Volume2, Star, Clock, User, Mic2, PlayCircle } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface Mlog {
  id: string;
  title: string;
  artist: string;
  cover: string;
  type: 'REVIEW' | 'MIXTAPE' | 'ALBUM' | 'PODCAST';
  date: string;
  rating?: number;
  duration?: string;
  description: string;
  theme: 'rose' | 'indigo' | 'emerald' | 'orange';
}

const MOCK_MLOGS: Mlog[] = [
    {
        id: '1',
        title: 'Analog Memories',
        artist: 'Exploring tape saturation',
        cover: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=200&auto=format&fit=crop',
        type: 'REVIEW',
        date: 'OCT 12',
        rating: 4.5,
        description: 'Exploring the warmth of tape saturation in modern electronic music.',
        theme: 'rose'
    },
    {
        id: '2',
        title: 'Neon Nights Vol. 4',
        artist: 'Synthwave Selection',
        cover: 'https://images.unsplash.com/photo-1514525253440-b393452de23e?q=80&w=200&auto=format&fit=crop',
        type: 'MIXTAPE',
        date: 'SEP 28',
        duration: '45 MIN',
        description: 'Synthwave selection for late night coding sessions.',
        theme: 'indigo'
    },
    {
        id: '3',
        title: 'Deep Focus',
        artist: 'Ambient Textures',
        cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=200&auto=format&fit=crop',
        type: 'ALBUM',
        date: 'SEP 15',
        rating: 5,
        description: 'Ambient textures and field recordings.',
        theme: 'emerald'
    },
    {
         id: '4',
         title: 'Silence & Noise',
         artist: 'Post-rock Dynamics',
         cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=200&auto=format&fit=crop',
         type: 'REVIEW',
         date: 'AUG 30',
         rating: 4.5,
         description: 'The art of mastering dynamics in post-rock.',
         theme: 'rose'
    },
     {
         id: '5',
         title: 'Sunday Morning',
         artist: 'Jazz & Rain',
         cover: 'https://images.unsplash.com/photo-1459749411177-287ce38e6b95?q=80&w=200&auto=format&fit=crop',
         type: 'MIXTAPE',
         date: 'AUG 12',
         duration: '1 H 20 MIN',
         description: 'Coffee, rain, and jazz records.',
         theme: 'indigo'
    },
    {
        id: '6',
        title: 'Design Systems',
        artist: 'UI Engineering',
        cover: '', // Placeholder for icon
        type: 'PODCAST',
        date: 'JUL 04',
        description: 'Ep. 42: The future of UI engineering.',
        theme: 'orange'
   }
];

const themeColors = {
    rose: 'text-rose-400 bg-rose-500/10 border-rose-500/20 group-hover:text-rose-400',
    indigo: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20 group-hover:text-indigo-400',
    emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20 group-hover:text-emerald-400',
    orange: 'text-orange-400 bg-orange-500/10 border-orange-500/20 group-hover:text-orange-400',
};

export default function MusicPage() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="min-h-screen pt-32 px-4 pb-32 max-w-7xl mx-auto flex flex-col gap-12">
      
      {/* Hero: The Player */}
      <section className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center animate-in fade-in slide-in-from-bottom-4 duration-1000">
          {/* Turntable Visual */}
          <div className="lg:col-span-5 relative group flex justify-center">
              <div className="relative aspect-square w-full max-w-[400px]">
                   {/* Vinyl Record */}
                   <div className={cn(
                       "absolute inset-0 rounded-full bg-black shadow-2xl border border-white/5 p-2",
                       isPlaying ? "animate-[spin_8s_linear_infinite]" : ""
                   )}>
                       <div className="w-full h-full rounded-full border border-white/5 relative flex items-center justify-center bg-[#111] bg-[radial-gradient(#222_1px,transparent_1px)] bg-[length:4px_4px]">
                            {/* Label */}
                            <div className="w-1/3 h-1/3 rounded-full bg-rose-600 relative overflow-hidden flex items-center justify-center border-4 border-black/80">
                                 <Image 
                                    src="https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=400&auto=format&fit=crop" 
                                    alt="Album Center"
                                    fill
                                    className="object-cover opacity-60 mix-blend-overlay"
                                 />
                                <span className="relative z-10 font-mono text-[10px] text-black font-bold tracking-widest text-center leading-tight">SIDE A<br/>33 RPM</span>
                            </div>
                       </div>
                   </div>

                   {/* Tonearm (Decorative) */}
                   <div className={cn(
                       "absolute top-0 right-0 w-8 h-48 origin-top bg-gradient-to-b from-gray-700 to-gray-500 rounded-full shadow-xl z-10 border border-white/10 hidden md:block transition-transform duration-700",
                       isPlaying ? "rotate-[6deg]" : "rotate-[12deg]"
                   )} />

                   {/* Center Glow */}
                   <div className={cn(
                       "absolute inset-0 rounded-full bg-rose-500/20 blur-3xl -z-10 transition-opacity duration-700",
                       isPlaying ? "opacity-40" : "opacity-20"
                   )} />
               </div>
          </div>

          {/* Player Controls & Info */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-8">
               <div className="space-y-2">
                   <div className="flex items-center gap-3 text-rose-400">
                        <Disc3 className={cn("w-4 h-4", isPlaying ? "animate-spin" : "")} />
                        <span className="text-xs font-mono tracking-widest uppercase">Now Spinning</span>
                   </div>
                   <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight leading-none">
                       Midnight <br className="md:hidden"/> Odyssey
                   </h1>
                   <p className="text-xl text-gray-400 font-light">Synthetic Dreams • 2024</p>
               </div>

               {/* Visualizer */}
               <div className="h-16 flex items-end gap-1 opacity-80">
                   {[...Array(24)].map((_, i) => {
                       // Deterministic random-like values based on index
                       const height = ((i * 13) % 100) + 10;
                       const duration = 0.5 + ((i * 7) % 10) / 10;
                       
                       return (
                           <div
                            key={i}
                            className="w-1 bg-rose-500 rounded-full transition-all duration-300"
                            style={{
                                height: isPlaying ? `${height}%` : '10%',
                                animation: isPlaying ? `equalize ${duration}s infinite ease-in-out` : 'none'
                            }}
                           />
                       );
                   })}
               </div>

               {/* Controls */}
               <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                   <div className="w-full h-1 bg-white/10 rounded-full mb-4 relative group cursor-pointer">
                        <div className="absolute top-0 left-0 h-full w-1/3 bg-rose-500 rounded-full"></div>
                   </div>
                   
                   <div className="flex justify-between items-center">
                        <div className="font-mono text-xs text-gray-500">01:24 <span className="text-gray-700">/</span> 04:12</div>
                        
                        <div className="flex items-center gap-6">
                            <button className="text-gray-400 hover:text-white transition-colors"><SkipBack size={24} /></button>
                            <button 
                                onClick={() => setIsPlaying(!isPlaying)}
                                className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center hover:scale-105 transition-transform"
                            >
                                {isPlaying ? <Pause size={24} fill="currentColor" /> : <PlayCircle size={24} fill="currentColor" />}
                            </button>
                            <button className="text-gray-400 hover:text-white transition-colors"><SkipForward size={24} /></button>
                        </div>

                        <div className="flex items-center gap-2 text-gray-400">
                            <Volume2 size={16} />
                            <div className="w-16 h-1 bg-white/10 rounded-full overflow-hidden">
                                <div className="w-3/4 h-full bg-gray-500"></div>
                            </div>
                        </div>
                   </div>
               </div>
          </div>
      </section>

      <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

      {/* Collection Grid */}
      <section className="space-y-6">
         <div className="flex items-center justify-between">
             <h2 className="text-2xl font-semibold text-white">Recent Logs</h2>
             <div className="flex gap-2">
                 <button className="px-3 py-1.5 rounded-lg text-xs font-mono bg-white/10 text-white border border-white/10">REVIEWS</button>
                 <button className="px-3 py-1.5 rounded-lg text-xs font-mono text-gray-500 hover:text-white transition-colors">PLAYLISTS</button>
             </div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {MOCK_MLOGS.map((log) => (
                <SpotlightCard key={log.id} className="p-4 flex gap-4 group cursor-pointer rounded-2xl">
                    <div className="w-24 h-24 rounded-lg bg-gray-800 overflow-hidden relative shrink-0">
                        {log.cover ? (
                            <Image src={log.cover} alt={log.title} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-gray-800 to-black flex items-center justify-center border border-white/5">
                                <Mic2 className="text-gray-600" size={32} />
                            </div>
                        )}
                    </div>
                    
                    <div className="flex flex-col justify-between py-1 flex-grow">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className={cn("px-1.5 py-0.5 rounded text-[10px] font-mono border", themeColors[log.theme].split(' ').slice(0,3).join(' '))}>
                                    {log.type}
                                </span>
                                <span className="text-[10px] text-gray-500 font-mono">{log.date}</span>
                            </div>
                            <h3 className={cn("text-lg font-medium text-white leading-tight mb-1 transition-colors group-hover:text-rose-400")}>
                                {log.title}
                            </h3>
                            <p className="text-sm text-gray-400 line-clamp-1">{log.description}</p>
                        </div>
                        
                        <div className="flex items-center gap-1 text-xs text-gray-500 font-mono mt-2">
                            {log.rating && (
                                <div className="flex text-yellow-500 gap-0.5">
                                    {[...Array(Math.floor(log.rating))].map((_, i) => <Star key={i} size={10} fill="currentColor" />)}
                                </div>
                            )}
                            {log.duration && (
                                <div className="flex items-center gap-1">
                                    <Clock size={10} />
                                    <span>{log.duration}</span>
                                </div>
                            )}
                             {log.type === 'PODCAST' && (
                                <div className="flex items-center gap-1">
                                    <PlayCircle size={10} />
                                    <span>LISTEN NOW</span>
                                </div>
                            )}
                        </div>
                    </div>
                </SpotlightCard>
            ))}
         </div>
      </section>
    </div>
  );
}
