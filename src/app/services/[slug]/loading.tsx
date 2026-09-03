import { Section } from "@/components/ui/Section";
import { Skeleton } from "@/components/ui/Skeleton";

export default function ServiceDetailLoading() {
  return (
    <>
      <Section spacing="compact" tone="sunken" border>
        <Skeleton className="h-4 w-56" />
        <div className="mt-4 flex gap-2">
          <Skeleton className="h-6 w-32 rounded-full" />
          <Skeleton className="h-6 w-28 rounded-full" />
        </div>
        <Skeleton className="mt-4 h-10 w-80 max-w-full" />
        <Skeleton className="mt-3 h-5 w-full max-w-xl" />
        <Skeleton className="mt-5 h-6 w-32" />
      </Section>
      <Section spacing="compact">
        <div className="mx-auto max-w-2xl">
          <Skeleton className="h-7 w-64" />
          <Skeleton className="mt-2 h-5 w-full" />
          <div className="mt-6 flex flex-col gap-5 rounded-lg border border-border-default p-6" aria-hidden>
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="flex flex-col gap-1.5">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-11 w-full" />
              </div>
            ))}
          </div>
        </div>
      </Section>
      <span className="sr-only" role="status">
        Loading service…
      </span>
    </>
  );
}
