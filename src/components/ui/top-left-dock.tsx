'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Home, Grid3X3, ExternalLink } from 'lucide-react';
import { useState } from 'react';

export const TopLeftDock = () => {
  const [isAppHovered, setIsAppHovered] = useState(false);

  const appLinks = [
    { name: 'Project 1', href: 'https://example1.com' },
    { name: 'Project 2', href: 'https://example2.com' },
    // Add more as needed
  ];

  return (
    <div className="fixed top-8 left-8 z-50 flex items-center gap-4">
      {/* Personal Identifier */}
      <div className="group relative">
        <Link href="/" className="text-xl font-bold tracking-tighter text-white hover:opacity-80 transition-opacity">
          AC.
        </Link>
        {/* Home icon on hover */}
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Home className="w-5 h-5 text-white" />
        </div>
      </div>

      {/* App Icon */}
      <div className="relative">
        <div
          className="w-10 h-10 rounded-full bg-white/5 border border-white/5 flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer"
          onMouseEnter={() => setIsAppHovered(true)}
          onMouseLeave={() => setIsAppHovered(false)}
        >
          <Grid3X3 className="w-5 h-5 text-neutral-400 hover:text-white" />
        </div>
        {/* Dropdown on hover */}
        {isAppHovered && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-12 left-0 bg-black/50 backdrop-blur-xl border border-white/10 rounded-xl p-2 min-w-48"
          >
            {appLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 text-sm text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                {link.name}
              </a>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};