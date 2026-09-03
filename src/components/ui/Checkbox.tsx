import { useId, type InputHTMLAttributes } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "id" | "type"> {
  id?: string;
  label: string;
  required?: boolean;
}

/** A single checkbox with its own visible label, styled to match the rest of the form kit. */
export function Checkbox({ label, id, className, checked, required, ...rest }: CheckboxProps) {
  const generatedId = useId();
  const checkboxId = id ?? generatedId;

  return (
    <label
      htmlFor={checkboxId}
      className={cn(
        "flex cursor-pointer items-center gap-2.5 rounded-md py-1 text-sm text-ink-800 select-none",
        rest.disabled && "cursor-not-allowed text-text-tertiary",
      )}
    >
      <span className="relative flex h-5 w-5 shrink-0 items-center justify-center">
        <input
          id={checkboxId}
          type="checkbox"
          checked={checked}
          className={cn(
            "peer h-5 w-5 shrink-0 appearance-none rounded-[6px] border border-border-strong bg-surface-raised transition-colors duration-[var(--duration-fast)]",
            "checked:border-primary checked:bg-primary",
            "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-brand-500)]",
            "disabled:cursor-not-allowed disabled:border-border-subtle disabled:bg-ink-50",
            className,
          )}
          {...rest}
        />
        <Check
          size={13}
          strokeWidth={3}
          aria-hidden
          className="pointer-events-none absolute text-white opacity-0 peer-checked:opacity-100"
        />
      </span>
      {label}
      {required ? <span className="text-error">*</span> : null}
    </label>
  );
}
