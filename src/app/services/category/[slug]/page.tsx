import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Search } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { CategoryGrid } from "@/components/catalog/CategoryGrid";
import { ServiceGrid } from "@/components/catalog/ServiceGrid";
import { EmptyState } from "@/components/ui/EmptyState";
import { getCategory, getCategories, getCatalog } from "@/lib/api/services";
import { buildCategoryTree } from "@/lib/catalog";
import { ApiError } from "@/lib/api/client";
import { servicePath } from "@/lib/env";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

async function loadCategory(slug: string) {
  try {
    return await getCategory(slug);
  } catch (error) {
    if (error instanceof ApiError && error.isNotFound) notFound();
    throw error;
  }
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const category = await getCategory(slug);
    return {
      title: category.name,
      description: category.description ?? `Browse ${category.name} services on Servora.`,
    };
  } catch {
    return { title: "Category" };
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = await loadCategory(slug);

  const [childCategoriesPage, servicesPage] = await Promise.all([
    getCategories({ parentId: category.id, pageSize: 100 }),
    getCatalog({ categorySlug: category.slug, pageSize: 24 }),
  ]);

  const childTree = buildCategoryTree(childCategoriesPage.data);

  return (
    <>
      <Section spacing="compact" tone="sunken" border>
        <Breadcrumbs items={[{ label: "Services", href: servicePath() }, { label: category.name }]} />
        <h1 className="mt-3 font-display text-h1 text-ink-900">{category.name}</h1>
        {category.description ? (
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-text-secondary">{category.description}</p>
        ) : null}
      </Section>

      {childTree.length > 0 ? (
        <Section spacing="compact">
          <h2 className="text-h3 font-medium text-ink-900">Subcategories</h2>
          <div className="mt-6">
            <CategoryGrid categories={childTree} />
          </div>
        </Section>
      ) : null}

      <Section spacing="compact" tone={childTree.length > 0 ? "sunken" : "default"} border={childTree.length > 0}>
        <h2 className="text-h3 font-medium text-ink-900">Services</h2>
        <div className="mt-6">
          {servicesPage.data.length === 0 ? (
            <EmptyState
              icon={<Search size={20} aria-hidden />}
              title="No services in this category yet"
              description="Check back soon, or explore a subcategory above."
            />
          ) : (
            <ServiceGrid services={servicesPage.data} />
          )}
        </div>
      </Section>
    </>
  );
}
