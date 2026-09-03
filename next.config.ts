import type { NextConfig } from "next";

// This app is a Next.js "zone" in Servora's eventual multi-zone deployment
// at https://servora.hemandu.com — every route this app owns already lives
// under its mount path (see src/app/services/**, driven by
// NEXT_PUBLIC_BASE_PATH — src/lib/env.ts's `servicePath()` builds every
// internal link from that same value instead of a hardcoded literal),
// rather than using Next.js's `basePath` option. That's what lets the
// exact same build serve both:
//   - the standalone Vercel deployment, at
//     https://servora-services-web.vercel.app/services, and
//   - the proxied path, at https://servora.hemandu.com/services,
// once the primary domain adds a rewrite for it — with no env-conditional
// branching needed here, and no other Servora domain hardcoded into this
// app.
//
// `assetPrefix` only changes the URLs Next.js emits for its own generated
// assets (JS/CSS chunks, font files from next/font, etc.), prefixing them
// so they resolve correctly once proxied. Because the value is a path (not
// a full external origin), Next.js's own server also serves requests at
// that prefix, so this doesn't break the standalone deployment — both URLs
// above end up requesting assets at the same {basePath}/_next/* path. It
// does not affect this app's own route paths or its data-fetching, which
// already goes through the API Gateway via NEXT_PUBLIC_API_BASE_URL.
//
// Read directly from process.env (not imported from src/lib/env.ts) since
// Next.js loads .env files and evaluates this config file before the app's
// own module graph exists; the default below is kept in sync with
// src/lib/env.ts's `basePath` default by convention, not by import.
const nextConfig: NextConfig = {
  assetPrefix: process.env.NEXT_PUBLIC_BASE_PATH ?? "/services",
};

export default nextConfig;
