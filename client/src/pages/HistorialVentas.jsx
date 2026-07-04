import { useEffect, useMemo, useState } from 'react';
import { Receipt, Eye, FileSearch } from 'lucide-react';
import { ventasApi } from '../services/api';
import { useToast } from '../context/ToastContext';
import { formatoMoneda, formatoFechaHora } from '../utils/format';
import { SkeletonTabla } from '../components/Skeleton';
import EmptyState from '../components/EmptyState';
import Modal from '../components/Modal';
import ReciboModal from '../components/ReciboModal';
import Badge from '../components/Badge';

const METODOS = ['Efectivo', 'Yape', 'Plin', 'Tarjeta'];

export default function HistorialVentas() {
  const { notify } = useToast();
  const [ventas, setVentas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [desde, setDesde] = useState('');
  const [hasta, setHasta] = useState('');
  const [metodoPago, setMetodoPago] = useState('');
  const [ventaDetalle, setVentaDetalle] = useState(null);
  const [ventaImprimir, setVentaImprimir] = useState(null);

  async function cargar() {
    setCargando(true);
    try {
      const data = await ventasApi.getAll({ desde, hasta, metodoPago });
      setVentas(data);
    } catch (err) {
      notify(err.message, 'error');
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [desde, hasta, metodoPago]);

  const totalVentas = useMemo(() => ventas.reduce((sum, v) => sum + v.total, 0), [ventas]);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-slate-800">Historial de ventas</h1>
        <p className="text-slate-500 text-sm mt-0.5">
          {ventas.length} ventas · Total {formatoMoneda(totalVentas)}
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
        <div className="p-4 flex flex-wrap gap-3 border-b border-slate-100">
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">Desde</label>
            <input
              type="date"
              value={desde}
              onChange={(e) => setDesde(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">Hasta</label>
            <input
              type="date"
              value={hasta}
              onChange={(e) => setHasta(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">Método de pago</label>
            <select
              value={metodoPago}
              onChange={(e) => setMetodoPago(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
            >
              <option value="">Todos</option>
              {METODOS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
        </div>

        {cargando ? (
          <div className="p-5">
            <SkeletonTabla filas={6} columnas={6} />
          </div>
        ) : ventas.length === 0 ? (
          <EmptyState icon={FileSearch} titulo="Sin ventas" descripcion="No se encontraron ventas con los filtros aplicados." />
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
                  <th className="px-5 py-3 font-medium text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {ventas.map((v) => (
                  <tr key={v.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60">
                    <td className="px-5 py-3 font-medium text-slate-700">B001-{String(v.id).padStart(6, '0')}</td>
                    <td className="px-5 py-3 text-slate-500">{formatoFechaHora(v.fecha)}</td>
                    <td className="px-5 py-3 text-slate-600">{v.clienteNombre}</td>
                    <td className="px-5 py-3">
                      <Badge variante="azul">{v.metodoPago}</Badge>
                    </td>
                    <td className="px-5 py-3 font-semibold text-slate-700">{formatoMoneda(v.total)}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setVentaDetalle(v)}
                          className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-emerald-600 transition-colors"
                          title="Ver detalle"
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          onClick={() => setVentaImprimir(v)}
                          className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-emerald-600 transition-colors"
                          title="Reimprimir comprobante"
                        >
                          <Receipt size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal abierto={Boolean(ventaDetalle)} onClose={() => setVentaDetalle(null)} titulo="Detalle de la venta" ancho="max-w-lg">
        {ventaDetalle && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-slate-400 text-xs">Cliente</p>
                <p className="font-medium text-slate-700">{ventaDetalle.clienteNombre}</p>
              </div>
              <div>
                <p className="text-slate-400 text-xs">Vendedor</p>
                <p className="font-medium text-slate-700">{ventaDetalle.vendedorNombre}</p>
              </div>
              <div>
                <p className="text-slate-400 text-xs">Fecha</p>
                <p className="font-medium text-slate-700">{formatoFechaHora(ventaDetalle.fecha)}</p>
              </div>
              <div>
                <p className="text-slate-400 text-xs">Método de pago</p>
                <p className="font-medium text-slate-700">{ventaDetalle.metodoPago}</p>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-3">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-slate-400 text-xs">
                    <th className="text-left font-medium pb-2">Producto</th>
                    <th className="text-center font-medium pb-2">Cant.</th>
                    <th className="text-right font-medium pb-2">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {ventaDetalle.items.map((item) => (
                    <tr key={item.productoId} className="border-t border-slate-50">
                      <td className="py-2 text-slate-700">{item.nombre}</td>
                      <td className="py-2 text-center text-slate-500">{item.cantidad}</td>
                      <td className="py-2 text-right text-slate-700">{formatoMoneda(item.subtotal)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="border-t border-slate-100 pt-3 space-y-1 text-sm">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal</span>
                <span>{formatoMoneda(ventaDetalle.subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>IGV (18%)</span>
                <span>{formatoMoneda(ventaDetalle.igv)}</span>
              </div>
              <div className="flex justify-between text-slate-800 font-bold text-base">
                <span>Total</span>
                <span>{formatoMoneda(ventaDetalle.total)}</span>
              </div>
            </div>
          </div>
        )}
      </Modal>

      <ReciboModal abierto={Boolean(ventaImprimir)} onClose={() => setVentaImprimir(null)} venta={ventaImprimir} />
    </div>
  );
}
