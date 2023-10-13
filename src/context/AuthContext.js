import { createContext, useState, useContext, useEffect } from "react";

export const authContext = createContext();

const initialState = {
  isAuthenticated: false,
  user: null,
  token: null,
};

export const useAuth = () => {
  const context = useContext(authContext);

  if (!context) {
    throw new Error("authContext is not available");
  }

  return context;
};

export const AuthProvider = ({ children }) => {
  const [state, setState] = useState(initialState);

  // On Mount
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    let storedUser;

    try {
      storedUser = JSON.parse(localStorage.getItem("user"));
    } catch {
      storedUser = null;
    }

    if (storedToken && storedUser) {
      setState({
        isAuthenticated: true,
        user: storedUser,
        token: storedToken,
      });
    }
  }, []);

  const login = (user, token) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    setState({
      isAuthenticated: true,
      user,
      token,
    });
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setState({
      isAuthenticated: false,
      user: null,
      token: null,
    });
  };

  return (
    <authContext.Provider value={{ ...state, login, logout }}>
      {children}
    </authContext.Provider>
  );
};
