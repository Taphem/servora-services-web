import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RequirementForm } from "@/components/requirements/RequirementForm";
import type { RequirementField } from "@/lib/api/schemas";

const fields: RequirementField[] = [
  {
    id: "f-problem",
    serviceId: "s1",
    key: "problem",
    label: "Describe the problem",
    fieldType: "TEXT",
    isRequired: true,
    displayOrder: 0,
    placeholder: "e.g. AC not cooling",
    helpText: null,
    minLength: 3,
    maxLength: 200,
    minValue: null,
    maxValue: null,
    minSelections: null,
    maxSelections: null,
    options: [],
  },
  {
    id: "f-notes",
    serviceId: "s1",
    key: "notes",
    label: "Anything else we should know?",
    fieldType: "TEXTAREA",
    isRequired: false,
    displayOrder: 1,
    placeholder: null,
    helpText: "Optional",
    minLength: null,
    maxLength: null,
    minValue: null,
    maxValue: null,
    minSelections: null,
    maxSelections: null,
    options: [],
  },
  {
    id: "f-ac-type",
    serviceId: "s1",
    key: "ac_type",
    label: "AC type",
    fieldType: "SELECT",
    isRequired: true,
    displayOrder: 2,
    placeholder: "Choose a type",
    helpText: null,
    minLength: null,
    maxLength: null,
    minValue: null,
    maxValue: null,
    minSelections: null,
    maxSelections: null,
    options: [
      { id: "o1", value: "split", label: "Split AC", displayOrder: 0 },
      { id: "o2", value: "window", label: "Window AC", displayOrder: 1 },
    ],
  },
  {
    id: "f-symptoms",
    serviceId: "s1",
    key: "symptoms",
    label: "Symptoms",
    fieldType: "MULTISELECT",
    isRequired: false,
    displayOrder: 3,
    placeholder: null,
    helpText: null,
    minLength: null,
    maxLength: null,
    minValue: null,
    maxValue: null,
    minSelections: null,
    maxSelections: null,
    options: [
      { id: "s1o", value: "no_cooling", label: "No cooling", displayOrder: 0 },
      { id: "s2o", value: "noise", label: "Unusual noise", displayOrder: 1 },
    ],
  },
  {
    id: "f-age",
    serviceId: "s1",
    key: "age",
    label: "Unit age (years)",
    fieldType: "NUMBER",
    isRequired: true,
    displayOrder: 4,
    placeholder: null,
    helpText: null,
    minLength: null,
    maxLength: null,
    minValue: "0",
    maxValue: "30",
    minSelections: null,
    maxSelections: null,
    options: [],
  },
  {
    id: "f-urgent",
    serviceId: "s1",
    key: "urgent",
    label: "This is urgent",
    fieldType: "BOOLEAN",
    isRequired: false,
    displayOrder: 5,
    placeholder: null,
    helpText: null,
    minLength: null,
    maxLength: null,
    minValue: null,
    maxValue: null,
    minSelections: null,
    maxSelections: null,
    options: [],
  },
  {
    id: "f-date",
    serviceId: "s1",
    key: "preferred_date",
    label: "Preferred date",
    fieldType: "DATE",
    isRequired: true,
    displayOrder: 6,
    placeholder: null,
    helpText: null,
    minLength: null,
    maxLength: null,
    minValue: null,
    maxValue: null,
    minSelections: null,
    maxSelections: null,
    options: [],
  },
  {
    id: "f-time",
    serviceId: "s1",
    key: "preferred_time",
    label: "Preferred time",
    fieldType: "TIME",
    isRequired: true,
    displayOrder: 7,
    placeholder: null,
    helpText: null,
    minLength: null,
    maxLength: null,
    minValue: null,
    maxValue: null,
    minSelections: null,
    maxSelections: null,
    options: [],
  },
];

describe("RequirementForm", () => {
  it("renders a control for every backend-supported requirement field type", () => {
    render(<RequirementForm serviceName="AC Repair" fields={fields} />);

    expect(screen.getByLabelText(/Describe the problem/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Anything else we should know/)).toBeInTheDocument();
    expect(screen.getByLabelText(/AC type/)).toBeInTheDocument();
    expect(screen.getByLabelText("No cooling")).toBeInTheDocument();
    expect(screen.getByLabelText("Unusual noise")).toBeInTheDocument();
    expect(screen.getByLabelText(/Unit age/)).toBeInTheDocument();
    expect(screen.getByLabelText(/This is urgent/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Preferred date/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Preferred time/)).toBeInTheDocument();
  });

  it("shows a validation message once a required field is touched and left invalid", async () => {
    const user = userEvent.setup();
    render(<RequirementForm serviceName="AC Repair" fields={fields} />);

    const problem = screen.getByLabelText(/Describe the problem/);
    await user.click(problem);
    await user.tab();

    expect(await screen.findByText("This field is required.")).toBeInTheDocument();
  });

  it("keeps the submit button disabled until every required field is valid", async () => {
    const user = userEvent.setup();
    render(<RequirementForm serviceName="AC Repair" fields={fields} />);

    const submit = screen.getByRole("button", { name: "Continue" });
    expect(submit).toBeDisabled();

    await user.type(screen.getByLabelText(/Describe the problem/), "AC not cooling");
    await user.selectOptions(screen.getByLabelText(/AC type/), "split");
    await user.type(screen.getByLabelText(/Unit age/), "4");

    const dateInput = screen.getByLabelText(/Preferred date/) as HTMLInputElement;
    await user.type(dateInput, "2026-06-15");
    const timeInput = screen.getByLabelText(/Preferred time/) as HTMLInputElement;
    await user.type(timeInput, "0930AM");

    expect(submit).toBeEnabled();
  });

  it("shows a request summary (not a fake booking confirmation) after a valid submit", async () => {
    const user = userEvent.setup();
    render(<RequirementForm serviceName="AC Repair" fields={fields} />);

    await user.type(screen.getByLabelText(/Describe the problem/), "AC not cooling");
    await user.selectOptions(screen.getByLabelText(/AC type/), "split");
    await user.type(screen.getByLabelText(/Unit age/), "4");
    await user.type(screen.getByLabelText(/Preferred date/), "2026-06-15");
    await user.type(screen.getByLabelText(/Preferred time/), "0930AM");

    await user.click(screen.getByRole("button", { name: "Continue" }));

    expect(await screen.findByText("Your details are ready")).toBeInTheDocument();
    expect(screen.getByText("AC not cooling")).toBeInTheDocument();
    expect(screen.getByText("Split AC")).toBeInTheDocument();
    // No fake provider match — the "next step" is explicitly disabled.
    expect(screen.getByRole("button", { name: /Find providers/ })).toBeDisabled();
  });

  it("renders a plain message when the service has no requirement fields", () => {
    render(<RequirementForm serviceName="Simple Service" fields={[]} />);
    expect(screen.getByText(/doesn't require any additional details/)).toBeInTheDocument();
  });
});
