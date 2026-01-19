import { SpotlightCard } from '@/components/ui/spotlight-card';
import { Box, Code, ArrowUpRight, Github, Twitter, Linkedin, Mail } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export function Showcase() {
  return (
    <Link href="/lab" className="block h-full w-full">
        <SpotlightCard className="h-full w-full relative group overflow-hidden border-white/5 hover:border-white/20 transition-all">
            <div className="absolute inset-0 mesh-gradient opacity-40 group-hover:opacity-60 transition-opacity duration-700"></div>
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
            
            <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-x-4 group-hover:translate-x-0">
                <ArrowUpRight className="text-3xl text-white" />
            </div>

            <div className="absolute bottom-0 left-0 p-8 w-full z-10">
                <div className="inline-block px-3 py-1 bg-white/10 backdrop-blur-md border border-white/10 rounded-full text-xs font-mono text-purple-300 mb-3">
                    INTERACTIVE LAB / 01
                </div>
                <h2 className="text-3xl font-semibold text-white mb-2">WebGL Experiments</h2>
                <p className="text-gray-400 max-w-sm line-clamp-2">A collection of shaders and reactive three.js sketches exploring chaos theory.</p>
            </div>
            
            {/* Decorative 3D-ish Element */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-white/20 rounded-full flex items-center justify-center animate-[spin_20s_linear_infinite] group-hover:border-white/40 transition-colors pointer-events-none">
                    <div className="w-32 h-32 border border-white/20 rounded-full flex items-center justify-center animate-[spin_15s_linear_infinite_reverse]">
                    <div className="w-16 h-16 bg-white/5 backdrop-blur-xl rounded-full"></div>
                    </div>
            </div>
        </SpotlightCard>
    </Link>
  );
}

const SOCIALS = [
    { icon: Github, href: '#', label: 'GitHub', color: 'group-hover:text-white' },
    { icon: Twitter, href: '#', label: 'Twitter', color: 'group-hover:text-sky-400' },
    { icon: Linkedin, href: '#', label: 'LinkedIn', color: 'group-hover:text-blue-500' },
    { icon: Mail, href: '#', label: 'Email', color: 'group-hover:text-emerald-400' },
];

export function QuickLinks() {
    return (
        <SpotlightCard className="h-full w-full p-6 bg-[#0F0F0F] border-white/5">
             <div className="grid grid-cols-2 gap-4 h-full">
                {SOCIALS.map((social) => (
                    <Link key={social.label} href={social.href} className="flex flex-col items-center justify-center bg-white/5 rounded-2xl hover:bg-white/10 hover:scale-105 transition-all border border-white/5 group h-full w-full">
                        <social.icon className={cn("text-2xl text-gray-500 transition-colors duration-300", social.color)} size={24} />
                    </Link>
                ))}
            </div>
        </SpotlightCard>
    )
}

export function StackCard() {
    return (
        <SpotlightCard className="h-full w-full p-0 relative overflow-hidden flex items-center justify-center group bg-[#0F0F0F] border-white/5">
             <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-blue-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
             <div className="text-center z-10 p-6 flex flex-col items-center justify-center h-full">
                 <div className="flex items-center gap-2 text-xs font-mono text-gray-500 mb-4 tracking-widest uppercase border border-white/10 px-3 py-1 rounded-full bg-white/5">
                    <Code size={12} />
                    <span>Tech Stack</span>
                 </div>
                 <div className="flex flex-wrap items-center gap-3 justify-center max-w-[80%]">
                    {/* Placeholder Icons - In real app use SVGs */}
                    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-[10px] font-bold text-white/50 hover:bg-white/20 hover:text-white transition-all cursor-help" title="Next.js">NEXT</div>
                    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-[10px] font-bold text-white/50 hover:bg-blue-500/20 hover:text-blue-400 transition-all cursor-help" title="React">RCT</div>
                    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-[10px] font-bold text-white/50 hover:bg-blue-600/20 hover:text-blue-500 transition-all cursor-help" title="TypeScript">TS</div>
                    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-[10px] font-bold text-white/50 hover:bg-cyan-500/20 hover:text-cyan-400 transition-all cursor-help" title="Tailwind">TW</div>
                 </div>
             </div>
        </SpotlightCard>
    )
}
