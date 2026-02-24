import type { Metadata} from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { Noto_Sans_SC, Noto_Sans_Mono } from 'next/font/google';
import { TopDock } from '@/components/ui/top-dock';
import { TopLeftDock } from '@/components/ui/top-left-dock';
import { TopRightDock } from '@/components/ui/top-right-dock';
import { ThemeProvider } from '@/components/theme-provider';
import ParticleOverlay from '@/components/ui/particle-overlay';
import AnalyticsTracker from '@/components/analytics/AnalyticsTracker';
import AudioPlayer from '@/components/player/AudioPlayer';
import { PlayerProvider } from '@/components/player/PlayerProvider';
import './globals.css';


export const metadata: Metadata = {
  title: 'PF Station',
  description: 'Personal portfolio and digital garden',
};

const notoSansSc = Noto_Sans_SC({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
  variable: '--font-noto-sans-sc',
});

const notoSansMonoSc = Noto_Sans_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
  variable: '--font-noto-sans-mono-sc',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable} ${notoSansSc.variable} ${notoSansMonoSc.variable}`}
      suppressHydrationWarning
    >
      <body className="font-sans min-h-screen relative selection:bg-white/20 overflow-x-hidden flex flex-col items-center p-4 md:p-8 bg-background text-foreground transition-colors duration-300">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <PlayerProvider>
            <AnalyticsTracker />
            <TopLeftDock />
            <TopDock />
            <TopRightDock />
            <AudioPlayer />
            <div className="aurora-blob aurora-1" />
            <div className="aurora-blob aurora-2" />
            <div className="aurora-blob aurora-3" />
            <ParticleOverlay />
            <div className="noise-bg" />
            <main className="relative z-10 w-full max-w-6xl mx-auto pt-24 pb-40">
              {children}
            </main>
          </PlayerProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
