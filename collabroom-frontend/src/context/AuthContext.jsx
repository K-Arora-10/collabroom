import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function fetchProtected() {
    return await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/users/protected`, {
      credentials: "include",
    });
  }

  async function refreshAccessToken() {
    await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/users/refresh`, {
      method: "POST",
      credentials: "include",
    });
  }

  useEffect(() => {
    async function checkAuth() {
      try {
        let res = await fetchProtected();

        if (res.status === 401) {
          await refreshAccessToken();
          res = await fetchProtected();
        }

        if (res.ok) {
          const data = await res.json();
          setUser(data);
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
