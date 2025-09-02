import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  describe,
  it,
  expect,
  vi,
  type Mock,
  beforeEach,
  afterEach,
} from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import EditDescriptionDialog from "./edit-description-dialog";

vi.mock("./useUpdateChemistryGroup", () => ({
  default: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: vi.fn(),
}));

import useUpdateChemistryGroup from "./useUpdateChemistryGroup";
import { toast } from "sonner";

const mockGroupId = "group-456";
const initialDescription = "Initial group description.";

const renderComponent = (props = {}) => {
  const queryClient = new QueryClient();
  const defaultProps = {
    open: true,
    description: initialDescription,
    groupId: mockGroupId,
    onClose: vi.fn(),
  };

  return render(
    <QueryClientProvider client={queryClient}>
      <EditDescriptionDialog {...defaultProps} {...props} />
    </QueryClientProvider>
  );
};

describe("EditDescriptionDialog", () => {
  beforeEach(() => {
    (useUpdateChemistryGroup as Mock).mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should render correctly with initial values", () => {
    renderComponent();

    expect(screen.getByText("Edit Description")).toBeInTheDocument();
    expect(screen.getByLabelText("Description")).toBeInTheDocument();
    expect(screen.getByLabelText("Description")).toHaveValue(
      initialDescription
    );
    expect(
      screen.getByRole("button", { name: "Save Changes" })
    ).toBeInTheDocument();
  });

  it("should allow typing in the textarea field", async () => {
    renderComponent();
    const textarea = screen.getByLabelText("Description");
    await userEvent.clear(textarea);
    await userEvent.type(textarea, "New group description.");
    expect(textarea).toHaveValue("New group description.");
  });

  it("should show a validation error if the description is empty", async () => {
    renderComponent();
    const textarea = screen.getByLabelText("Description");
    const saveButton = screen.getByRole("button", { name: "Save Changes" });

    await userEvent.clear(textarea);
    await userEvent.click(saveButton);

    expect(
      await screen.findByText("Description is required")
    ).toBeInTheDocument();
  });

  it("should call the update mutation on valid form submission", async () => {
    const mockMutate = vi.fn((_variables, options) => {
      options.onSuccess?.();
    });
    (useUpdateChemistryGroup as Mock).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    });
    const mockOnClose = vi.fn();

    renderComponent({ onClose: mockOnClose });

    const newDescription = "Updated group description.";
    const textarea = screen.getByLabelText("Description");
    const saveButton = screen.getByRole("button", { name: "Save Changes" });

    await userEvent.clear(textarea);
    await userEvent.type(textarea, newDescription);
    await userEvent.click(saveButton);

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith(
        {
          groupId: mockGroupId,
          payload: { description: newDescription },
        },
        expect.any(Object)
      );
    });

    expect(toast).toHaveBeenCalledWith("Description has been updated");
    expect(mockOnClose).toHaveBeenCalled();
  });

  it("should disable the save button when the mutation is pending", () => {
    (useUpdateChemistryGroup as Mock).mockReturnValue({
      mutate: vi.fn(),
      isPending: true,
    });

    renderComponent();

    expect(screen.getByRole("button", { name: "Save Changes" })).toBeDisabled();
  });
});
