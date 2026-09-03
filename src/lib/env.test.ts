import { describe, expect, it } from "vitest";
import { env, servicePath } from "@/lib/env";

describe("env", () => {
  it("only exposes NEXT_PUBLIC_-safe values (site URL, API base URL, base path), nothing secret-shaped", () => {
    const keys = Object.keys(env);
    expect(keys.sort()).toEqual(["apiBaseUrl", "basePath", "siteUrl"]);
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

  it("defaults the mount path to /services", () => {
    expect(env.basePath).toBe("/services");
  });
});

describe("servicePath", () => {
  it("returns the mount path root when called with no segment", () => {
    expect(servicePath()).toBe(env.basePath);
  });

  it("prefixes a given segment with the mount path", () => {
    expect(servicePath("/category/ac-repair")).toBe(`${env.basePath}/category/ac-repair`);
    expect(servicePath("/ac-repair")).toBe(`${env.basePath}/ac-repair`);
  });
});
