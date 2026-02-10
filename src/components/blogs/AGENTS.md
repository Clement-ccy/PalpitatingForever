# BLOG COMPONENTS NOTES

## OVERVIEW
Blog list, timeline, and sidebar widgets for the blogs section.

## WHERE TO LOOK
| Task | Location | Notes |
|------|----------|-------|
| Theme tokens | `theme.ts` | Accent + soft background classes |
| Main list | `main/PostList.tsx` | Bento grid of posts + pagination |
| Hot picks banner | `main/HotPicksBanner.tsx` | Rotating featured posts |
| Sidebar widgets | `main/SidebarWidgets.tsx` | Tags, stats, sponsor, QR |
| Timeline | `timeline/TimelineView.tsx` | Split timeline + preview card |
| View toggle | `ViewToggle.tsx` | Switch between main/timeline |

## CONVENTIONS
- Blog view uses `BlogItem = NotionPage & { theme: string }`.
- Theme classes come from `BLOG_THEME_TOKENS`.
- Use `SpotlightCard` for card surfaces.

## ANTI-PATTERNS
- Avoid pulling raw Notion objects into UI; map first.
