"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { name: "Works", href: "/works" },
  { name: "Blog", href: "/blogs" },
  { name: "Music", href: "/mlogs" },
  { name: "Photos", href: "/plogs" },
  { name: "Gear", href: "/gears" },
  { name: "Lab", href: "/lab" },
];

export function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="w-full max-w-6xl mx-auto mb-8 flex justify-between items-center relative z-20 pt-8 px-4 md:px-0" style={{ viewTransitionName: "header" }}>
      <Link href="/" className="text-xl font-bold tracking-tighter text-white hover:opacity-80 transition-opacity z-50">
        AC.
      </Link>
      
      {/* Desktop Navigation */}
      <div className="hidden md:flex gap-1 p-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
        {navItems.map((item) => {
           const isActive = pathname.startsWith(item.href);
           return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-all duration-300",
                isActive 
                  ? "bg-white/10 text-white" 
                  : "text-gray-400 hover:text-white hover:bg-white/10"
              )}
            >
              {item.name}
            </Link>
          );
        })}
      </div>

      {/* Mobile Menu Toggle */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden p-2 text-white bg-white/5 rounded-full border border-white/10 hover:bg-white/10 transition-colors z-50 relative"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
            <motion.div
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute top-20 left-4 right-4 bg-[#0A0A0A] border border-white/10 rounded-2xl p-2 flex flex-col gap-1 shadow-2xl z-40 md:hidden overflow-hidden"
            >
                {navItems.map((item) => {
                    const isActive = pathname.startsWith(item.href);
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setIsOpen(false)}
                            className={cn(
                                "flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                                isActive 
                                ? "bg-white/10 text-white" 
                                : "text-gray-400 hover:text-white hover:bg-white/5"
                            )}
                        >
                            {item.name}
                        </Link>
                    );
                })}
            </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
