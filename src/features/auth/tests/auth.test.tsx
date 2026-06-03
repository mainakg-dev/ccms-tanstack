import { server } from "#/mocks/server";
import { LoginPage } from "#/routes/login";
import { renderWithClient } from "#/test/helper";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";

describe("LoginPage Integration Tests", () => {
  it("should successfully render the login page form", async () => {
    renderWithClient(<LoginPage />);

    expect(screen.getByLabelText(/Email Address/i)).toBeDefined();
    expect(screen.getByLabelText(/Password/i)).toBeDefined();
    expect(screen.getByRole("button", { name: /Sign in/i })).toBeDefined();
  });

  it("should show form validation errors on empty fields submission (Negative Test)", async () => {
    renderWithClient(<LoginPage />);

    const submitBtn = screen.getByRole("button", { name: /Sign in/i });
    await userEvent.click(submitBtn);

    // Form validation messages should appear (as defined in Zod schema)
    await waitFor(() => {
      expect(screen.getByText(/Invalid email address/i)).toBeDefined();
      expect(
        screen.getByText(/Password must be at least 6 characters/i),
      ).toBeDefined();
    });
  });

  it("should handle wrong credentials / unauthorized API response (Negative Test)", async () => {
    // Override MSW login handler to respond with 401 Unauthorized
    server.use(
      http.post("*/loginRoute", () => {
        return HttpResponse.json(
          { message: "Invalid credentials. Please try again." },
          { status: 401 },
        );
      }),
    );

    renderWithClient(<LoginPage />);

    const emailInput = screen.getByLabelText(/Email Address/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const submitBtn = screen.getByRole("button", { name: /Sign in/i });

    await userEvent.type(emailInput, "invalid@institute.com");
    await userEvent.type(passwordInput, "wrongpassword");
    await userEvent.click(submitBtn);

    await waitFor(() => {
      expect(
        screen.getByText(/Invalid credentials. Please try again./i),
      ).toBeDefined();
    });
  });
});
