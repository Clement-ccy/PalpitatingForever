import { BentoGrid, BentoItem } from "@/components/ui/bento-grid";
import { ProfileCard } from "@/components/dashboard/profile-card";
import { NowPlaying } from "@/components/dashboard/now-playing";
import { LatestThought } from "@/components/dashboard/latest-thought";
import { MapWidget } from "@/components/dashboard/map-widget";
import { Showcase, QuickLinks, StackCard } from "@/components/dashboard/extras";

export default function Home() {
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

        {/* 3. Quick Links (1x1) */}
        <BentoItem colSpan={1} rowSpan={1}>
          <QuickLinks />
        </BentoItem>

        {/* 4. Now Playing (1x1) */}
        <BentoItem colSpan={1} rowSpan={1}>
          <NowPlaying />
        </BentoItem>

        {/* 5. Stack / Filler (1x1) */}
        <BentoItem colSpan={1} rowSpan={1}>
            <StackCard />
        </BentoItem>

        {/* 6. Showcase / Lab (2x1) */}
        <BentoItem colSpan={2} rowSpan={1}>
           <Showcase />
        </BentoItem>

        {/* 7. Latest Thought (2x1) */}
        <BentoItem colSpan={2} rowSpan={1}>
          <LatestThought />
        </BentoItem>

      </BentoGrid>
    </div>
  );
}
