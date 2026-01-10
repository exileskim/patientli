# Patientli Platform Plan (LLM-Ready)

> **Audience:** GPT‑5.2 (lead dev) + human reviewers
>
> **Primary objective:** turn the existing Next.js marketing shell into a production-grade, token-driven **Patientli Looks** purchase + editing platform, with an architecture that can safely expand into the **Attribution CRM** without rework.
>
> **Inputs used:**
> - Product requirements for Looks platform (Phase 1 + 2)
> - Product requirements for Healthcare Attribution CRM (separate initiative)
> - Current `patientli` Next.js codebase snapshot (from `patientli.zip`)

---

## 0. Non-negotiable outcomes

1. **Token-driven theming**: No customer-facing design edits require writing CSS. All visuals derive from validated token schemas.
2. **Deterministic preview**: Given `(lookVersion, tokenOverrides, contentOverrides)`, preview renders identically every time.
3. **Config portability**: A saved config is a compact JSON document with versioning that can be exported/imported.
4. **Strict boundaries for compliance**:
   - Looks platform stores only non-PHI practice marketing data (name/phone/address/logo).
   - CRM handles PHI, audit logging, and HIPAA-ready infrastructure.
   - Code/org structure must keep the PHI surface area isolated.
5. **LLM-operable codebase**: modular boundaries, typed schemas, consistent patterns, and runnable test/seed scripts.

---

## 1. Current codebase audit (what exists today)

### Stack (as shipped)
- Next.js App Router (`next@16.1.1`)
- React (`react@19.2.3`)
- Tailwind v4 (CSS-first via `@import "tailwindcss"` and `@theme inline` in `globals.css`)
- `next-auth@4.24.13` installed; UI pages exist but **no auth route handler configured**
- Stripe SDKs installed; pricing UI calls `/api/checkout` but **no API routes implemented**

### Implemented UI routes
- Marketing shell: `/`, `/services`, `/resources`, `/solutions/*`, `/work/*`
- Looks catalog/detail: `/looks`, `/looks/[slug]` (currently hard-coded preview mockups)
- Pricing: `/pricing` (calls missing `/api/checkout`)
- Auth UI: `/auth/signin`, `/account` (assumes NextAuth is configured)
- Checkout success page exists: `/checkout/success`

### Known issues / debt
- **CSS token mismatch**: pages use `--color-accent-dark` but `globals.css` defines `--color-accent-hover`.
- Content is inconsistent: some pages use JSON (`services.json`), others use hard-coded maps.
- `node_modules` inside the zip is not executable (permission/packaging); dev setup must reinstall dependencies.
- Dynamic routes type `params` as `Promise<{slug}>` in places; standardize to Next.js expected shapes.

---

## 2. Product scope

### Track A — Patientli Looks (this repo’s primary near-term scope)

**Phase 1 (pre-sale)**
- Public gallery of Looks
- Interactive configurator:
  - practice personalization (name/phone/address + optional logo)
  - design controls (font pair, palette variant, image pack)
  - real-time preview (desktop + mobile)
  - reversible changes + reset
  - shareable link
- Checkout:
  - Stripe Checkout for subscription plans
  - store selected config
  - webhook-driven purchase activation

**Phase 2 (post-purchase)**
- Authenticated dashboard
- Token + content editing
- Versioning/rollback
- Support escalation

**Phase 2.5 (AI edits)**
- Natural language instructions → typed diffs (tokens/content)
- Mandatory preview + approval
- Audit log of prompts + applied diffs

### Track B — Healthcare Attribution CRM (separate initiative; plan included here for foundation)

**MVP**
- Auth + RBAC + audit logs
- Open Dental ingestion
- Marketing lead ingestion (Google Ads, forms, calls)
- Attribution matching (phone/email/name+date + manual override)
- Dashboards + exports

**Key constraint:** CRM is PHI-bearing; hosting + logging + access must be HIPAA-ready.

---

## 3. Architecture strategy

### 3.1 Principle: modular monolith now, with a clean split line later

