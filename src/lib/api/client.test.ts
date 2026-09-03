import { afterEach, describe, expect, it, vi } from "vitest";
import { z } from "zod";
import { apiGet, ApiError, ClientErrorCode } from "@/lib/api/client";

function mockFetchOnce(response: { ok: boolean; status: number; json: () => Promise<unknown> }) {
  const fetchMock = vi.fn().mockResolvedValue(response);
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

afterEach(() => {
  vi.unstubAllGlobals();
});

const itemSchema = z.object({ id: z.string(), name: z.string() });

describe("apiGet", () => {
  it("returns the parsed payload when it matches the schema", async () => {
    mockFetchOnce({ ok: true, status: 200, json: async () => ({ id: "1", name: "AC Repair" }) });

    const result = await apiGet("/api/v1/services/catalog/ac-repair", { schema: itemSchema });

    expect(result).toEqual({ id: "1", name: "AC Repair" });
  });

  it("sends credentials: include on every request", async () => {
    const fetchMock = mockFetchOnce({ ok: true, status: 200, json: async () => ({ id: "1", name: "x" }) });

    await apiGet("/api/v1/services/categories", { schema: itemSchema });

    expect(fetchMock).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ credentials: "include" }),
    );
  });

  it("throws a MalformedResponse ApiError when the success payload doesn't match the schema", async () => {
    mockFetchOnce({ ok: true, status: 200, json: async () => ({ unexpected: true }) });

    await expect(apiGet("/api/v1/services/catalog/x", { schema: itemSchema })).rejects.toMatchObject({
      code: ClientErrorCode.MalformedResponse,
    });
  });

  it("throws an ApiError built from the backend's error envelope on a non-2xx response", async () => {
    mockFetchOnce({
      ok: false,
      status: 404,
      json: async () => ({ error: { code: "SERVICE_NOT_FOUND", message: "Service not found", requestId: "req-1" } }),
    });

    await expect(apiGet("/api/v1/services/catalog/missing", { schema: itemSchema })).rejects.toMatchObject({
      code: "SERVICE_NOT_FOUND",
      status: 404,
      requestId: "req-1",
    });
  });

  it("throws a MalformedResponse ApiError when a non-2xx body isn't the expected error envelope", async () => {
    mockFetchOnce({ ok: false, status: 500, json: async () => ({ oops: "not an envelope" }) });

    await expect(apiGet("/api/v1/services/catalog/x", { schema: itemSchema })).rejects.toMatchObject({
      code: ClientErrorCode.MalformedResponse,
      status: 500,
    });
  });

  it("throws a NetworkError ApiError when fetch itself rejects", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new Error("network down")),
    );

    await expect(apiGet("/api/v1/services/catalog/x", { schema: itemSchema })).rejects.toMatchObject({
      code: ClientErrorCode.NetworkError,
    });
  });

  it("exposes isNotFound for 404 responses", async () => {
    mockFetchOnce({
      ok: false,
      status: 404,
      json: async () => ({ error: { code: "CATEGORY_NOT_FOUND", message: "Not found" } }),
    });

    try {
      await apiGet("/api/v1/services/categories/missing", { schema: itemSchema });
      expect.unreachable();
    } catch (error) {
      expect(error).toBeInstanceOf(ApiError);
      expect((error as ApiError).isNotFound).toBe(true);
    }
  });

  it("logs the upstream error's code/status/requestId server-side on a non-2xx response", async () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    mockFetchOnce({
      ok: false,
      status: 503,
      json: async () => ({
        error: { code: "DOWNSTREAM_NOT_CONFIGURED", message: "not configured", requestId: "req-9" },
      }),
    });

    await expect(apiGet("/api/v1/services/catalog", { schema: itemSchema })).rejects.toBeInstanceOf(ApiError);

    expect(errorSpy).toHaveBeenCalledWith(
      expect.stringContaining("/api/v1/services/catalog"),
      expect.objectContaining({ status: 503, code: "DOWNSTREAM_NOT_CONFIGURED", requestId: "req-9" }),
    );
    errorSpy.mockRestore();
  });

  it("logs a network failure server-side without swallowing it silently", async () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("network down")));

    await expect(apiGet("/api/v1/services/catalog", { schema: itemSchema })).rejects.toBeInstanceOf(ApiError);

    expect(errorSpy).toHaveBeenCalledWith(
      expect.stringContaining("/api/v1/services/catalog"),
      expect.objectContaining({ code: ClientErrorCode.NetworkError }),
    );
    errorSpy.mockRestore();
  });
});
