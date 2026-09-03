import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { PriceTag } from "@/components/catalog/PriceTag";
import { bookingModeLabels } from "@/lib/catalog";
import type { Service } from "@/lib/api/schemas";

export function ServiceCard({ service }: { service: Service }) {
  return (
    <Link href={`/services/${service.slug}`} className="block rounded-lg">
      <Card interactive className="flex h-full flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-h4 font-medium text-ink-900">{service.name}</h3>
          <Badge tone="brand">{bookingModeLabels[service.bookingMode]}</Badge>
        </div>
        {service.description ? (
          <p className="line-clamp-3 flex-1 text-sm leading-relaxed text-text-secondary">
            {service.description}
          </p>
        ) : (
          <div className="flex-1" />
        )}
        <PriceTag service={service} className="text-sm font-medium text-ink-900" />
      </Card>
    </Link>
  );
}
