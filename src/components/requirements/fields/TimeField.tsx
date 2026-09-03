import { cn } from "@/lib/utils";
import { fieldControlClass, fieldErrorBorderClass } from "@/components/requirements/fieldStyles";
import type { RequirementField } from "@/lib/api/schemas";

interface TimeFieldProps {
  field: RequirementField;
  value: string;
  hasError: boolean;
  controlId: string;
  describedById?: string;
  onChange: (value: string) => void;
  onBlur: () => void;
}

export function TimeField({ field, value, hasError, controlId, describedById, onChange, onBlur }: TimeFieldProps) {
  return (
    <input
      id={controlId}
      type="time"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      onBlur={onBlur}
      required={field.isRequired}
      aria-invalid={hasError || undefined}
      aria-describedby={describedById}
      className={cn(fieldControlClass, hasError && fieldErrorBorderClass)}
    />
  );
}
