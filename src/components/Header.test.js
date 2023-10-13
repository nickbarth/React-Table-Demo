import React from "react";
import { render, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";

import { Header } from "./Header";
import { useAuth } from "../context/AuthContext";

jest.mock("../context/AuthContext");

describe("Header", () => {
  it("renders login button when user is not authenticated", () => {
    useAuth.mockReturnValue({
      isAuthenticated: false,
      login: jest.fn(),
      logout: jest.fn(),
    });

    const { getByText } = render(<Header />);
    expect(getByText(/login/i)).toBeInTheDocument();
  });

  it("renders user email and logout button when user is authenticated", () => {
    const mockUser = { email: "john@example.com" };
    useAuth.mockReturnValue({
      isAuthenticated: true,
      user: mockUser,
      login: jest.fn(),
      logout: jest.fn(),
    });

    const { getByText } = render(<Header />);
    expect(getByText(mockUser.email)).toBeInTheDocument();
    expect(getByText(/logout/i)).toBeInTheDocument();
  });

  it("calls login function when login button is clicked", () => {
    const mockLogin = jest.fn();
    useAuth.mockReturnValue({
      isAuthenticated: false,
      login: mockLogin,
      logout: jest.fn(),
    });

    const { getByText } = render(<Header />);
    fireEvent.click(getByText(/login/i));
    expect(mockLogin).toHaveBeenCalledWith(
      {
        name: "John Doe",
        email: "john@example.com",
      },
      "JWT"
    );
  });

  it("calls logout function when logout button is clicked", () => {
    const mockLogout = jest.fn();
    useAuth.mockReturnValue({
      isAuthenticated: true,
      user: { email: "john@example.com" },
      login: jest.fn(),
      logout: mockLogout,
    });

    const { getByText } = render(<Header />);
    fireEvent.click(getByText(/logout/i));
    expect(mockLogout).toHaveBeenCalled();
  });
});
