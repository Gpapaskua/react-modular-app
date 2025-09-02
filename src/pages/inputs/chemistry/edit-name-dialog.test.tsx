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
import EditNameDialog from "./edit-name-dialog";

vi.mock("./useUpdateChemistryGroup", () => ({
  default: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: vi.fn(),
}));

import useUpdateChemistryGroup from "./useUpdateChemistryGroup";
import { toast } from "sonner";

const mockGroupId = "group-123";
const initialName = "Initial Group Name";

const renderComponent = (props = {}) => {
  const queryClient = new QueryClient();
  const defaultProps = {
    open: true,
    name: initialName,
    groupId: mockGroupId,
    onClose: vi.fn(),
  };

  return render(
    <QueryClientProvider client={queryClient}>
      <EditNameDialog {...defaultProps} {...props} />
    </QueryClientProvider>
  );
};

describe("EditNameDialog", () => {
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
    expect(screen.getByLabelText("Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Name")).toHaveValue(initialName);
    expect(
      screen.getByRole("button", { name: "Save Changes" })
    ).toBeInTheDocument();
  });

  it("should allow typing in the input field", async () => {
    renderComponent();
    const input = screen.getByLabelText("Name");
    await userEvent.clear(input);
    await userEvent.type(input, "New Group Name");
    expect(input).toHaveValue("New Group Name");
  });

  it("should show a validation error if the name is empty", async () => {
    renderComponent();
    const input = screen.getByLabelText("Name");
    const saveButton = screen.getByRole("button", { name: "Save Changes" });

    await userEvent.clear(input);
    await userEvent.click(saveButton);

    expect(
      await screen.findByText(/Name is required/i)
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

    const newName = "Updated Group Name";
    const input = screen.getByLabelText("Name");
    const saveButton = screen.getByRole("button", { name: "Save Changes" });

    await userEvent.clear(input);
    await userEvent.type(input, newName);
    await userEvent.click(saveButton);

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith(
        {
          groupId: mockGroupId,
          payload: { name: newName },
        },
        expect.any(Object)
      );
    });

    expect(toast).toHaveBeenCalledWith("Name has been changed");
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
