import { cn } from "@/lib/utils";
import { fieldControlClass, fieldErrorBorderClass } from "@/components/requirements/fieldStyles";
import type { RequirementField } from "@/lib/api/schemas";

interface NumberFieldProps {
  field: RequirementField;
  value: string;
  hasError: boolean;
  controlId: string;
  describedById?: string;
  onChange: (value: string) => void;
  onBlur: () => void;
}

export function NumberField({ field, value, hasError, controlId, describedById, onChange, onBlur }: NumberFieldProps) {
  return (
    <input
      id={controlId}
      type="number"
      inputMode="decimal"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      onBlur={onBlur}
      placeholder={field.placeholder ?? undefined}
      required={field.isRequired}
      min={field.minValue ?? undefined}
      max={field.maxValue ?? undefined}
      aria-invalid={hasError || undefined}
      aria-describedby={describedById}
      className={cn(fieldControlClass, hasError && fieldErrorBorderClass)}
    />
  );
}
