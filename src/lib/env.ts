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

  /**
   * The path this app is mounted under in Servora's path-based
   * multi-zone deployment (https://servora.hemandu.com/services). The
   * same value drives `assetPrefix` in next.config.ts (which reads
   * process.env directly, since Next.js evaluates that file outside
   * this module) so generated JS/CSS/font asset URLs resolve under the
   * same prefix as the app's own routes. Defaults to "/services" so the
   * app keeps working with zero configuration; set to "" to deploy this
   * app at an origin's root instead.
   */
  basePath: process.env.NEXT_PUBLIC_BASE_PATH ?? "/services",
} as const;

/**
 * Builds an in-app absolute href under this app's configured mount path
 * (`env.basePath`) instead of a hardcoded "/services" literal, so the
 * mount path — or moving this app to a different path entirely — only
 * ever needs to change in one place (NEXT_PUBLIC_BASE_PATH). Every
 * internal `<Link>`/`redirect()` target in this app should be built
 * with this helper.
 *
 * `segment` is appended as-is and should already start with "/" (e.g.
 * `servicePath("/category/ac-repair")`); omit it for the mount root.
 */
export function servicePath(segment = ""): string {
  return `${env.basePath}${segment}`;
}
