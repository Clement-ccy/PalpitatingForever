'use client';

import { use, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ExternalLink } from 'lucide-react';
import { renderNotionBlocks } from '@/components/notion/NotionBlockRenderer';
import type { NotionBlock, NotionPage } from '@/lib/notion/types';
import { fetchNotionBlocks, fetchNotionPages } from '@/lib/notion/client';
import { trackEvent } from '@/lib/analytics/client';
import { Comments } from '@/components/comments/Comments';

const DEFAULT_COVER = 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop';

const NotionRenderer = ({ blocks }: { blocks: NotionBlock[] }) => (
  <div className="notion-content">
    {renderNotionBlocks(blocks)}
  </div>
);

export default function WorkDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [blocks, setBlocks] = useState<NotionBlock[]>([]);
  const [work, setWork] = useState<NotionPage | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetchNotionPages()
      .then((pages) => {
        if (!active) return;
        const item = pages.find((page) => page.id === id && page.category === 'Works') ?? null;
        setWork(item);
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

  if (!work) {
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
        <p className="text-muted">Work not found.</p>
        <Link href="/works" className="mt-8 text-accent-works hover:underline flex items-center gap-2">
          <ChevronLeft size={18} /> Back to Works
        </Link>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-background relative">
      <div className="relative h-[55vh] w-full overflow-hidden">
        <Image
          src={work.cover || DEFAULT_COVER}
          alt={work.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-t from-background via-background/60 to-transparent" />
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-4xl mx-auto px-6 pb-12 w-full">
            <Link href="/works" className="inline-flex items-center gap-2 text-accent-works font-mono text-sm mb-6 hover:gap-3 transition-all">
              <ChevronLeft size={16} /> BACK TO WORKS
            </Link>
            <h1 className="text-4xl md:text-6xl font-black text-foreground mb-4 leading-tight tracking-tighter">
              {work.title}
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl">{work.summary}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {work.tags.map((tag) => (
                <span key={tag} className="px-3 py-1 rounded-full bg-card border border-card-border text-[10px] font-mono uppercase tracking-wider text-accent-works">
                  {tag}
                </span>
              ))}
            </div>
            {work.url && (
              <div className="mt-6">
                <a
                  href={work.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-foreground text-background text-sm font-semibold hover:opacity-80 transition-opacity"
                  onClick={() => trackEvent({
                    site: 'main',
                    name: 'work_external_click',
                    path: `/works/${work.id}`,
                    title: work.title,
                  })}
                >
                  View Live <ExternalLink size={16} />
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-20 relative">
        <div className="prose prose-invert prose-lg max-w-none">
          <NotionRenderer blocks={blocks} />
        </div>

        <Comments
          site="main"
          pageKey={work.id}
          pageUrl={`/works/${work.id}`}
          pageTitle={work.title}
          accentClassName="text-accent-works"
        />
      </div>
    </div>
  );
}
