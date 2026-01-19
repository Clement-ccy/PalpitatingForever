'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, ArrowUpRight } from 'lucide-react';
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
      
      {/* Header Section */}
      <div className="mb-16 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
                <h1 className="text-5xl md:text-7xl font-semibold tracking-tight text-white mb-6">
                    Selected Works
                </h1>
                <p className="text-lg text-gray-400 max-w-2xl leading-relaxed">
                    A collection of digital products, interactive experiences, and open source contributions. 
                    Building the intersection of design and engineering.
                </p>
            </div>
            
            {/* Filter Buttons */}
            <div className="flex gap-2 flex-wrap">
                    <button className="px-4 py-2 rounded-full bg-white text-black text-sm font-medium hover:bg-gray-200 transition-colors">All</button>
                    <button className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-gray-300 text-sm font-medium hover:bg-white/10 hover:text-white transition-colors">React</button>
                    <button className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-gray-300 text-sm font-medium hover:bg-white/10 hover:text-white transition-colors">WebGL</button>
                    <button className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-gray-300 text-sm font-medium hover:bg-white/10 hover:text-white transition-colors">Mobile</button>
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
            <SpotlightCard className="group h-full flex flex-col p-0 overflow-hidden bg-[#0A0A0A] border-white/10">
                {/* Image Section */}
                <div className="aspect-[4/3] relative overflow-hidden bg-gray-900">
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent opacity-60 z-10 pointer-events-none"></div>
                     <Image 
                        src={work.imageUrl} 
                        alt={work.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                     />
                    <div className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                            <ArrowUpRight className="text-white" size={18} />
                            </div>
                    </div>
                </div>

                {/* Content Section */}
                <div className="p-6 relative z-10 flex flex-col flex-grow">
                    <motion.div layoutId={`card-content-${work.id}`}>
                        <div className="flex items-center gap-2 mb-3">
                            <span className={cn("text-xs font-mono", themeColors[work.theme])}>{work.year}</span>
                            <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                            <span className="text-xs font-mono text-gray-400 uppercase tracking-wider">{work.category}</span>
                        </div>
                        <h3 className={cn("text-2xl font-semibold text-white mb-2 transition-colors", themeHoverColors[work.theme])}>
                            {work.title}
                        </h3>
                        <p className="text-sm text-gray-400 line-clamp-2 mb-4">
                            {work.description}
                        </p>
                        <div className="flex gap-2 flex-wrap mt-auto">
                            {work.tech.map(t => (
                                <span key={t} className="px-2 py-1 rounded-md bg-white/5 border border-white/5 text-xs text-gray-400 font-mono">
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
            <p className="text-gray-400 mb-6">Interested in collaborating on a project?</p>
            <a href="#" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-black font-medium hover:bg-gray-200 transition-colors">
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
              className="w-full max-w-3xl bg-[#0F0F0F] rounded-3xl border border-white/10 overflow-hidden relative pointer-events-auto shadow-2xl max-h-[90vh] flex flex-col"
            >
                {/* Close Button */}
                <button 
                    onClick={(e) => { e.stopPropagation(); setSelectedId(null); }}
                    className="absolute top-4 right-4 p-2 bg-black/50 rounded-full border border-white/10 hover:bg-white/10 transition-colors z-30 text-white"
                >
                    <X size={20} />
                </button>

                 <div className="relative w-full aspect-video bg-neutral-900 border-b border-white/10 flex items-center justify-center overflow-hidden shrink-0">
                     <Image 
                        src={selectedWork.imageUrl} 
                        alt={selectedWork.title}
                        fill
                        className="object-cover"
                     />
                     <div className="absolute inset-0 bg-black/40"></div>
                     {/* Gradient Overlay */}
                      <div 
                        className={cn("absolute inset-0 opacity-40 bg-gradient-to-br", themeGradients[selectedWork.theme], "to-transparent")}
                    />

                    <motion.div layoutId={`card-title-${selectedId}`} className="relative z-10 text-center p-4">
                        <h2 className="text-4xl md:text-6xl font-bold text-white mb-2">{selectedWork.title}</h2>
                        <p className="text-white/80 font-mono uppercase tracking-widest text-sm">{selectedWork.category} — {selectedWork.year}</p>
                    </motion.div>
                 </div>

              <div className="p-8 overflow-y-auto custom-scrollbar">
                <motion.div layoutId={`card-content-${selectedId}`}>
                   <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                             {/* User Avatar Placeholder */}
                             <div className="w-10 h-10 rounded-full bg-white/10 border border-white/10 overflow-hidden">
                                <Image src="/avatar.png" alt="Author" width={40} height={40} />
                             </div>
                             <div>
                                <p className="text-sm font-medium text-white">Alex Chen</p>
                                <p className="text-xs text-gray-500">Lead Designer</p>
                             </div>
                        </div>
                        <a href={selectedWork.link} className="flex items-center gap-2 px-5 py-2.5 bg-white text-black text-sm font-bold rounded-full hover:bg-gray-200 transition-colors">
                            View Live <ExternalLink size={14} />
                        </a>
                   </div>
                  
                  <div className="prose prose-invert max-w-none">
                      <p className="text-gray-300 text-lg leading-relaxed mb-8">
                        {selectedWork.description}
                      </p>
                      
                      <p className="text-gray-400">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                      </p>
                  </div>

                  <div className="mt-8 pt-8 border-t border-white/10">
                     <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Technologies Used</h3>
                     <div className="flex flex-wrap gap-2">
                        {selectedWork.tech.map(t => (
                            <span key={t} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-white/60 font-mono">
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
