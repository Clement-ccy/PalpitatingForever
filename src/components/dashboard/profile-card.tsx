import Image from 'next/image';
import { Github, Linkedin, Mail, Twitter } from 'lucide-react';
import { SpotlightCard } from '@/components/ui/spotlight-card';

const CONTACT_LINKS = [
  { icon: Github, href: 'https://github.com/', label: 'GitHub' },
  { icon: Twitter, href: 'https://x.com/', label: 'Twitter' },
  { icon: Linkedin, href: 'https://linkedin.com/', label: 'LinkedIn' },
  { icon: Mail, href: 'mailto:hello@example.com', label: 'Email' },
];

export function ProfileCard() {
  return (
    <SpotlightCard className="h-full w-full p-8 flex flex-col justify-between group">
      <div className="flex justify-between items-start">
        <div className="relative">
          <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-card-border shadow-2xl relative z-10">
            <Image
              src="/media/avatar.png"
              alt="Clement Chen"
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
              className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
            />
          </div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-background rounded-full flex items-center justify-center z-20">
            <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-card border border-card-border backdrop-blur-sm">
          <div className="relative flex items-center justify-center w-2 h-2">
            <div className="absolute w-full h-full bg-emerald-500 rounded-full pulse-ring"></div>
            <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full relative z-10"></div>
          </div>
          <span className="text-xs font-mono text-muted">CODING</span>
        </div>
      </div>

      <div className="space-y-4 mt-8">
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight leading-tight text-foreground/90">
          Clement Chen
        </h1>
        <p className="text-lg text-muted font-light max-w-md leading-relaxed">
          Digital Craftsman & <br className="hidden md:block"/>Frontend Architect.
        </p>
      </div>

      <div className="flex gap-4 mt-auto pt-6 items-center">
        <a href="#" className="px-5 py-2.5 rounded-full bg-foreground text-background text-sm font-medium hover:opacity-80 transition-opacity">Resume</a>
        <div className="flex items-center gap-2 group/contact">
          <a href="#" className="px-5 py-2.5 rounded-full bg-card border border-card-border text-foreground text-sm font-medium hover:bg-white/10 dark:hover:bg-white/10 transition-colors">Contact</a>
          <div className="flex items-center gap-2 overflow-hidden max-w-0 opacity-0 translate-x-2 transition-all duration-300 ease-out group-hover/contact:max-w-[200px] group-hover/contact:opacity-100 group-hover/contact:translate-x-0">
            {CONTACT_LINKS.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target={item.href.startsWith('http') ? '_blank' : undefined}
                rel={item.href.startsWith('http') ? 'noreferrer' : undefined}
                className="w-9 h-9 rounded-full border border-card-border bg-card flex items-center justify-center text-muted hover:text-foreground hover:bg-foreground/5 transition-colors"
                aria-label={item.label}
              >
                <item.icon size={16} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </SpotlightCard>
  );
}
