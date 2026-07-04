import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, soloAdmin = false }) {
  const { estaAutenticado, esAdministrador } = useAuth();

  if (!estaAutenticado) {
    return <Navigate to="/login" replace />;
  }

  if (soloAdmin && !esAdministrador) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
