import { useEffect, useState } from 'react';
import Modal from './Modal';

const VACIO = { nombre: '', dni: '', telefono: '', correo: '' };

export default function ClienteFormModal({ abierto, onClose, onGuardar, clienteEditar, guardando }) {
  const [form, setForm] = useState(VACIO);

  useEffect(() => {
    setForm(clienteEditar ? { ...clienteEditar } : VACIO);
  }, [clienteEditar, abierto]);

  function actualizar(campo, valor) {
    setForm((prev) => ({ ...prev, [campo]: valor }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    onGuardar(form);
  }

  return (
    <Modal abierto={abierto} onClose={onClose} titulo={clienteEditar ? 'Editar cliente' : 'Nuevo cliente'} ancho="max-w-md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          <span className="text-sm font-medium text-slate-600 mb-1.5 block">Nombre completo</span>
          <input required value={form.nombre} onChange={(e) => actualizar('nombre', e.target.value)} className="input" />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-600 mb-1.5 block">DNI</span>
          <input
            required
            value={form.dni}
            onChange={(e) => actualizar('dni', e.target.value)}
            maxLength={8}
            className="input"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-600 mb-1.5 block">Teléfono</span>
          <input required value={form.telefono} onChange={(e) => actualizar('telefono', e.target.value)} className="input" />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-600 mb-1.5 block">Correo electrónico</span>
          <input
            type="email"
            value={form.correo}
            onChange={(e) => actualizar('correo', e.target.value)}
            className="input"
          />
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
            {guardando ? 'Guardando...' : 'Guardar cliente'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
