import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('jwt_token');
    const raw = localStorage.getItem('user_data');
    if (token && raw) {
      try { setUser(JSON.parse(raw)); } catch { /* stale data */ }
    }
    setLoading(false);
  }, []);

  const storeAuth = (token, userData) => {
    localStorage.setItem('jwt_token', token);
    localStorage.setItem('user_data', JSON.stringify(userData));
    setUser(userData);
  };

  const clearAuth = () => {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user_data');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, storeAuth, clearAuth, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}
