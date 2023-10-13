import { createContext, useState, useContext } from "react";

export const PreferenceContext = createContext();

const initialState = {
  columnOrder: [
    "id",
    "full_name",
    "email",
    "city",
    "registered_date",
    "is_private",
  ],
};

export const usePreference = () => {
  const context = useContext(PreferenceContext);

  if (!context) {
    throw new Error("PreferenceContext is not available");
  }

  return context;
};

export const PreferenceProvider = ({ children }) => {
  const [columnOrder, setColumnOrder] = useState(initialState.columnOrder);

  const saveOrder = (order) => {
    localStorage.setItem("columnOrder", JSON.stringify(order));
    setColumnOrder(order);
  };

  const loadOrder = () => {
    const storedOrder = localStorage.getItem("columnOrder");
    const order = storedOrder ? JSON.parse(storedOrder) : columnOrder;
    setColumnOrder(order);
    return order;
  };

  return (
    <PreferenceContext.Provider value={{ columnOrder, saveOrder, loadOrder }}>
      {children}
    </PreferenceContext.Provider>
  );
};
