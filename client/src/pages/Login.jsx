import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Cross, Mail, Lock, Eye, EyeOff, LoaderCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function Login() {
  const { login } = useAuth();
  const { notify } = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [verPassword, setVerPassword] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setCargando(true);
    try {
      const resultado = await login(email, password);
      notify(`Bienvenido, ${resultado.usuario.nombre}`, 'success');
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'No se pudo iniciar sesión');
    } finally {
      setCargando(false);
    }
  }

  function usarDemo(rol) {
    if (rol === 'ADMINISTRADOR') {
      setEmail('admin@novasalud.com');
      setPassword('admin123');
    } else {
      setEmail('vendedor@novasalud.com');
      setPassword('vende123');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-teal-50 px-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-600/20 mb-4">
            <Cross className="text-white" size={26} strokeWidth={2.5} />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Botica Nova Salud</h1>
          <p className="text-slate-500 text-sm mt-1">Sistema de gestión farmacéutica</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-100 p-8">
          <h2 className="text-lg font-semibold text-slate-800 mb-1">Iniciar sesión</h2>
          <p className="text-sm text-slate-500 mb-6">Ingresa tus credenciales para continuar</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-600 mb-1.5 block">Correo electrónico</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="correo@novasalud.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-400"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-600 mb-1.5 block">Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
                <input
                  type={verPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-400"
                />
                <button
                  type="button"
                  onClick={() => setVerPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {verPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-3 py-2.5">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={cargando}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl py-2.5 text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {cargando && <LoaderCircle size={16} className="animate-spin" />}
              {cargando ? 'Ingresando...' : 'Ingresar'}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-100">
            <p className="text-xs text-slate-400 mb-2.5 text-center">Cuentas de demostración</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => usarDemo('ADMINISTRADOR')}
                className="text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg py-2 transition-colors"
              >
                Administrador
              </button>
              <button
                onClick={() => usarDemo('VENDEDOR')}
                className="text-xs font-medium text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-lg py-2 transition-colors"
              >
                Vendedor
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
