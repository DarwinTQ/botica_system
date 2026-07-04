import { useEffect, useMemo, useState } from 'react';
import { Search, Plus, Minus, Trash2, ShoppingCart, PackageSearch, Banknote, Smartphone, CreditCard } from 'lucide-react';
import { productosApi, clientesApi, ventasApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import PlaceholderImage from '../components/PlaceholderImage';
import EmptyState from '../components/EmptyState';
import ReciboModal from '../components/ReciboModal';
import { formatoMoneda } from '../utils/format';

const METODOS_PAGO = [
  { valor: 'Efectivo', icono: Banknote },
  { valor: 'Yape', icono: Smartphone },
  { valor: 'Plin', icono: Smartphone },
  { valor: 'Tarjeta', icono: CreditCard },
];

const IGV_RATE = 0.18;

export default function PuntoDeVenta() {
  const { usuario } = useAuth();
  const { notify } = useToast();

  const [productos, setProductos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState('');

  const [carrito, setCarrito] = useState([]);
  const [clienteId, setClienteId] = useState('');
  const [metodoPago, setMetodoPago] = useState('Efectivo');
  const [procesando, setProcesando] = useState(false);
  const [ventaConfirmada, setVentaConfirmada] = useState(null);

  async function cargarDatos() {
    setCargando(true);
    try {
      const [prod, cli] = await Promise.all([productosApi.getAll(), clientesApi.getAll()]);
      setProductos(prod);
      setClientes(cli);
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

  const productosFiltrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    if (!q) return productos;
    return productos.filter((p) => p.nombre.toLowerCase().includes(q) || p.codigo.toLowerCase().includes(q));
  }, [productos, busqueda]);

  function agregarAlCarrito(producto) {
    if (producto.stockActual <= 0) return;
    setCarrito((prev) => {
      const existente = prev.find((item) => item.productoId === producto.id);
      if (existente) {
        if (existente.cantidad >= producto.stockActual) {
          notify(`No hay más stock disponible de ${producto.nombre}`, 'error');
          return prev;
        }
        return prev.map((item) =>
          item.productoId === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item
        );
      }
      return [
        ...prev,
        {
          productoId: producto.id,
          nombre: producto.nombre,
          precioUnitario: producto.precioVenta,
          cantidad: 1,
          stockDisponible: producto.stockActual,
        },
      ];
    });
  }

  function cambiarCantidad(productoId, delta) {
    setCarrito((prev) =>
      prev.map((item) => {
        if (item.productoId !== productoId) return item;
        const nuevaCantidad = item.cantidad + delta;
        if (nuevaCantidad < 1) return item;
        if (nuevaCantidad > item.stockDisponible) {
          notify('No puedes superar el stock disponible', 'error');
          return item;
        }
        return { ...item, cantidad: nuevaCantidad };
      })
    );
  }

  function quitarDelCarrito(productoId) {
    setCarrito((prev) => prev.filter((item) => item.productoId !== productoId));
  }

  const subtotal = useMemo(() => carrito.reduce((sum, i) => sum + i.precioUnitario * i.cantidad, 0), [carrito]);
  const igv = subtotal * IGV_RATE;
  const total = subtotal + igv;

  async function confirmarVenta() {
    if (carrito.length === 0) return;
    setProcesando(true);
    try {
      const venta = await ventasApi.create({
        clienteId: clienteId ? Number(clienteId) : null,
        metodoPago,
        vendedorId: usuario?.id,
        vendedorNombre: usuario?.nombre,
        items: carrito.map((item) => ({ productoId: item.productoId, cantidad: item.cantidad })),
      });
      notify('Venta registrada correctamente', 'success');
      setVentaConfirmada(venta);
      setCarrito([]);
      setClienteId('');
      setMetodoPago('Efectivo');
      cargarDatos();
    } catch (err) {
      notify(err.message, 'error');
    } finally {
      setProcesando(false);
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6 items-start">
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
          <input
            autoFocus
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar producto por nombre o código..."
            className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-3 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-400"
          />
        </div>

        {cargando ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-40 rounded-2xl bg-white border border-slate-100 animate-pulse" />
            ))}
          </div>
        ) : productosFiltrados.length === 0 ? (
          <EmptyState icon={PackageSearch} titulo="Sin resultados" descripcion="No se encontraron productos." />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
            {productosFiltrados.map((p) => {
              const agotado = p.stockActual <= 0;
              return (
                <button
                  key={p.id}
                  data-testid={`producto-catalogo-${p.codigo}`}
                  onClick={() => agregarAlCarrito(p)}
                  disabled={agotado}
                  className={`text-left bg-white border border-slate-100 rounded-2xl p-3 shadow-sm transition-all ${
                    agotado ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md hover:border-emerald-200 hover:-translate-y-0.5'
                  }`}
                >
                  {p.imagen ? (
                    <img src={p.imagen} alt={p.nombre} className="w-full h-20 object-cover rounded-xl mb-2" />
                  ) : (
                    <div className="w-full h-20 rounded-xl bg-slate-100 flex items-center justify-center mb-2">
                      <PlaceholderImage className="w-10 h-10" iconSize={18} />
                    </div>
                  )}
                  <p className="text-sm font-medium text-slate-700 line-clamp-2 leading-tight">{p.nombre}</p>
                  <div className="flex items-center justify-between mt-1.5">
                    <span className="text-emerald-700 font-bold text-sm">{formatoMoneda(p.precioVenta)}</span>
                    <span className={`text-xs font-medium ${agotado ? 'text-red-500' : 'text-slate-400'}`}>
                      {agotado ? 'Agotado' : `Stock: ${p.stockActual}`}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm sticky top-20 flex flex-col max-h-[calc(100vh-6rem)]">
        <div className="p-4 border-b border-slate-100 flex items-center gap-2">
          <ShoppingCart size={18} className="text-emerald-600" />
          <h2 className="font-semibold text-slate-800">Carrito de venta</h2>
          <span className="ml-auto text-xs font-medium bg-emerald-50 text-emerald-700 px-2 py-1 rounded-full">
            {carrito.length} ítem{carrito.length === 1 ? '' : 's'}
          </span>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {carrito.length === 0 ? (
            <EmptyState icon={ShoppingCart} titulo="Carrito vacío" descripcion="Agrega productos desde el catálogo." />
          ) : (
            carrito.map((item) => (
              <div key={item.productoId} className="flex items-center gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-700 truncate">{item.nombre}</p>
                  <p className="text-xs text-slate-400">{formatoMoneda(item.precioUnitario)} c/u</p>
                </div>
                <div className="flex items-center gap-1 bg-slate-50 rounded-lg px-1">
                  <button onClick={() => cambiarCantidad(item.productoId, -1)} className="p-1.5 text-slate-500 hover:text-slate-700">
                    <Minus size={13} />
                  </button>
                  <span className="text-sm font-medium w-5 text-center">{item.cantidad}</span>
                  <button onClick={() => cambiarCantidad(item.productoId, 1)} className="p-1.5 text-slate-500 hover:text-slate-700">
                    <Plus size={13} />
                  </button>
                </div>
                <button onClick={() => quitarDelCarrito(item.productoId)} className="p-1.5 text-slate-400 hover:text-red-500">
                  <Trash2 size={14} />
                </button>
              </div>
            ))
          )}
        </div>

        <div className="p-4 border-t border-slate-100 space-y-3">
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">Cliente</label>
            <select
              value={clienteId}
              onChange={(e) => setClienteId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
            >
              <option value="">Cliente general</option>
              {clientes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">Método de pago</label>
            <div className="grid grid-cols-4 gap-1.5">
              {METODOS_PAGO.map(({ valor, icono: Icono }) => (
                <button
                  key={valor}
                  onClick={() => setMetodoPago(valor)}
                  className={`flex flex-col items-center gap-1 py-2 rounded-xl text-[11px] font-medium border transition-colors ${
                    metodoPago === valor
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                      : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  <Icono size={16} />
                  {valor}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1 pt-2 border-t border-slate-100 text-sm">
            <div className="flex justify-between text-slate-500">
              <span>Subtotal</span>
              <span>{formatoMoneda(subtotal)}</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>IGV (18%)</span>
              <span>{formatoMoneda(igv)}</span>
            </div>
            <div className="flex justify-between text-slate-800 font-bold text-base pt-1">
              <span>Total</span>
              <span>{formatoMoneda(total)}</span>
            </div>
          </div>

          <button
            onClick={confirmarVenta}
            disabled={carrito.length === 0 || procesando}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl py-3 text-sm transition-colors disabled:opacity-50"
          >
            {procesando ? 'Procesando...' : 'Confirmar venta'}
          </button>
        </div>
      </div>

      <ReciboModal abierto={Boolean(ventaConfirmada)} onClose={() => setVentaConfirmada(null)} venta={ventaConfirmada} />
    </div>
  );
}
