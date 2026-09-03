import { Checkbox } from "@/components/ui/Checkbox";
import type { RequirementField } from "@/lib/api/schemas";

interface BooleanFieldProps {
  field: RequirementField;
  value: boolean;
  controlId: string;
  describedById?: string;
  onChange: (value: boolean) => void;
  onBlur: () => void;
}

export function BooleanField({ field, value, controlId, describedById, onChange, onBlur }: BooleanFieldProps) {
  return (
    <Checkbox
      id={controlId}
      label={field.label}
      required={field.isRequired}
      checked={value}
      onChange={(event) => onChange(event.target.checked)}
      onBlur={onBlur}
      aria-describedby={describedById}
    />
  );
}
