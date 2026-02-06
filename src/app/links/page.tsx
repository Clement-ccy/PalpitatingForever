'use client';

import Link from 'next/link';

const LINKS = [
  { name: 'OneKey', url: 'https://onekey.so' },
  { name: 'Notion', url: 'https://www.notion.so' },
  { name: 'Figma', url: 'https://figma.com' },
];

export default function LinksPage() {
  return (
    <div className="min-h-screen pt-32 px-6 pb-32 max-w-5xl mx-auto text-foreground">
      <header className="mb-12">
        <p className="text-xs font-mono text-muted uppercase tracking-widest">Friends</p>
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight">Links</h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
          Friends, inspirations, and resources I keep close.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {LINKS.map((item) => (
          <Link
            key={item.url}
            href={item.url}
            target="_blank"
            className="rounded-2xl border border-card-border bg-card/40 px-6 py-5 hover:bg-card/60 transition-colors"
          >
            <p className="text-lg font-semibold text-foreground">{item.name}</p>
            <p className="text-xs font-mono text-muted mt-2">{item.url}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
