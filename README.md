<!-- plato-system/README.md -->
# Plato System

Next.js monolith (App Router) + internal API Routes + PostgreSQL (Prisma) + Vercel deployment.

This repository is structured for a production dashboard that tracks AI usage/cost, budgets, alerts, reports/exports, integrations, billing, and audit logs.

## Local run

1) Install
- `npm i`

2) Configure
- copy `.env.example` to `.env` and fill values

3) DB
- `npm run prisma:generate`
- `npm run db:push` (or `npm run prisma:migrate` in production)

4) Start
- `npm run dev`

## Production (Vercel)

- Set Environment Variables in Vercel (same keys as `.env.example`)
- Use `npm run build` as Build Command
- Use `npm run start` as Start Command (Vercel handles this automatically for Next.js)

## Notes

- Protected pages are gated by a `plato_session` cookie in `middleware.ts`.
- API routes are not gated by middleware; authentication/authorization is enforced inside route handlers.
