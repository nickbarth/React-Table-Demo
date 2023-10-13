import { render, screen, waitFor, act } from "@testing-library/react";
import UserTable from "./UserTable";
import { useAuth } from "../context/AuthContext";
import { usePreference } from "../context/PreferenceContext";

global.fetch = jest.fn();

// Mocking the contexts
jest.mock("../context/AuthContext", () => ({
  useAuth: jest.fn(),
}));

jest.mock("../context/PreferenceContext", () => ({
  usePreference: jest.fn(),
}));

describe("UserTable", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    fetch.mockClear();
  });

  it("renders UserTableControls only when user is authenticated", async () => {
    useAuth.mockReturnValue({
      isAuthenticated: true,
      user: { name: "John Doe" },
      token: "sample-token",
      login: jest.fn(),
      logout: jest.fn(),
    });

    usePreference.mockReturnValue({
      columnOrder: [
        "id",
        "full_name",
        "email",
        "city",
        "registered_date",
        "is_private",
      ],
      saveOrder: jest.fn(),
      loadOrder: jest.fn(),
    });

    await act(async () => {
      render(<UserTable />);
    });

    await waitFor(() => {
      expect(screen.getByText(/Save Order/i)).toBeInTheDocument();
      expect(screen.getByText(/Load Order/i)).toBeInTheDocument();
    });
  });

  it("shows an error when fetching users fails", async () => {
    useAuth.mockReturnValue({
      isAuthenticated: false,
      user: null,
      token: null,
      login: jest.fn(),
      logout: jest.fn(),
    });

    usePreference.mockReturnValue({
      columnOrder: [
        "id",
        "full_name",
        "email",
        "city",
        "registered_date",
        "is_private",
      ],
      saveOrder: jest.fn(),
      loadOrder: jest.fn(),
    });

    fetch.mockRejectedValueOnce(new Error("API is down"));

    await act(async () => {
      render(<UserTable />);
    });

    await waitFor(() => {
      expect(screen.getByText(/Error/i)).toBeInTheDocument();
    });
  });
});
