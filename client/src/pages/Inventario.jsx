import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  PackageSearch,
  CalendarClock,
} from 'lucide-react';
import { productosApi, categoriasApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Badge, { estadoStockBadge } from '../components/Badge';
import PlaceholderImage from '../components/PlaceholderImage';
import { SkeletonTabla } from '../components/Skeleton';
import EmptyState from '../components/EmptyState';
import ConfirmDialog from '../components/ConfirmDialog';
import ProductoFormModal from '../components/ProductoFormModal';
import { formatoMoneda, diasHastaFecha } from '../utils/format';

const POR_PAGINA = 8;
const DIAS_ALERTA_VENCIMIENTO = 60;

export default function Inventario() {
  const { esAdministrador } = useAuth();
  const { notify } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();

  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [cargando, setCargando] = useState(true);

  const [busqueda, setBusqueda] = useState(searchParams.get('q') || '');
  const [categoriaFiltro, setCategoriaFiltro] = useState('');
  const [orden, setOrden] = useState({ campo: 'nombre', direccion: 'asc' });
  const [pagina, setPagina] = useState(1);

  const [modalAbierto, setModalAbierto] = useState(false);
  const [productoEditar, setProductoEditar] = useState(null);
  const [guardando, setGuardando] = useState(false);
  const [productoEliminar, setProductoEliminar] = useState(null);
  const [eliminando, setEliminando] = useState(false);

  async function cargarDatos() {
    setCargando(true);
    try {
      const [prod, cat] = await Promise.all([productosApi.getAll(), categoriasApi.getAll()]);
      setProductos(prod);
      setCategorias(cat);
    } catch (err) {
      notify(err.message, 'error');
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargarDatos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setPagina(1);
  }, [busqueda, categoriaFiltro]);

  function cambiarOrden(campo) {
    setOrden((prev) =>
      prev.campo === campo ? { campo, direccion: prev.direccion === 'asc' ? 'desc' : 'asc' } : { campo, direccion: 'asc' }
    );
  }

  const productosFiltrados = useMemo(() => {
    let lista = [...productos];

    if (busqueda.trim()) {
      const q = busqueda.trim().toLowerCase();
      lista = lista.filter((p) => p.nombre.toLowerCase().includes(q) || p.codigo.toLowerCase().includes(q));
    }
    if (categoriaFiltro) {
      lista = lista.filter((p) => p.categoriaId === Number(categoriaFiltro));
    }

    lista.sort((a, b) => {
      const dir = orden.direccion === 'asc' ? 1 : -1;
      const va = a[orden.campo];
      const vb = b[orden.campo];
      if (typeof va === 'string') return va.localeCompare(vb) * dir;
      return (va - vb) * dir;
    });

    return lista;
  }, [productos, busqueda, categoriaFiltro, orden]);

  const totalPaginas = Math.max(1, Math.ceil(productosFiltrados.length / POR_PAGINA));
  const productosPagina = productosFiltrados.slice((pagina - 1) * POR_PAGINA, pagina * POR_PAGINA);

  function abrirNuevo() {
    setProductoEditar(null);
    setModalAbierto(true);
  }

  function abrirEditar(producto) {
    setProductoEditar(producto);
    setModalAbierto(true);
  }

  async function guardarProducto(form) {
    setGuardando(true);
    try {
      if (productoEditar) {
        await productosApi.update(productoEditar.id, form);
        notify('Producto actualizado correctamente', 'success');
      } else {
        await productosApi.create(form);
        notify('Producto creado correctamente', 'success');
      }
      setModalAbierto(false);
      cargarDatos();
    } catch (err) {
      notify(err.message, 'error');
    } finally {
      setGuardando(false);
    }
  }

  async function confirmarEliminar() {
    setEliminando(true);
    try {
      await productosApi.remove(productoEliminar.id);
      notify('Producto eliminado', 'success');
      setProductoEliminar(null);
      cargarDatos();
    } catch (err) {
      notify(err.message, 'error');
    } finally {
      setEliminando(false);
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Inventario</h1>
          <p className="text-slate-500 text-sm mt-0.5">{productosFiltrados.length} productos registrados</p>
        </div>
        {esAdministrador && (
          <button
            onClick={abrirNuevo}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-xl px-4 py-2.5 transition-colors"
          >
            <Plus size={16} />
            Nuevo producto
          </button>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
        <div className="p-4 flex flex-wrap gap-3 border-b border-slate-100">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              value={busqueda}
              onChange={(e) => {
                setBusqueda(e.target.value);
                setSearchParams(e.target.value ? { q: e.target.value } : {});
              }}
              placeholder="Buscar por nombre o código..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-400"
            />
          </div>
          <select
            value={categoriaFiltro}
            onChange={(e) => setCategoriaFiltro(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
          >
            <option value="">Todas las categorías</option>
            {categorias.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre}
              </option>
            ))}
          </select>
        </div>

        {cargando ? (
          <div className="p-5">
            <SkeletonTabla filas={6} columnas={6} />
          </div>
        ) : productosFiltrados.length === 0 ? (
          <EmptyState
            icon={PackageSearch}
            titulo="Sin resultados"
            descripcion="No se encontraron productos con los filtros aplicados."
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-slate-400 text-xs uppercase tracking-wide border-b border-slate-100">
                    <th className="px-5 py-3 font-medium">Producto</th>
                    <EncabezadoOrdenable campo="categoriaId" orden={orden} onClick={cambiarOrden} etiqueta="Categoría" ordenable={false} />
                    <EncabezadoOrdenable campo="precioVenta" orden={orden} onClick={cambiarOrden} etiqueta="Precio" />
                    <EncabezadoOrdenable campo="stockActual" orden={orden} onClick={cambiarOrden} etiqueta="Stock" />
                    <th className="px-5 py-3 font-medium">Vencimiento</th>
                    {esAdministrador && <th className="px-5 py-3 font-medium text-right">Acciones</th>}
                  </tr>
                </thead>
                <tbody>
                  {productosPagina.map((p) => {
                    const estado = estadoStockBadge(p.stockActual, p.stockMinimo);
                    const dias = diasHastaFecha(p.fechaVencimiento);
                    const porVencer = dias <= DIAS_ALERTA_VENCIMIENTO;
                    return (
                      <tr key={p.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60">
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-3">
                            {p.imagen ? (
                              <img src={p.imagen} alt={p.nombre} className="w-11 h-11 rounded-lg object-cover shrink-0" />
                            ) : (
                              <PlaceholderImage className="w-11 h-11" iconSize={18} />
                            )}
                            <div>
                              <p className="font-medium text-slate-700">{p.nombre}</p>
                              <p className="text-xs text-slate-400">
                                {p.codigo} · {p.laboratorio}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3 text-slate-500">{p.categoriaNombre}</td>
                        <td className="px-5 py-3 font-medium text-slate-700">{formatoMoneda(p.precioVenta)}</td>
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-2">
                            <span className="text-slate-600">{p.stockActual}</span>
                            <Badge variante={estado.variante}>{estado.texto}</Badge>
                          </div>
                        </td>
                        <td className="px-5 py-3">
                          {porVencer ? (
                            <span className="inline-flex items-center gap-1.5 text-amber-600 font-medium text-xs">
                              <CalendarClock size={14} />
                              {dias < 0 ? 'Vencido' : `${dias} días`}
                            </span>
                          ) : (
                            <span className="text-slate-400 text-xs">{p.fechaVencimiento}</span>
                          )}
                        </td>
                        {esAdministrador && (
                          <td className="px-5 py-3">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => abrirEditar(p)}
                                className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-emerald-600 transition-colors"
                              >
                                <Pencil size={15} />
                              </button>
                              <button
                                onClick={() => setProductoEliminar(p)}
                                className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-red-600 transition-colors"
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between px-5 py-3.5 border-t border-slate-100">
              <p className="text-xs text-slate-400">
                Página {pagina} de {totalPaginas}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPagina((p) => Math.max(1, p - 1))}
                  disabled={pagina === 1}
                  className="p-2 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-50"
                >
                  <ChevronLeft size={15} />
                </button>
                <button
                  onClick={() => setPagina((p) => Math.min(totalPaginas, p + 1))}
                  disabled={pagina === totalPaginas}
                  className="p-2 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-50"
                >
                  <ChevronRight size={15} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {esAdministrador && (
        <>
          <ProductoFormModal
            abierto={modalAbierto}
            onClose={() => setModalAbierto(false)}
            onGuardar={guardarProducto}
            categorias={categorias}
            productoEditar={productoEditar}
            guardando={guardando}
          />
          <ConfirmDialog
            abierto={Boolean(productoEliminar)}
            onClose={() => setProductoEliminar(null)}
            onConfirm={confirmarEliminar}
            titulo="Eliminar producto"
            mensaje={`¿Seguro que deseas eliminar "${productoEliminar?.nombre}"? Esta acción no se puede deshacer.`}
            cargando={eliminando}
          />
        </>
      )}
    </div>
  );
}

function EncabezadoOrdenable({ campo, etiqueta, orden, onClick, ordenable = true }) {
  return (
    <th className="px-5 py-3 font-medium">
      {ordenable ? (
        <button onClick={() => onClick(campo)} className="flex items-center gap-1.5 hover:text-slate-600">
          {etiqueta}
          <ArrowUpDown size={12} className={orden.campo === campo ? 'text-emerald-600' : 'text-slate-300'} />
        </button>
      ) : (
        etiqueta
      )}
    </th>
  );
}
