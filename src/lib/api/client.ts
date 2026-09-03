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

/**
 * Every call site of apiGet() today runs inside a Server Component or
 * generateMetadata(), so this only ever executes on the server (Vercel's
 * function logs), never in the browser — the customer-facing message
 * stays generic (see the various error.tsx files). This exists because
 * Next.js redacts a Server Component's thrown error before it reaches a
 * Client error boundary in production (a generic digest-only message,
 * by design, to avoid leaking arbitrary error text to the browser), so
 * without an explicit log here, a failure upstream of this app — e.g.
 * the API Gateway or a downstream service being unreachable or
 * misconfigured — would otherwise be invisible anywhere a developer
 * could see it. Logs only the backend's own structured error fields
 * (code/message/requestId — already meant to be shared for support and
 * cross-service log correlation) plus the request URL, never response
 * bodies or headers that might carry something unexpected.
 */
function logFetchFailure(url: string, code: string, message: string, status?: number, requestId?: string) {
  console.error(`[servora-services-web] GET ${url} failed`, { status, code, requestId, message });
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
      logFetchFailure(url, ClientErrorCode.Timeout, "request timed out");
      throw new ApiError(ClientErrorCode.Timeout, "The request took too long. Please try again.", 0);
    }
    logFetchFailure(url, ClientErrorCode.NetworkError, cause instanceof Error ? cause.message : String(cause));
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
      logFetchFailure(
        url,
        errorBody.data.error.code,
        errorBody.data.error.message,
        response.status,
        errorBody.data.error.requestId,
      );
      throw new ApiError(
        errorBody.data.error.code,
        errorBody.data.error.message,
        response.status,
        errorBody.data.error.requestId,
      );
    }
    logFetchFailure(url, ClientErrorCode.MalformedResponse, "non-2xx response without the expected error envelope", response.status);
    throw new ApiError(
      ClientErrorCode.MalformedResponse,
      "Something went wrong on our end. Please try again.",
      response.status,
    );
  }

  const result = options.schema.safeParse(payload);
  if (!result.success) {
    logFetchFailure(url, ClientErrorCode.MalformedResponse, result.error.message, response.status);
    throw new ApiError(
      ClientErrorCode.MalformedResponse,
      "The server returned data in an unexpected format.",
      response.status,
    );
  }

  return result.data;
}
