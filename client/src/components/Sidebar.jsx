import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  History,
  BellRing,
  Users,
  BarChart3,
  Settings,
  Cross,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, soloAdmin: false },
  { to: '/pos', label: 'Punto de Venta', icon: ShoppingCart, soloAdmin: false },
  { to: '/inventario', label: 'Inventario', icon: Package, soloAdmin: false },
  { to: '/clientes', label: 'Clientes', icon: Users, soloAdmin: false },
  { to: '/ventas', label: 'Historial de Ventas', icon: History, soloAdmin: true },
  { to: '/alertas', label: 'Alertas', icon: BellRing, soloAdmin: true },
  { to: '/reportes', label: 'Reportes', icon: BarChart3, soloAdmin: true },
  { to: '/admin', label: 'Administración', icon: Settings, soloAdmin: true },
];

export default function Sidebar() {
  const { esAdministrador } = useAuth();
  const items = ITEMS.filter((item) => !item.soloAdmin || esAdministrador);

  return (
    <aside className="w-64 shrink-0 bg-white border-r border-slate-100 h-screen sticky top-0 flex flex-col">
      <div className="flex items-center gap-2.5 px-6 h-16 border-b border-slate-100">
        <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center">
          <Cross className="text-white" size={18} strokeWidth={2.5} />
        </div>
        <div>
          <p className="font-bold text-slate-800 leading-tight text-sm">Botica Nova Salud</p>
          <p className="text-[11px] text-slate-400 leading-tight">Gestión farmacéutica</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {items.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="px-4 py-4 border-t border-slate-100">
        <p className="text-[11px] text-slate-400 text-center">© {new Date().getFullYear()} Nova Salud</p>
      </div>
    </aside>
  );
}
