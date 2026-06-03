import { CenterMarksEntry } from "#/routes/center/marks-entry";
import { renderWithClient } from "#/test/helper";
import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

describe("CenterMarksEntry Integration Tests", () => {
  it("should lookup student, fill marks, and submit successfully (Positive CRUD Update/Create)", async () => {
    renderWithClient(<CenterMarksEntry />);

    // Search for student
    const searchInput = screen.getByPlaceholderText(/Enter Enrollment Number/i);
    const searchBtn = screen.getByRole("button", { name: /Lookup/i });

    await userEvent.type(searchInput, "EN-2025-001");
    await userEvent.click(searchBtn);

    // Wait for student lookup to fetch data
    await waitFor(() => {
      expect(screen.getByText(/Rahul Kumar/i)).toBeDefined();
      expect(
        screen.getByText(/Diploma in Computer Application \(DCA\)/i),
      ).toBeDefined();
    });

    // Enter passing year and date
    const passingYearInput = screen.getByLabelText(/Passing Year/i);
    const dateInput = screen.getByLabelText(/Date of Publishing/i);

    await userEvent.type(passingYearInput, "2025");
    await userEvent.type(dateInput, "2025-06-15");

    // Retrieve input elements within the subject table rows (which are of role spinbutton since type="number")
    const subjectRows = screen.getAllByRole("row");
    // First data row is index 1
    const firstRowInputs = within(subjectRows[1]).getAllByRole("spinbutton");
    const theoryInput = firstRowInputs[0];
    const practicalInput = firstRowInputs[1];

    await userEvent.type(theoryInput, "70");
    await userEvent.type(practicalInput, "40");

    // Submit form
    const submitBtn = screen.getByRole("button", { name: /Submit Marks/i });
    await userEvent.click(submitBtn);

    // Verify form resets upon success
    await waitFor(() => {
      expect((searchInput as HTMLInputElement).value).toBe("");
      expect(screen.queryByText(/Rahul Kumar/i)).toBeNull();
    });
  });

  it("should display error message on searching invalid student (Negative Test)", async () => {
    renderWithClient(<CenterMarksEntry />);

    const searchInput = screen.getByPlaceholderText(/Enter Enrollment Number/i);
    const searchBtn = screen.getByRole("button", { name: /Lookup/i });

    await userEvent.type(searchInput, "EN-INVALID-123");
    await userEvent.click(searchBtn);

    await waitFor(() => {
      expect(screen.getByText("Student not found.")).toBeDefined();
    });
  });
});
