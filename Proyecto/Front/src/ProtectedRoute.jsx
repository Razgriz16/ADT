import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, requiredRole }) => {
  const rol = localStorage.getItem('rol'); // Obtener el rol desde localStorage
  console.log(rol)

  // Verificar si el rol del usuario coincide con el rol requerido
  if (rol !== requiredRole) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
