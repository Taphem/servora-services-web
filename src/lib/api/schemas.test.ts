import { describe, expect, it } from "vitest";
import {
  categorySchema,
  serviceSchema,
  requirementFieldSchema,
  categoryPageSchema,
  requirementsResponseSchema,
} from "@/lib/api/schemas";

describe("categorySchema", () => {
  it("accepts a well-formed category", () => {
    const result = categorySchema.safeParse({
      id: "c1",
      parentId: null,
      name: "Home Services",
      slug: "home-services",
      description: null,
      displayOrder: 0,
      status: "ACTIVE",
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-01T00:00:00.000Z",
    });
    expect(result.success).toBe(true);
  });

  it("rejects a category missing required fields, rather than inventing defaults", () => {
    const result = categorySchema.safeParse({ id: "c1", name: "Home Services" });
    expect(result.success).toBe(false);
  });

  it("rejects an unknown status value", () => {
    const result = categorySchema.safeParse({
      id: "c1",
      parentId: null,
      name: "Home Services",
      slug: "home-services",
      description: null,
      displayOrder: 0,
      status: "ARCHIVED",
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-01T00:00:00.000Z",
    });
    expect(result.success).toBe(false);
  });
});

describe("serviceSchema", () => {
  it("keeps basePriceAmount as a string, matching the backend's NUMERIC-as-string wire format", () => {
    const result = serviceSchema.safeParse({
      id: "s1",
      categoryId: "c1",
      name: "AC Repair",
      slug: "ac-repair",
      description: "Fix your AC",
      status: "ACTIVE",
      bookingMode: "INSTANT_ACCEPT",
      pricingModel: "FIXED",
      basePriceAmount: "49.99",
      basePriceCurrency: "USD",
      displayOrder: 0,
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-01T00:00:00.000Z",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(typeof result.data.basePriceAmount).toBe("string");
    }
  });

  it("rejects a numeric basePriceAmount instead of silently coercing it", () => {
    const result = serviceSchema.safeParse({
      id: "s1",
      categoryId: "c1",
      name: "AC Repair",
      slug: "ac-repair",
      description: null,
      status: "ACTIVE",
      bookingMode: "INSTANT_ACCEPT",
      pricingModel: "FIXED",
      basePriceAmount: 49.99,
      basePriceCurrency: "USD",
      displayOrder: 0,
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-01T00:00:00.000Z",
    });
    expect(result.success).toBe(false);
  });
});

describe("requirementFieldSchema", () => {
  it("accepts every backend field type", () => {
    const types = ["TEXT", "TEXTAREA", "SELECT", "MULTISELECT", "NUMBER", "BOOLEAN", "DATE", "TIME"];
    for (const fieldType of types) {
      const result = requirementFieldSchema.safeParse({
        id: "f1",
        serviceId: "s1",
        key: "k",
        label: "Label",
        fieldType,
        isRequired: true,
        displayOrder: 0,
        placeholder: null,
        helpText: null,
        minLength: null,
        maxLength: null,
        minValue: null,
        maxValue: null,
        minSelections: null,
        maxSelections: null,
        options: [],
      });
      expect(result.success, `expected ${fieldType} to be a valid field type`).toBe(true);
    }
  });

  it("rejects a field type the backend hasn't defined", () => {
    const result = requirementFieldSchema.safeParse({
      id: "f1",
      serviceId: "s1",
      key: "k",
      label: "Label",
      fieldType: "RADIO",
      isRequired: true,
      displayOrder: 0,
      placeholder: null,
      helpText: null,
      minLength: null,
      maxLength: null,
      minValue: null,
      maxValue: null,
      minSelections: null,
      maxSelections: null,
      options: [],
    });
    expect(result.success).toBe(false);
  });
});

describe("categoryPageSchema", () => {
  it("requires the pagination envelope alongside the data array", () => {
    const result = categoryPageSchema.safeParse({ data: [] });
    expect(result.success).toBe(false);
  });

  it("accepts an empty data array with pagination", () => {
    const result = categoryPageSchema.safeParse({
      data: [],
      pagination: { page: 1, pageSize: 20, total: 0, totalPages: 0 },
    });
    expect(result.success).toBe(true);
  });
});

describe("requirementsResponseSchema", () => {
  it("requires the fields array wrapper", () => {
    expect(requirementsResponseSchema.safeParse([]).success).toBe(false);
    expect(requirementsResponseSchema.safeParse({ fields: [] }).success).toBe(true);
  });
});
