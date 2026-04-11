
import { createContext, useContext, useState, useEffect } from "react";
import { login as loginApi, register as registerApi, logout as logoutApi, verify as verifyApi } from "../api/auth.api";

const AuthContext = createContext();

const STORAGE_KEY = "jusbill_user";

export function AuthProvider({ children }) {
  // Seed state from localStorage so there is no login flash on reload
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  // If we already have a cached user we can start with loading=false;
  // the background verify will silently revalidate.
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const res = await verifyApi();
      const userData = res.data;
      setUser(userData);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
    } catch (error) {
      // Only clear session on a real 401 — not on network errors / cold starts
      if (error.response?.status === 401) {
        setUser(null);
        localStorage.removeItem(STORAGE_KEY);
      }
      // On network errors we keep the cached user so a temp outage doesn't log you out
    } finally {
      setLoading(false);
    }
  };

  const login = async (data) => {
    const res = await loginApi(data);
    const userData = res.data.user;
    setUser(userData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
    return res;
  };

  const register = async (data) => {
    const res = await registerApi(data);
    const userData = res.data.user;
    setUser(userData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
    return res;
  };

  const logout = async () => {
    try {
      await logoutApi();
    } catch (error) {
      console.error("Logout failed", error);
    }
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
