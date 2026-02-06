This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Analytics + Comments (Worker v1)

### Environment variables
```bash
# Frontend
NEXT_PUBLIC_API_BASE_URL=https://api.ccy.asia

# Worker
SITE_SLUG=main
ADMIN_SESSION_SECRET=***
DATA_SECRET=***
ADMIN_SETUP_TOKEN=***
```

### Migrations
```bash
npx wrangler d1 migrations apply pf-database --local
npx wrangler d1 migrations apply pf-database --remote
```

### Cron
Daily rollup + retention cleanup runs at **00:10 Asia/Shanghai** via `wrangler.toml` cron.

### Admin subdomain
Admin runs on **admin.ccy.asia** (host-based routing in `src/middleware.ts`).

### Admin setup (one-time)
```bash
curl -X POST https://api.ccy.asia/v1/admin/auth/setup \
  -H "Authorization: Bearer $ADMIN_SETUP_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"username":"Clement-ccy","password":"<REDACTED>"}'
```

### Admin UI registration
- Visit https://admin.ccy.asia
- Register tab is enabled only before setup is disabled

## Local Worker + D1 (single DB)

### Create local database
```bash
npx wrangler d1 create pf-database --local
```

### Apply migrations (local)
```bash
npx wrangler d1 migrations apply pf-database --local
```

### Optional reset helper
```bash
# PowerShell
./scripts/reset-local-d1.ps1

# bash
./scripts/reset-local-d1.sh
```

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
