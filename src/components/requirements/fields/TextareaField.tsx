import { cn } from "@/lib/utils";
import { fieldControlClass, fieldErrorBorderClass } from "@/components/requirements/fieldStyles";
import type { RequirementField } from "@/lib/api/schemas";

interface TextareaFieldProps {
  field: RequirementField;
  value: string;
  hasError: boolean;
  controlId: string;
  describedById?: string;
  onChange: (value: string) => void;
  onBlur: () => void;
}

export function TextareaField({
  field,
  value,
  hasError,
  controlId,
  describedById,
  onChange,
  onBlur,
}: TextareaFieldProps) {
  return (
    <textarea
      id={controlId}
      rows={4}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      onBlur={onBlur}
      placeholder={field.placeholder ?? undefined}
      required={field.isRequired}
      minLength={field.minLength ?? undefined}
      maxLength={field.maxLength ?? undefined}
      aria-invalid={hasError || undefined}
      aria-describedby={describedById}
      className={cn(fieldControlClass, "h-auto resize-y py-3", hasError && fieldErrorBorderClass)}
    />
  );
}
