import Link from "next/link";
import { env } from "@/lib/env";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border-subtle bg-surface-sunken">
      <div className="container-servora flex flex-col gap-3 py-8 text-sm text-text-secondary sm:flex-row sm:items-center sm:justify-between">
        <p>&copy; {year} Servora. All rights reserved.</p>
        <Link href={env.siteUrl} className="rounded-sm transition-colors hover:text-text-brand">
          Back to Servora
        </Link>
      </div>
    </footer>
  );
}
