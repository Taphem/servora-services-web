import type { RequirementField as RequirementFieldSchema } from "@/lib/api/schemas";
import type { RequirementAnswerValue } from "@/lib/validation/requirements";
import { TextField } from "@/components/requirements/fields/TextField";
import { TextareaField } from "@/components/requirements/fields/TextareaField";
import { SelectField } from "@/components/requirements/fields/SelectField";
import { MultiSelectField } from "@/components/requirements/fields/MultiSelectField";
import { NumberField } from "@/components/requirements/fields/NumberField";
import { BooleanField } from "@/components/requirements/fields/BooleanField";
import { DateField } from "@/components/requirements/fields/DateField";
import { TimeField } from "@/components/requirements/fields/TimeField";

interface RequirementFieldProps {
  field: RequirementFieldSchema;
  value: RequirementAnswerValue;
  error?: string;
  onChange: (value: RequirementAnswerValue) => void;
  onBlur: () => void;
}

/**
 * Renders one requirement field from the backend-defined schema. This is
 * the only place that switches on `field.fieldType` — every field type
 * the backend can send (TEXT/TEXTAREA/SELECT/MULTISELECT/NUMBER/
 * BOOLEAN/DATE/TIME) already has a case here, so a new requirement of an
 * already-supported type needs no frontend change, only a backend one.
 */
export function RequirementField({ field, value, error, onChange, onBlur }: RequirementFieldProps) {
  const controlId = `requirement-${field.key}`;
  const describedById = error || field.helpText ? `${controlId}-hint` : undefined;

  const hint = error ? (
    <p id={describedById} className="text-xs text-error">
      {error}
    </p>
  ) : field.helpText ? (
    <p id={describedById} className="text-xs text-text-muted">
      {field.helpText}
    </p>
  ) : null;

  if (field.fieldType === "BOOLEAN") {
    return (
      <div className="flex flex-col gap-1.5">
        <BooleanField
          field={field}
          value={typeof value === "boolean" ? value : false}
          controlId={controlId}
          describedById={describedById}
          onChange={onChange}
          onBlur={onBlur}
        />
        {hint}
      </div>
    );
  }

  if (field.fieldType === "MULTISELECT") {
    return (
      <fieldset className="flex flex-col gap-2">
        <legend className="text-sm font-medium text-ink-700">
          {field.label}
          {field.isRequired ? <span className="ml-1 text-error">*</span> : null}
        </legend>
        <MultiSelectField
          field={field}
          value={Array.isArray(value) ? value : []}
          describedById={describedById}
          onChange={onChange}
          onBlur={onBlur}
        />
        {hint}
      </fieldset>
    );
  }

  const stringValue = typeof value === "string" ? value : "";
  const hasError = Boolean(error);
  const commonProps = {
    field,
    value: stringValue,
    hasError,
    controlId,
    describedById,
    onChange,
    onBlur,
  };

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={controlId} className="text-sm font-medium text-ink-700">
        {field.label}
        {field.isRequired ? <span className="ml-1 text-error">*</span> : null}
      </label>
      {field.fieldType === "TEXT" && <TextField {...commonProps} />}
      {field.fieldType === "TEXTAREA" && <TextareaField {...commonProps} />}
      {field.fieldType === "SELECT" && <SelectField {...commonProps} />}
      {field.fieldType === "NUMBER" && <NumberField {...commonProps} />}
      {field.fieldType === "DATE" && <DateField {...commonProps} />}
      {field.fieldType === "TIME" && <TimeField {...commonProps} />}
      {hint}
    </div>
  );
}
