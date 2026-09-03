import { Checkbox } from "@/components/ui/Checkbox";
import type { RequirementField } from "@/lib/api/schemas";

interface MultiSelectFieldProps {
  field: RequirementField;
  value: string[];
  describedById?: string;
  onChange: (value: string[]) => void;
  onBlur: () => void;
}

export function MultiSelectField({ field, value, describedById, onChange, onBlur }: MultiSelectFieldProps) {
  const options = [...field.options].sort((a, b) => a.displayOrder - b.displayOrder);

  function toggle(optionValue: string, checked: boolean) {
    onChange(checked ? [...value, optionValue] : value.filter((v) => v !== optionValue));
  }

  return (
    <div aria-describedby={describedById} className="flex flex-col gap-1">
      {options.map((option) => (
        <Checkbox
          key={option.id}
          label={option.label}
          checked={value.includes(option.value)}
          onChange={(event) => toggle(option.value, event.target.checked)}
          onBlur={onBlur}
        />
      ))}
    </div>
  );
}