Implement Looks platform as a modular monolith in this Next.js repo. Build CRM either:
- **Option 1 (recommended for compliance):** separate app/deployment (`apps/crm` in a monorepo or a separate repo) with HIPAA-ready infra.
- **Option 2:** same repo but strict route-group isolation + separate deployment target; still treat CRM as a different security zone.

The plan below assumes **Option 1**, but all DB schemas and shared identity concepts are designed so Option 2 remains possible.

### 3.2 High-level components

**Public web (marketing + Looks pre-sale)**
- Next.js pages (SSG/SSR)
- Reads Looks + content packs
- Writes anonymous configs (optional)

**Identity + Billing**
- NextAuth (email magic link + Google)
- Stripe subscriptions

**Looks config service (DB)**
- Postgres
- Prisma
- Stores Look configs, revisions, purchases

**Dashboard**
- Authenticated UI for token/content edits + support

**(Future) CRM service**
- Separate Next.js app + API
- Postgres (separate DB or separate schema)
- Job runner / queue
- Integrations (Open Dental, Google Ads)

---

## 4. Repository organization (LLM-friendly)

### 4.1 Target structure

Keep `src/app` lean; move domain logic into modules.

```
src/
  app/
    (marketing)/...
    (looks)/...
    (app)/...              # authenticated dashboard (Looks)
    api/
      checkout/route.ts
      stripe/webhook/route.ts
      auth/[...nextauth]/route.ts
  modules/
    looks/
      domain/
        tokens.schema.ts
        content.schema.ts
        look.schema.ts
        config.schema.ts
      server/
        looks.repo.ts
        configs.repo.ts
        purchases.repo.ts
        stripe.service.ts
      ui/
        Configurator/
        DemoPreview/
        controls/
    support/
      server/
      ui/
  lib/
    db/
      prisma.ts
    env.ts
    id.ts
    base64url.ts
    logger.ts
  content/
    looks.json
    industries/
      dental.json
      optometry.json
    templates/
      siteSchema.v1.json
```

### 4.2 Documentation for LLM dev

Add and maintain:
- `docs/adr/*.md` (architecture decisions)
- `docs/runbook.md` (how to run, deploy, debug)
- `docs/security.md` (PHI boundaries, logging policy)
- `docs/stripe.md` (prices, webhooks, events)
- `docs/tokens.md` (token schema + mapping)

**Rule:** every time an invariant changes, update the relevant doc + add ADR.

---

## 5. Data model (Looks + shared identity)

### 5.1 Multi-tenant identity (shared foundation)

Even if Looks is initially single-tenant, implement a minimal multi-tenant model now to avoid refactors.

Entities:
- **User**: authenticated principal
- **Org**: agency or practice org
- **Membership**: user ↔ org with role
- **Practice**: the customer practice profile (non-PHI marketing data for Looks)

Roles (minimum):
- `ORG_ADMIN`
- `ORG_MEMBER`
- `READ_ONLY` (Phase 2)

### 5.2 Looks entities

- **Look**: stable identity (`slug`)
- **LookVersion**: versioned tokens + templates (`lookId`, `version`, `status`)
- **LookConfig**: customer configuration (references `lookVersionId`)
- **LookConfigRevision**: immutable revision snapshots
- **Purchase**: Stripe linkage, plan, status

### 5.3 Suggested Prisma schema (skeleton)

> This is an implementation sketch; exact fields may evolve. Keep configs as JSON but validated by zod before write.

