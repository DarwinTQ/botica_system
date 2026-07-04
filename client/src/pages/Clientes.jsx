import { useEffect, useMemo, useState } from 'react';
import { Search, Plus, Pencil, Trash2, History, Users } from 'lucide-react';
import { clientesApi } from '../services/api';
import { useToast } from '../context/ToastContext';
import { SkeletonTabla } from '../components/Skeleton';
import EmptyState from '../components/EmptyState';
import ConfirmDialog from '../components/ConfirmDialog';
import ClienteFormModal from '../components/ClienteFormModal';
import Modal from '../components/Modal';
import { formatoMoneda, formatoFechaHora } from '../utils/format';

export default function Clientes() {
  const { notify } = useToast();
  const [clientes, setClientes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState('');

  const [modalAbierto, setModalAbierto] = useState(false);
  const [clienteEditar, setClienteEditar] = useState(null);
  const [guardando, setGuardando] = useState(false);
  const [clienteEliminar, setClienteEliminar] = useState(null);
  const [eliminando, setEliminando] = useState(false);
  const [historial, setHistorial] = useState(null);
  const [cargandoHistorial, setCargandoHistorial] = useState(false);

  async function cargar() {
    setCargando(true);
    try {
      setClientes(await clientesApi.getAll());
    } catch (err) {
      notify(err.message, 'error');
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const clientesFiltrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    if (!q) return clientes;
    return clientes.filter((c) => c.nombre.toLowerCase().includes(q) || c.dni.includes(q));
  }, [clientes, busqueda]);

  function abrirNuevo() {
    setClienteEditar(null);
    setModalAbierto(true);
  }

  async function guardarCliente(form) {
    setGuardando(true);
    try {
      if (clienteEditar) {
        await clientesApi.update(clienteEditar.id, form);
        notify('Cliente actualizado correctamente', 'success');
      } else {
        await clientesApi.create(form);
        notify('Cliente creado correctamente', 'success');
      }
      setModalAbierto(false);
      cargar();
    } catch (err) {
      notify(err.message, 'error');
    } finally {
      setGuardando(false);
    }
  }

  async function confirmarEliminar() {
    setEliminando(true);
    try {
      await clientesApi.remove(clienteEliminar.id);
      notify('Cliente eliminado', 'success');
      setClienteEliminar(null);
      cargar();
    } catch (err) {
      notify(err.message, 'error');
    } finally {
      setEliminando(false);
    }
  }

  async function verHistorial(cliente) {
    setCargandoHistorial(true);
    setHistorial({ cliente, compras: [] });
    try {
      const data = await clientesApi.getById(cliente.id);
      setHistorial({ cliente, compras: data.historialCompras || [] });
    } catch (err) {
      notify(err.message, 'error');
    } finally {
      setCargandoHistorial(false);
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Clientes</h1>
          <p className="text-slate-500 text-sm mt-0.5">{clientesFiltrados.length} clientes registrados</p>
        </div>
        <button
          onClick={abrirNuevo}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-xl px-4 py-2.5 transition-colors"
        >
          <Plus size={16} />
          Nuevo cliente
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
        <div className="p-4 border-b border-slate-100">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar por nombre o DNI..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-400"
            />
          </div>
        </div>

        {cargando ? (
          <div className="p-5">
            <SkeletonTabla filas={5} columnas={5} />
          </div>
        ) : clientesFiltrados.length === 0 ? (
          <EmptyState icon={Users} titulo="Sin clientes" descripcion="Aún no hay clientes registrados." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-400 text-xs uppercase tracking-wide border-b border-slate-100">
                  <th className="px-5 py-3 font-medium">Nombre</th>
                  <th className="px-5 py-3 font-medium">DNI</th>
                  <th className="px-5 py-3 font-medium">Teléfono</th>
                  <th className="px-5 py-3 font-medium">Correo</th>
                  <th className="px-5 py-3 font-medium text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {clientesFiltrados.map((c) => (
                  <tr key={c.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60">
                    <td className="px-5 py-3 font-medium text-slate-700">{c.nombre}</td>
                    <td className="px-5 py-3 text-slate-500">{c.dni}</td>
                    <td className="px-5 py-3 text-slate-500">{c.telefono}</td>
                    <td className="px-5 py-3 text-slate-500">{c.correo || '—'}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => verHistorial(c)}
                          className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-emerald-600 transition-colors"
                          title="Historial de compras"
                        >
                          <History size={15} />
                        </button>
                        <button
                          onClick={() => {
                            setClienteEditar(c);
                            setModalAbierto(true);
                          }}
                          className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-emerald-600 transition-colors"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => setClienteEliminar(c)}
                          className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-red-600 transition-colors"
                        >
                          <Trash2 size={15} />
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

      <ClienteFormModal
        abierto={modalAbierto}
        onClose={() => setModalAbierto(false)}
        onGuardar={guardarCliente}
        clienteEditar={clienteEditar}
        guardando={guardando}
      />
      <ConfirmDialog
        abierto={Boolean(clienteEliminar)}
        onClose={() => setClienteEliminar(null)}
        onConfirm={confirmarEliminar}
        titulo="Eliminar cliente"
        mensaje={`¿Seguro que deseas eliminar a "${clienteEliminar?.nombre}"?`}
        cargando={eliminando}
      />

      <Modal abierto={Boolean(historial)} onClose={() => setHistorial(null)} titulo="Historial de compras" ancho="max-w-lg">
        {historial && (
          <div>
            <p className="font-medium text-slate-700 mb-3">{historial.cliente.nombre}</p>
            {cargandoHistorial ? (
              <SkeletonTabla filas={3} columnas={3} />
            ) : historial.compras.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-8">Este cliente aún no tiene compras registradas.</p>
            ) : (
              <div className="space-y-2">
                {historial.compras.map((v) => (
                  <div key={v.id} className="flex items-center justify-between px-4 py-3 rounded-xl bg-slate-50 text-sm">
                    <div>
                      <p className="font-medium text-slate-700">B001-{String(v.id).padStart(6, '0')}</p>
                      <p className="text-xs text-slate-400">{formatoFechaHora(v.fecha)} · {v.metodoPago}</p>
                    </div>
                    <p className="font-semibold text-slate-700">{formatoMoneda(v.total)}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
