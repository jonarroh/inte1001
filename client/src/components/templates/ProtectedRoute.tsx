// ProtectedRoute.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/", {
        replace: true,
      }); // Redirige a la ruta raíz si no hay token
    }
  }, [navigate]);

  return <>{children}</>; // Renderiza `children` solo si hay token
}

export default ProtectedRoute;
