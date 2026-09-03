import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { PriceTag } from "@/components/catalog/PriceTag";
import type { Service } from "@/lib/api/schemas";

function service(overrides: Partial<Service>): Service {
  return {
    id: "1",
    categoryId: "cat-1",
    name: "AC Repair",
    slug: "ac-repair",
    description: null,
    status: "ACTIVE",
    bookingMode: "INSTANT_ACCEPT",
    pricingModel: "FIXED",
    basePriceAmount: "49.99",
    basePriceCurrency: "USD",
    displayOrder: 0,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
    ...overrides,
  };
}

describe("PriceTag", () => {
  it("shows a formatted starting price for a FIXED-price service", () => {
    render(<PriceTag service={service({ pricingModel: "FIXED" })} />);
    expect(screen.getByText("From $49.99")).toBeInTheDocument();
  });

  it("appends an hourly suffix for HOURLY pricing", () => {
    render(<PriceTag service={service({ pricingModel: "HOURLY" })} />);
    expect(screen.getByText("From $49.99 / hr")).toBeInTheDocument();
  });

  it("never claims a fixed price for QUOTE-based services", () => {
    render(
      <PriceTag
        service={service({ pricingModel: "QUOTE", basePriceAmount: null, basePriceCurrency: null })}
      />,
    );
    expect(screen.getByText("Pricing by quote")).toBeInTheDocument();
  });

  it("falls back to a quote message when the price is missing even for a priced model", () => {
    render(<PriceTag service={service({ basePriceAmount: null })} />);
    expect(screen.getByText("Pricing by quote")).toBeInTheDocument();
  });
});
