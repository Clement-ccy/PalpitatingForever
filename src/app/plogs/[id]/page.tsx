'use client';

import { use, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { renderNotionBlocks } from '@/components/notion/NotionBlockRenderer';
import type { NotionBlock, NotionPage } from '@/lib/notion/types';
import { fetchNotionBlocks, fetchNotionPages } from '@/lib/notion/client';

const DEFAULT_COVER = 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=800&auto=format&fit=crop';

const NotionRenderer = ({ blocks }: { blocks: NotionBlock[] }) => (
  <div className="notion-content">
    {renderNotionBlocks(blocks)}
  </div>
);

export default function PlogDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [blocks, setBlocks] = useState<NotionBlock[]>([]);
  const [plog, setPlog] = useState<NotionPage | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetchNotionPages()
      .then((pages) => {
        if (!active) return;
        const item = pages.find((page) => page.id === id && page.category === 'Plogs') ?? null;
        setPlog(item);
        setIsLoading(false);
      })
      .catch(() => {
        if (!active) return;
        setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, [id]);

  useEffect(() => {
    if (!id) return;
    let active = true;
    fetchNotionBlocks(id).then((data) => {
      if (!active) return;
      setBlocks(data);
    });
    return () => {
      active = false;
    };
  }, [id]);

  if (!plog) {
    if (isLoading) {
      return (
        <div className="min-h-[60vh] flex items-center justify-center text-muted">
          Loading...
        </div>
      );
    }
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
        <h1 className="text-4xl font-bold text-foreground mb-4">404</h1>
        <p className="text-muted">Plog not found.</p>
        <Link href="/plogs" className="mt-8 text-accent-plogs hover:underline flex items-center gap-2">
          <ChevronLeft size={18} /> Back to Plogs
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative">
      <div className="relative h-[50vh] w-full overflow-hidden">
        <Image
          src={plog.cover || DEFAULT_COVER}
          alt={plog.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-t from-background via-background/60 to-transparent" />
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-4xl mx-auto px-6 pb-12 w-full">
            <Link href="/plogs" className="inline-flex items-center gap-2 text-accent-plogs font-mono text-sm mb-6 hover:gap-3 transition-all">
              <ChevronLeft size={16} /> BACK TO PLOGS
            </Link>
            <h1 className="text-4xl md:text-6xl font-black text-foreground mb-4 leading-tight tracking-tighter">
              {plog.title}
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl">{plog.summary}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {plog.tags.map((tag) => (
                <span key={tag} className="px-3 py-1 rounded-full bg-card border border-card-border text-[10px] font-mono uppercase tracking-wider text-accent-plogs">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-20 relative">
        <div className="prose prose-invert prose-lg max-w-none">
          <NotionRenderer blocks={blocks} />
        </div>
      </div>
    </div>
  );
}
