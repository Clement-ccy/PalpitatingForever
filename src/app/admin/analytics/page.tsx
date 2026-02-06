'use client';

import { useEffect, useState } from 'react';
import { AdminGuard } from '@/components/admin/AdminGuard';
import {
  fetchUmamiOverview,
  fetchUmamiPages,
  fetchUmamiReferrers,
  fetchUmamiDevices,
  fetchUmamiOs,
  fetchUmamiBrowsers,
  fetchUmamiCountries,
  fetchUmamiEvents,
  fetchUmamiTimeseries,
  fetchUmamiRetention,
  type AnalyticsItem,
  type AnalyticsOverview,
  type TimeseriesPoint,
  type RetentionPoint,
} from '@/lib/admin/analytics-client';

export default function AdminAnalyticsPage() {
  const [overview, setOverview] = useState<AnalyticsOverview | null>(null);
  const [pages, setPages] = useState<AnalyticsItem[]>([]);
  const [referrers, setReferrers] = useState<AnalyticsItem[]>([]);
  const [devices, setDevices] = useState<AnalyticsItem[]>([]);
  const [oses, setOses] = useState<AnalyticsItem[]>([]);
  const [browsers, setBrowsers] = useState<AnalyticsItem[]>([]);
  const [countries, setCountries] = useState<AnalyticsItem[]>([]);
  const [events, setEvents] = useState<AnalyticsItem[]>([]);
  const [timeseries, setTimeseries] = useState<TimeseriesPoint[]>([]);
  const [retention, setRetention] = useState<RetentionPoint[]>([]);
  const [range, setRange] = useState(30);
  const csrf = typeof window !== 'undefined' ? sessionStorage.getItem('pf_admin_csrf') ?? '' : '';

  useEffect(() => {
    if (!csrf) return;
    const end = Math.floor(Date.now() / 1000);
    const start = end - range * 86400;
    fetchUmamiOverview(csrf, { start, end }).then((data) => data && setOverview(data));
    fetchUmamiPages(csrf, { start, end }).then(setPages);
    fetchUmamiReferrers(csrf, { start, end }).then(setReferrers);
    fetchUmamiDevices(csrf, { start, end }).then(setDevices);
    fetchUmamiOs(csrf, { start, end }).then(setOses);
    fetchUmamiBrowsers(csrf, { start, end }).then(setBrowsers);
    fetchUmamiCountries(csrf, { start, end }).then(setCountries);
    fetchUmamiEvents(csrf, { start, end }).then(setEvents);
    fetchUmamiTimeseries(csrf, { start, end }).then(setTimeseries);
    fetchUmamiRetention(csrf, { start, end }).then(setRetention);
  }, [csrf, range]);

  return (
    <AdminGuard>
      <div className="space-y-6">
        <header>
          <p className="text-xs font-mono text-muted uppercase tracking-widest">Analytics</p>
          <h1 className="text-3xl font-semibold text-foreground">Overview</h1>
        </header>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-mono text-muted uppercase tracking-widest">Analytics</p>
            <h1 className="text-3xl font-semibold text-foreground">Overview</h1>
          </div>
          <RangeSelect value={range} onChange={setRange} />
        </div>

        <TrendCard title="Trend" series={timeseries} />
        <RetentionCard title="Retention" series={retention} />

        <div className="rounded-3xl border border-card-border bg-card/40 p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['Pageviews', 'Visitors', 'Visits', 'Events'].map((label, index) => (
              <div key={label} className="rounded-2xl border border-card-border bg-background/40 p-4">
                <p className="text-xs font-mono text-muted uppercase tracking-widest">{label}</p>
                <p className="mt-3 text-2xl font-semibold text-foreground">
                  {overview ? Object.values(overview)[index] : '--'}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AnalyticsPanel title="Top Pages" items={pages} valueKey="views" />
          <AnalyticsPanel title="Referrers" items={referrers} valueKey="views" />
          <AnalyticsPanel title="Devices" items={devices} valueKey="count" />
          <AnalyticsPanel title="OS" items={oses} valueKey="count" />
          <AnalyticsPanel title="Browsers" items={browsers} valueKey="count" />
          <AnalyticsPanel title="Countries" items={countries} valueKey="count" />
          <AnalyticsPanel title="Events" items={events} valueKey="count" />
        </div>
      </div>
    </AdminGuard>
  );
}

