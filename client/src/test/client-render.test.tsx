import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { HomePage } from "../routes/HomePage";

describe("HomePage Component", () => {
  it("should render landing elements successfully", () => {
    render(<HomePage />);

    // Assert that the page title heading exists
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toBeDefined();
    expect(heading.textContent).toContain("AI job tracking");

    // Assert that the button is rendered
    const button = screen.getByRole("button", { name: /Add application/i });
    expect(button).toBeDefined();
  });
});
