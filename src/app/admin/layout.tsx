import './globals.css';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="min-h-screen bg-background text-foreground font-sans">
      <main className="mx-auto w-full max-w-6xl px-6 py-12">
        {children}
      </main>
    </section>
  );
}
