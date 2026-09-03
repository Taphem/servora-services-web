"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Select } from "@/components/ui/Select";
import { bookingModeLabels } from "@/lib/catalog";
import type { CategoryTreeNode } from "@/lib/catalog";

interface CatalogFiltersProps {
  categories: CategoryTreeNode[];
}

function flattenCategories(nodes: CategoryTreeNode[], depth = 0): { value: string; label: string }[] {
  return nodes.flatMap((node) => [
    { value: node.slug, label: `${"— ".repeat(depth)}${node.name}` },
    ...flattenCategories(node.children, depth + 1),
  ]);
}

const bookingModeOptions = Object.entries(bookingModeLabels).map(([value, label]) => ({ value, label }));

/**
 * Filters backed only by query params the catalog API actually accepts
 * (`categorySlug`, `bookingMode`) — no client-side-only filters that
 * would silently do nothing against real data.
 */
export function CatalogFilters({ categories }: CatalogFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const categoryOptions = flattenCategories(categories);

  function updateParam(key: string, value: string) {
    const next = new URLSearchParams(searchParams.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    const query = next.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  }

  return (
    <div className="flex flex-wrap gap-3">
      <Select
        aria-label="Filter by category"
        placeholder="All categories"
        options={categoryOptions}
        value={searchParams.get("category") ?? ""}
        onChange={(event) => updateParam("category", event.target.value)}
        className="min-w-[13rem]"
      />
      <Select
        aria-label="Filter by booking type"
        placeholder="All booking types"
        options={bookingModeOptions}
        value={searchParams.get("bookingMode") ?? ""}
        onChange={(event) => updateParam("bookingMode", event.target.value)}
        className="min-w-[13rem]"
      />
    </div>
  );
}
