import type { Service } from "@/lib/api/schemas";
import { ServiceCard } from "@/components/catalog/ServiceCard";

export function ServiceGrid({ services }: { services: Service[] }) {
  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {services.map((service) => (
        <li key={service.id}>
          <ServiceCard service={service} />
        </li>
      ))}
    </ul>
  );
}
