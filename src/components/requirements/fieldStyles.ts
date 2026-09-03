/** Shared control styling for every requirement field input, kept separate from label/help/error markup which the RequirementField wrapper owns. */
export const fieldControlClass =
  "h-11 w-full rounded-md border bg-surface-raised px-4 text-sm text-ink-900 placeholder:text-text-tertiary transition-colors duration-[var(--duration-fast)] border-border-default hover:border-border-strong focus:border-primary disabled:cursor-not-allowed disabled:border-border-subtle disabled:bg-ink-50 disabled:text-text-tertiary";

export const fieldErrorBorderClass = "border-error hover:border-error focus:border-error";
