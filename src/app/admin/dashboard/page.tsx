'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { BarChart3, MessageCircle, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AdminGuard } from '@/components/admin/AdminGuard';
import { fetchAdminOverview } from '@/lib/admin/client';
import type { AdminOverview } from '@/lib/admin/types';

export default function AdminDashboardPage() {
  const [overview, setOverview] = useState<AdminOverview | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const csrf = sessionStorage.getItem('pf_admin_csrf') ?? '';
    fetchAdminOverview(csrf).then((data) => {
      if (data) setOverview(data);
    })
      .finally(() => setLoading(false));
  }, []);

  return (
    <AdminGuard>
      <div className="space-y-10">
        <header className="flex flex-col gap-2">
          <p className="text-xs font-mono text-muted uppercase tracking-widest">Admin Console</p>
          <h1 className="text-3xl font-semibold text-foreground">Dashboard</h1>
        </header>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {['Pageviews', 'Visitors', 'Visits', 'Events'].map((label, index) => (
          <div key={label} className="rounded-2xl border border-card-border bg-card/40 p-4">
            <p className="text-xs font-mono text-muted uppercase tracking-widest">{label}</p>
            <p className="mt-3 text-2xl font-semibold text-foreground">
              {loading ? '--' : (overview ? Object.values(overview)[index] : 0)}
            </p>
          </div>
        ))}
      </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Link href="/admin/analytics" className={cn('rounded-3xl border border-card-border bg-background/40 p-6 hover:bg-background/60 transition-colors')}>
            <div className="flex items-center gap-3">
              <BarChart3 size={20} />
              <div>
                <p className="text-sm font-semibold">Analytics</p>
                <p className="text-xs text-muted">Pageviews, referrers, events</p>
              </div>
            </div>
          </Link>
          <Link href="/admin/comments" className="rounded-3xl border border-card-border bg-background/40 p-6 hover:bg-background/60 transition-colors">
            <div className="flex items-center gap-3">
              <MessageCircle size={20} />
              <div>
                <p className="text-sm font-semibold">Comments</p>
                <p className="text-xs text-muted">Moderate and review</p>
              </div>
            </div>
          </Link>
          <Link href="/admin/settings" className="rounded-3xl border border-card-border bg-background/40 p-6 hover:bg-background/60 transition-colors">
            <div className="flex items-center gap-3">
              <Settings size={20} />
              <div>
                <p className="text-sm font-semibold">Settings</p>
                <p className="text-xs text-muted">Configure features</p>
              </div>
            </div>
          </Link>
        </section>
      </div>
    </AdminGuard>
  );
}
