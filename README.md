# ВАРКА — сайт кофейни + CRM

Next.js демо: публичный сайт (меню, заказ, бронь) и админка CRM с live-уведомлениями.

## Стек

- Next.js 16 + Tailwind CSS 4
- Prisma + **локальный PostgreSQL**
- NextAuth: **Google** + **email/пароль**
- SSE-уведомления в CRM (`pg_notify` + snapshot)

## Быстрый старт

1. PostgreSQL должен быть запущен.
2. В `.env` укажите `DATABASE_URL` на базу `varka_coffee`.
3. Установите и поднимите:

```bash
npm install
npx prisma migrate dev
npm run db:seed
npm run dev
```

Сайт: [http://localhost:3000](http://localhost:3000)  
CRM: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

**Пароль:** `admin@varka.cafe` / `varka2026`  
**Google:** задайте `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`, `ADMIN_EMAILS`.  
Redirect URI: `{AUTH_URL}/api/auth/callback/google`

В CRM включите «звук вкл» — тосты, звук и browser Notification на новые заказы/брони.

## Neon / Supabase

Схема уже `postgresql`. Достаточно сменить URL в `.env`:

```env
# Neon
DATABASE_URL="postgresql://USER:PASS@ep-xxx.region.aws.neon.tech/neondb?sslmode=require"

# Supabase
DATABASE_URL="postgresql://postgres.PROJECT:PASS@aws-0-REGION.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.PROJECT:PASS@aws-0-REGION.pooler.supabase.com:5432/postgres"
```

Затем: `npx prisma migrate deploy && npm run db:seed`

Тексты кофейни — `src/lib/site.ts`.
# varka-coffee