```prisma
model User {
  id            String   @id @default(cuid())
  email         String   @unique
  name          String?
  image         String?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  memberships   Membership[]
  purchases     Purchase[]
}

model Org {
  id        String   @id @default(cuid())
  name      String
  type      OrgType
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  memberships Membership[]
  practices   Practice[]
  purchases   Purchase[]
}

enum OrgType {
  AGENCY
  PRACTICE
}

model Membership {
  id        String   @id @default(cuid())
  userId    String
  orgId     String
  role      OrgRole
  createdAt DateTime @default(now())

  user User @relation(fields: [userId], references: [id])
  org  Org  @relation(fields: [orgId], references: [id])

  @@unique([userId, orgId])
  @@index([orgId])
}

enum OrgRole {
  ORG_ADMIN
  ORG_MEMBER
  READ_ONLY
}

model Practice {
  id        String   @id @default(cuid())
  orgId     String

  // Non-PHI marketing profile (Looks)
  name      String
  phone     String?
  address1  String?
  address2  String?
  city      String?
  state     String?
  zip       String?
  logoUrl   String?

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  org Org @relation(fields: [orgId], references: [id])

  @@index([orgId])
}

model Look {
  id        String   @id @default(cuid())
  slug      String   @unique
  title     String
  createdAt DateTime @default(now())

  versions  LookVersion[]
}

model LookVersion {
  id        String   @id @default(cuid())
  lookId    String
  version   Int
  status    LookVersionStatus @default(DRAFT)

  // Validated JSON blobs
  tokenSchemaVersion Int
  baseTokens Json
  templateManifest Json
  contentPackManifest Json

  createdAt DateTime @default(now())

  look Look @relation(fields: [lookId], references: [id])

  @@unique([lookId, version])
  @@index([lookId, status])
}

enum LookVersionStatus {
  DRAFT
  PUBLISHED
  ARCHIVED
}

model LookConfig {
  id            String   @id @default(cuid())
  lookVersionId String
  orgId         String?
  practiceId    String?
  createdByUserId String?

  // config = overrides + practice personalization + chosen layout
  config Json

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  lookVersion LookVersion @relation(fields: [lookVersionId], references: [id])
  org         Org?        @relation(fields: [orgId], references: [id])
  practice    Practice?   @relation(fields: [practiceId], references: [id])

  revisions LookConfigRevision[]
  purchases Purchase[]

  @@index([orgId])
  @@index([practiceId])
  @@index([lookVersionId])
}

model LookConfigRevision {
  id         String   @id @default(cuid())
  configId   String
  revision   Int
  snapshot   Json
  createdAt  DateTime @default(now())
  createdByUserId String?

  config LookConfig @relation(fields: [configId], references: [id])

  @@unique([configId, revision])
  @@index([configId])
}

model Purchase {
  id            String   @id @default(cuid())
  userId        String?
  orgId         String?
  configId      String?

  planKey       String
  status        PurchaseStatus

  stripeCheckoutSessionId String @unique
  stripeCustomerId        String?
  stripeSubscriptionId    String?

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  user   User?      @relation(fields: [userId], references: [id])
  org    Org?       @relation(fields: [orgId], references: [id])
  config LookConfig? @relation(fields: [configId], references: [id])

  @@index([orgId])
  @@index([userId])
  @@index([configId])
}

enum PurchaseStatus {
  PENDING
  ACTIVE
  CANCELED
  PAST_DUE
}

model AuditLog {
  id        String   @id @default(cuid())
  actorUserId String?
  orgId     String?
  action    String
  targetType String
  targetId  String?
  metadata  Json?
  createdAt DateTime @default(now())

  @@index([orgId, createdAt])
}
```

---

## 6. Token system design (Looks)

### 6.1 Token schema goals
- Typed and validated (zod)
- Small, composable, versioned
- Supports:
  - palette variants
  - font pairs
  - radius/spacing scales
  - component-specific tokens (optional)
  - image style packs (references to asset IDs)

### 6.2 Recommended token schema v1

**Design tokens (core)**
- `color`: `{ primary, accent, bg, surface, text, muted, border }`
- `typography`: `{ headingFamily, bodyFamily, headingWeight?, bodyWeight? }`
- `radius`: `{ sm, md, lg, xl, pill }` OR a scale seed
- `spacing`: `{ xs, sm, md, lg, xl }` OR a scale seed
- `shadow`: `{ sm, md, lg }`

**Derived tokens (generated, never hand-authored)**
- `accentHover` (computed from `accent`)
- `primaryLight/primaryDark`
- contrast-checked `textOnPrimary`, `textOnAccent`

