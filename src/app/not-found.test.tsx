import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import NotFound from "@/app/not-found";

describe("NotFound", () => {
  it("tells the customer the page is missing and offers a real link back into the catalog", () => {
    render(<NotFound />);

    expect(screen.getByText(/couldn't find that page/i)).toBeInTheDocument();

    const link = screen.getByRole("link", { name: "Browse services" });
    expect(link).toHaveAttribute("href", "/services");
  });
});
