import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './context/AuthContext';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Inventario from './pages/Inventario';
import PuntoDeVenta from './pages/PuntoDeVenta';
import HistorialVentas from './pages/HistorialVentas';
import Alertas from './pages/Alertas';
import Clientes from './pages/Clientes';
import Reportes from './pages/Reportes';
import Administracion from './pages/Administracion';

export default function App() {
  const { estaAutenticado } = useAuth();

  return (
    <Routes>
      <Route
        path="/login"
        element={estaAutenticado ? <Navigate to="/dashboard" replace /> : <Login />}
      />

      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/pos" element={<PuntoDeVenta />} />
        <Route path="/inventario" element={<Inventario />} />
        <Route path="/clientes" element={<Clientes />} />

        <Route
          path="/ventas"
          element={
            <ProtectedRoute soloAdmin>
              <HistorialVentas />
            </ProtectedRoute>
          }
        />
        <Route
          path="/alertas"
          element={
            <ProtectedRoute soloAdmin>
              <Alertas />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reportes"
          element={
            <ProtectedRoute soloAdmin>
              <Reportes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute soloAdmin>
              <Administracion />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
