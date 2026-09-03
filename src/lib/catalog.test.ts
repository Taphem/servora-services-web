import { describe, expect, it } from "vitest";
import { buildCategoryTree } from "@/lib/catalog";
import type { Category } from "@/lib/api/schemas";

function category(overrides: Partial<Category>): Category {
  return {
    id: "id",
    parentId: null,
    name: "Category",
    slug: "category",
    description: null,
    displayOrder: 0,
    status: "ACTIVE",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
    ...overrides,
  };
}

describe("buildCategoryTree", () => {
  it("nests children under their parent by parentId", () => {
    const categories = [
      category({ id: "home", name: "Home Services", parentId: null }),
      category({ id: "ac", name: "AC Repair", parentId: "home" }),
      category({ id: "plumbing", name: "Plumbing", parentId: "home" }),
    ];

    const tree = buildCategoryTree(categories);

    expect(tree).toHaveLength(1);
    expect(tree[0].id).toBe("home");
    expect(tree[0].children.map((c) => c.id).sort()).toEqual(["ac", "plumbing"]);
  });

  it("supports more than one level of nesting", () => {
    const categories = [
      category({ id: "home", parentId: null }),
      category({ id: "ac", parentId: "home" }),
      category({ id: "ac-install", name: "AC Installation", parentId: "ac" }),
    ];

    const tree = buildCategoryTree(categories);

    expect(tree[0].children[0].id).toBe("ac");
    expect(tree[0].children[0].children[0].id).toBe("ac-install");
  });

  it("treats a category whose parent isn't in the list as a root", () => {
    const categories = [category({ id: "orphan", parentId: "missing-parent" })];
    const tree = buildCategoryTree(categories);
    expect(tree).toHaveLength(1);
    expect(tree[0].id).toBe("orphan");
  });

  it("sorts siblings by displayOrder, then name", () => {
    const categories = [
      category({ id: "b", name: "B", displayOrder: 1 }),
      category({ id: "a", name: "A", displayOrder: 0 }),
    ];
    const tree = buildCategoryTree(categories);
    expect(tree.map((c) => c.id)).toEqual(["a", "b"]);
  });
});
