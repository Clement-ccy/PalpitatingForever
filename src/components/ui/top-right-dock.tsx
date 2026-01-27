'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shuffle, BookOpen, Search, LayoutGrid, X, ExternalLink, Settings, Moon, Sun } from 'lucide-react';
import { MOCK_BLOGS } from '@/data/mock-blogs';
import { MOCK_WORKS } from '@/data/mock-works';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';

export const TopRightDock = () => {
  const [showPanel, setShowPanel] = useState(false);
  const router = useRouter();

  const handleRandomProject = () => {
    const randomWork = MOCK_WORKS[Math.floor(Math.random() * MOCK_WORKS.length)];
    if (randomWork.link && randomWork.link !== '#') {
      window.open(randomWork.link, '_blank');
    } else {
      router.push('/works');
    }
  };

  const handleRandomBlog = () => {
    const randomBlog = MOCK_BLOGS[Math.floor(Math.random() * MOCK_BLOGS.length)];
    router.push(`/blogs/${randomBlog.slug}`);
  };

  return (
    <>
      <div className="fixed top-8 right-8 z-50 flex items-center gap-2">
        <div className="flex h-16 items-center gap-2 rounded-2xl border border-card-border bg-background/50 px-3 backdrop-blur-xl">
          <DockButton icon={Shuffle} onClick={handleRandomProject} label="Random Project" />
          <DockButton icon={BookOpen} onClick={handleRandomBlog} label="Random Blog" />
          <DockButton icon={Search} onClick={() => {}} label="Search" />
          <div className="w-px h-6 bg-card-border mx-1" />
          <DockButton 
            icon={LayoutGrid} 
            onClick={() => setShowPanel(true)} 
            label="Control Panel"
            className="bg-foreground/10 border-foreground/10 text-foreground"
          />
        </div>
      </div>

      <AnimatePresence>
        {showPanel && (
          <ControlPanel onClose={() => setShowPanel(false)} />
        )}
      </AnimatePresence>
    </>
  );
};

const DockButton = ({ 
  icon: Icon, 
  onClick, 
  label, 
  className 
}: { 
  icon: any, 
  onClick: () => void, 
  label: string,
  className?: string
}) => (
  <button
    onClick={onClick}
    className={`group relative w-10 h-10 rounded-full flex items-center justify-center bg-card border border-card-border text-muted hover:bg-foreground/5 hover:text-foreground transition-all ${className}`}
  >
    <Icon className="w-5 h-5" />
    <span className="absolute top-12 right-0 rounded-md bg-neutral-900 border border-white/10 px-2 py-1 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
      {label}
    </span>
  </button>
);

const ControlPanel = ({ onClose }: { onClose: () => void }) => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      className="fixed top-0 right-0 h-full w-full md:w-96 bg-background/80 backdrop-blur-2xl border-l border-white/10 z-100 p-8 shadow-2xl"
    >
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-foreground" />
          <h2 className="text-xl font-bold text-foreground">Control Center</h2>
        </div>
        <button 
          onClick={onClose}
          className="p-2 hover:bg-foreground/5 rounded-full transition-colors text-muted hover:text-foreground"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="space-y-8">
        <section>
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">Web Settings</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl bg-card border border-card-border">
              <div className="flex items-center gap-3">
                {theme === 'dark' ? <Moon className="w-4 h-4 text-foreground" /> : <Sun className="w-4 h-4 text-foreground" />}
                <span className="text-foreground">Theme Mode</span>
              </div>
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="w-12 h-6 bg-muted rounded-full relative transition-colors focus:outline-none"
              >
                <motion.div 
                  animate={{ x: theme === 'dark' ? 24 : 4 }}
                  className="absolute top-1 w-4 h-4 bg-background rounded-full shadow-sm"
                />
              </button>
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl bg-card border border-card-border opacity-50 cursor-not-allowed">
              <div className="flex items-center gap-3">
                <Settings className="w-4 h-4 text-foreground" />
                <span className="text-foreground">Music Autoplay</span>
              </div>
              <div className="w-10 h-6 bg-muted rounded-full" />
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">Quick Navigation</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Works', href: '/works' },
              { label: 'Blog', href: '/blogs' },
              { label: 'Lab', href: '/lab' },
              { label: 'Gears', href: '/gears' },
            ].map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="flex items-center justify-between p-3 rounded-xl bg-card border border-card-border hover:bg-white/5 dark:hover:bg-white/5 transition-all text-foreground group"
              >
                <span>{link.label}</span>
                <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            ))}
          </div>
        </section>
      </div>
    </motion.div>
  );
};
