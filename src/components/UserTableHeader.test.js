import { act, render, screen, fireEvent } from "@testing-library/react";
import UserTableHeader from "./UserTableHeader";

describe("UserTableHeader", () => {
  const baseProps = {
    dispatch: jest.fn(),
    columns: [
      { id: "id", label: "ID" },
      { id: "full_name", label: "Full Name" },
    ],
    columnOrder: ["id", "full_name"],
    isAuthenticated: false,
    sortedBy: "id",
    sortAscending: true,
    handleSort: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders column labels based on columnOrder", () => {
    render(
      <table>
        <UserTableHeader {...baseProps} />
      </table>
    );

    expect(screen.getByText("Full Name")).toBeInTheDocument();
  });

  it("shows ascending sort indicator", () => {
    render(
      <table>
        <UserTableHeader {...baseProps} />
      </table>
    );

    expect(screen.getByText("ID ▲")).toBeInTheDocument();
  });

  it("shows descending sort indicator when sortAscending is false", () => {
    render(
      <table>
        <UserTableHeader {...{ ...baseProps, sortAscending: false }} />
      </table>
    );

    expect(screen.getByText("ID ▼")).toBeInTheDocument();
  });

  it("allows dragging and reordering columns when authenticated", () => {
    render(
      <table>
        <UserTableHeader {...baseProps} isAuthenticated={true} />
      </table>
    );

    const sourceColumn = screen.getByText(/ID/);
    const destinationColumn = screen.getByText(/Full Name/);

    fireEvent.dragStart(sourceColumn, {
      dataTransfer: { setData: jest.fn().mockImplementation(() => "id") },
    });

    fireEvent.drop(destinationColumn, {
      dataTransfer: { getData: jest.fn().mockReturnValue("id") },
    });

    expect(baseProps.dispatch).toHaveBeenCalledWith({
      type: "SET_COLUMN_ORDER",
      value: ["full_name", "id"],
    });
  });

  it("does not allow dragging when not authenticated", () => {
    render(
      <table>
        <UserTableHeader {...baseProps} />
      </table>
    );

    const idColumn = screen.getByText("Full Name");
    expect(idColumn.draggable).toBe(false);
  });
});
