'use client';


export default function AboutPage() {
  return (
    <div className="min-h-screen pt-32 px-6 pb-32 max-w-5xl mx-auto text-foreground">
      <header className="mb-12">
        <p className="text-xs font-mono text-muted uppercase tracking-widest">About</p>
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight">Clement Chen</h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
          Builder, designer, and experimenter. I craft delightful digital products, play with WebGL,
          and document the process in this portfolio.
        </p>
      </header>

      <section className="space-y-6 text-muted-foreground text-base leading-relaxed">
        <p>
          This site is a living archive: blogs, mlogs, plogs, and works are all synced from Notion and
          rendered as a cohesive visual narrative. I’m focused on building systems that feel human,
          with a blend of motion, light, and structure.
        </p>
        <p>
          Currently exploring analytics, comments, and a fully custom CMS stack—optimized for privacy
          and minimalism.
        </p>
      </section>
    </div>
  );
}
