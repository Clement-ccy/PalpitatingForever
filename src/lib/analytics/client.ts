import type { AnalyticsCollectPayload, AnalyticsEventPayload } from './types';

const PAGEVIEW_KEY_VERSION = 2;
const pageviewKey = (site: string, path: string) => `pf:pv:${PAGEVIEW_KEY_VERSION}:${site}:${path}`;
const inFlightPageviews = new Set<string>();

const hasTrackedPageview = (site: string, path: string) => {
  if (typeof window === 'undefined') return false;
  try {
    return sessionStorage.getItem(pageviewKey(site, path)) === '1';
  } catch {
    return false;
  }
};

const markPageviewTracked = (site: string, path: string) => {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.setItem(pageviewKey(site, path), '1');
  } catch {
    // Ignore storage write failures (Safari private mode, quota, etc.)
  }
};

export async function collectAnalytics(payload: AnalyticsCollectPayload): Promise<void> {
  try {
    if (!payload.site || !payload.path) return;
    const finalPayload = payload;
  const key = pageviewKey(payload.site, payload.path);
    if (inFlightPageviews.has(key)) return;
    if (hasTrackedPageview(payload.site, payload.path)) return;
    inFlightPageviews.add(key);
    const response = await fetch('/api/analytics/collect', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(finalPayload),
      keepalive: true,
      credentials: 'include',
    });
    if (response.ok) {
      markPageviewTracked(payload.site, payload.path);
      inFlightPageviews.delete(key);
    } else {
      inFlightPageviews.delete(key);
    }
  } catch (error) {
    if (payload.site && payload.path) {
      inFlightPageviews.delete(pageviewKey(payload.site, payload.path));
    }
    console.error('Failed to collect analytics', error);
  }
}

export async function trackEvent(payload: AnalyticsEventPayload): Promise<void> {
  try {
    if (!payload.site || !payload.name || !payload.path) return;
    const finalPayload = payload;
    await fetch('/api/analytics/event', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(finalPayload),
      keepalive: true,
      credentials: 'include',
    });
  } catch (error) {
    console.error('Failed to track event', error);
  }
}
