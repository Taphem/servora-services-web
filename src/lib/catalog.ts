import type { BookingMode, Category, PricingModel } from "@/lib/api/schemas";

export interface CategoryTreeNode extends Category {
  children: CategoryTreeNode[];
}

/**
 * Categories are hierarchical (a category's `parentId` may point at
 * another category), but the API returns them as a flat list — this
 * assembles that list into a tree client-side purely for rendering.
 * Any category whose parent isn't in the given list (e.g. it wasn't
 * fetched) is treated as a root, so a partial list still renders.
 */
export function buildCategoryTree(categories: Category[]): CategoryTreeNode[] {
  const nodes = new Map<string, CategoryTreeNode>();
  for (const category of categories) {
    nodes.set(category.id, { ...category, children: [] });
  }

  const roots: CategoryTreeNode[] = [];
  for (const category of categories) {
    const node = nodes.get(category.id);
    if (!node) continue;
    const parent = category.parentId ? nodes.get(category.parentId) : undefined;
    if (parent) {
      parent.children.push(node);
    } else {
      roots.push(node);
    }
  }

  sortCategoryTree(roots);
  return roots;
}

function sortCategoryTree(nodes: CategoryTreeNode[]) {
  nodes.sort(byDisplayOrder);
  for (const node of nodes) sortCategoryTree(node.children);
}

function byDisplayOrder(a: Category, b: Category) {
  return a.displayOrder - b.displayOrder || a.name.localeCompare(b.name);
}

export const bookingModeLabels: Record<BookingMode, string> = {
  INSTANT_ACCEPT: "Instant booking",
  PROVIDER_SELECTION: "Choose your provider",
  QUOTE: "Request-based",
};

export const pricingModelLabels: Record<PricingModel, string> = {
  FIXED: "Fixed price",
  HOURLY: "Hourly rate",
  QUOTE: "Quote required",
};
