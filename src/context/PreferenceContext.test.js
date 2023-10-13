import { render, act } from "@testing-library/react";
import {
  PreferenceProvider,
  usePreference,
  PreferenceContext,
} from "./PreferenceContext";

const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
};

Object.defineProperty(window, "localStorage", { value: mockLocalStorage });

describe("PreferenceProvider", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should initialize with default column order", () => {
    let contextValue;

    function MockConsumer() {
      contextValue = usePreference();
      return null;
    }

    render(
      <PreferenceProvider>
        <MockConsumer />
      </PreferenceProvider>
    );

    expect(contextValue.columnOrder).toEqual([
      "id",
      "full_name",
      "email",
      "city",
      "registered_date",
      "is_private",
    ]);
  });

  it("should save column order to localStorage", () => {
    let contextValue;
    const newOrder = [
      "full_name",
      "id",
      "email",
      "registered_date",
      "city",
      "is_private",
    ];

    function MockConsumer() {
      contextValue = usePreference();
      return null;
    }

    render(
      <PreferenceProvider>
        <MockConsumer />
      </PreferenceProvider>
    );

    act(() => {
      contextValue.saveOrder(newOrder);
    });

    expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
      "columnOrder",
      JSON.stringify(newOrder)
    );
    expect(contextValue.columnOrder).toEqual(newOrder);
  });

  it("should load column order from localStorage", () => {
    let contextValue;
    const newOrder = [
      "full_name",
      "id",
      "email",
      "registered_date",
      "city",
      "is_private",
    ];

    mockLocalStorage.getItem.mockReturnValue(JSON.stringify(newOrder));

    function MockConsumer() {
      contextValue = usePreference();
      return null;
    }

    render(
      <PreferenceProvider>
        <MockConsumer />
      </PreferenceProvider>
    );

    act(() => {
      const order = contextValue.loadOrder();
      expect(order).toEqual(newOrder);
    });
    expect(contextValue.columnOrder).toEqual(newOrder);
  });

  it("should use default column order when none is in localStorage", () => {
    let contextValue;

    mockLocalStorage.getItem.mockReturnValue(null);

    function MockConsumer() {
      contextValue = usePreference();
      return null;
    }

    render(
      <PreferenceProvider>
        <MockConsumer />
      </PreferenceProvider>
    );

    act(() => {
      const order = contextValue.loadOrder();
      expect(order).toEqual([
        "id",
        "full_name",
        "email",
        "city",
        "registered_date",
        "is_private",
      ]);
    });
  });
});
