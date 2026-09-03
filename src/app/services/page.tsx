import type { Metadata } from "next";
import Link from "next/link";
import { Layers, Search } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { CategoryGrid } from "@/components/catalog/CategoryGrid";
import { ServiceGrid } from "@/components/catalog/ServiceGrid";
import { CatalogFilters } from "@/components/catalog/CatalogFilters";
import { EmptyState } from "@/components/ui/EmptyState";
import { getCategories, getCatalog } from "@/lib/api/services";
import { buildCategoryTree } from "@/lib/catalog";
import type { BookingMode } from "@/lib/api/schemas";

export const metadata: Metadata = {
  title: "Browse services",
  description: "Explore Servora's local service categories and find the right professional for your job.",
};

const BOOKING_MODES: BookingMode[] = ["INSTANT_ACCEPT", "PROVIDER_SELECTION", "QUOTE"];

function isBookingMode(value: string | undefined): value is BookingMode {
  return value !== undefined && (BOOKING_MODES as string[]).includes(value);
}

interface ServicesPageProps {
  searchParams: Promise<{ category?: string; bookingMode?: string }>;
}

export default async function ServicesPage({ searchParams }: ServicesPageProps) {
  const params = await searchParams;
  const bookingMode = isBookingMode(params.bookingMode) ? params.bookingMode : undefined;

  const [categoriesPage, servicesPage] = await Promise.all([
    getCategories({ pageSize: 100 }),
    getCatalog({ pageSize: 24, categorySlug: params.category, bookingMode }),
  ]);

  const categoryTree = buildCategoryTree(categoriesPage.data);
  const hasFilters = Boolean(params.category || bookingMode);

  return (
    <>
      <Section spacing="compact" tone="sunken" border>
        <h1 className="font-display text-h1 text-ink-900">Find the right service</h1>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-text-secondary">
          Browse categories or explore all available services on Servora.
        </p>
      </Section>

      <Section spacing="compact">
        <h2 className="text-h3 font-medium text-ink-900">Categories</h2>
        <div className="mt-6">
          {categoryTree.length === 0 ? (
            <EmptyState
              icon={<Layers size={20} aria-hidden />}
              title="No categories available yet"
              description="Check back soon — new service categories are added regularly."
            />
          ) : (
            <CategoryGrid categories={categoryTree} />
          )}
        </div>
      </Section>

      <Section spacing="compact" tone="sunken" border>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="text-h3 font-medium text-ink-900">All services</h2>
          <CatalogFilters categories={categoryTree} />
        </div>
        <div className="mt-6">
          {servicesPage.data.length === 0 ? (
            <EmptyState
              icon={<Search size={20} aria-hidden />}
              title={hasFilters ? "No services match these filters" : "No services available yet"}
              description={
                hasFilters
                  ? "Try a different category or booking type."
                  : "Check back soon — new services are added regularly."
              }
              action={
                hasFilters ? (
                  <Link href="/services" className="text-sm font-medium text-text-brand hover:underline">
                    Clear filters
                  </Link>
                ) : undefined
              }
            />
          ) : (
            <ServiceGrid services={servicesPage.data} />
          )}
        </div>
      </Section>
    </>
  );
}
