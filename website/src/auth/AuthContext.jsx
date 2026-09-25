import { createContext, useContext, useState, useCallback, useMemo } from "react";
import Cookies from "js-cookie";

const AuthContext = createContext(null);

const ROLES = ["subadmin", "dealer"];
const ROLE_KEY = "authRole";

// Role is stored explicitly at login so a page refresh keeps the right role.
// Falls back to the old localStorage keys (dealerInfo / CreateProfile).
// No more silent "admin" default: token without a known role = not logged in.
const detectRole = () => {
  const stored = localStorage.getItem(ROLE_KEY);
  if (ROLES.includes(stored)) return stored;
  if (localStorage.getItem("dealerInfo")) return "dealer";
  if (localStorage.getItem("CreateProfile")) return "subadmin";
  return null;
};

const readSession = () => {
  const hasToken = !!Cookies.get("authToken");
  const role = hasToken ? detectRole() : null;
  return { isLoggedIn: hasToken && !!role, role };
};

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(readSession);

  const login = useCallback((token, roleKey) => {
    if (!ROLES.includes(roleKey)) {
      throw new Error(`Unknown role: ${roleKey}`);
    }
    Cookies.set("authToken", token, { expires: 1 });
    localStorage.setItem(ROLE_KEY, roleKey);
    setSession({ isLoggedIn: true, role: roleKey });
  }, []);

  const logout = useCallback(() => {
    Cookies.remove("authToken");
    localStorage.removeItem(ROLE_KEY);
    localStorage.removeItem("dealerInfo");
    localStorage.removeItem("CreateProfile");
    setSession({ isLoggedIn: false, role: null });
  }, []);

  const value = useMemo(
    () => ({ isLoggedIn: session.isLoggedIn, role: session.role, login, logout }),
    [session, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
