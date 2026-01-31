'use client';

import { MotionValue, motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useRef } from 'react';
import Link from 'next/link';
import { PenTool, Music, Camera, Settings,  FlaskConical, Briefcase } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export const TopDock = () => {
  const mouseX = useMotionValue(Infinity);
  const pathname = usePathname();

  const links = [
    { name: 'Works', icon: Briefcase, href: '/works' },
    { name: 'Blogs', icon: PenTool, href: '/blogs' },
    { name: 'Mlogs', icon: Music, href: '/mlogs' },
    { name: 'Plogs', icon: Camera, href: '/plogs' },
    { name: 'Gears', icon: Settings, href: '/gears' },
    { name: 'Lab', icon: FlaskConical, href: '/lab' },
  ];

  return (
    <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50 hidden md:block">
      <motion.div
        onMouseMove={(e) => mouseX.set(e.pageX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        className="flex h-16 items-center gap-4 rounded-2xl border border-card-border bg-background/50 px-4 backdrop-blur-xl"
      >
        {links.map((link) => (
          <DockIcon key={link.href} mouseX={mouseX} {...link} isActive={pathname === link.href} />
        ))}
      </motion.div>
    </div>
  );
};

function DockIcon({
  mouseX,
  href,
  icon: Icon,
  name,
  isActive,
}: {
  mouseX: MotionValue;
  href: string;
  icon: React.ElementType;
  name: string;
  isActive: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const widthSync = useTransform(distance, [-150, 0, 150], [40, 80, 40]);
  const width = useSpring(widthSync, { mass: 0.1, stiffness: 150, damping: 12 });

  return (
    <div className="group relative">
      {/* Tooltip */}
      <div className="absolute top-14 left-1/2 -translate-x-1/2 rounded-md bg-neutral-900 border border-white/10 px-2 py-1 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
        {name}
      </div>
      
      <Link href={href}>
        <motion.div
        ref={ref}
        style={{ width }}
        className={cn(
            "aspect-square w-10 rounded-full flex items-center justify-center border transition-colors",
            isActive 
            ? "bg-foreground/10 border-foreground/20 text-foreground shadow-[0_0_20px_rgba(var(--foreground),0.1)]"
            : "bg-card border-card-border text-muted hover:bg-foreground/5 hover:text-foreground"
        )}
        >
        <Icon className="w-5 h-5" />
        </motion.div>
      </Link>
    </div>
  );
}
