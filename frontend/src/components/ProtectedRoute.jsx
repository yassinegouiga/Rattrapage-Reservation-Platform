import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    // Redirige vers la page de login en gardant en mémoire la page visée
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && !user.roles.includes(requiredRole)) {
    // Si l'utilisateur est connecté mais n'a pas le bon rôle,
    // on le renvoie vers son dashboard respectif
    if (user.roles.includes("ROLE_ADMIN")) {
        return <Navigate to="/admin/dashboard" replace />;
    } else {
        return <Navigate to="/teacher/dashboard" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
