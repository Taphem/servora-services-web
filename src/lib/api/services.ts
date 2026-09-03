import { apiGet } from "@/lib/api/client";
import {
  categoryPageSchema,
  categorySchema,
  requirementsResponseSchema,
  servicePageSchema,
  serviceSchema,
  type BookingMode,
} from "@/lib/api/schemas";

/**
 * Domain-specific calls into servora-services (via the API Gateway).
 * Keep every fetch() for the service catalog behind this module — no
 * component should call apiGet()/fetch() directly. Route paths and
 * query params here are exactly what the backend supports; nothing is
 * invented (e.g. there is no `search` query param on the catalog route).
 */

interface FetchOptions {
  revalidate?: number | false;
  signal?: AbortSignal;
}

export function getCategories(
  params: { page?: number; pageSize?: number; parentId?: string } = {},
  options: FetchOptions = {},
) {
  return apiGet("/api/v1/services/categories", {
    schema: categoryPageSchema,
    searchParams: params,
    tags: ["categories"],
    ...options,
  });
}

export function getCategory(idOrSlug: string, options: FetchOptions = {}) {
  return apiGet(`/api/v1/services/categories/${encodeURIComponent(idOrSlug)}`, {
    schema: categorySchema,
    tags: ["categories", `category:${idOrSlug}`],
    ...options,
  });
}

export function getCatalog(
  params: {
    page?: number;
    pageSize?: number;
    categoryId?: string;
    categorySlug?: string;
    bookingMode?: BookingMode;
  } = {},
  options: FetchOptions = {},
) {
  return apiGet("/api/v1/services/catalog", {
    schema: servicePageSchema,
    searchParams: params,
    tags: ["catalog"],
    ...options,
  });
}

export function getService(idOrSlug: string, options: FetchOptions = {}) {
  return apiGet(`/api/v1/services/catalog/${encodeURIComponent(idOrSlug)}`, {
    schema: serviceSchema,
    tags: ["catalog", `service:${idOrSlug}`],
    ...options,
  });
}

export async function getServiceRequirements(idOrSlug: string, options: FetchOptions = {}) {
  const response = await apiGet(`/api/v1/services/catalog/${encodeURIComponent(idOrSlug)}/requirements`, {
    schema: requirementsResponseSchema,
    tags: [`requirements:${idOrSlug}`],
    ...options,
  });
  return response.fields;
}
