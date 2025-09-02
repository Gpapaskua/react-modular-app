import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import ParamsTable from "./params-table";
import type { IParameter } from "./types";
import type { PropsWithChildren, ReactNode } from "react";

vi.mock("@/components/ui/data-table", () => ({
  default: ({
    data,
    renderFooter,
  }: {
    data: IParameter[];
    renderFooter: () => ReactNode;
  }) => (
    <div>
      <h1>Mock DataTable</h1>
      <table>
        <tbody>
          {data.map((item) => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>{item.value}</td>
              <td>{item.units}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {renderFooter && renderFooter()}
    </div>
  ),
}));

// Mock the columns. Since they are a dependency, we can provide a simple version for the test.
vi.mock("./columns", () => ({
  columns: [
    { accessorKey: "name", header: "Parameter Name" },
    { accessorKey: "value", header: "Value" },
    { accessorKey: "units", header: "Units" },
  ],
}));

// Mock UI components to avoid rendering complexities
vi.mock("@/components/ui/table", () => ({
  TableCell: ({ children, ...props }: PropsWithChildren) => (
    <td {...props}>{children}</td>
  ),
  TableFooter: ({ children, ...props }: PropsWithChildren) => (
    <tfoot {...props}>{children}</tfoot>
  ),
  TableRow: ({ children, ...props }: PropsWithChildren) => (
    <tr {...props}>{children}</tr>
  ),
}));

// Mock lucide-react icons
vi.mock("lucide-react", () => ({
  PlusCircle: () => <svg>Plus Icon</svg>,
}));

// --- Test Suite ---

describe("ParamsTable", () => {
  // Define mock data that matches the IParameter type
  const mockData: IParameter[] = [
    { id: "1", name: "pH", value: 7.2, units: "pH" },
    { id: "2", name: "TOC", value: 15.5, units: "mg/L" },
  ];

  const mockOnUpdateParam = vi.fn();
  const mockOnAddNewParam = vi.fn();

  beforeEach(() => {
    mockOnUpdateParam.mockClear();
    mockOnAddNewParam.mockClear();
  });

  it("should render the DataTable with the correct data", () => {
    render(
      <ParamsTable
        data={mockData}
        onUpdateParam={mockOnUpdateParam}
        onAddNewParam={mockOnAddNewParam}
      />
    );

    expect(screen.getByText("Mock DataTable")).toBeInTheDocument();

    expect(screen.getByText("7.2")).toBeInTheDocument();
    expect(screen.getByText("TOC")).toBeInTheDocument();
    expect(screen.getByText("15.5")).toBeInTheDocument();
  });

  it('should render the footer with the "Add" button', () => {
    render(
      <ParamsTable
        data={mockData}
        onUpdateParam={mockOnUpdateParam}
        onAddNewParam={mockOnAddNewParam}
      />
    );

    expect(
      screen.getByText("Additional Effluent Parameters")
    ).toBeInTheDocument();

    const addButton = screen.getByRole("button");
    expect(addButton).toBeInTheDocument();

    expect(screen.getByText("Plus Icon")).toBeInTheDocument();
  });

  it("should call onAddNewParam when the add button is clicked", () => {
    render(
      <ParamsTable
        data={mockData}
        onUpdateParam={mockOnUpdateParam}
        onAddNewParam={mockOnAddNewParam}
      />
    );

    const addButton = screen.getByRole("button");
    fireEvent.click(addButton);

    expect(mockOnAddNewParam).toHaveBeenCalledTimes(1);
  });
});