**Image pack tokens**
- `imagery`: `{ packId, rules: { saturation, contrast, cropStyle, subjectDiversityTags } }`

### 6.3 Mapping tokens → CSS variables

- Keep Tailwind v4 `@theme inline` as the *default Patientli marketing theme*.
- For Looks previews, inject a **scoped CSS variable set** on a container element:

```tsx
<div
  data-look-preview
  style={cssVarsFromTokens(mergedTokens)}
>
  <DemoSite />
</div>
```

This prevents the marketing shell from retheming.

### 6.4 Token overrides as patches

Store overrides as *deltas*:

```ts
type TokenOverrides = Partial<LookTokens>;
```

Persist a config document like:

```json
{
  "lookSlug": "luna-smiles",
  "lookVersion": 1,
  "overrides": {
    "color": { "accent": "#E8F59E" },
    "typography": { "headingFamily": "IvyPresto Display" }
  },
  "practice": {
    "name": "Forestville Family Dentistry",
    "phone": "(555) 555-5555",
    "city": "Forestville",
    "state": "CA"
  },
  "layout": {
    "home": "home.v1.hero-left",
    "services": "services.v1.grid"
  }
}
```

### 6.5 Fix immediately

Unify the accent hover variable:
- Replace all `--color-accent-dark` usages with `--color-accent-hover`, **or**
- Define `--color-accent-dark` in `globals.css` as an alias.

Pick one and enforce with a lint rule (search-based CI check).

---

## 7. Content system (industry + practice personalization)

### 7.1 Content requirements
- Industry/specialty selection should populate:
  - hero messaging
  - service descriptions
  - imagery suggestions
- Practice personalization should update:
  - name, address, phone site-wide
  - logo

### 7.2 Data representation (v1)

Start with structured JSON content packs and a small section schema. Introduce a headless CMS only when the post-purchase editor requires non-technical editing by humans.

**Industry content pack (example)**
`src/content/industries/dental.json`

```json
{
  "industryId": "dental",
  "defaultServices": [
    {"id": "cleanings", "title": "Cleanings", "blurb": "..."}
  ],
  "hero": {
    "headline": "Modern dentistry for busy families",
    "subheadline": "Same-week appointments. Transparent pricing."
  },
  "seo": {
    "defaultTitle": "Dentist in {{city}}, {{state}} | {{practiceName}}"
  }
}
```

### 7.3 Content tokens

Treat these as first-class tokens:
- `practiceName`, `phone`, `address`, `city`, `state`
- `services[]`, `staff[]`

Never allow “global find/replace in HTML”; always edit structured fields.

---

## 8. Phase 1 (Looks pre-sale) — Detailed implementation plan

### 8.1 Definition of done (Phase 1)

**Buyer-facing demo**
- Browse Looks (`/looks`)
- Open a Look configurator (`/looks/[slug]` becomes real configurator)
- Enter practice personalization (name, phone, city/state; logo optional)
- Change at least two style controls (palette + fonts)
- See real-time preview (desktop + mobile)
- Copy a shareable URL that reconstructs the config

**Checkout + persistence**
- Select a plan and complete Stripe Checkout
- Webhook creates Purchase + links config
- Success page verifies session and shows next steps

**Operational correctness**
- Webhook verification works and is idempotent
- No PHI stored

### 8.2 UI architecture

**Configurator page** (`/looks/[slug]`)
- Left: preview (desktop/mobile tabs)
- Right: controls

Controls v1:
- Practice: name, phone, city, state (logo upload optional)
- Style:
  - palette variant selector
  - font pair selector
  - image pack selector (placeholder ok)

### 8.3 URL sharing

- Encode config patch into `c=` query param using base64url
- Validate decoded config with zod
- Enforce max length (e.g. 2KB). If exceeded:
  - POST `/api/configs` to store config
  - share `id=` param instead

### 8.4 Persistence & API routes

Implement route handlers:

- `POST /api/configs`
  - body: `{ lookSlug, lookVersion, configPatch }`
  - returns: `{ id }`

