"use client";

import { useEffect } from "react";
import { Container } from "@/components/ui/Container";
import { ErrorState } from "@/components/ui/ErrorState";
import { Button } from "@/components/ui/Button";
import { servicePath } from "@/lib/env";

/**
 * Root-level error boundary — catches anything an individual route
 * segment's own error.tsx didn't (or a failure in the layout itself),
 * so one broken page never takes down the whole app. Never renders the
 * raw error message/stack to the customer.
 */
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="flex min-h-[60vh] items-center py-16">
      <Container className="mx-auto max-w-lg">
        <ErrorState
          title="Something went wrong"
          description="We couldn't load this page. Please try again."
          action={
            <div className="flex flex-wrap justify-center gap-3">
              <Button variant="primary" onClick={reset}>
                Try again
              </Button>
              <Button href={servicePath()} variant="secondary">
                Back to services
              </Button>
            </div>
          }
        />
      </Container>
    </section>
  );
}
