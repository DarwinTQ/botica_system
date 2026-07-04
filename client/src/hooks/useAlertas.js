import { useEffect, useState, useCallback } from 'react';
import { alertasApi } from '../services/api';

export function useAlertas(intervaloMs = 30000) {
  const [alertas, setAlertas] = useState([]);
  const [cargando, setCargando] = useState(true);

  const recargar = useCallback(async () => {
    try {
      const data = await alertasApi.getAll();
      setAlertas(data);
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    recargar();
    if (!intervaloMs) return undefined;
    const id = setInterval(recargar, intervaloMs);
    return () => clearInterval(id);
  }, [recargar, intervaloMs]);

  return { alertas, cargando, recargar };
}