- `POST /api/checkout`
  - body: `{ planKey, config: { id? | inline? } }`
  - server creates/ensures config exists
  - creates Stripe Checkout session
  - returns: `{ url }`

- `POST /api/stripe/webhook`
  - verifies signature
  - handles `checkout.session.completed`
  - upserts Purchase with idempotency keyed on Stripe event id and session id

### 8.5 Stripe details

Use env-driven price IDs:
- `STRIPE_BASIC_PRICE_ID`
- `STRIPE_STARTER_PRICE_ID`
- `STRIPE_GROWTH_PRICE_ID`

Checkout session metadata:
- `configId`
- `planKey`
- `lookSlug`
- `lookVersion`

Success page:
- `/checkout/success?session_id=...`
- server fetches session with Stripe secret
- renders status and “create account / sign in” CTA

### 8.6 Account creation strategy (recommended)

Minimize friction:
1. Stripe checkout collects email.
2. After webhook, if user doesn’t exist, create `User` with that email.
3. Send magic link sign-in email (NextAuth email provider) OR show “continue” flow.

This avoids password management.

---

## 9. Phase 2 (Looks post-purchase dashboard) — Detailed implementation plan

### 9.1 Definition of done
- Authenticated user sees:
  - active plan
  - saved configs
  - can edit tokens + content
  - can preview + publish (or at least save)
  - version history + rollback
  - support request entry

### 9.2 Core screens
- `/app` dashboard home
- `/app/configs` list
- `/app/configs/[id]` editor

### 9.3 Versioning model

- Every “Save” creates `LookConfigRevision` (append-only)
- “Publish” points `LookConfig.config` to latest approved revision or sets `publishedRevisionId`
- Rollback = set published pointer to earlier revision

### 9.4 Support escalation

Implement minimal support ticketing:
- `SupportRequest` table with:
  - orgId, userId, configId, revisionId
  - message
  - attachments (later)
  - status

In v1, sending an email to support@patient.li with a signed link to the config can be enough.

---

## 10. Phase 2.5 (AI-assisted edits) — Guardrailed design

### 10.1 Required safety rails
- AI outputs a typed diff:
  - `TokenOverridesPatch`
  - `ContentPatch`
- Never accept raw HTML from the model.
- Always show preview.
- Always create a revision.
- Log prompt + diff in `AuditLog` with redaction.

### 10.2 Suggested workflow
1. User enters instruction.
2. Server calls LLM with:
   - current config snapshot
   - allowed edit schema
   - constraints (contrast, max changes)
3. Model returns JSON diff.
4. Validate with zod.
5. Apply to draft revision.
6. User reviews & approves.

---

## 11. CRM track (HIPAA-ready) — Foundation + MVP plan

> This is a separate initiative. Use it to shape shared identity/billing decisions now.

### 11.1 Split the compliance boundary

- **Looks platform**: no PHI. Hosted for speed (Vercel acceptable if no PHI).
- **CRM**: PHI + audit logging. Host on HIPAA-eligible infra with BAA.

Do not mix PHI tables into the same DB/schema used by the marketing site unless absolutely necessary.

### 11.2 CRM MVP architecture

**Core requirements**
- RBAC + audit logs
- Open Dental ingestion (scheduled sync)
- Marketing ingestion:
  - Google Ads
  - web forms (Gravity Forms webhook)
  - call tracking events
- Attribution engine:
  - phone → email → name+date proximity
  - manual override
- Dashboards + exports

**Recommended service layout**
- `crm-api` (Next.js route handlers or separate API service)
- `crm-worker` (job runner)
- `crm-db` (Postgres)

### 11.3 CRM data model (high level)

Objects (from PRD):
- User, Practice
- Patient
- Lead
- Channel
- AttributionRecord
- RevenueEvent
- IntegrationAccount
- AuditLog

**Important:** store raw ingested events in immutable tables (`RawLeadEvent`, `RawPmsEvent`) and derive normalized tables from them. This makes debugging attribution far easier.

