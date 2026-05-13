import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { auth as authApi } from '../api/client';

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');

  const login = async (email, password) => {
    const { data } = await authApi.login(email, password);
    ctx.storeAuth(data.data.token, data.data.user);
    return data.data.user;
  };

  const register = async (email, password) => {
    const { data } = await authApi.register(email, password);
    ctx.storeAuth(data.data.token, data.data.user);
    return data.data.user;
  };

  const logout = () => ctx.clearAuth();

  return { ...ctx, login, register, logout };
}
