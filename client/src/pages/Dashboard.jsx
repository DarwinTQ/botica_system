import { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { DollarSign, ShoppingBag, PackageX, CalendarClock, AlertTriangle, PackageSearch } from 'lucide-react';
import { dashboardApi } from '../services/api';
import { formatoMoneda } from '../utils/format';
import { SkeletonTarjetas } from '../components/Skeleton';
import Skeleton from '../components/Skeleton';
import EmptyState from '../components/EmptyState';
import { useAuth } from '../context/AuthContext';

function TarjetaKpi({ icono: Icono, titulo, valor, colorFondo, colorIcono }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-start justify-between">
      <div>
        <p className="text-sm text-slate-500 font-medium">{titulo}</p>
        <p className="text-2xl font-bold text-slate-800 mt-1.5">{valor}</p>
      </div>
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${colorFondo}`}>
        <Icono size={20} className={colorIcono} />
      </div>
    </div>
  );
}

const DIAS_SEMANA = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

export default function Dashboard() {
  const { usuario } = useAuth();
  const [resumen, setResumen] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    dashboardApi
      .resumen()
      .then(setResumen)
      .finally(() => setCargando(false));
  }, []);

  const datosGrafico = resumen?.ventasUltimos7Dias.map((d) => ({
    dia: DIAS_SEMANA[new Date(d.fecha).getDay()],
    total: d.total,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-800">Hola, {usuario?.nombre?.split(' ')[0]} 👋</h1>
        <p className="text-slate-500 text-sm mt-0.5">Aquí tienes el resumen de hoy en Botica Nova Salud.</p>
      </div>

      {cargando ? (
        <SkeletonTarjetas cantidad={4} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <TarjetaKpi
            icono={DollarSign}
            titulo="Ventas del día"
            valor={formatoMoneda(resumen.ventasHoyTotal)}
            colorFondo="bg-emerald-50"
            colorIcono="text-emerald-600"
          />
          <TarjetaKpi
            icono={ShoppingBag}
            titulo="N° de ventas hoy"
            valor={resumen.numeroVentasHoy}
            colorFondo="bg-teal-50"
            colorIcono="text-teal-600"
          />
          <TarjetaKpi
            icono={PackageX}
            titulo="Stock bajo"
            valor={resumen.productosStockBajo}
            colorFondo="bg-amber-50"
            colorIcono="text-amber-600"
          />
          <TarjetaKpi
            icono={CalendarClock}
            titulo="Próximos a vencer"
            valor={resumen.productosPorVencer}
            colorFondo="bg-red-50"
            colorIcono="text-red-600"
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <h2 className="font-semibold text-slate-800 mb-4">Ventas de los últimos 7 días</h2>
          {cargando ? (
            <Skeleton className="h-64 w-full" />
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={datosGrafico}>
                <defs>
                  <linearGradient id="colorVentas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#059669" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#059669" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eef2f7" />
                <XAxis dataKey="dia" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} width={70} tickFormatter={(v) => `S/ ${v}`} />
                <Tooltip formatter={(v) => formatoMoneda(v)} contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 13 }} />
                <Area type="monotone" dataKey="total" stroke="#059669" strokeWidth={2.5} fill="url(#colorVentas)" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <h2 className="font-semibold text-slate-800 mb-4">Top 5 productos más vendidos</h2>
          {cargando ? (
            <Skeleton className="h-64 w-full" />
          ) : resumen.topProductos.length === 0 ? (
            <EmptyState icon={PackageSearch} titulo="Sin ventas registradas" descripcion="Aún no hay productos vendidos." />
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={resumen.topProductos} layout="vertical" margin={{ left: 10 }}>
                <XAxis type="number" hide />
                <YAxis
                  type="category"
                  dataKey="nombre"
                  width={140}
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => (v.length > 18 ? `${v.slice(0, 18)}…` : v)}
                />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 13 }} />
                <Bar dataKey="cantidad" fill="#0d9488" radius={[0, 6, 6, 0]} barSize={16} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <h2 className="font-semibold text-slate-800 mb-4">Alertas activas</h2>
        {cargando ? (
          <Skeleton className="h-24 w-full" />
        ) : resumen.alertasActivas.length === 0 ? (
          <EmptyState icon={AlertTriangle} titulo="Todo en orden" descripcion="No hay alertas de stock ni vencimiento por ahora." />
        ) : (
          <div className="space-y-2">
            {resumen.alertasActivas.map((a) => (
              <div key={a.id} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-50">
                <AlertTriangle size={16} className={a.nivel === 'critico' ? 'text-red-500' : 'text-amber-500'} />
                <p className="text-sm text-slate-600 flex-1">{a.mensaje}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
