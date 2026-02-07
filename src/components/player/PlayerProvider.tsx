'use client';

import { createContext, useContext, useMemo, useState } from 'react';
import type { AudioTrack } from '@/lib/player/types';

type PlayerContextValue = {
  queue: AudioTrack[];
  currentIndex: number;
  isPlaying: boolean;
  setQueue: (tracks: AudioTrack[], startIndex?: number) => void;
  addTracks: (tracks: AudioTrack[]) => void;
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
