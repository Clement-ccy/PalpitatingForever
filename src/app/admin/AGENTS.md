# ADMIN APP NOTES

## OVERVIEW
Admin pages for login, dashboard, analytics, comments, and settings.

## WHERE TO LOOK
| Task | Location | Notes |
|------|----------|-------|
| Login | `page.tsx` | Login/register flow + CSRF set |
| Dashboard | `dashboard/page.tsx` | Overview cards + links |
| Analytics | `analytics/page.tsx` | Umami analytics panels |
| Comments | `comments/page.tsx` | Moderation + analytics |
| Settings | `settings/page.tsx` | Key/value editor |
| Layout | `layout.tsx` | Admin shell wrapper |
| Styles | `globals.css` | Admin-specific resets |

## CONVENTIONS
- All pages wrapped by `AdminGuard` except login.
- Reads CSRF from `sessionStorage` key `pf_admin_csrf`.
