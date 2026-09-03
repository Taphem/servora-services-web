import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { fieldControlClass, fieldErrorBorderClass } from "@/components/requirements/fieldStyles";
import type { RequirementField } from "@/lib/api/schemas";

interface SelectFieldProps {
  field: RequirementField;
  value: string;
  hasError: boolean;
  controlId: string;
  describedById?: string;
  onChange: (value: string) => void;
  onBlur: () => void;
}

export function SelectField({
  field,
  value,
  hasError,
  controlId,
  describedById,
  onChange,
  onBlur,
}: SelectFieldProps) {
  const options = [...field.options].sort((a, b) => a.displayOrder - b.displayOrder);

  return (
    <div className="relative">
      <select
        id={controlId}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onBlur={onBlur}
        required={field.isRequired}
        aria-invalid={hasError || undefined}
        aria-describedby={describedById}
        className={cn(fieldControlClass, "appearance-none pr-10", hasError && fieldErrorBorderClass)}
      >
        <option value="" disabled>
          {field.placeholder ?? "Select an option"}
        </option>
        {options.map((option) => (
          <option key={option.id} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown
        size={16}
        aria-hidden
        className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-text-tertiary"
      />
    </div>
  );
}
