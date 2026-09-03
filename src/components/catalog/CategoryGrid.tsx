import type { CategoryTreeNode } from "@/lib/catalog";
import { CategoryCard } from "@/components/catalog/CategoryCard";

export function CategoryGrid({ categories }: { categories: CategoryTreeNode[] }) {
  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {categories.map((category) => (
        <li key={category.id}>
          <CategoryCard category={category} />
        </li>
      ))}
    </ul>
  );
}
