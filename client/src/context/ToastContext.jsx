import { createContext, useContext, useCallback, useState } from 'react';
import { CheckCircle2, XCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

const ICONOS = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
};

const ESTILOS = {
  success: 'bg-white border-emerald-200 text-emerald-800',
  error: 'bg-white border-red-200 text-red-800',
  info: 'bg-white border-slate-200 text-slate-800',
};

const ESTILOS_ICONO = {
  success: 'text-emerald-500',
  error: 'text-red-500',
  info: 'text-slate-500',
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const remove = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const notify = useCallback(
    (mensaje, tipo = 'success') => {
      const id = Date.now() + Math.random();
      setToasts((prev) => [...prev, { id, mensaje, tipo }]);
      setTimeout(() => remove(id), 4000);
    },
    [remove]
  );

  return (
    <ToastContext.Provider value={{ notify }}>
      {children}
      <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 w-80 max-w-[90vw]">
        {toasts.map((t) => {
          const Icono = ICONOS[t.tipo] || Info;
          return (
            <div
              key={t.id}
              className={`flex items-start gap-3 rounded-2xl border shadow-lg px-4 py-3 animate-[fadeIn_0.2s_ease-out] ${ESTILOS[t.tipo]}`}
            >
              <Icono size={20} className={`shrink-0 mt-0.5 ${ESTILOS_ICONO[t.tipo]}`} />
              <p className="text-sm font-medium flex-1">{t.mensaje}</p>
              <button onClick={() => remove(t.id)} className="text-slate-400 hover:text-slate-600">
                <X size={16} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast debe usarse dentro de <ToastProvider>');
  return ctx;
}
