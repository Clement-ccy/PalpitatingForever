import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { Navbar } from '@/components/ui/navbar';
import { Dock } from '@/components/ui/dock';
import './globals.css';

export const metadata: Metadata = {
  title: 'Digital Dashboard',
  description: 'Personal portfolio and digital garden',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="font-sans min-h-screen relative selection:bg-white/20 overflow-x-hidden flex flex-col items-center p-4 md:p-8">
        <div className="aurora-blob aurora-1" />
        <div className="aurora-blob aurora-2" />
        <div className="aurora-blob aurora-3" />
        <div className="noise-bg" />
        <Navbar />
        <main className="relative z-10 w-full max-w-6xl mx-auto pb-40">
          {children}
        </main>
        <Dock />
      </body>
    </html>
  );
}
