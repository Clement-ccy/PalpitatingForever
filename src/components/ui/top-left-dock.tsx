"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Home, Grid3X3, ExternalLink } from "lucide-react";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export const TopLeftDock = () => {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [isAppHovered, setIsAppHovered] = useState(false);
  const [isBrandingHovered, setIsBrandingHovered] = useState(false);

  const appLinks = [
    { name: "Project 1", href: "https://example1.com" },
    { name: "Project 2", href: "https://example2.com" },
    // Add more as needed
  ];

  return (
    <div className="fixed top-8 left-8 z-50 flex items-center gap-4">
      <div className="flex h-16 items-center gap-4 rounded-2xl border border-card-border bg-background/50 px-4 backdrop-blur-xl">
        {/* App Icon */}
        <div
          className="relative h-full flex items-center"
          onMouseEnter={() => setIsAppHovered(true)}
          onMouseLeave={() => setIsAppHovered(false)}
        >
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-card border border-card-border hover:bg-foreground/5 transition-colors cursor-pointer group">
            <Grid3X3 className="w-4 h-4 text-muted group-hover:text-foreground transition-colors" />
            <span className="text-xs font-medium text-muted group-hover:text-foreground transition-colors">
              Projects
            </span>
          </div>

          {/* Dropdown on hover */}
          <AnimatePresence>
            {isAppHovered && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute top-full left-0 pt-2 min-w-48 z-100"
              >
                <div className="bg-background/80 backdrop-blur-xl border border-card-border rounded-xl p-2 shadow-2xl">
                  {appLinks.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-foreground/5 rounded-lg transition-colors"
                    >
                      <ExternalLink className="w-4 h-4 text-muted" />
                      {link.name}
                    </a>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="w-px h-6 bg-card-border" />
        {/* Personal Identifier */}
        <Link
          href="/"
          className={cn(
            "group relative flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-300",
            isHome
              ? "bg-foreground/10 shadow-[0_0_20px_rgba(var(--foreground),0.15)] border border-foreground/20"
              : "hover:bg-foreground/5",
          )}
          onMouseEnter={() => setIsBrandingHovered(true)}
          onMouseLeave={() => setIsBrandingHovered(false)}
        >
          <AnimatePresence mode="wait">
            {isBrandingHovered ? (
              <motion.div
                key="home"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
              >
                <Home
                  className={cn(
                    "w-5 h-5",
                    isHome
                      ? "text-foreground"
                      : "text-muted group-hover:text-foreground",
                  )}
                />
              </motion.div>
            ) : (
              <motion.div
                key="brand"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                className={cn(
                  "text-xl font-bold tracking-tighter",
                  isHome
                    ? "text-foreground"
                    : "text-muted group-hover:text-foreground",
                )}
              >
                CC.
              </motion.div>
            )}
          </AnimatePresence>
        </Link>
      </div>
    </div>
  );
};
