import { cn } from "@/lib/utils";
import { fieldControlClass, fieldErrorBorderClass } from "@/components/requirements/fieldStyles";
import type { RequirementField } from "@/lib/api/schemas";

interface TextFieldProps {
  field: RequirementField;
  value: string;
  hasError: boolean;
  controlId: string;
  describedById?: string;
  onChange: (value: string) => void;
  onBlur: () => void;
}

export function TextField({ field, value, hasError, controlId, describedById, onChange, onBlur }: TextFieldProps) {
  return (
    <input
      id={controlId}
      type="text"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      onBlur={onBlur}
      placeholder={field.placeholder ?? undefined}
      required={field.isRequired}
      minLength={field.minLength ?? undefined}
      maxLength={field.maxLength ?? undefined}
      aria-invalid={hasError || undefined}
      aria-describedby={describedById}
      className={cn(fieldControlClass, hasError && fieldErrorBorderClass)}
    />
  );
}
