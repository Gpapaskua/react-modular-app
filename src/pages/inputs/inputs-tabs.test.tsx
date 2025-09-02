import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { useLocation, useNavigate } from "react-router";
import InputsTabs from "./inputs-tabs";

vi.mock("react-router", () => ({
  useLocation: vi.fn(),
  useNavigate: vi.fn(),
}));

vi.mock("./config", () => ({
  INPUT_ROUTES: {
    CHEMISTRY: "chemistry",
  },
  tabRoutes: [
    { value: "chemistry", label: "Chemistry", path: "/inputs/chemistry" },
    { value: "geology", label: "Geology", path: "/inputs/geology" },
    { value: "engineering", label: "Engineering", path: "/inputs/engineering" },
  ],
}));

vi.mock("@/components/ui/tabs", () => {
  let onValueChangeHandler: (value: string) => void;

  return {
    Tabs: ({ value, onValueChange, children }: any) => {
      onValueChangeHandler = onValueChange;
      return (
        <div data-testid="tabs" data-value={value}>
          {children}
        </div>
      );
    },
    TabsList: ({ children }: any) => (
      <div data-testid="tabs-list">{children}</div>
    ),
    TabsTrigger: ({ value, children }: any) => (
      <button value={value} onClick={() => onValueChangeHandler(value)}>
        {children}
      </button>
    ),
  };
});

const mockedUseLocation = useLocation as Mock;
const mockedUseNavigate = useNavigate as Mock;

describe("InputsTabs", () => {
  let mockNavigate: Mock;

  beforeEach(() => {
    vi.clearAllMocks();

    mockNavigate = vi.fn();
    mockedUseNavigate.mockReturnValue(mockNavigate);
  });

  const renderWithPath = (pathname: string) => {
    mockedUseLocation.mockReturnValue({ pathname });
    render(<InputsTabs />);
  };

  it("should render all tabs from the configuration", () => {
    renderWithPath("/inputs/chemistry");
    expect(screen.getByText("Chemistry")).toBeInTheDocument();
    expect(screen.getByText("Geology")).toBeInTheDocument();
    expect(screen.getByText("Engineering")).toBeInTheDocument();
  });

  it("should correctly set the active tab based on the current URL", () => {
    renderWithPath("/inputs/geology");
    const tabsContainer = screen.getByTestId("tabs");
    expect(tabsContainer).toHaveAttribute("data-value", "geology");
  });

  it("should default to the 'chemistry' tab if the URL does not match any tab", () => {
    renderWithPath("/inputs/some-other-page");
    const tabsContainer = screen.getByTestId("tabs");
    expect(tabsContainer).toHaveAttribute("data-value", "chemistry");
  });

  it("should call navigate with the correct path when a tab is clicked", () => {
    renderWithPath("/inputs/chemistry");

    const geologyTab = screen.getByRole("button", { name: "Geology" });

    fireEvent.click(geologyTab);

    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith("/inputs/geology");
  });

  it("should not navigate if the tab logic is called with a value that has no path", () => {
    renderWithPath("/inputs/chemistry");

    const engineeringTab = screen.getByRole("button", { name: "Engineering" });
    fireEvent.click(engineeringTab);

    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith("/inputs/engineering");
  });
});
