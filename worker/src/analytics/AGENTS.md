# WORKER ANALYTICS NOTES

## OVERVIEW
Analytics endpoints + rollup jobs for pageviews/events.

## WHERE TO LOOK
| Task | Location | Notes |
|------|----------|-------|
| Handlers | `handlers.ts` | Collect/event + umami breakdowns |

## CONVENTIONS
- Scheduled retention runs from `worker/src/index.ts`.
