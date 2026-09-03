import type { Metadata } from "next";
import { MapPinOff } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <section className="flex min-h-[60vh] items-center py-16">
      <Container className="mx-auto flex max-w-xl flex-col items-center text-center">
        <div className="relative flex items-center justify-center">
          <p className="font-display text-[5.5rem] leading-none text-primary/10 sm:text-[8rem]">404</p>
          <span
            aria-hidden
            className="absolute flex h-14 w-14 items-center justify-center rounded-full bg-primary-soft text-text-brand"
          >
            <MapPinOff size={26} aria-hidden />
          </span>
        </div>

        <h1 className="mt-2 font-display text-h2 text-ink-900">We couldn&apos;t find that page.</h1>
        <p className="mt-4 max-w-md text-base leading-relaxed text-text-secondary">
          The page you&apos;re looking for doesn&apos;t exist or may have moved.
        </p>

        <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:justify-center">
          <Button href="/services" variant="primary" size="lg" className="w-full sm:w-auto">
            Browse services
          </Button>
        </div>
      </Container>
    </section>
  );
}
