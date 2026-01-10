# Stripe

## Environment variables
Set these in `.env.local` (see `.env.example`):

- `NEXT_PUBLIC_APP_URL` (used for success/cancel URLs)
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (client)
- `STRIPE_SECRET_KEY` (server)
- `STRIPE_WEBHOOK_SECRET` (server)
- `STRIPE_BASIC_PRICE_ID` (server)
- `STRIPE_STARTER_PRICE_ID` (server)
- `STRIPE_GROWTH_PRICE_ID` (server)

## Routes
- `POST /api/checkout` → creates a Stripe Checkout Session (subscription) and persists a `Purchase`
  - body: `{ planKey: "basic" | "starter" | "growth", configId?: string }`
  - response: `{ url: string | null }`
- `POST /api/stripe/webhook` → Stripe webhook receiver (signature verified)
  - handles: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`

## Local webhook testing
1. Install Stripe CLI.
2. Run: `stripe listen --forward-to http://localhost:3000/api/stripe/webhook`
3. Copy the printed signing secret into `STRIPE_WEBHOOK_SECRET`.

## Idempotency
- `checkout.session.completed` upserts by `stripeCheckoutSessionId`.
- Subscription events update by `stripeSubscriptionId` via `updateMany`.

