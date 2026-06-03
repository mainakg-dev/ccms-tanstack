import { FranchiseEnquiryPage } from "#/routes/enquiry";
import { renderWithClient } from "#/test/helper";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

describe("FranchiseEnquiryPage Integration Tests", () => {
  it("should successfully complete multi-step form wizard (Positive Create)", async () => {
    renderWithClient(<FranchiseEnquiryPage />);

    // STEP 1
    const nameInput = screen.getByPlaceholderText(/Enter your full name/i);
    const emailInput = screen.getByPlaceholderText(/you@example.com/i);
    const mobileInput = screen.getByPlaceholderText(/10-digit mobile number/i);
    const nextBtn = screen.getByRole("button", { name: /Next/i });

    await userEvent.type(nameInput, "Rajesh Center Head");
    await userEvent.type(emailInput, "rajesh@center.com");
    await userEvent.type(mobileInput, "9876543210");
    await userEvent.click(nextBtn);

    // Verify Step 2 is rendered
    await waitFor(() => {
      expect(
        screen.getByPlaceholderText(
          /Enter the full address of the proposed franchise center location/i,
        ),
      ).toBeDefined();
    });

    // STEP 2
    const addressInput = screen.getByPlaceholderText(
      /Enter the full address of the proposed franchise center location/i,
    );
    await userEvent.type(addressInput, "78 G.T Road, Asansol 713303");
    await userEvent.click(screen.getByRole("button", { name: /Next/i }));

    // Verify Step 3 is rendered
    await waitFor(() => {
      expect(
        screen.getByPlaceholderText(
          /Describe your motivation, previous experience/i,
        ),
      ).toBeDefined();
    });

    // STEP 3
    const messageInput = screen.getByPlaceholderText(
      /Describe your motivation, previous experience/i,
    );
    await userEvent.type(
      messageInput,
      "This is a proposal to set up a training academy with 20 high-spec computers and qualified instructors.",
    );

    const submitBtn = screen.getByRole("button", { name: /Submit Enquiry/i });
    await userEvent.click(submitBtn);

    // Verify Success Screen
    await waitFor(() => {
      expect(screen.getByText(/Thank You!/i)).toBeDefined();
      expect(
        screen.getByText(
          /Your franchise enquiry has been submitted successfully/i,
        ),
      ).toBeDefined();
    });
  });

  it("should block navigation and show error if step 1 inputs are invalid (Negative Test)", async () => {
    renderWithClient(<FranchiseEnquiryPage />);

    const nextBtn = screen.getByRole("button", { name: /Next/i });
    await userEvent.click(nextBtn);

    // Fields should fail validation and show errors
    await waitFor(() => {
      expect(
        screen.getByText(/Name must be at least 2 characters/i),
      ).toBeDefined();
      expect(
        screen.getByText(/Please enter a valid email address/i),
      ).toBeDefined();
      expect(
        screen.getByText(/Mobile number must be exactly 10 digits/i),
      ).toBeDefined();
    });

    // Verify we remain on Step 1 (Proposed Center Address from Step 2 should not exist)
    expect(
      screen.queryByPlaceholderText(
        /Enter the full address of the proposed franchise center location/i,
      ),
    ).toBeNull();
  });
});
