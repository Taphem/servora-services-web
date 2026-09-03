import type { RequirementField } from "@/lib/api/schemas";

/**
 * Frontend-only validation for the answers a customer types into a
 * dynamic requirement form, driven entirely by the constraints the
 * Services backend attaches to each field (isRequired, min/max length,
 * min/max value, min/max selections, the option list). This is a UX
 * convenience only — the backend remains the authoritative validator
 * when these answers are eventually submitted to Booking, and nothing
 * here should be read as loosening or replacing that.
 */

export type RequirementAnswerValue = string | number | boolean | string[] | undefined;
export type RequirementAnswers = Record<string, RequirementAnswerValue>;

const TIME_PATTERN = /^([01]\d|2[0-3]):([0-5]\d)$/;

function isBlank(value: RequirementAnswerValue): boolean {
  if (value === undefined || value === null) return true;
  if (typeof value === "string") return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  return false;
}

/** Validate a single field's current value; returns an error message, or null when valid. */
export function validateField(field: RequirementField, value: RequirementAnswerValue): string | null {
  if (isBlank(value)) {
    return field.isRequired ? "This field is required." : null;
  }

  switch (field.fieldType) {
    case "TEXT":
    case "TEXTAREA": {
      const text = String(value);
      if (field.minLength !== null && text.length < field.minLength) {
        return `Must be at least ${field.minLength} character${field.minLength === 1 ? "" : "s"}.`;
      }
      if (field.maxLength !== null && text.length > field.maxLength) {
        return `Must be at most ${field.maxLength} character${field.maxLength === 1 ? "" : "s"}.`;
      }
      return null;
    }
    case "SELECT": {
      const isKnownOption = field.options.some((option) => option.value === value);
      return isKnownOption ? null : "Choose one of the listed options.";
    }
    case "MULTISELECT": {
      const values = Array.isArray(value) ? value : [];
      const optionValues = new Set(field.options.map((option) => option.value));
      if (!values.every((v) => optionValues.has(v))) return "Contains an option that isn't offered.";
      if (field.minSelections !== null && values.length < field.minSelections) {
        return `Select at least ${field.minSelections}.`;
      }
      if (field.maxSelections !== null && values.length > field.maxSelections) {
        return `Select at most ${field.maxSelections}.`;
      }
      return null;
    }
    case "NUMBER": {
      const num = typeof value === "number" ? value : Number(value);
      if (!Number.isFinite(num)) return "Enter a valid number.";
      if (field.minValue !== null && num < Number(field.minValue)) {
        return `Must be at least ${field.minValue}.`;
      }
      if (field.maxValue !== null && num > Number(field.maxValue)) {
        return `Must be at most ${field.maxValue}.`;
      }
      return null;
    }
    case "BOOLEAN": {
      if (typeof value !== "boolean") return "Invalid value.";
      if (field.isRequired && value !== true) return "This field is required.";
      return null;
    }
    case "DATE": {
      const date = new Date(`${String(value)}T00:00:00`);
      return Number.isNaN(date.getTime()) ? "Enter a valid date." : null;
    }
    case "TIME":
      return TIME_PATTERN.test(String(value)) ? null : "Enter a valid time.";
    default:
      return null;
  }
}

/** Validate every field's current answer; returns a map of field key -> error message for invalid fields only. */
export function validateAnswers(
  fields: RequirementField[],
  answers: RequirementAnswers,
): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const field of fields) {
    const message = validateField(field, answers[field.key]);
    if (message) errors[field.key] = message;
  }
  return errors;
}

/** Initial answer state so every field starts as a controlled input. */
export function defaultAnswers(fields: RequirementField[]): RequirementAnswers {
  const answers: RequirementAnswers = {};
  for (const field of fields) {
    if (field.fieldType === "MULTISELECT") answers[field.key] = [];
    else if (field.fieldType === "BOOLEAN") answers[field.key] = false;
    else answers[field.key] = "";
  }
  return answers;
}
