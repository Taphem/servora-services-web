import { describe, expect, it } from "vitest";
import { env } from "@/lib/env";

describe("env", () => {
  it("only exposes NEXT_PUBLIC_-safe values (site URL and API base URL), nothing secret-shaped", () => {
    const keys = Object.keys(env);
    expect(keys.sort()).toEqual(["apiBaseUrl", "siteUrl"]);
    for (const key of keys) {
      expect(key.toLowerCase()).not.toMatch(/secret|token|password|credential/);
    }
  });

  it("has a working default API base URL even with zero configuration", () => {
    expect(env.apiBaseUrl).toMatch(/^https?:\/\//);
  });

  it("never defaults to a Render-internal *.onrender.com origin for the API base URL", () => {
    expect(env.apiBaseUrl).not.toMatch(/onrender\.com/);
  });
});
