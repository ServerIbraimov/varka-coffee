# ВАРКА

Сайт кофейни + CRM (Next.js, Prisma, Neon).

## Локально

```bash
npm install
cp .env.example .env
npx prisma migrate deploy
npm run db:seed
npm run dev
```

CRM: `/admin/login` · `admin@varka.cafe` / `varka2026`

## Vercel

1. Импортируйте репо, Framework: Next.js.
2. Env: `DATABASE_URL`, `DIRECT_URL`, `AUTH_SECRET`, `AUTH_URL`, опционально Google.
3. После первого деплоя: `npx prisma migrate deploy && npm run db:seed` (локально против Neon) или Vercel CLI.
4. Google redirect: `{AUTH_URL}/api/auth/callback/google`
