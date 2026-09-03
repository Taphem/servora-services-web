# servora-services-web

Servora's customer-facing service marketplace frontend — service discovery, category
browsing, service detail pages, and schema-driven dynamic requirement forms.

This is a standalone Next.js application, independent of `servora-web` (the core site:
landing page, authentication, primary navigation) and every other Servora frontend. It
consumes the existing `servora-services` backend through the Servora API Gateway and does
not implement authentication, profile, payment, or provider management — those remain the
responsibility of their own repositories.

## Milestone scope

This first milestone covers:

1. Service discovery (`/services`)
2. Category browsing, including nested subcategories (`/services/category/[slug]`)
3. Service detail pages (`/services/[slug]`)
4. Dynamic, schema-driven service requirement forms
5. A clean API client foundation (fetch + Zod validation) for everything above

It deliberately stops short of booking, payment, and provider matching — the requirement
form captures and validates a customer's answers, then shows a clear "what's next" summary
rather than calling a booking endpoint that doesn't exist yet.

## Getting started

```bash
npm install
cp .env.example .env.local   # optional — defaults already work
npm run dev
```

The app runs at `http://localhost:3000` and expects a Servora API Gateway reachable at
`NEXT_PUBLIC_API_BASE_URL` (defaults to `http://localhost:8080` for local development; see
`servora-api-gateway`). Production must point this at `https://api.servora.hemandu.com` —
never at a Render-internal `*.onrender.com` URL.

## Architecture

```
Browser
  → servora-services-web (this app)
  → https://api.servora.hemandu.com (API Gateway)
  → servora-services
  → PostgreSQL
```

- **`src/lib/api/schemas.ts`** — Zod schemas mirroring servora-services' actual response
  shapes (categories, services, requirement fields, pagination, the error envelope). Note
  that `basePriceAmount`/`minValue`/`maxValue` are validated as strings, matching how the
  backend serializes its `NUMERIC` columns — not coerced to numbers.
- **`src/lib/api/client.ts`** — the single `fetch()` wrapper. Every request goes through the
  API Gateway with `credentials: "include"`, a request timeout, and Zod validation of the
  response; a malformed or unexpected payload throws rather than rendering broken UI or
  inventing fallback data.
- **`src/lib/api/services.ts`** — one function per backend endpoint actually in use. No
  component calls `fetch()` directly.
- **`src/lib/validation/requirements.ts`** — frontend-only validation for a customer's
  requirement answers, driven entirely by the constraints the backend attaches to each
  field (`isRequired`, min/max length, min/max value, min/max selections, the option list).
  This is a UX convenience; the backend remains the authoritative validator.
- **`src/components/requirements/`** — the dynamic form renderer. `RequirementField.tsx` is
  the only place that switches on `fieldType`; every type the backend can send today
  (`TEXT`, `TEXTAREA`, `SELECT`, `MULTISELECT`, `NUMBER`, `BOOLEAN`, `DATE`, `TIME`) already
  has a case, each delegating to its own component under `fields/`. Adding a new
  requirement of an already-supported type on the backend needs no frontend deploy.

## Design system

The visual language (colors, type scale, spacing, motion, radii, shadows) is hand-mirrored
from `servora-web`'s `globals.css` token set, kept in sync manually since this repo has no
shared package with that one. Component patterns (`Button`, `Card`, `Input`, `Select`,
`Container`, `Section`, …) follow the same prop shapes and naming as their `servora-web`
counterparts. If `servora-web`'s tokens change, update `src/app/globals.css` here to match.

## Known backend-contract gaps

The following are intentionally **not** implemented because no backend contract exists yet
for them — the UI never fabricates data or fakes an API to fill the gap:

- **Search.** `GET /api/v1/services/catalog` has no `search` query parameter. There is no
  search box in this app.
- **Price/availability/rating filters.** Only `categoryId`/`categorySlug` and `bookingMode`
  are real, backend-supported filters on the catalog endpoint (see `CatalogFilters.tsx`).
  Availability, distance, and rating belong to other domains (Provider/Booking/Review).
- **Provider discovery and booking submission.** After a customer fills out a service's
  requirement form, there is no endpoint yet to submit those answers toward provider
  matching. The form validates and shows a summary of the captured answers instead of
  calling a nonexistent endpoint; the "Find providers" action is visibly disabled.
- **Reviews.** `servora-review` exists as a backend, but no endpoint contract for
  category/service pages was verified as part of this milestone, so nothing here calls it.

## Testing

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

Tests use Vitest + React Testing Library, covering the API client (success/error/malformed
response handling), Zod schemas (valid and invalid payloads), category-tree assembly,
price display rules, and the dynamic requirement form (every field type rendering,
per-field validation, keyboard-accessible labels, and the post-submit summary state).
Async Server Components (the actual route pages) are exercised manually in the browser
rather than through RTL, which doesn't run the App Router's server rendering; verify
`/services`, `/services/category/[slug]`, and `/services/[slug]` against a running gateway
before shipping a change to them.

## Environment variables

See `.env.example`. Only `NEXT_PUBLIC_`-prefixed variables exist in this app, and every one
of them has a safe default — nothing here holds a secret, and nothing should ever be added
behind that prefix that isn't safe to ship to the browser.
