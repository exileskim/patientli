# Runbook

## Local dev

### Prereqs
- Node.js 20+
- (Optional) Docker Desktop for local Postgres

### Setup
- `./scripts/dev-setup.sh`
- Start dev server: `npm run dev`

### Database
- Start Postgres (optional): `docker compose up -d`
- Run migrations: `npm run db:migrate`
- Seed Looks: `npm run db:seed`

## Auth (magic link + Google)

- Magic link auth is enabled by default.
- In local dev, if `RESEND_API_KEY` and `RESEND_FROM` are not set, the login link is printed to the server logs:
  - Look for: `[auth] Magic link for you@example.com: https://...`
- Google sign-in is enabled only when `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are set.

## Looks flow

- Configure a Look: `/looks/[slug]`
- Save + continue to pricing: `/pricing?configId=...`
- Client portal dashboard: `/app`

## Stripe

See `docs/stripe.md`.

