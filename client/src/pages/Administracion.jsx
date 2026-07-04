import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash2, Tag, UserCog, Package, ArrowRight } from 'lucide-react';
import { categoriasApi, usuariosApi } from '../services/api';
import { useToast } from '../context/ToastContext';
import { SkeletonTabla } from '../components/Skeleton';
import ConfirmDialog from '../components/ConfirmDialog';
import CategoriaFormModal from '../components/CategoriaFormModal';
import UsuarioFormModal from '../components/UsuarioFormModal';
import Badge from '../components/Badge';

const TABS = [
  { id: 'productos', label: 'Productos', icono: Package },
  { id: 'categorias', label: 'Categorías', icono: Tag },
  { id: 'usuarios', label: 'Usuarios', icono: UserCog },
];

export default function Administracion() {
  const [tab, setTab] = useState('productos');

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-slate-800">Panel de administración</h1>
        <p className="text-slate-500 text-sm mt-0.5">Gestiona productos, categorías y usuarios del sistema</p>
      </div>

      <div className="flex gap-2 border-b border-slate-200">
        {TABS.map(({ id, label, icono: Icono }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
              tab === id ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Icono size={15} />
            {label}
          </button>
        ))}
      </div>

      {tab === 'productos' && <TabProductos />}
      {tab === 'categorias' && <TabCategorias />}
      {tab === 'usuarios' && <TabUsuarios />}
    </div>
  );
}

function TabProductos() {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 flex flex-col items-center text-center">
      <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center mb-4">
        <Package size={26} className="text-emerald-600" />
      </div>
      <h3 className="font-semibold text-slate-800 mb-1">Gestión de productos</h3>
      <p className="text-sm text-slate-500 max-w-md mb-5">
        La creación, edición y carga de imágenes de productos se administra desde el módulo de Inventario,
        donde también puedes buscar, filtrar y ver el estado de stock.
      </p>
      <Link
        to="/inventario"
        className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-xl px-4 py-2.5 transition-colors"
      >
        Ir a Inventario
        <ArrowRight size={15} />
      </Link>
    </div>
  );
}

function TabCategorias() {
  const { notify } = useToast();
  const [categorias, setCategorias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [categoriaEditar, setCategoriaEditar] = useState(null);
  const [guardando, setGuardando] = useState(false);
  const [categoriaEliminar, setCategoriaEliminar] = useState(null);
  const [eliminando, setEliminando] = useState(false);

  async function cargar() {
    setCargando(true);
    try {
      setCategorias(await categoriasApi.getAll());
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

  async function guardar(form) {
    setGuardando(true);
    try {
      if (categoriaEditar) {
        await categoriasApi.update(categoriaEditar.id, form);
        notify('Categoría actualizada', 'success');
      } else {
        await categoriasApi.create(form);
        notify('Categoría creada', 'success');
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
      await categoriasApi.remove(categoriaEliminar.id);
      notify('Categoría eliminada', 'success');
      setCategoriaEliminar(null);
      cargar();
    } catch (err) {
      notify(err.message, 'error');
    } finally {
      setEliminando(false);
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
      <div className="p-4 flex items-center justify-between border-b border-slate-100">
        <p className="text-sm text-slate-500">{categorias.length} categorías registradas</p>
        <button
          onClick={() => {
            setCategoriaEditar(null);
            setModalAbierto(true);
          }}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-xl px-3.5 py-2 transition-colors"
        >
          <Plus size={15} />
          Nueva categoría
        </button>
      </div>

      {cargando ? (
        <div className="p-5">
          <SkeletonTabla filas={4} columnas={2} />
        </div>
      ) : (
        <div className="divide-y divide-slate-50">
          {categorias.map((c) => (
            <div key={c.id} className="flex items-center justify-between px-5 py-3">
              <span className="text-sm font-medium text-slate-700">{c.nombre}</span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => {
                    setCategoriaEditar(c);
                    setModalAbierto(true);
                  }}
                  className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-emerald-600 transition-colors"
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={() => setCategoriaEliminar(c)}
                  className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-red-600 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <CategoriaFormModal
        abierto={modalAbierto}
        onClose={() => setModalAbierto(false)}
        onGuardar={guardar}
        categoriaEditar={categoriaEditar}
        guardando={guardando}
      />
      <ConfirmDialog
        abierto={Boolean(categoriaEliminar)}
        onClose={() => setCategoriaEliminar(null)}
        onConfirm={confirmarEliminar}
        titulo="Eliminar categoría"
        mensaje={`¿Seguro que deseas eliminar "${categoriaEliminar?.nombre}"?`}
        cargando={eliminando}
      />
    </div>
  );
}

function TabUsuarios() {
  const { notify } = useToast();
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [usuarioEditar, setUsuarioEditar] = useState(null);
  const [guardando, setGuardando] = useState(false);
  const [usuarioEliminar, setUsuarioEliminar] = useState(null);
  const [eliminando, setEliminando] = useState(false);

  async function cargar() {
    setCargando(true);
    try {
      setUsuarios(await usuariosApi.getAll());
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

  async function guardar(form) {
    setGuardando(true);
    try {
      if (usuarioEditar) {
        await usuariosApi.update(usuarioEditar.id, form);
        notify('Usuario actualizado', 'success');
      } else {
        await usuariosApi.create(form);
        notify('Usuario creado', 'success');
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
      await usuariosApi.remove(usuarioEliminar.id);
      notify('Usuario eliminado', 'success');
      setUsuarioEliminar(null);
      cargar();
    } catch (err) {
      notify(err.message, 'error');
    } finally {
      setEliminando(false);
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
      <div className="p-4 flex items-center justify-between border-b border-slate-100">
        <p className="text-sm text-slate-500">{usuarios.length} usuarios registrados</p>
        <button
          onClick={() => {
            setUsuarioEditar(null);
            setModalAbierto(true);
          }}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-xl px-3.5 py-2 transition-colors"
        >
          <Plus size={15} />
          Nuevo usuario
        </button>
      </div>

      {cargando ? (
        <div className="p-5">
          <SkeletonTabla filas={3} columnas={4} />
        </div>
      ) : (
        <div className="divide-y divide-slate-50">
          {usuarios.map((u) => (
            <div key={u.id} className="flex items-center justify-between px-5 py-3">
              <div>
                <p className="text-sm font-medium text-slate-700">{u.nombre}</p>
                <p className="text-xs text-slate-400">{u.email}</p>
              </div>
              <div className="flex items-center gap-3">
                <Badge variante={u.rol === 'ADMINISTRADOR' ? 'verde' : 'azul'}>{u.rol}</Badge>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      setUsuarioEditar(u);
                      setModalAbierto(true);
                    }}
                    className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-emerald-600 transition-colors"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => setUsuarioEliminar(u)}
                    className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-red-600 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <UsuarioFormModal
        abierto={modalAbierto}
        onClose={() => setModalAbierto(false)}
        onGuardar={guardar}
        usuarioEditar={usuarioEditar}
        guardando={guardando}
      />
      <ConfirmDialog
        abierto={Boolean(usuarioEliminar)}
        onClose={() => setUsuarioEliminar(null)}
        onConfirm={confirmarEliminar}
        titulo="Eliminar usuario"
        mensaje={`¿Seguro que deseas eliminar a "${usuarioEliminar?.nombre}"?`}
        cargando={eliminando}
      />
    </div>
  );
}
