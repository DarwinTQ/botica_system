import { useEffect, useState } from 'react';
import { ImagePlus, X } from 'lucide-react';
import Modal from './Modal';
import PlaceholderImage from './PlaceholderImage';

const VACIO = {
  codigo: '',
  nombre: '',
  categoriaId: '',
  laboratorio: '',
  presentacion: '',
  precioCompra: '',
  precioVenta: '',
  stockActual: '',
  stockMinimo: '',
  fechaVencimiento: '',
  requiereReceta: false,
  imagen: null,
};

export default function ProductoFormModal({ abierto, onClose, onGuardar, categorias, productoEditar, guardando }) {
  const [form, setForm] = useState(VACIO);

  useEffect(() => {
    if (productoEditar) {
      setForm({
        codigo: productoEditar.codigo,
        nombre: productoEditar.nombre,
        categoriaId: String(productoEditar.categoriaId),
        laboratorio: productoEditar.laboratorio,
        presentacion: productoEditar.presentacion,
        precioCompra: productoEditar.precioCompra,
        precioVenta: productoEditar.precioVenta,
        stockActual: productoEditar.stockActual,
        stockMinimo: productoEditar.stockMinimo,
        fechaVencimiento: productoEditar.fechaVencimiento,
        requiereReceta: productoEditar.requiereReceta,
        imagen: productoEditar.imagen,
      });
    } else {
      setForm(VACIO);
    }
  }, [productoEditar, abierto]);

  function actualizar(campo, valor) {
    setForm((prev) => ({ ...prev, [campo]: valor }));
  }

  function onImagenSeleccionada(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => actualizar('imagen', reader.result);
    reader.readAsDataURL(file);
  }

  function handleSubmit(e) {
    e.preventDefault();
    onGuardar(form);
  }

  return (
    <Modal
      abierto={abierto}
      onClose={onClose}
      titulo={productoEditar ? 'Editar producto' : 'Nuevo producto'}
      ancho="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="flex items-center gap-4">
          {form.imagen ? (
            <div className="relative">
              <img src={form.imagen} alt="Vista previa" className="w-20 h-20 rounded-xl object-cover border border-slate-200" />
              <button
                type="button"
                onClick={() => actualizar('imagen', null)}
                className="absolute -top-2 -right-2 bg-white border border-slate-200 rounded-full p-1 shadow-sm hover:bg-slate-50"
              >
                <X size={12} />
              </button>
            </div>
          ) : (
            <PlaceholderImage className="w-20 h-20" iconSize={30} />
          )}
          <label className="flex items-center gap-2 text-sm font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-xl px-4 py-2.5 cursor-pointer transition-colors">
            <ImagePlus size={16} />
            {form.imagen ? 'Cambiar imagen' : 'Subir imagen (opcional)'}
            <input type="file" accept="image/*" onChange={onImagenSeleccionada} className="hidden" />
          </label>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Campo label="Código">
            <input required value={form.codigo} onChange={(e) => actualizar('codigo', e.target.value)} className="input" />
          </Campo>
          <Campo label="Nombre">
            <input required value={form.nombre} onChange={(e) => actualizar('nombre', e.target.value)} className="input" />
          </Campo>
          <Campo label="Categoría">
            <select required value={form.categoriaId} onChange={(e) => actualizar('categoriaId', e.target.value)} className="input">
              <option value="">Seleccionar...</option>
              {categorias.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre}
                </option>
              ))}
            </select>
          </Campo>
          <Campo label="Laboratorio">
            <input required value={form.laboratorio} onChange={(e) => actualizar('laboratorio', e.target.value)} className="input" />
          </Campo>
          <Campo label="Presentación">
            <input
              required
              value={form.presentacion}
              onChange={(e) => actualizar('presentacion', e.target.value)}
              placeholder="Tabletas, jarabe, cápsulas..."
              className="input"
            />
          </Campo>
          <Campo label="Fecha de vencimiento">
            <input
              required
              type="date"
              value={form.fechaVencimiento}
              onChange={(e) => actualizar('fechaVencimiento', e.target.value)}
              className="input"
            />
          </Campo>
          <Campo label="Precio de compra (S/)">
            <input
              required
              type="number"
              step="0.01"
              min="0"
              value={form.precioCompra}
              onChange={(e) => actualizar('precioCompra', e.target.value)}
              className="input"
            />
          </Campo>
          <Campo label="Precio de venta (S/)">
            <input
              required
              type="number"
              step="0.01"
              min="0"
              value={form.precioVenta}
              onChange={(e) => actualizar('precioVenta', e.target.value)}
              className="input"
            />
          </Campo>
          <Campo label="Stock actual">
            <input
              required
              type="number"
              min="0"
              value={form.stockActual}
              onChange={(e) => actualizar('stockActual', e.target.value)}
              className="input"
            />
          </Campo>
          <Campo label="Stock mínimo">
            <input
              required
              type="number"
              min="0"
              value={form.stockMinimo}
              onChange={(e) => actualizar('stockMinimo', e.target.value)}
              className="input"
            />
          </Campo>
        </div>

        <label className="flex items-center gap-2.5 text-sm text-slate-600 cursor-pointer">
          <input
            type="checkbox"
            checked={form.requiereReceta}
            onChange={(e) => actualizar('requiereReceta', e.target.checked)}
            className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
          />
          Requiere receta médica
        </label>

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={guardando}
            className="flex-1 rounded-xl bg-emerald-600 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 transition-colors disabled:opacity-60"
          >
            {guardando ? 'Guardando...' : 'Guardar producto'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

function Campo({ label, children }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-600 mb-1.5 block">{label}</span>
      {children}
    </label>
  );
}
