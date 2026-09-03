import { Section } from "@/components/ui/Section";
import { Skeleton } from "@/components/ui/Skeleton";

function CardSkeleton() {
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border-default p-5">
      <Skeleton className="h-11 w-11 rounded-full" />
      <Skeleton className="h-5 w-2/3" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  );
}

export default function ServicesLoading() {
  return (
    <>
      <Section spacing="compact" tone="sunken" border>
        <Skeleton className="h-10 w-72 max-w-full" />
        <Skeleton className="mt-3 h-5 w-96 max-w-full" />
      </Section>

      <Section spacing="compact">
        <Skeleton className="h-7 w-40" />
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-hidden>
          {Array.from({ length: 6 }).map((_, index) => (
            <CardSkeleton key={index} />
          ))}
        </div>
      </Section>

      <Section spacing="compact" tone="sunken" border>
        <Skeleton className="h-7 w-40" />
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-hidden>
          {Array.from({ length: 6 }).map((_, index) => (
            <CardSkeleton key={index} />
          ))}
        </div>
      </Section>
      <span className="sr-only" role="status">
        Loading services…
      </span>
    </>
  );
}
