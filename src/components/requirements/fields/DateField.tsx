import { cn } from "@/lib/utils";
import { fieldControlClass, fieldErrorBorderClass } from "@/components/requirements/fieldStyles";
import type { RequirementField } from "@/lib/api/schemas";

interface DateFieldProps {
  field: RequirementField;
  value: string;
  hasError: boolean;
  controlId: string;
  describedById?: string;
  onChange: (value: string) => void;
  onBlur: () => void;
}

export function DateField({ field, value, hasError, controlId, describedById, onChange, onBlur }: DateFieldProps) {
  return (
    <input
      id={controlId}
      type="date"
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
