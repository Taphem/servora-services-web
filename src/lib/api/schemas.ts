import { z } from "zod";

/**
 * Runtime schemas for every shape the Services backend (via the API
 * Gateway) can return. The backend is authoritative — these schemas
 * exist so a malformed or unexpected response fails loudly and safely
 * instead of the frontend silently rendering broken UI or inventing
 * fallback data. Field names and types are mirrored exactly from
 * servora-services' domain types (src/domain/types.ts) and Postgres
 * schema — see NUMERIC-as-string fields below.
 */

export const categoryStatusSchema = z.enum(["ACTIVE", "INACTIVE"]);
export type CategoryStatus = z.infer<typeof categoryStatusSchema>;

export const serviceStatusSchema = z.enum(["DRAFT", "ACTIVE", "INACTIVE"]);
export type ServiceStatus = z.infer<typeof serviceStatusSchema>;

export const bookingModeSchema = z.enum(["INSTANT_ACCEPT", "PROVIDER_SELECTION", "QUOTE"]);
export type BookingMode = z.infer<typeof bookingModeSchema>;

export const pricingModelSchema = z.enum(["FIXED", "HOURLY", "QUOTE"]);
export type PricingModel = z.infer<typeof pricingModelSchema>;

export const requirementFieldTypeSchema = z.enum([
  "TEXT",
  "TEXTAREA",
  "SELECT",
  "MULTISELECT",
  "NUMBER",
  "BOOLEAN",
  "DATE",
  "TIME",
]);
export type RequirementFieldType = z.infer<typeof requirementFieldTypeSchema>;

export const categorySchema = z.object({
  id: z.string(),
  parentId: z.string().nullable(),
  name: z.string(),
  slug: z.string(),
  description: z.string().nullable(),
  displayOrder: z.number(),
  status: categoryStatusSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type Category = z.infer<typeof categorySchema>;

export const serviceSchema = z.object({
  id: z.string(),
  categoryId: z.string(),
  name: z.string(),
  slug: z.string(),
  description: z.string().nullable(),
  status: serviceStatusSchema,
  bookingMode: bookingModeSchema,
  pricingModel: pricingModelSchema,
  // NUMERIC(12,2) columns are returned by the DB driver as strings, not
  // numbers (no parseFloat happens server-side) — model them as strings
  // here rather than coercing, so precision is never silently lost.
  basePriceAmount: z.string().nullable(),
  basePriceCurrency: z.string().nullable(),
  displayOrder: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type Service = z.infer<typeof serviceSchema>;

export const requirementFieldOptionSchema = z.object({
  id: z.string(),
  value: z.string(),
  label: z.string(),
  displayOrder: z.number(),
});
export type RequirementFieldOption = z.infer<typeof requirementFieldOptionSchema>;

export const requirementFieldSchema = z.object({
  id: z.string(),
  serviceId: z.string(),
  key: z.string(),
  label: z.string(),
  fieldType: requirementFieldTypeSchema,
  isRequired: z.boolean(),
  displayOrder: z.number(),
  placeholder: z.string().nullable(),
  helpText: z.string().nullable(),
  minLength: z.number().nullable(),
  maxLength: z.number().nullable(),
  minValue: z.string().nullable(),
  maxValue: z.string().nullable(),
  minSelections: z.number().nullable(),
  maxSelections: z.number().nullable(),
  options: z.array(requirementFieldOptionSchema),
});
export type RequirementField = z.infer<typeof requirementFieldSchema>;

export const paginationMetaSchema = z.object({
  page: z.number(),
  pageSize: z.number(),
  total: z.number(),
  totalPages: z.number(),
});
export type PaginationMeta = z.infer<typeof paginationMetaSchema>;

function pageSchema<T extends z.ZodTypeAny>(item: T) {
  return z.object({ data: z.array(item), pagination: paginationMetaSchema });
}

export const categoryPageSchema = pageSchema(categorySchema);
export type CategoryPage = z.infer<typeof categoryPageSchema>;

export const servicePageSchema = pageSchema(serviceSchema);
export type ServicePage = z.infer<typeof servicePageSchema>;

export const requirementsResponseSchema = z.object({
  fields: z.array(requirementFieldSchema),
});

export const apiErrorEnvelopeSchema = z.object({
  error: z.object({
    code: z.string(),
    message: z.string(),
    requestId: z.string().optional(),
  }),
});
export type ApiErrorBody = z.infer<typeof apiErrorEnvelopeSchema>;
