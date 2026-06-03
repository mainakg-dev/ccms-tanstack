import { AdminNotices } from "#/routes/admin/notices";
import { renderWithClient } from "#/test/helper";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

describe("AdminNotices Integration Tests", () => {
  it("should successfully render the publish notice form", async () => {
    renderWithClient(<AdminNotices />);

    expect(screen.getByLabelText(/^Title$/i)).toBeDefined();
    expect(screen.getByLabelText(/^Content$/i)).toBeDefined();
    expect(
      screen.getByRole("button", { name: /Publish Notice/i }),
    ).toBeDefined();
  });

  it("should show form validation errors on empty notice submission (Negative Test)", async () => {
    renderWithClient(<AdminNotices />);

    const publishBtn = screen.getByRole("button", { name: /Publish Notice/i });
    await userEvent.click(publishBtn);

    await waitFor(() => {
      expect(screen.getByText(/Title is required/i)).toBeDefined();
      expect(
        screen.getByText(/Content must be at least 10 characters/i),
      ).toBeDefined();
    });
  });

  it("should successfully submit a notice and reset the form (Positive Create)", async () => {
    renderWithClient(<AdminNotices />);

    const titleInput = screen.getByLabelText(/^Title$/i);
    const contentInput = screen.getByLabelText(/^Content$/i);
    const publishBtn = screen.getByRole("button", { name: /Publish Notice/i });

    await userEvent.type(titleInput, "Semester Exam Schedule");
    await userEvent.type(
      contentInput,
      "This is an important announcement regarding the upcoming semester examinations starting next month.",
    );
    await userEvent.click(publishBtn);

    // Form should reset title and content after successful submission
    await waitFor(() => {
      expect((titleInput as HTMLInputElement).value).toBe("");
      expect((contentInput as HTMLTextAreaElement).value).toBe("");
    });
  });
});
