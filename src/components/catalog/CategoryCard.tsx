import Link from "next/link";
import { ArrowRight, Layers } from "lucide-react";
import { Card } from "@/components/ui/Card";
import type { CategoryTreeNode } from "@/lib/catalog";

export function CategoryCard({ category }: { category: CategoryTreeNode }) {
  const childCount = category.children.length;

  return (
    <Link href={`/services/category/${category.slug}`} className="block rounded-lg">
      <Card interactive className="flex h-full flex-col gap-3 p-5">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-soft text-text-brand">
          <Layers size={20} aria-hidden />
        </span>
        <div className="flex-1">
          <h3 className="text-h4 font-medium text-ink-900">{category.name}</h3>
          {category.description ? (
            <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-text-secondary">
              {category.description}
            </p>
          ) : null}
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-text-tertiary">
            {childCount > 0 ? `${childCount} subcategor${childCount === 1 ? "y" : "ies"}` : "Browse services"}
          </span>
          <ArrowRight size={16} aria-hidden className="text-text-brand" />
        </div>
      </Card>
    </Link>
  );
}
