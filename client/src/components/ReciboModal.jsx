import { Printer } from 'lucide-react';
import Modal from './Modal';
import { formatoMoneda, formatoFechaHora } from '../utils/format';

export default function ReciboModal({ abierto, onClose, venta }) {
  if (!venta) return null;

  return (
    <Modal abierto={abierto} onClose={onClose} titulo="Comprobante de venta" ancho="max-w-md">
      <div id="boleta-imprimible" className="space-y-4">
        <div className="text-center">
          <h3 className="font-bold text-slate-800 text-lg">Botica Nova Salud</h3>
          <p className="text-xs text-slate-500">Av. Salud y Bienestar 123, Lima - Perú</p>
          <p className="text-xs text-slate-500">RUC: 20123456789</p>
          <p className="text-xs text-slate-400 mt-1">{formatoFechaHora(venta.fecha)}</p>
        </div>

        <div className="border-t border-dashed border-slate-300 pt-3 text-sm">
          <div className="flex justify-between text-slate-500">
            <span>Cliente</span>
            <span className="text-slate-700 font-medium">{venta.clienteNombre}</span>
          </div>
          <div className="flex justify-between text-slate-500">
            <span>Método de pago</span>
            <span className="text-slate-700 font-medium">{venta.metodoPago}</span>
          </div>
          <div className="flex justify-between text-slate-500">
            <span>Comprobante N°</span>
            <span className="text-slate-700 font-medium">B001-{String(venta.id).padStart(6, '0')}</span>
          </div>
        </div>

        <div className="border-t border-dashed border-slate-300 pt-3">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-slate-400 text-xs">
                <th className="text-left font-medium pb-1">Producto</th>
                <th className="text-center font-medium pb-1">Cant.</th>
                <th className="text-right font-medium pb-1">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {venta.items.map((item) => (
                <tr key={item.productoId}>
                  <td className="py-1 text-slate-700">{item.nombre}</td>
                  <td className="py-1 text-center text-slate-500">{item.cantidad}</td>
                  <td className="py-1 text-right text-slate-700">{formatoMoneda(item.subtotal)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="border-t border-dashed border-slate-300 pt-3 space-y-1 text-sm">
          <div className="flex justify-between text-slate-500">
            <span>Subtotal</span>
            <span>{formatoMoneda(venta.subtotal)}</span>
          </div>
          <div className="flex justify-between text-slate-500">
            <span>IGV (18%)</span>
            <span>{formatoMoneda(venta.igv)}</span>
          </div>
          <div className="flex justify-between text-slate-800 font-bold text-base pt-1">
            <span>Total</span>
            <span>{formatoMoneda(venta.total)}</span>
          </div>
        </div>

        <p className="text-center text-xs text-slate-400 pt-2">¡Gracias por su compra!</p>
      </div>

      <div className="flex gap-3 mt-6 print:hidden">
        <button
          onClick={onClose}
          className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
        >
          Cerrar
        </button>
        <button
          onClick={() => window.print()}
          className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 transition-colors"
        >
          <Printer size={16} />
          Imprimir
        </button>
      </div>
    </Modal>
  );
}
