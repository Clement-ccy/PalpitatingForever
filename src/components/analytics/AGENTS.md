# ANALYTICS COMPONENTS NOTES

## OVERVIEW
Client-side tracker for pageviews and route metadata.

## WHERE TO LOOK
| Task | Location | Notes |
|------|----------|-------|
| Tracker | `AnalyticsTracker.tsx` | Pageview + title/description sync |

## CONVENTIONS
- Skips admin routes.
- Uses `collectAnalytics` from `lib/analytics/client`.
