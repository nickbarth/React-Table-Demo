import React from "react";
import { render } from "@testing-library/react";

import UserTableBody from "./UserTableBody";

describe("UserTableBody", () => {
  const mockUsers = [
    {
      id: 1,
      full_name: "John Doe",
      email: "john@example.com",
      city: "Edmonton",
      registered_date: new Date("2023-01-01"),
      is_private: true,
    },
  ];

  const mockColumnOrder = [
    "full_name",
    "email",
    "city",
    "registered_date",
    "is_private",
  ];

  it("renders the user data based on column order", () => {
    const { getAllByRole } = render(
      <table>
        <UserTableBody
          users={mockUsers}
          columnOrder={mockColumnOrder}
          totalUsers={1}
        />
      </table>
    );

    const cells = getAllByRole("cell");
    const expectedValues = [
      "John Doe",
      "john@example.com",
      "Edmonton",
      "2023-01-01",
      "Yes",
    ];

    cells.forEach((cell, index) => {
      expect(cell).toHaveTextContent(expectedValues[index]);
    });
  });

  it("formats registered_date correctly", () => {
    const dateUser = [
      { ...mockUsers[0], registered_date: new Date("2020-05-15") },
    ];
    const { getByText } = render(
      <table>
        <UserTableBody
          users={dateUser}
          columnOrder={["registered_date"]}
          totalUsers={10}
        />
      </table>
    );
    expect(getByText("2020-05-15")).toBeInTheDocument();
  });

  it("formats is_private correctly", () => {
    const privateUser = [{ ...mockUsers[0], is_private: false }];
    const { getByText } = render(
      <table>
        <UserTableBody
          users={privateUser}
          columnOrder={["is_private"]}
          totalUsers={10}
        />
      </table>
    );
    expect(getByText("No")).toBeInTheDocument();
  });

  it("renders the UserTableLoader when user count is less than total users", () => {
    const { getByText } = render(
      <table>
        <UserTableBody
          users={mockUsers}
          columnOrder={mockColumnOrder}
          totalUsers={10}
        />
      </table>
    );
    expect(getByText("Loading...")).toBeInTheDocument();
  });
});
