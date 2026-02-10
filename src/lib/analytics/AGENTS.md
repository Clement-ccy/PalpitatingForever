# ANALYTICS LIB NOTES

## OVERVIEW
Client wrappers for pageview and event tracking.

## WHERE TO LOOK
| Task | Location | Notes |
|------|----------|-------|
| Client | `client.ts` | `collectAnalytics`, `trackEvent` |
| Types | `types.ts` | Payload shapes |

## CONVENTIONS
- `collectAnalytics` dedupes pageviews via sessionStorage.
