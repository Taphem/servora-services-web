import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { RequirementField } from "@/lib/api/schemas";
import type { RequirementAnswers, RequirementAnswerValue } from "@/lib/validation/requirements";

interface RequirementSummaryProps {
  serviceName: string;
  fields: RequirementField[];
  answers: RequirementAnswers;
  onEdit: () => void;
}

/**
 * Shown once the customer's requirement answers pass validation. There is
 * no booking/provider-matching API for this milestone, so "Find
 * providers" is intentionally disabled rather than faking a result —
 * this is the deliberate stopping point in the customer journey until
 * that backend contract exists.
 */
export function RequirementSummary({ serviceName, fields, answers, onEdit }: RequirementSummaryProps) {
  return (
    <div className="flex flex-col gap-5 rounded-lg border border-brand-200 bg-brand-50 p-5">
      <div className="flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-100 text-text-brand">
          <CheckCircle2 size={18} aria-hidden />
        </span>
        <div>
          <p className="font-medium text-ink-900">Your details are ready</p>
          <p className="mt-1 text-sm leading-relaxed text-text-secondary">
            We&apos;ve captured what you told us about your {serviceName.toLowerCase()} request. Matching you
            with available providers isn&apos;t available yet — we&apos;ll let you know as soon as it is.
          </p>
        </div>
      </div>

      <dl className="grid grid-cols-1 gap-3 rounded-md bg-surface-raised p-4 sm:grid-cols-2">
        {fields.map((field) => (
          <div key={field.id}>
            <dt className="text-label uppercase text-text-tertiary">{field.label}</dt>
            <dd className="mt-0.5 break-words text-sm text-ink-900">{formatAnswer(field, answers[field.key])}</dd>
          </div>
        ))}
      </dl>

      <div className="flex flex-wrap gap-3">
        <Button variant="secondary" onClick={onEdit}>
          Edit details
        </Button>
        <Button variant="primary" disabled>
          Find providers (coming soon)
        </Button>
      </div>
    </div>
  );
}

function formatAnswer(field: RequirementField, value: RequirementAnswerValue): string {
  if (value === undefined || value === "" || (Array.isArray(value) && value.length === 0)) {
    return "—";
  }
  if (field.fieldType === "BOOLEAN") return value ? "Yes" : "No";
  if (field.fieldType === "MULTISELECT" && Array.isArray(value)) {
    return value.map((v) => field.options.find((option) => option.value === v)?.label ?? v).join(", ");
  }
  if (field.fieldType === "SELECT") {
    return field.options.find((option) => option.value === value)?.label ?? String(value);
  }
  return String(value);
}
