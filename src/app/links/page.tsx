'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { fetchNotionPages } from '@/lib/notion/client';

type LinkItem = {
  id: string;
  name: string;
  url: string;
  description: string;
  cover: string | null;
};

export default function LinksPage() {
  const [links, setLinks] = useState<LinkItem[]>([]);

  useEffect(() => {
    let active = true;
    fetchNotionPages().then((pages) => {
      if (!active) return;
      const mapped = pages
        .filter((page) => page.category === 'Links')
        .map((page) => ({
          id: page.id,
          name: page.title,
          url: page.url,
          description: page.summary,
          cover: page.cover,
        }));
      setLinks(mapped);
    });
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="min-h-screen text-foreground">
      <header className="mb-12">
        <p className="text-xs font-mono text-muted uppercase tracking-widest">Friends</p>
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight">Links</h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
          Friends, inspirations, and resources I keep close.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {links.map((item) => (
          <Link
            key={item.id}
            href={item.url}
            target="_blank"
            className="rounded-2xl border border-card-border bg-card/40 px-6 py-5 hover:bg-card/60 transition-colors flex items-center gap-4"
          >
            <div className="relative w-12 h-12 rounded-2xl overflow-hidden bg-card border border-card-border">
              {item.cover ? (
                <Image src={item.cover} alt={item.name} fill sizes="48px" className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs font-mono text-muted">LINK</div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-lg font-semibold text-foreground">{item.name}</p>
              <p className="text-xs text-muted line-clamp-2 mt-1">{item.description || item.url}</p>
              <p className="text-[10px] font-mono text-muted mt-2 truncate">{item.url}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
