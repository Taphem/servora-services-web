import { cn } from "@/lib/utils";

/** Simple wordmark — matches servora-web's brand voice without pulling in its SVG assets. */
export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("font-display text-h4 font-medium tracking-tight text-ink-900", className)}>
      Servora
    </span>
  );
}
