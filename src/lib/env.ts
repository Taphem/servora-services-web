/**
 * Single place the app reads environment variables from, instead of
 * scattering `process.env.X` through components. Every value here has a
 * safe default, so the app runs correctly with zero configuration.
 *
 * Only NEXT_PUBLIC_-prefixed variables belong here — anything without
 * that prefix is server-only and must never be read from a Client
 * Component. See `.env.example` for the full documented list.
 */
export const env = {
  /** Public site origin — used for absolute URLs in metadata (Open Graph, canonical links). */
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://servora.hemandu.com",

  /**
   * The public Servora API Gateway origin. The browser talks ONLY to
   * this — never to servora-services or any other downstream service
   * directly. Production must always be the public gateway domain
   * (https://api.servora.hemandu.com), never a Render-internal
   * *.onrender.com URL. Defaults to a local gateway for development.
   */
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080",
} as const;
