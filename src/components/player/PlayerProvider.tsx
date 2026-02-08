'use client';

import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { AudioTrack } from '@/lib/player/types';
import type { NotionBlock, NotionPage } from '@/lib/notion/types';
import { fetchNotionBlocks, fetchNotionPages } from '@/lib/notion/client';

type PlayerContextValue = {
  queue: AudioTrack[];
  currentIndex: number;
  isPlaying: boolean;
  setQueue: (tracks: AudioTrack[], startIndex?: number) => void;
  addTracks: (tracks: AudioTrack[]) => void;
  playTrack: (track: AudioTrack) => void;
  playTrackById: (id: string) => void;
  next: () => void;
  prev: () => void;
  setPlaying: (playing: boolean) => void;
};

const PlayerContext = createContext<PlayerContextValue | null>(null);

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error('usePlayer must be used within PlayerProvider');
  return ctx;
}

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const [queue, setQueueState] = useState<AudioTrack[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (initializedRef.current) return;
    if (queue.length > 0) {
      initializedRef.current = true;
      return;
    }
    initializedRef.current = true;
    let active = true;

    const extractAudioUrl = (blocks: NotionBlock[]): string | null => {
      const audioBlock = blocks.find((block) => block.type === 'audio');
      const content = audioBlock?.content && typeof audioBlock.content === 'object'
        ? (audioBlock.content as { url?: string })
        : undefined;
      return content?.url ?? null;
    };

    const getTrackMeta = (page: NotionPage) => {
      const [trackTitle, artistName] = page.title.split(' - ');
      return {
        title: trackTitle || page.title,
        artist: artistName || page.summary || 'Unknown Artist',
      };
    };

    const loadInitialQueue = async () => {
      try {
        const pages = await fetchNotionPages();
        if (!active) return;
        const mlogs = pages.filter((page) => page.category === 'Mlogs');
        const sorted = [...mlogs].sort((a, b) => (a.date < b.date ? 1 : -1));
        const topFive = sorted.slice(0, 5);
        const tracks: AudioTrack[] = [];

        for (const log of topFive) {
          const blocks = await fetchNotionBlocks(log.id);
          if (!active) return;
          const audioUrl = extractAudioUrl(blocks);
          if (!audioUrl) continue;
          const meta = getTrackMeta(log);
          tracks.push({
            id: log.id,
            title: meta.title,
            artist: meta.artist,
            cover: log.cover,
            src: audioUrl,
            kind: 'mlog',
          });
        }

        if (!active || tracks.length === 0) return;
        setQueueState(tracks);
        setCurrentIndex(0);
        setIsPlaying(false);
      } catch (error) {
        console.error('Failed to load initial audio queue', error);
      }
    };

    void loadInitialQueue();

    return () => {
      active = false;
    };
  }, [queue.length]);

  const value = useMemo<PlayerContextValue>(() => ({
    queue,
    currentIndex,
    isPlaying,
    setQueue: (tracks, startIndex = 0) => {
      setQueueState(tracks);
      setCurrentIndex(Math.max(0, Math.min(startIndex, tracks.length - 1)));
      setIsPlaying(tracks.length > 0);
    },
    addTracks: (tracks) => {
      setQueueState((prev) => {
        const existing = new Set(prev.map((t) => t.id));
        return [...prev, ...tracks.filter((t) => !existing.has(t.id))];
      });
    },
    playTrack: (track) => {
      setQueueState((prev) => {
        const existingIndex = prev.findIndex((t) => t.id === track.id);
        if (existingIndex >= 0) {
          setCurrentIndex(existingIndex);
          setIsPlaying(true);
          return prev;
        }
        const nextQueue = [...prev, track];
        setCurrentIndex(nextQueue.length - 1);
        setIsPlaying(true);
        return nextQueue;
      });
    },
    playTrackById: (id) => {
      setQueueState((prev) => {
        const index = prev.findIndex((t) => t.id === id);
        if (index >= 0) {
          setCurrentIndex(index);
          setIsPlaying(true);
        }
        return prev;
      });
    },
    next: () => {
      setCurrentIndex((prev) => (queue.length === 0 ? prev : (prev + 1) % queue.length));
      if (queue.length > 0) setIsPlaying(true);
    },
    prev: () => {
      setCurrentIndex((prev) => (queue.length === 0 ? prev : (prev - 1 + queue.length) % queue.length));
      if (queue.length > 0) setIsPlaying(true);
    },
    setPlaying: (playing) => setIsPlaying(playing),
  }), [queue, currentIndex, isPlaying]);

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
}
