'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { collectAnalytics } from '@/lib/analytics/client';

type RouteMeta = {
  title: string;
  description: string;
};

const DEFAULT_META: RouteMeta = {
  title: 'PF Station',
  description: 'Personal portfolio and digital garden.',
};

const ROUTE_META: Record<string, RouteMeta> = {
  '/': DEFAULT_META,
  '/about': {
    title: 'About · PF Station',
    description: 'Builder, designer, and experimenter crafting delightful digital products.',
  },
  '/blogs': {
    title: 'Blog · PF Station',
    description: 'Documenting the process, sharing insights, and building a second brain.',
  },
  '/blogs/[slug]': {
    title: 'Blog · PF Station',
    description: 'Thoughts, essays, and experiments from the PF Station archive.',
  },
  '/works': {
    title: 'Works · PF Station',
    description: 'A collection of digital products, interactive experiences, and open source contributions.',
  },
  '/mlogs': {
    title: 'Mlogs · PF Station',
    description: 'Music and podcast logs with notes, ratings, and highlights.',
  },
  '/plogs': {
    title: 'Plogs · PF Station',
    description: 'A collection of visual logs grouped by journey and theme.',
  },
  '/gears': {
    title: 'Gears · PF Station',
    description: 'The hardware, software, and tools I use to build, design, and survive.',
  },
  '/links': {
    title: 'Links · PF Station',
    description: 'Friends, inspirations, and resources I keep close.',
  },
};

const getTitle = () => (typeof document === 'undefined' ? null : document.title || null);

const resolveRouteMeta = (pathname: string): RouteMeta => {
  if (pathname === '/') return ROUTE_META['/'];
  if (pathname.startsWith('/blogs/')) return ROUTE_META['/blogs/[slug]'];
  if (pathname.startsWith('/blogs')) return ROUTE_META['/blogs'];
  if (pathname.startsWith('/works')) return ROUTE_META['/works'];
  if (pathname.startsWith('/mlogs')) return ROUTE_META['/mlogs'];
  if (pathname.startsWith('/plogs')) return ROUTE_META['/plogs'];
  if (pathname.startsWith('/gears')) return ROUTE_META['/gears'];
  if (pathname.startsWith('/links')) return ROUTE_META['/links'];
  if (pathname.startsWith('/about')) return ROUTE_META['/about'];
  return DEFAULT_META;
};

const setMetaDescription = (content: string) => {
  if (typeof document === 'undefined') return;
  const existing = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
  const tag = existing ?? document.createElement('meta');
  if (!existing) {
    tag.setAttribute('name', 'description');
    document.head.appendChild(tag);
  }
  if (tag.content !== content) {
    tag.setAttribute('content', content);
  }
};

export default function AnalyticsTracker() {
  const pathname = usePathname();
  const lastPathRef = useRef<string>('');
  const lastTitleRef = useRef<string>('');
  const observerRef = useRef<MutationObserver | null>(null);
  const titleSyncRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!pathname) return;
    const isAdminRoute = pathname.startsWith('/admin');
    const routeMeta = resolveRouteMeta(pathname);

    if (routeMeta.title && document.title !== routeMeta.title) {
      document.title = routeMeta.title;
    }
    if (routeMeta.description) {
      setMetaDescription(routeMeta.description);
    }

    const sendPageview = () => {
      const title = getTitle();
      lastTitleRef.current = title ?? '';
      if (isAdminRoute) return;
      collectAnalytics({
        site: 'main',
        path: pathname,
        title,
        referrer: document.referrer || null,
        url: window.location.href,
        language: navigator.language,
        screen: `${window.screen.width}x${window.screen.height}`,
        tz: Intl.DateTimeFormat().resolvedOptions().timeZone,
      });
    };

    if (lastPathRef.current !== pathname) {
      lastPathRef.current = pathname;
      sendPageview();
    }

    if (observerRef.current) {
      observerRef.current.disconnect();
    }
    if (titleSyncRef.current) {
      clearTimeout(titleSyncRef.current);
      titleSyncRef.current = null;
    }

    if (!isAdminRoute) {
      observerRef.current = new MutationObserver(() => {
        if (lastPathRef.current !== pathname) return;
        if (titleSyncRef.current) return;
        titleSyncRef.current = setTimeout(() => {
          titleSyncRef.current = null;
          const title = getTitle();
          if (!title || title === lastTitleRef.current) return;
          sendPageview();
        }, 300);
      });

      observerRef.current.observe(document.head, {
        subtree: true,
        childList: true,
        characterData: true,
      });
    }

    return () => {
      if (titleSyncRef.current) {
        clearTimeout(titleSyncRef.current);
        titleSyncRef.current = null;
      }
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, [pathname]);

  return null;
}
