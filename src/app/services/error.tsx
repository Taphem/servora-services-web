"use client";

import { useEffect } from "react";
import { Section } from "@/components/ui/Section";
import { ErrorState } from "@/components/ui/ErrorState";
import { Button } from "@/components/ui/Button";
import { ApiError } from "@/lib/api/client";

export default function ServicesError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const description =
    error instanceof ApiError && error.code !== "CLIENT_MALFORMED_RESPONSE"
      ? error.message
      : "We couldn't load services right now. Please try again in a moment.";

  return (
    <Section spacing="compact">
      <ErrorState
        title="We couldn't load services"
        description={description}
        action={
          <Button variant="primary" onClick={reset}>
            Try again
          </Button>
        }
      />
    </Section>
  );
}
