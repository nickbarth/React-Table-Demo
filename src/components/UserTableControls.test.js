import React from "react";
import { render, fireEvent } from "@testing-library/react";
import UserTableControls from "./UserTableControls"; // Adjust the path as necessary
import { usePreference } from "../context/PreferenceContext";

jest.mock("../context/PreferenceContext");

describe("UserTableControls", () => {
  const mockDispatch = jest.fn();
  const mockSaveOrder = jest.fn();
  const mockLoadOrder = jest.fn();

  const mockColumnOrder = ["full_name", "email"];

  beforeEach(() => {
    usePreference.mockReturnValue({
      columnOrder: mockColumnOrder,
      saveOrder: mockSaveOrder,
      loadOrder: mockLoadOrder,
    });
  });

  it("calls saveOrder function when Save Order button is clicked", () => {
    const { getByText } = render(
      <UserTableControls
        dispatch={mockDispatch}
        columnOrder={mockColumnOrder}
      />
    );

    fireEvent.click(getByText("Save Order"));

    expect(mockSaveOrder).toHaveBeenCalledWith(mockColumnOrder);
  });

  it("calls dispatch function with loaded order when Load Order button is clicked", () => {
    const newOrder = ["email", "full_name"];
    mockLoadOrder.mockReturnValueOnce(newOrder);

    const { getByText } = render(
      <UserTableControls
        dispatch={mockDispatch}
        columnOrder={mockColumnOrder}
      />
    );

    fireEvent.click(getByText("Load Order"));

    expect(mockDispatch).toHaveBeenCalledWith({
      type: "SET_COLUMN_ORDER",
      value: newOrder,
    });
  });
});
