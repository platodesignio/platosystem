# Plato System

AI Cost Control SaaS

Plato System is a minimal AI execution gateway with strict cost control.
It prevents token overuse, enforces monthly limits, and provides full usage visibility.

---

## Architecture

Next.js (App Router)
Internal API Routes
PostgreSQL
Prisma ORM
JWT Authentication
OpenAI Integration

Monolithic deployment model optimized for Vercel.

---

## Features

- User authentication (JWT + httpOnly cookie)
- Monthly spending limit enforcement
- Per-request token limit enforcement
- Token usage estimation
- Real token usage validation
- Cost calculation (prompt / completion separated)
- API key management (hashed storage)
- Execution history tracking
- Model usage breakdown
- Dashboard analytics

---

## Requirements

Node.js >= 18.17
PostgreSQL database
OpenAI API key

---

## Environment Variables

Create `.env.local`:

