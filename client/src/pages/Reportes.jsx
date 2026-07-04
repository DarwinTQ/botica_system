import { useEffect, useState } from 'react';
import { Download, TrendingUp, Package, Wallet } from 'lucide-react';
import { reportesApi } from '../services/api';
import { useToast } from '../context/ToastContext';
import { formatoMoneda, formatoFechaHora } from '../utils/format';
import { descargarCSV } from '../utils/csv';
import { SkeletonTabla, SkeletonTarjetas } from '../components/Skeleton';
import EmptyState from '../components/EmptyState';
import { FileSearch } from 'lucide-react';

function hace7Dias() {
  const d = new Date();
  d.setDate(d.getDate() - 6);
  return d.toISOString().slice(0, 10);
}
function hoy() {
  return new Date().toISOString().slice(0, 10);
}

export default function Reportes() {
  const { notify } = useToast();
  const [desde, setDesde] = useState(hace7Dias());
  const [hasta, setHasta] = useState(hoy());
  const [cargando, setCargando] = useState(true);

  const [ventasRango, setVentasRango] = useState(null);
  const [productosMasVendidos, setProductosMasVendidos] = useState([]);
  const [valorInventario, setValorInventario] = useState(null);

  async function cargar() {
    setCargando(true);
    try {
      const [vr, pmv, vi] = await Promise.all([
        reportesApi.ventasPorRango(desde, hasta),
        reportesApi.productosMasVendidos(desde, hasta),
        reportesApi.valorInventario(),
      ]);
      setVentasRango(vr);
      setProductosMasVendidos(pmv);
      setValorInventario(vi);
    } catch (err) {
      notify(err.message, 'error');
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [desde, hasta]);

  function exportarVentas() {
    descargarCSV(`ventas_${desde}_a_${hasta}.csv`, ventasRango.ventas, [
      { etiqueta: 'N° Venta', valor: (v) => `B001-${String(v.id).padStart(6, '0')}` },
      { etiqueta: 'Fecha', valor: (v) => formatoFechaHora(v.fecha) },
      { etiqueta: 'Cliente', valor: (v) => v.clienteNombre },
      { etiqueta: 'Método de pago', valor: (v) => v.metodoPago },
      { etiqueta: 'Subtotal', valor: (v) => v.subtotal },
      { etiqueta: 'IGV', valor: (v) => v.igv },
      { etiqueta: 'Total', valor: (v) => v.total },
    ]);
  }

  function exportarProductosMasVendidos() {
    descargarCSV(`productos_mas_vendidos_${desde}_a_${hasta}.csv`, productosMasVendidos, [
      { etiqueta: 'Producto', valor: (p) => p.nombre },
      { etiqueta: 'Cantidad vendida', valor: (p) => p.cantidad },
      { etiqueta: 'Ingresos (S/)', valor: (p) => p.ingresos },
    ]);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Reportes</h1>
          <p className="text-slate-500 text-sm mt-0.5">Análisis de ventas e inventario</p>
        </div>
        <div className="flex gap-3">
          <input
            type="date"
            value={desde}
            onChange={(e) => setDesde(e.target.value)}
            className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
          />
          <input
            type="date"
            value={hasta}
            onChange={(e) => setHasta(e.target.value)}
            className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
          />
        </div>
      </div>

      {cargando ? (
        <SkeletonTarjetas cantidad={3} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <TarjetaResumen icono={TrendingUp} titulo="Ventas en el rango" valor={formatoMoneda(ventasRango.total)} subtitulo={`${ventasRango.cantidad} ventas`} />
          <TarjetaResumen icono={Wallet} titulo="Valor de inventario (costo)" valor={formatoMoneda(valorInventario.valorCosto)} subtitulo={`${valorInventario.unidadesTotales} unidades`} />
          <TarjetaResumen icono={Package} titulo="Valor de inventario (venta)" valor={formatoMoneda(valorInventario.valorVenta)} subtitulo="Precio a público" />
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
        <div className="p-5 flex items-center justify-between border-b border-slate-100">
          <h2 className="font-semibold text-slate-800">Productos más vendidos</h2>
          <button
            onClick={exportarProductosMasVendidos}
            disabled={cargando || productosMasVendidos.length === 0}
            className="flex items-center gap-2 text-sm font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-xl px-3 py-2 transition-colors disabled:opacity-50"
          >
            <Download size={15} />
            Exportar CSV
          </button>
        </div>
        {cargando ? (
          <div className="p-5">
            <SkeletonTabla filas={4} columnas={3} />
          </div>
        ) : productosMasVendidos.length === 0 ? (
          <EmptyState icon={FileSearch} titulo="Sin datos" descripcion="No hay ventas en el rango seleccionado." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-400 text-xs uppercase tracking-wide border-b border-slate-100">
                  <th className="px-5 py-3 font-medium">Producto</th>
                  <th className="px-5 py-3 font-medium">Cantidad vendida</th>
                  <th className="px-5 py-3 font-medium">Ingresos</th>
                </tr>
              </thead>
              <tbody>
                {productosMasVendidos.map((p) => (
                  <tr key={p.productoId} className="border-b border-slate-50 last:border-0">
                    <td className="px-5 py-3 font-medium text-slate-700">{p.nombre}</td>
                    <td className="px-5 py-3 text-slate-500">{p.cantidad}</td>
                    <td className="px-5 py-3 text-slate-700 font-medium">{formatoMoneda(p.ingresos)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
        <div className="p-5 flex items-center justify-between border-b border-slate-100">
          <h2 className="font-semibold text-slate-800">Ventas en el rango seleccionado</h2>
          <button
            onClick={exportarVentas}
            disabled={cargando || ventasRango.ventas.length === 0}
            className="flex items-center gap-2 text-sm font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-xl px-3 py-2 transition-colors disabled:opacity-50"
          >
            <Download size={15} />
            Exportar CSV
          </button>
        </div>
        {cargando ? (
          <div className="p-5">
            <SkeletonTabla filas={4} columnas={5} />
          </div>
        ) : ventasRango.ventas.length === 0 ? (
          <EmptyState icon={FileSearch} titulo="Sin ventas" descripcion="No hay ventas registradas en el rango seleccionado." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-400 text-xs uppercase tracking-wide border-b border-slate-100">
                  <th className="px-5 py-3 font-medium">N° Venta</th>
                  <th className="px-5 py-3 font-medium">Fecha</th>
                  <th className="px-5 py-3 font-medium">Cliente</th>
                  <th className="px-5 py-3 font-medium">Método</th>
                  <th className="px-5 py-3 font-medium">Total</th>
                </tr>
              </thead>
              <tbody>
                {ventasRango.ventas.map((v) => (
                  <tr key={v.id} className="border-b border-slate-50 last:border-0">
                    <td className="px-5 py-3 font-medium text-slate-700">B001-{String(v.id).padStart(6, '0')}</td>
                    <td className="px-5 py-3 text-slate-500">{formatoFechaHora(v.fecha)}</td>
                    <td className="px-5 py-3 text-slate-600">{v.clienteNombre}</td>
                    <td className="px-5 py-3 text-slate-500">{v.metodoPago}</td>
                    <td className="px-5 py-3 font-semibold text-slate-700">{formatoMoneda(v.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function TarjetaResumen({ icono: Icono, titulo, valor, subtitulo }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
      <div className="flex items-center gap-2.5 mb-2">
        <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center">
          <Icono size={17} className="text-emerald-600" />
        </div>
        <p className="text-sm text-slate-500 font-medium">{titulo}</p>
      </div>
      <p className="text-2xl font-bold text-slate-800">{valor}</p>
      <p className="text-xs text-slate-400 mt-1">{subtitulo}</p>
    </div>
  );
}
