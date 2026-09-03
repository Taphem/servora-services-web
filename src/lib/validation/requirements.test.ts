import { describe, expect, it } from "vitest";
import { defaultAnswers, validateAnswers, validateField } from "@/lib/validation/requirements";
import type { RequirementField } from "@/lib/api/schemas";

function field(overrides: Partial<RequirementField>): RequirementField {
  return {
    id: "field-1",
    serviceId: "service-1",
    key: "problem",
    label: "Describe the problem",
    fieldType: "TEXT",
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
    ...overrides,
  };
}

describe("validateField", () => {
  it("requires a value when the field is required", () => {
    expect(validateField(field({ fieldType: "TEXT" }), "")).toBe("This field is required.");
    expect(validateField(field({ fieldType: "TEXT" }), "hello")).toBeNull();
  });

  it("allows a blank value for optional fields", () => {
    expect(validateField(field({ fieldType: "TEXT", isRequired: false }), "")).toBeNull();
  });

  it("enforces TEXT min/max length", () => {
    const f = field({ fieldType: "TEXT", minLength: 3, maxLength: 5 });
    expect(validateField(f, "ab")).toMatch(/at least 3/);
    expect(validateField(f, "abcdef")).toMatch(/at most 5/);
    expect(validateField(f, "abcd")).toBeNull();
  });

  it("enforces TEXTAREA min/max length", () => {
    const f = field({ fieldType: "TEXTAREA", minLength: 10 });
    expect(validateField(f, "too short")).toMatch(/at least 10/);
  });

  it("validates SELECT against the option list", () => {
    const f = field({
      fieldType: "SELECT",
      options: [
        { id: "o1", value: "split", label: "Split AC", displayOrder: 0 },
        { id: "o2", value: "window", label: "Window AC", displayOrder: 1 },
      ],
    });
    expect(validateField(f, "split")).toBeNull();
    expect(validateField(f, "not-an-option")).toBe("Choose one of the listed options.");
  });

  it("validates MULTISELECT membership and min/max selections", () => {
    const f = field({
      fieldType: "MULTISELECT",
      isRequired: false,
      minSelections: 1,
      maxSelections: 2,
      options: [
        { id: "o1", value: "a", label: "A", displayOrder: 0 },
        { id: "o2", value: "b", label: "B", displayOrder: 1 },
        { id: "o3", value: "c", label: "C", displayOrder: 2 },
      ],
    });
    expect(validateField(f, [])).toBeNull(); // optional, blank is fine
    expect(validateField(f, ["a", "b", "c"])).toMatch(/at most 2/);
    expect(validateField(f, ["not-an-option"])).toBe("Contains an option that isn't offered.");
    expect(validateField(f, ["a"])).toBeNull();
  });

  it("enforces MULTISELECT minSelections even when required is false but minSelections is set", () => {
    const f = field({
      fieldType: "MULTISELECT",
      isRequired: false,
      minSelections: 2,
      options: [
        { id: "o1", value: "a", label: "A", displayOrder: 0 },
        { id: "o2", value: "b", label: "B", displayOrder: 1 },
      ],
    });
    expect(validateField(f, ["a"])).toMatch(/at least 2/);
  });

  it("validates NUMBER range and numeric-ness", () => {
    const f = field({ fieldType: "NUMBER", minValue: "1", maxValue: "10" });
    expect(validateField(f, "not-a-number")).toBe("Enter a valid number.");
    expect(validateField(f, "0")).toMatch(/at least 1/);
    expect(validateField(f, "11")).toMatch(/at most 10/);
    expect(validateField(f, "5")).toBeNull();
  });

  it("requires BOOLEAN fields to be checked when required", () => {
    const f = field({ fieldType: "BOOLEAN" });
    expect(validateField(f, false)).toBe("This field is required.");
    expect(validateField(f, true)).toBeNull();
  });

  it("validates DATE as a real calendar date", () => {
    const f = field({ fieldType: "DATE" });
    expect(validateField(f, "not-a-date")).toBe("Enter a valid date.");
    expect(validateField(f, "2026-01-15")).toBeNull();
  });

  it("validates TIME against HH:MM", () => {
    const f = field({ fieldType: "TIME" });
    expect(validateField(f, "9am")).toBe("Enter a valid time.");
    expect(validateField(f, "09:30")).toBeNull();
    expect(validateField(f, "24:00")).toBe("Enter a valid time.");
  });
});

describe("validateAnswers", () => {
  it("returns an error map keyed by field key for every invalid field", () => {
    const fields = [
      field({ key: "problem", fieldType: "TEXT" }),
      field({ key: "urgent", fieldType: "BOOLEAN", isRequired: false }),
    ];
    const errors = validateAnswers(fields, { problem: "", urgent: false });
    expect(errors).toEqual({ problem: "This field is required." });
  });
});

describe("defaultAnswers", () => {
  it("seeds MULTISELECT as an empty array, BOOLEAN as false, and everything else as an empty string", () => {
    const fields = [
      field({ key: "a", fieldType: "MULTISELECT" }),
      field({ key: "b", fieldType: "BOOLEAN" }),
      field({ key: "c", fieldType: "NUMBER" }),
    ];
    expect(defaultAnswers(fields)).toEqual({ a: [], b: false, c: "" });
  });
});
