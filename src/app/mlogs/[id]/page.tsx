'use client';

import { use, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, PlayCircle } from 'lucide-react';
import { renderNotionBlocks } from '@/components/notion/NotionBlockRenderer';
import type { NotionBlock, NotionPage } from '@/lib/notion/types';
import { fetchNotionBlocks, fetchNotionPages } from '@/lib/notion/client';
import { Comments } from '@/components/comments/Comments';
import { usePlayer } from '@/components/player/PlayerProvider';
import type { AudioTrack } from '@/lib/player/types';

const DEFAULT_COVER = 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=800&auto=format&fit=crop';

const NotionRenderer = ({ blocks }: { blocks: NotionBlock[] }) => (
  <div className="notion-content">
    {renderNotionBlocks(blocks)}
  </div>
);

export default function MlogDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [blocks, setBlocks] = useState<NotionBlock[]>([]);
  const [log, setLog] = useState<NotionPage | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { setQueue, playTrackById } = usePlayer();
  const [audioSrc, setAudioSrc] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    fetchNotionPages()
      .then((pages) => {
        if (!active) return;
        const item = pages.find((page) => page.id === id && page.category === 'Mlogs') ?? null;
        setLog(item);
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
      const audioBlock = data.find((block) => block.type === 'audio');
      const content = (audioBlock?.content && typeof audioBlock.content === 'object'
        ? (audioBlock.content as { url?: string })
        : undefined);
      setAudioSrc(content?.url ?? null);
    });
    return () => {
      active = false;
    };
  }, [id]);

  if (!log) {
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
        <p className="text-muted">Log not found.</p>
        <Link href="/mlogs" className="mt-8 text-accent-mlogs hover:underline flex items-center gap-2">
          <ChevronLeft size={18} /> Back to Mlogs
        </Link>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-background relative">
      <div className="relative h-[50vh] w-full overflow-hidden">
        <Image
          src={log.cover || DEFAULT_COVER}
          alt={log.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-t from-background via-background/60 to-transparent" />
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-4xl mx-auto px-6 pb-12 w-full">
            <Link href="/mlogs" className="inline-flex items-center gap-2 text-accent-mlogs font-mono text-sm mb-6 hover:gap-3 transition-all">
              <ChevronLeft size={16} /> BACK TO MLOGS
            </Link>
            <h1 className="text-4xl md:text-6xl font-black text-foreground mb-4 leading-tight tracking-tighter">
              {log.title}
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl">{log.summary}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {log.tags.map((tag) => (
                <span key={tag} className="px-3 py-1 rounded-full bg-card border border-card-border text-[10px] font-mono uppercase tracking-wider text-accent-mlogs">
                  {tag}
                </span>
              ))}
            </div>
             <div className="mt-6">
              <button
                type="button"
                onClick={() => {
                  if (!audioSrc || !log) return;
                  const track: AudioTrack = {
                    id: log.id,
                    title: log.title,
                    artist: log.summary || 'Unknown Artist',
                    cover: log.cover,
                    src: audioSrc,
                    kind: 'mlog',
                  };
                  setQueue([track], 0);
                  playTrackById(log.id);
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-foreground text-background text-sm font-semibold hover:opacity-80 transition-opacity"
              >
                Play <PlayCircle size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-20 relative">
        <div className="prose prose-invert prose-lg max-w-none">
          <NotionRenderer blocks={blocks} />
        </div>

        <Comments
          site="main"
          pageKey={log.id}
          pageUrl={`/mlogs/${log.id}`}
          pageTitle={log.title}
          accentClassName="text-accent-mlogs"
        />
      </div>
    </div>
  );
}
