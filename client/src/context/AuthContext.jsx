import { createContext, useContext, useState, useCallback } from 'react';
import { authApi } from '../services/api';

const AuthContext = createContext(null);

const STORAGE_KEY = 'botica-nova-salud:sesion';

function readSesion() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [sesion, setSesion] = useState(readSesion);

  const login = useCallback(async (email, password) => {
    const resultado = await authApi.login(email, password);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(resultado));
    setSesion(resultado);
    return resultado;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setSesion(null);
  }, []);

  const value = {
    usuario: sesion?.usuario ?? null,
    token: sesion?.token ?? null,
    estaAutenticado: Boolean(sesion?.usuario),
    esAdministrador: sesion?.usuario?.rol === 'ADMINISTRADOR',
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  return ctx;
}
