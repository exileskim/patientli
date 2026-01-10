Patientli marketing + Looks platform (Next.js App Router).

## Getting Started

### Prereqs
- Node.js 20+
- (Optional) Docker Desktop for local Postgres

### Setup
Run:

```bash
./scripts/dev-setup.sh
```

This will install dependencies, create `.env.local` from `.env.example`, and (if Docker is running) start Postgres and run Prisma migrate + seed.

### Dev server
Run:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## App routes
- Looks gallery: `/looks`
- Configurator: `/looks/[slug]`
- Pricing: `/pricing`
- Client portal: `/app`

## Auth in dev
If `RESEND_API_KEY` / `RESEND_FROM` are not set, magic-link URLs are printed to the server logs for local testing.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
