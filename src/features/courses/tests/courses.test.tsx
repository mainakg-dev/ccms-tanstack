import { AdminCourses } from "#/routes/admin/courses";
import { renderWithClient } from "#/test/helper";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

describe("AdminCourses Integration Tests", () => {
  it("should successfully render the courses list (Positive Read)", async () => {
    renderWithClient(<AdminCourses />);

    // Wait for courses list to render
    await waitFor(() => {
      expect(
        screen.getByText("Diploma in Computer Application (DCA)"),
      ).toBeDefined();
    });

    expect(
      screen.getByText("Advanced Diploma in Computer Application (ADCA)"),
    ).toBeDefined();
  });

  it("should display validation errors when creating an empty course (Negative Test)", async () => {
    renderWithClient(<AdminCourses />);

    await waitFor(() => {
      expect(
        screen.getByText("Diploma in Computer Application (DCA)"),
      ).toBeDefined();
    });

    // Click Add Course to open dialog
    const addCourseBtn = screen.getByRole("button", { name: /Add Course/i });
    await userEvent.click(addCourseBtn);

    // Press Submit immediately
    const submitBtn = screen.getByRole("button", { name: /Create Course/i });
    await userEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/Course name is required/i)).toBeDefined();
      expect(screen.getByText(/Duration is required/i)).toBeDefined();
    });
  });

  it("should successfully add a new course (Positive CRUD Create)", async () => {
    renderWithClient(<AdminCourses />);

    await waitFor(() => {
      expect(
        screen.getByText("Diploma in Computer Application (DCA)"),
      ).toBeDefined();
    });

    const addCourseBtn = screen.getByRole("button", { name: /Add Course/i });
    await userEvent.click(addCourseBtn);

    const nameInput = screen.getByPlaceholderText(
      /e.g. Diploma in Computer Application/i,
    );
    const durationInput = screen.getByPlaceholderText(/e.g. 6 months/i);
    const codeInput = screen.getByPlaceholderText(/e.g. DCA-001/i);
    const submitBtn = screen.getByRole("button", { name: /Create Course/i });

    await userEvent.type(nameInput, "Full Stack Web Engineering");
    await userEvent.type(durationInput, "6 months");
    await userEvent.type(codeInput, "FSWE-101");
    await userEvent.click(submitBtn);

    // Verify it adds course and fetches list again
    await waitFor(() => {
      expect(screen.getByText("Full Stack Web Engineering")).toBeDefined();
    });
  });
});
