"use client";

import { useEffect } from "react";
import { Section } from "@/components/ui/Section";
import { ErrorState } from "@/components/ui/ErrorState";
import { Button } from "@/components/ui/Button";
import { ApiError } from "@/lib/api/client";

export default function CategoryError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const description =
    error instanceof ApiError && error.code !== "CLIENT_MALFORMED_RESPONSE"
      ? error.message
      : "We couldn't load this category right now. Please try again in a moment.";

  return (
    <Section spacing="compact">
      <ErrorState
        title="We couldn't load this category"
        description={description}
        action={
          <div className="flex flex-wrap justify-center gap-3">
            <Button variant="primary" onClick={reset}>
              Try again
            </Button>
            <Button href="/services" variant="secondary">
              Browse all services
            </Button>
          </div>
        }
      />
    </Section>
  );
}