### 11.4 Ingestion + job runner

- Use a queue (BullMQ+Redis, pg-boss, or cloud queue) to:
  - pull Open Dental on schedule
  - pull Google Ads conversions
  - process webhooks
  - recompute attribution

### 11.5 Attribution algorithm (v1)

Implement as a deterministic scoring system:
- Exact phone match: score 1.0
- Exact email match: score 0.9
- Name + time window: score 0.6 (only if no conflicts)

Conflict resolution:
- If multiple leads match, pick earliest-touch or last-click based on configured model.
- Store all candidate matches with scores for auditability.

### 11.6 Dashboards

Precompute daily aggregates per channel to keep UI fast:
- leads
- attributed patients
- attributed revenue

Materialize with:
- nightly job or incremental updates

---

## 12. Engineering system for an LLM lead dev

### 12.1 Operating loop

For each feature:
1. **Write a mini-spec** in `docs/specs/<feature>.md`:
   - user story
   - acceptance criteria
   - API + schema changes
   - UI states
   - test plan
2. Implement in small commits.
3. Run checks locally:
   - `npm run lint`
   - `npm run build`
   - unit tests (add)
4. Add/adjust docs + ADR.

### 12.2 Strong conventions (do not violate)
- All external inputs validated with zod.
- All DB writes go through repo/service functions (no inline Prisma in UI).
- No secrets in client bundles.
- No PHI in logs.
- Every Stripe webhook is idempotent.

### 12.3 CI/CD minimum

Add GitHub Actions:
- install deps
- lint
- typecheck/build
- (later) unit tests + Playwright smoke

### 12.4 Local dev setup script

Provide a `./scripts/dev-setup.sh` that:
- checks Node version
- installs deps
- copies `.env.example` → `.env.local`
- starts DB (docker compose) if using local Postgres
- runs Prisma migrate + seed

---

## 13. Execution milestones

### Milestone 0 — Repo hygiene (1–2 days)
- Fix token var mismatch (`accent-dark`)
- Normalize route param typings
- Remove bundled `node_modules` from repo; require `npm ci`
- Add Prisma + Postgres (local + hosted)

### Milestone 1 — Phase 1 Looks (demo + share + checkout)
- Token schema + CSS variable injection
- Real preview components (not mock rectangles)
- Config sharing
- Stripe checkout + webhook + DB persistence

### Milestone 2 — Phase 2 Looks (dashboard + versioning + support)
- NextAuth configured
- Config list + editor
- Revision history + rollback
- Support request

### Milestone 3 — CRM foundation (separate app)
- Identity alignment (Org/Practice)
- Audit logging framework
- Job runner scaffold

### Milestone 4 — CRM MVP
- Open Dental integration
- Lead ingestion
- Attribution + dashboards
- Export/reporting

---

## 14. Acceptance test scripts (manual)

### Looks Phase 1
1. Open `/looks` → pick a Look
2. Change palette + fonts → preview updates
3. Enter practice name + phone → preview updates
4. Copy share link → open in incognito → config matches
5. Select plan → Stripe test checkout → success page
6. Verify DB:
   - config stored
   - purchase stored
7. Replay webhook event → no duplicate purchase

### Looks Phase 2
1. Sign in via magic link
2. View configs
3. Edit tokens → save revision
4. Roll back
5. Submit support request

---

## 15. Open decisions (record as ADRs)

1. **Where practice sites are hosted** (Patientli-hosted multi-tenant vs exported sites).
2. **CMS choice** for post-purchase editing (Sanity/Contentful/Strapi/custom).
3. **Queue choice** for CRM jobs.
4. **Attribution model** default (first-touch vs last-click).

---

## Appendix A — Immediate TODOs discovered in the shell

- Replace `--color-accent-dark` usages (search in `src/`).
- Implement missing API routes: `/api/checkout`, `/api/stripe/webhook`, `/api/auth/[...nextauth]`.
- Replace hard-coded resource/solution maps with JSON content files.
- Replace placeholder Adobe kit id in `layout.tsx`.

