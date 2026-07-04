import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, LogOut, ChevronDown, AlertTriangle, PackageX } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAlertas } from '../hooks/useAlertas';

export default function Header() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();
  const { alertas } = useAlertas();
  const [busqueda, setBusqueda] = useState('');
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [alertasAbiertas, setAlertasAbiertas] = useState(false);
  const menuRef = useRef(null);
  const alertasRef = useRef(null);

  useEffect(() => {
    function onClickFuera(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuAbierto(false);
      if (alertasRef.current && !alertasRef.current.contains(e.target)) setAlertasAbiertas(false);
    }
    document.addEventListener('mousedown', onClickFuera);
    return () => document.removeEventListener('mousedown', onClickFuera);
  }, []);

  function buscar(e) {
    e.preventDefault();
    if (!busqueda.trim()) return;
    navigate(`/inventario?q=${encodeURIComponent(busqueda.trim())}`);
  }

  return (
    <header className="h-16 border-b border-slate-100 bg-white/80 backdrop-blur sticky top-0 z-30 flex items-center gap-4 px-6">
      <form onSubmit={buscar} className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar producto por nombre o código..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-400"
          />
        </div>
      </form>

      <div className="flex items-center gap-3 ml-auto">
        <div className="relative" ref={alertasRef}>
          <button
            onClick={() => setAlertasAbiertas((v) => !v)}
            className="relative w-10 h-10 rounded-xl hover:bg-slate-50 flex items-center justify-center text-slate-500 transition-colors"
          >
            <Bell size={19} />
            {alertas.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                {alertas.length}
              </span>
            )}
          </button>

          {alertasAbiertas && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 max-h-96 overflow-y-auto">
              <p className="px-4 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wide">
                Notificaciones ({alertas.length})
              </p>
              {alertas.length === 0 && (
                <p className="px-4 py-6 text-sm text-slate-400 text-center">Sin alertas activas</p>
              )}
              {alertas.slice(0, 8).map((a) => (
                <div key={a.id} className="px-4 py-2.5 flex items-start gap-2.5 hover:bg-slate-50">
                  {a.tipo === 'STOCK_BAJO' ? (
                    <PackageX size={16} className="text-amber-500 mt-0.5 shrink-0" />
                  ) : (
                    <AlertTriangle size={16} className="text-red-500 mt-0.5 shrink-0" />
                  )}
                  <p className="text-sm text-slate-600">{a.mensaje}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuAbierto((v) => !v)}
            className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-xl hover:bg-slate-50 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold">
              {usuario?.nombre?.charAt(0) ?? '?'}
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-sm font-medium text-slate-700 leading-tight">{usuario?.nombre}</p>
              <p className="text-[11px] text-slate-400 leading-tight">{usuario?.rol}</p>
            </div>
            <ChevronDown size={16} className="text-slate-400" />
          </button>

          {menuAbierto && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 py-1.5">
              <button
                onClick={logout}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut size={15} />
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
