import { formatPrice } from "@/lib/utils";
import type { Service } from "@/lib/api/schemas";

/**
 * Displays the service's informational base price, or a clear
 * "pricing by quote" message when the service is quote-based or has no
 * base price. This is never the final booking amount — that's owned by
 * the provider/booking domains — so the wording here is deliberately
 * framed as a starting point, not a fixed total.
 */
export function PriceTag({ service, className }: { service: Service; className?: string }) {
  const formatted = formatPrice(service.basePriceAmount, service.basePriceCurrency);

  if (service.pricingModel === "QUOTE" || !formatted) {
    return <span className={className}>Pricing by quote</span>;
  }

  const suffix = service.pricingModel === "HOURLY" ? " / hr" : "";
  return (
    <span className={className}>
      From {formatted}
      {suffix}
    </span>
  );
}
