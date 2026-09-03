import type { z } from "zod";
import { env } from "@/lib/env";
import { apiErrorEnvelopeSchema } from "@/lib/api/schemas";

/**
 * The one place a request leaves this app for the real backend. The
 * browser (and any server-side fetch during rendering) calls the API
 * Gateway only — never servora-services or any other downstream service
 * directly. `credentials: "include"` is set on every call so an existing
 * Servora session cookie round-trips when a future authenticated
 * endpoint needs it; today's public catalog endpoints don't require it.
 */

/** Frontend-only synthetic codes for failures that never reach the backend's own error envelope. */
export const ClientErrorCode = {
  /** fetch() itself threw — offline, DNS failure, CORS rejection, etc. */
  NetworkError: "CLIENT_NETWORK_ERROR",
  /** The request took too long and was aborted. */
  Timeout: "CLIENT_TIMEOUT",
  /** Response wasn't the `{ error: { code, message } }` envelope we expect, or the success payload didn't match its schema. */
  MalformedResponse: "CLIENT_MALFORMED_RESPONSE",
} as const;

export class ApiError extends Error {
  readonly code: string;
  readonly status: number;
  readonly requestId?: string;

  constructor(code: string, message: string, status: number, requestId?: string) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.status = status;
    this.requestId = requestId;
  }

  get isNotFound() {
    return this.status === 404;
  }
}

type SearchParamValue = string | number | boolean | undefined;

interface GetOptions<T> {
  /** Runtime schema the success payload must satisfy. */
  schema: z.ZodType<T>;
  searchParams?: Record<string, SearchParamValue>;
  /** Next.js fetch cache lifetime in seconds; `false` disables caching. Defaults to 60s — public catalog data is stable but not static. */
  revalidate?: number | false;
  /** Next.js cache tags, for on-demand invalidation later. */
  tags?: string[];
  signal?: AbortSignal;
  timeoutMs?: number;
}

function buildUrl(path: string, searchParams?: Record<string, SearchParamValue>): string {
  const url = new URL(path, env.apiBaseUrl);
  if (searchParams) {
    for (const [key, value] of Object.entries(searchParams)) {
      if (value !== undefined) url.searchParams.set(key, String(value));
    }
  }
  return url.toString();
}

export async function apiGet<T>(path: string, options: GetOptions<T>): Promise<T> {
  const url = buildUrl(path, options.searchParams);
  const timeoutSignal = AbortSignal.timeout(options.timeoutMs ?? 10_000);
  const signal = options.signal ? AbortSignal.any([options.signal, timeoutSignal]) : timeoutSignal;

  let response: Response;
  try {
    response = await fetch(url, {
      method: "GET",
      credentials: "include",
      signal,
      next: { revalidate: options.revalidate ?? 60, tags: options.tags },
    });
  } catch (cause) {
    if (cause instanceof Error && cause.name === "TimeoutError") {
      throw new ApiError(ClientErrorCode.Timeout, "The request took too long. Please try again.", 0);
    }
    throw new ApiError(
      ClientErrorCode.NetworkError,
      "Couldn't reach the server. Check your connection and try again.",
      0,
    );
  }

  let payload: unknown;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    const errorBody = apiErrorEnvelopeSchema.safeParse(payload);
    if (errorBody.success) {
      throw new ApiError(
        errorBody.data.error.code,
        errorBody.data.error.message,
        response.status,
        errorBody.data.error.requestId,
      );
    }
    throw new ApiError(
      ClientErrorCode.MalformedResponse,
      "Something went wrong on our end. Please try again.",
      response.status,
    );
  }

  const result = options.schema.safeParse(payload);
  if (!result.success) {
    throw new ApiError(
      ClientErrorCode.MalformedResponse,
      "The server returned data in an unexpected format.",
      response.status,
    );
  }

  return result.data;
}
