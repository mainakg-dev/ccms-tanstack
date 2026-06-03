import { server } from "#/mocks/server";
import { AdminEnrollments } from "#/routes/admin/enrollments";
import { renderWithClient } from "#/test/helper";
import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";

describe("AdminEnrollments Integration Tests", () => {
  it("should successfully render the enrollments list (Positive Read)", async () => {
    renderWithClient(<AdminEnrollments />);

    // Verify loading state is shown initially
    expect(screen.getByText(/Loading enrollments.../i)).toBeDefined();

    // Wait for the mock enrollments to load
    await waitFor(() => {
      expect(screen.queryByText(/Loading enrollments.../i)).toBeNull();
    });

    // Check that students from mock data are rendered
    expect(screen.getByText("Rahul Kumar")).toBeDefined();
    expect(screen.getByText("rahul@example.com")).toBeDefined();
    expect(screen.getByText("Priya Sharma")).toBeDefined();
  });

  it("should filter the list of enrollments by search input (Positive Filter)", async () => {
    renderWithClient(<AdminEnrollments />);

    await waitFor(() => {
      expect(screen.queryByText(/Loading enrollments.../i)).toBeNull();
    });

    const searchInput = screen.getByPlaceholderText(
      /Search by name, email, or enrollment no/i,
    );

    // Filter by name 'Rahul'
    await userEvent.type(searchInput, "Rahul");
    expect(screen.getByText("Rahul Kumar")).toBeDefined();
    expect(screen.queryByText("Priya Sharma")).toBeNull();

    // Clear search
    await userEvent.clear(searchInput);
    expect(screen.getByText("Rahul Kumar")).toBeDefined();
    expect(screen.getByText("Priya Sharma")).toBeDefined();
  });

  it("should display empty state when search matches nothing (Negative Search)", async () => {
    renderWithClient(<AdminEnrollments />);

    await waitFor(() => {
      expect(screen.queryByText(/Loading enrollments.../i)).toBeNull();
    });

    const searchInput = screen.getByPlaceholderText(
      /Search by name, email, or enrollment no/i,
    );
    await userEvent.type(searchInput, "NonExistentStudentNameXYZ");

    expect(screen.getByText(/No enrollments found/i)).toBeDefined();
    expect(
      screen.getByText(/Try adjusting your search criteria/i),
    ).toBeDefined();
  });

  it("should handle API fetch error gracefully (Negative Read)", async () => {
    // Override MSW handler to simulate server failure
    server.use(
      http.get("*/AllEnrollments", () => {
        return new HttpResponse(null, { status: 500 });
      }),
    );

    renderWithClient(<AdminEnrollments />);

    // Wait until loading finishes
    await waitFor(() => {
      expect(screen.queryByText(/Loading enrollments.../i)).toBeNull();
    });

    // Should render the empty state / error boundary
    expect(screen.getByText(/No enrollments found/i)).toBeDefined();
  });

  it("should activate an inactive student (Positive CRUD Update)", async () => {
    renderWithClient(<AdminEnrollments />);

    await waitFor(() => {
      expect(screen.queryByText(/Loading enrollments.../i)).toBeNull();
    });

    // Find Amit Patel's row (Amit is inactive in mock data)
    const rows = screen.getAllByRole("row");
    const amitRow = rows.find((row) => row.textContent?.includes("Amit Patel"));
    expect(amitRow).toBeDefined();

    // Get the actions button inside Amit's row
    const actionsButton = within(amitRow!).getByRole("button");
    await userEvent.click(actionsButton);

    // Click 'Activate' from the dropdown menu
    const activateOption = await screen.findByText("Activate");
    await userEvent.click(activateOption);

    // Verify it updates status
    await waitFor(() => {
      expect(within(amitRow!).getByText(/ACTIVE/i)).toBeDefined();
    });
  });

  it("should delete a student enrollment (Positive CRUD Delete)", async () => {
    renderWithClient(<AdminEnrollments />);

    await waitFor(() => {
      expect(screen.queryByText(/Loading enrollments.../i)).toBeNull();
    });

    // Find Rahul Kumar's row
    const rows = screen.getAllByRole("row");
    const rahulRow = rows.find((row) =>
      row.textContent?.includes("Rahul Kumar"),
    );
    expect(rahulRow).toBeDefined();

    // Get actions button inside Rahul's row
    const actionsButton = within(rahulRow!).getByRole("button");
    await userEvent.click(actionsButton);

    // Click 'Delete' from the dropdown
    const deleteOption = await screen.findByText("Delete");
    await userEvent.click(deleteOption);

    // Click the confirmation Delete button inside the Dialog
    const confirmDeleteBtn = await screen.findByRole("button", {
      name: /^Delete$/,
    });
    await userEvent.click(confirmDeleteBtn);

    // Verify Rahul Kumar is deleted from the table
    await waitFor(() => {
      expect(screen.queryByText("Rahul Kumar")).toBeNull();
    });
  });
});
