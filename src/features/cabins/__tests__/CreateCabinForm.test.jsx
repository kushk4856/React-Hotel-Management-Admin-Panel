import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import CreateCabinForm from "../CreateCabinForm";

// 1. Mock the custom hooks
const mockCreateCabin = vi.fn();
const mockEditCabin = vi.fn();

vi.mock("../useCreateCabin", () => ({
  useCreateCabin: () => ({
    isCreating: false,
    createCabin: mockCreateCabin,
  }),
}));

vi.mock("../useEditCabin", () => ({
  useEditCabin: () => ({
    isEditing: false,
    editCabin: mockEditCabin,
  }),
}));

describe("CreateCabinForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders correctly", () => {
    render(<CreateCabinForm onCloseModal={vi.fn()} />);
    expect(screen.getByLabelText(/cabin name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/maximum capacity/i)).toBeInTheDocument();
  });

  it("submits the form with correct data", async () => {
    const user = userEvent.setup();
    render(<CreateCabinForm onCloseModal={vi.fn()} />);

    // 2. Fill out the form
    await user.type(screen.getByLabelText(/cabin name/i), "Luxury 001");
    await user.type(screen.getByLabelText(/maximum capacity/i), "4");
    await user.type(screen.getByLabelText(/regular price/i), "500");
    await user.type(screen.getByLabelText(/discount/i), "50");
    await user.type(
      screen.getByLabelText(/description/i),
      "A beautiful cabin in the woods"
    );

    // 3. Upload a file (simulated)
    const file = new File(["(⌐□_□)"], "cabin.png", { type: "image/png" });
    const input = screen.getByLabelText(/cabin photo/i);
    await user.upload(input, file);

    // 4. Click Submit
    const submitBtn = screen.getByRole("button", { name: /create cabin/i });
    await user.click(submitBtn);

    // 5. Assert createCabin was called
    await waitFor(() => {
      expect(mockCreateCabin).toHaveBeenCalledTimes(1);
      // Check that the data passed to createCabin contains what we typed
      const calledWith = mockCreateCabin.mock.calls[0][0];
      expect(calledWith.name).toBe("Luxury 001");
      expect(calledWith.maxCapacity).toBe("4");
      expect(calledWith.regularPrice).toBe("500");
    });
  });

  it("shows validation errors for empty fields", async () => {
    const user = userEvent.setup();
    render(<CreateCabinForm onCloseModal={vi.fn()} />);

    // Click submit without typing anything
    await user.click(screen.getByRole("button", { name: /create cabin/i }));

    // Expect validation errors to appear
    const alerts = await screen.findAllByText(/this field is required/i);
    expect(alerts.length).toBeGreaterThan(0);
    expect(mockCreateCabin).not.toHaveBeenCalled();
  });
})    