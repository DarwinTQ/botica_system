import { PackageX, CalendarClock, ShieldCheck } from 'lucide-react';
import { useAlertas } from '../hooks/useAlertas';
import EmptyState from '../components/EmptyState';
import { SkeletonTarjetas } from '../components/Skeleton';

export default function Alertas() {
  const { alertas, cargando } = useAlertas();

  const stockBajo = alertas.filter((a) => a.tipo === 'STOCK_BAJO');
  const vencimientos = alertas.filter((a) => a.tipo === 'VENCIMIENTO');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-800">Alertas</h1>
        <p className="text-slate-500 text-sm mt-0.5">{alertas.length} alertas activas requieren tu atención</p>
      </div>

      {cargando ? (
        <SkeletonTarjetas cantidad={2} />
      ) : alertas.length === 0 ? (
        <EmptyState
          icon={ShieldCheck}
          titulo="Sin alertas activas"
          descripcion="Todo el inventario está dentro de los niveles esperados."
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SeccionAlertas
            titulo="Reposición de stock"
            icono={PackageX}
            color="amber"
            alertas={stockBajo}
            vacio="No hay productos con stock bajo o agotado."
          />
          <SeccionAlertas
            titulo="Próximos a vencer"
            icono={CalendarClock}
            color="red"
            alertas={vencimientos}
            vacio="No hay productos por vencer en los próximos 60 días."
          />
        </div>
      )}
    </div>
  );
}

const COLORES = {
  amber: { fondo: 'bg-amber-50', icono: 'text-amber-600', badge: 'bg-amber-100 text-amber-700' },
  red: { fondo: 'bg-red-50', icono: 'text-red-600', badge: 'bg-red-100 text-red-700' },
};

function SeccionAlertas({ titulo, icono: Icono, color, alertas, vacio }) {
  const estilos = COLORES[color];
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
      <div className="flex items-center gap-2.5 mb-4">
        <div className={`w-9 h-9 rounded-xl ${estilos.fondo} flex items-center justify-center`}>
          <Icono size={18} className={estilos.icono} />
        </div>
        <h2 className="font-semibold text-slate-800">{titulo}</h2>
        <span className={`ml-auto text-xs font-semibold px-2 py-1 rounded-full ${estilos.badge}`}>{alertas.length}</span>
      </div>

      {alertas.length === 0 ? (
        <p className="text-sm text-slate-400 text-center py-8">{vacio}</p>
      ) : (
        <div className="space-y-2">
          {alertas.map((a) => (
            <div key={a.id} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-50">
              <span
                className={`w-2 h-2 rounded-full shrink-0 ${a.nivel === 'critico' ? 'bg-red-500' : 'bg-amber-500'}`}
              />
              <p className="text-sm text-slate-600 flex-1">{a.mensaje}</p>
              <span
                className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                  a.nivel === 'critico' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                }`}
              >
                {a.nivel}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
