"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { RequirementField } from "@/components/requirements/RequirementField";
import { RequirementSummary } from "@/components/requirements/RequirementSummary";
import {
  defaultAnswers,
  validateAnswers,
  validateField,
  type RequirementAnswers,
  type RequirementAnswerValue,
} from "@/lib/validation/requirements";
import type { RequirementField as RequirementFieldSchema } from "@/lib/api/schemas";

interface RequirementFormProps {
  serviceName: string;
  fields: RequirementFieldSchema[];
}

/**
 * Renders every requirement field from the given schema and validates
 * answers for UX only — the backend remains the authoritative validator
 * whenever these answers are eventually submitted to Booking.
 */
export function RequirementForm({ serviceName, fields }: RequirementFormProps) {
  const orderedFields = [...fields].sort((a, b) => a.displayOrder - b.displayOrder);

  const [answers, setAnswers] = useState<RequirementAnswers>(() => defaultAnswers(orderedFields));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submittedAnswers, setSubmittedAnswers] = useState<RequirementAnswers | null>(null);

  function fieldFor(key: string) {
    return orderedFields.find((field) => field.key === key);
  }

  function revalidate(key: string, value: RequirementAnswerValue) {
    const field = fieldFor(key);
    if (!field) return;
    const message = validateField(field, value);
    setErrors((prev) => {
      const next = { ...prev };
      if (message) next[key] = message;
      else delete next[key];
      return next;
    });
  }

  function handleChange(key: string, value: RequirementAnswerValue) {
    setAnswers((prev) => ({ ...prev, [key]: value }));
    if (touched[key]) revalidate(key, value);
  }

  function handleBlur(key: string) {
    setTouched((prev) => ({ ...prev, [key]: true }));
    revalidate(key, answers[key]);
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const validationErrors = validateAnswers(orderedFields, answers);
    setErrors(validationErrors);
    setTouched(Object.fromEntries(orderedFields.map((field) => [field.key, true])));

    const firstInvalidKey = orderedFields.find((field) => validationErrors[field.key])?.key;
    if (firstInvalidKey) {
      document.getElementById(`requirement-${firstInvalidKey}`)?.focus();
      return;
    }

    setSubmitting(true);
    // No booking submission endpoint exists yet for these answers — see
    // RequirementSummary for the deliberate "what happens next" state.
    window.setTimeout(() => {
      setSubmitting(false);
      setSubmittedAnswers(answers);
    }, 300);
  }

  if (orderedFields.length === 0) {
    return (
      <p className="text-sm text-text-secondary">
        This service doesn&apos;t require any additional details before you continue.
      </p>
    );
  }

  if (submittedAnswers) {
    return (
      <RequirementSummary
        serviceName={serviceName}
        fields={orderedFields}
        answers={submittedAnswers}
        onEdit={() => setSubmittedAnswers(null)}
      />
    );
  }

  const isInvalid = orderedFields.some((field) => validateField(field, answers[field.key]) !== null);

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      {orderedFields.map((field) => (
        <RequirementField
          key={field.id}
          field={field}
          value={answers[field.key]}
          error={touched[field.key] ? errors[field.key] : undefined}
          onChange={(value) => handleChange(field.key, value)}
          onBlur={() => handleBlur(field.key)}
        />
      ))}
      <Button type="submit" size="lg" loading={submitting} disabled={submitting || isInvalid}>
        Continue
      </Button>
    </form>
  );
}
