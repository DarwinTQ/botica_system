import { useEffect, useState } from 'react';
import Modal from './Modal';

const VACIO = { nombre: '', email: '', password: '', rol: 'VENDEDOR' };

export default function UsuarioFormModal({ abierto, onClose, onGuardar, usuarioEditar, guardando }) {
  const [form, setForm] = useState(VACIO);

  useEffect(() => {
    setForm(usuarioEditar ? { ...usuarioEditar, password: '' } : VACIO);
  }, [usuarioEditar, abierto]);

  function actualizar(campo, valor) {
    setForm((prev) => ({ ...prev, [campo]: valor }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    onGuardar(form);
  }

  return (
    <Modal abierto={abierto} onClose={onClose} titulo={usuarioEditar ? 'Editar usuario' : 'Nuevo usuario'} ancho="max-w-sm">
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          <span className="text-sm font-medium text-slate-600 mb-1.5 block">Nombre completo</span>
          <input required value={form.nombre} onChange={(e) => actualizar('nombre', e.target.value)} className="input" />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-600 mb-1.5 block">Correo electrónico</span>
          <input
            required
            type="email"
            value={form.email}
            onChange={(e) => actualizar('email', e.target.value)}
            className="input"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-600 mb-1.5 block">
            Contraseña {usuarioEditar && <span className="text-slate-400 font-normal">(dejar vacío para no cambiar)</span>}
          </span>
          <input
            type="password"
            required={!usuarioEditar}
            value={form.password}
            onChange={(e) => actualizar('password', e.target.value)}
            className="input"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-600 mb-1.5 block">Rol</span>
          <select value={form.rol} onChange={(e) => actualizar('rol', e.target.value)} className="input">
            <option value="ADMINISTRADOR">Administrador</option>
            <option value="VENDEDOR">Vendedor</option>
          </select>
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
            {guardando ? 'Guardando...' : 'Guardar usuario'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
