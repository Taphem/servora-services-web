import { Section } from "@/components/ui/Section";
import { Skeleton } from "@/components/ui/Skeleton";

export default function CategoryLoading() {
  return (
    <>
      <Section spacing="compact" tone="sunken" border>
        <Skeleton className="h-4 w-40" />
        <Skeleton className="mt-4 h-10 w-72 max-w-full" />
        <Skeleton className="mt-3 h-5 w-96 max-w-full" />
      </Section>
      <Section spacing="compact">
        <Skeleton className="h-7 w-40" />
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-hidden>
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-40 rounded-lg" />
          ))}
        </div>
      </Section>
      <span className="sr-only" role="status">
        Loading category…
      </span>
    </>
  );
}
