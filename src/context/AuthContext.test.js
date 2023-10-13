import { render, act } from "@testing-library/react";
import { AuthProvider, useAuth, authContext } from "./AuthContext";

const mockLocalStorage = {
  getItem: jest.fn().mockReturnValue("{}"),
  setItem: jest.fn(),
  removeItem: jest.fn(),
};

Object.defineProperty(window, "localStorage", { value: mockLocalStorage });

describe("AuthProvider", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("initializes with default values when localStorage is empty", () => {
    render(<AuthProvider />);
    expect(mockLocalStorage.getItem).toBeCalledWith("token");
    expect(mockLocalStorage.getItem).toBeCalledWith("user");
  });

  it("can login and set values to localStorage", () => {
    let authContextValue;

    function MockConsumer() {
      authContextValue = useAuth();
      return null;
    }

    render(
      <AuthProvider>
        <MockConsumer />
      </AuthProvider>
    );

    act(() => {
      authContextValue.login({ name: "testUser" }, "testToken");
    });

    expect(mockLocalStorage.setItem).toBeCalledWith("token", "testToken");
    expect(mockLocalStorage.setItem).toBeCalledWith(
      "user",
      JSON.stringify({ name: "testUser" })
    );
    expect(authContextValue.isAuthenticated).toBe(true);
    expect(authContextValue.user).toEqual({ name: "testUser" });
    expect(authContextValue.token).toBe("testToken");
  });

  it("can logout and remove values from localStorage", () => {
    let authContextValue;

    function MockConsumer() {
      authContextValue = useAuth();
      return null;
    }

    render(
      <AuthProvider>
        <MockConsumer />
      </AuthProvider>
    );

    act(() => {
      authContextValue.logout();
    });

    expect(mockLocalStorage.removeItem).toBeCalledWith("token");
    expect(mockLocalStorage.removeItem).toBeCalledWith("user");
    expect(authContextValue.isAuthenticated).toBe(false);
    expect(authContextValue.user).toBe(null);
    expect(authContextValue.token).toBe(null);
  });
});
