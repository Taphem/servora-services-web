import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Section } from "@/components/ui/Section";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { PriceTag } from "@/components/catalog/PriceTag";
import { RequirementForm } from "@/components/requirements/RequirementForm";
import { getService, getCategory, getServiceRequirements } from "@/lib/api/services";
import { bookingModeLabels, pricingModelLabels } from "@/lib/catalog";
import { ApiError } from "@/lib/api/client";
import { servicePath } from "@/lib/env";
import type { Service } from "@/lib/api/schemas";

interface ServiceDetailPageProps {
  params: Promise<{ slug: string }>;
}

async function loadService(slug: string) {
  try {
    return await getService(slug);
  } catch (error) {
    if (error instanceof ApiError && error.isNotFound) notFound();
    throw error;
  }
}

export async function generateMetadata({ params }: ServiceDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const service = await getService(slug);
    return {
      title: service.name,
      description: service.description ?? `Book ${service.name} on Servora.`,
    };
  } catch {
    return { title: "Service" };
  }
}

export default async function ServiceDetailPage({ params }: ServiceDetailPageProps) {
  const { slug } = await params;
  const service = await loadService(slug);

  const [category, requirementFields] = await Promise.all([
    getCategory(service.categoryId).catch(() => null),
    getServiceRequirements(service.slug),
  ]);

  return (
    <>
      <Section spacing="compact" tone="sunken" border>
        <Breadcrumbs
          items={[
            { label: "Services", href: servicePath() },
            ...(category ? [{ label: category.name, href: servicePath(`/category/${category.slug}`) }] : []),
            { label: service.name },
          ]}
        />
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Badge tone="brand">{bookingModeLabels[service.bookingMode]}</Badge>
          <Badge tone="neutral">{pricingModelLabels[service.pricingModel]}</Badge>
        </div>
        <h1 className="mt-3 font-display text-h1 text-ink-900">{service.name}</h1>
        {service.description ? (
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-text-secondary">{service.description}</p>
        ) : null}
        <PriceTag service={service} className="mt-5 block text-h4 font-medium text-ink-900" />
        <p className="mt-2 max-w-xl text-sm text-text-tertiary">{pricingNoteFor(service)}</p>
      </Section>

      <Section spacing="compact">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-h3 font-medium text-ink-900">Tell us about your request</h2>
          <p className="mt-2 text-sm leading-relaxed text-text-secondary">
            Answer a few quick questions so we can match you with the right provider.
          </p>
          <Card className="mt-6 p-6">
            <RequirementForm serviceName={service.name} fields={requirementFields} />
          </Card>
        </div>
      </Section>
    </>
  );
}

function pricingNoteFor(service: Pick<Service, "pricingModel">): string {
  switch (service.pricingModel) {
    case "QUOTE":
      return "Pricing depends on your requirements — you'll receive a quote after submitting your details.";
    case "HOURLY":
      return "Estimated hourly rate. Your final cost depends on time worked and the provider you choose.";
    case "FIXED":
    default:
      return "This is a starting price. Your final price is confirmed with your provider before booking.";
  }
}
