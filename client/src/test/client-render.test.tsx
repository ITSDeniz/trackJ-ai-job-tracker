import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { HomePage } from "../routes/HomePage";
import { AuthProvider } from "@/features/auth/AuthContext";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

describe("HomePage Component", () => {
  it("should render landing elements successfully", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <AuthProvider>
            <HomePage />
          </AuthProvider>
        </MemoryRouter>
      </QueryClientProvider>
    );

    // Assert that the page title heading exists
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toBeDefined();
    expect(heading.textContent).toContain("Welcome back");

    // Assert that the button is rendered
    const button = screen.getByRole("button", { name: /Add application/i });
    expect(button).toBeDefined();
  });
});
