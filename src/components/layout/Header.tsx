import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/ui/Logo";
import { env, servicePath } from "@/lib/env";

/**
 * Minimal site chrome for a standalone deploy. This app doesn't own
 * authentication or global navigation — those live in servora-web — so
 * this header just anchors the brand and links back to the main site.
 * When embedded under the unified servora.hemandu.com origin via
 * path-based routing, servora-web's own navbar will typically surround
 * this app instead.
 */
export function Header() {
  return (
    <header className="border-b border-border-subtle bg-surface/95 backdrop-blur-sm">
      <Container className="flex h-16 items-center justify-between sm:h-20">
        <Link href={env.siteUrl} className="rounded-sm" aria-label="Servora home">
          <Logo />
        </Link>
        <nav aria-label="Primary" className="flex items-center gap-1">
          <Link
            href={servicePath()}
            className="rounded-full px-4 py-2 text-sm font-medium text-ink-700 transition-colors duration-[var(--duration-fast)] hover:bg-ink-900/[0.04] hover:text-ink-900"
          >
            Browse services
          </Link>
        </nav>
      </Container>
    </header>
  );
}