function AnalyticsPanel({
  title,
  items,
  valueKey,
}: {
  title: string;
  items: AnalyticsItem[];
  valueKey: 'views' | 'visitors' | 'count';
}) {
  return (
    <div className="rounded-3xl border border-card-border bg-card/40 p-6">
      <div className="flex items-center justify-between">
        <p className="text-xs font-mono text-muted uppercase tracking-widest">{title}</p>
        <span className="text-xs text-muted">Top {items.length}</span>
      </div>
      <div className="mt-4 space-y-2 text-sm">
        {items.length === 0 ? (
          <p className="text-muted">No data.</p>
        ) : (
          items.map((item) => (
            <div key={`${title}-${item.name}`} className="flex items-center justify-between">
              <span className="text-foreground/80 truncate max-w-[70%]">{String(item.name || 'unknown')}</span>
              <span className="font-mono text-muted">
                {valueKey === 'views' ? item.views ?? 0 : valueKey === 'visitors' ? item.visitors ?? 0 : item.count ?? 0}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function RangeSelect({ value, onChange }: { value: number; onChange: (next: number) => void }) {
  return (
    <div className="flex items-center gap-2 text-xs font-mono text-muted">
      <span>Range</span>
      {[7, 30, 90].map((days) => (
        <button
          key={days}
          type="button"
          onClick={() => onChange(days)}
          className={
            `px-2 py-1 rounded-full border ${value === days ? 'bg-foreground text-background border-foreground' : 'border-card-border text-muted'}`
          }
        >
          {days}d
        </button>
      ))}
    </div>
  );
}

function TrendCard({ title, series }: { title: string; series: TimeseriesPoint[] }) {
  const max = Math.max(1, ...series.map((point) => point.pageviews));
  return (
    <div className="rounded-3xl border border-card-border bg-card/40 p-6">
      <div className="flex items-center justify-between">
        <p className="text-xs font-mono text-muted uppercase tracking-widest">{title}</p>
        <span className="text-xs text-muted">Pageviews</span>
      </div>
      <div className="mt-4 grid grid-cols-[repeat(auto-fit,minmax(6px,1fr))] gap-1 h-24 items-end">
        {series.length === 0 ? (
          <p className="text-muted text-sm">No data.</p>
        ) : (
          series.map((point) => (
            <div
              key={point.day}
              className="rounded bg-foreground/60"
              style={{ height: `${Math.max(4, (point.pageviews / max) * 100)}%` }}
              title={`${point.day}: ${point.pageviews}`}
            />
          ))
        )}
      </div>
    </div>
  );
}

function RetentionCard({ title, series }: { title: string; series: RetentionPoint[] }) {
  const max = Math.max(1, ...series.map((point) => point.visitors));
  return (
    <div className="rounded-3xl border border-card-border bg-card/40 p-6">
      <div className="flex items-center justify-between">
        <p className="text-xs font-mono text-muted uppercase tracking-widest">{title}</p>
        <span className="text-xs text-muted">Distinct visitors</span>
      </div>
      <div className="mt-4 grid grid-cols-[repeat(auto-fit,minmax(6px,1fr))] gap-1 h-24 items-end">
        {series.length === 0 ? (
          <p className="text-muted text-sm">No data.</p>
        ) : (
          series.map((point) => (
            <div
              key={point.day}
              className="rounded bg-accent-works/60"
              style={{ height: `${Math.max(4, (point.visitors / max) * 100)}%` }}
              title={`${point.day}: ${point.visitors}`}
            />
          ))
        )}
      </div>
    </div>
  );
}
