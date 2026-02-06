import { SpotlightCard } from '@/components/ui/spotlight-card';
import { Code, ArrowUpRight, Github, Twitter, Linkedin, Mail } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export function Showcase() {
  return (
    <Link href="/about" className="block h-full w-full">
        <SpotlightCard className="h-full w-full relative group overflow-hidden">
            <div className="absolute inset-0 mesh-gradient opacity-40 group-hover:opacity-60 transition-opacity duration-700"></div>
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
            
            <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-8 group-hover:translate-x-0 z-20">
                <ArrowUpRight className="text-3xl text-foreground" />
            </div>

            <div className="bottom-0 left-0 p-8 w-full z-10">
                <div className="inline-block px-3 py-1 bg-card/20 backdrop-blur-md border border-card-border rounded-full text-xs font-mono text-purple-400 dark:text-purple-300 mb-3">
                    ABOUT / 01
                </div>
                <h2 className="text-3xl font-semibold text-foreground mb-2 wrap-break-word">Who I Am</h2>
                <p className="text-muted max-w-sm line-clamp-2">Background, focus areas, and the systems behind this site.</p>
            </div>
            
            {/* Decorative 3D-ish Element */}
            <div className="absolute top-1/2 left-1/2 w-48 h-48 pointer-events-none animate-[float-element_8s_ease-in-out_infinite]">
                <div className="w-full h-full border border-card-border rounded-full flex items-center justify-center animate-[spin_20s_linear_infinite] group-hover:border-card-hover-border transition-colors">
                        <div className="w-32 h-32 border border-card-border rounded-full flex items-center justify-center animate-[spin_15s_linear_infinite_reverse]">
                        <div className="w-16 h-16 bg-card/10 backdrop-blur-xl rounded-full"></div>
                        </div>
                </div>
            </div>
        </SpotlightCard>
    </Link>
  );
}

const SOCIALS = [
    { icon: Github, href: '#', label: 'GitHub', color: 'group-hover:text-foreground' },
    { icon: Twitter, href: '#', label: 'Twitter', color: 'group-hover:text-sky-500' },
    { icon: Linkedin, href: '#', label: 'LinkedIn', color: 'group-hover:text-blue-600' },
    { icon: Mail, href: '#', label: 'Email', color: 'group-hover:text-emerald-500' },
];

export function QuickLinks() {
    return (
        <SpotlightCard className="h-full w-full p-6">
             <div className="grid grid-cols-2 gap-4 h-full">
                {SOCIALS.map((social) => (
                    <Link key={social.label} href={social.href} className="flex flex-col items-center justify-center bg-card rounded-2xl hover:bg-white/5 dark:hover:bg-white/5 hover:scale-105 transition-all border border-card-border group h-full w-full">
                        <social.icon className={cn("text-2xl text-muted transition-colors duration-300", social.color)} size={24} />
                    </Link>
                ))}
            </div>
        </SpotlightCard>
    )
}

export function StackCard() {
    return (
        <SpotlightCard className="h-full w-full p-0 relative overflow-hidden flex items-center justify-center group">
             <div className="absolute -inset-px bg-linear-to-br from-purple-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0"></div>
             <div className="text-center z-10 p-6 flex flex-col items-center justify-center h-full">
                  <div className="flex items-center gap-2 text-xs font-mono text-muted mb-4 tracking-widest uppercase border border-card-border px-3 py-1 rounded-full bg-card">
                     <Code size={12} />
                     <span>Tech Stack</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 justify-center max-w-[80%]">
                    {/* Placeholder Icons */}
                    <TechIcon title="Next.js">NEXT</TechIcon>
                    <TechIcon title="React">RCT</TechIcon>
                    <TechIcon title="TypeScript">TS</TechIcon>
                    <TechIcon title="Tailwind">TW</TechIcon>
                  </div>
             </div>
        </SpotlightCard>
    )
}

const TechIcon = ({ children, title }: { children: React.ReactNode, title: string }) => (
    <div className="w-8 h-8 rounded-lg bg-card border border-card-border flex items-center justify-center text-[10px] font-bold text-muted hover:bg-foreground hover:text-background transition-all cursor-help" title={title}>
        {children}
    </div>
);
