import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { TopDock } from '@/components/ui/top-dock';
import { TopLeftDock } from '@/components/ui/top-left-dock';
import { TopRightDock } from '@/components/ui/top-right-dock';
import { ThemeProvider } from '@/components/theme-provider';
import './globals.css';

export const metadata: Metadata = {
  title: 'PF Station',
  description: 'Personal portfolio and digital garden',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`} suppressHydrationWarning>
      <body className="font-sans min-h-screen relative selection:bg-white/20 overflow-x-hidden flex flex-col items-center p-4 md:p-8 bg-background text-foreground transition-colors duration-300">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <TopLeftDock />
          <TopDock />
          <TopRightDock />
          <div className="aurora-blob aurora-1" />
          <div className="aurora-blob aurora-2" />
          <div className="aurora-blob aurora-3" />
          <div className="noise-bg" />
          <main className="relative z-10 w-full max-w-6xl mx-auto pt-24 pb-40">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
