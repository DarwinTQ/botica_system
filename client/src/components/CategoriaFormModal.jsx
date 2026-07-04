import { useEffect, useState } from 'react';
import Modal from './Modal';

export default function CategoriaFormModal({ abierto, onClose, onGuardar, categoriaEditar, guardando }) {
  const [nombre, setNombre] = useState('');

  useEffect(() => {
    setNombre(categoriaEditar?.nombre || '');
  }, [categoriaEditar, abierto]);

  function handleSubmit(e) {
    e.preventDefault();
    onGuardar({ nombre });
  }

  return (
    <Modal abierto={abierto} onClose={onClose} titulo={categoriaEditar ? 'Editar categoría' : 'Nueva categoría'} ancho="max-w-sm">
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          <span className="text-sm font-medium text-slate-600 mb-1.5 block">Nombre de la categoría</span>
          <input required value={nombre} onChange={(e) => setNombre(e.target.value)} className="input" autoFocus />
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
            {guardando ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
