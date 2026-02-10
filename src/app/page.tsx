'use client';

import { useEffect, useMemo, useState } from 'react';
import { BentoGrid, BentoItem } from '@/components/ui/bento-grid';
import { ProfileCard } from '@/components/dashboard/profile-card';
import { NowPlaying } from '@/components/dashboard/now-playing';
import { MapWidget } from '@/components/dashboard/map-widget';
import { Showcase } from '@/components/dashboard/extras';
import HotPicksBanner from '@/components/blogs/main/HotPicksBanner';
import { fetchNotionPages } from '@/lib/notion/client';
import type { NotionPage } from '@/lib/notion/types';
import { resolveBlogTheme } from '@/components/blogs/theme';

type BlogItem = NotionPage & { theme: string };

export default function Home() {
  const [posts, setPosts] = useState<BlogItem[]>([]);

  useEffect(() => {
    let active = true;
    fetchNotionPages().then((pages) => {
      if (!active) return;
      const mapped = pages
        .filter((post) => post.category === 'Blogs' || post.category === 'PF-AIGC')
        .map((post) => ({
          ...post,
          theme: resolveBlogTheme(post.theme, post.id),
        }))
        .sort((a, b) => (a.date < b.date ? 1 : -1));
      setPosts(mapped);
    });
    return () => {
      active = false;
    };
  }, []);

  const hotPosts = useMemo(() => posts.slice(0, 5), [posts]);
  return (
    <div className="flex items-center justify-center w-full">
      <BentoGrid className="max-w-6xl w-full grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Row 1: Profile (2x2), Map (1x1), QuickLinks (1x1) - wait, referencing HTML layout */}
        {/* Reference HTML:
            1. Profile Card (2x2)
            2. Map (1x1)
            3. Links (1x1)
            4. Now Playing (1x1)
            5. Stack (1x1)
            6. Showcase (2x1)
            7. Latest Thought (2x1)
        */}

        {/* 1. Profile Card (2x2) */}
        <BentoItem colSpan={2} rowSpan={2}>
          <ProfileCard />
        </BentoItem>

        {/* 2. Map (1x1) */}
        <BentoItem colSpan={1} rowSpan={1}>
          <MapWidget />
        </BentoItem>

        {/* 3. Now Playing (1x1) */}
        <BentoItem colSpan={1} rowSpan={1}>
          <NowPlaying />
        </BentoItem>

        {/* 6. Showcase / Lab (2x1) */}
        <BentoItem colSpan={2} rowSpan={1}>
           <Showcase />
        </BentoItem>

        {/* 7. Hot Picks (2x1) */}
        <BentoItem colSpan={4} rowSpan={1}>
          <HotPicksBanner posts={hotPosts} />
        </BentoItem>

      </BentoGrid>
    </div>
  );
}
