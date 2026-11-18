import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from './AuthContext.jsx'

export function RutaProtegida() {
  const { autenticado } = useAuth()
  const ubicacion = useLocation()

  if (!autenticado) {
    return <Navigate to="/login" replace state={{ desde: ubicacion.pathname }} />
  }

  return <Outlet />
}

export function RutaConRol({ roles }) {
  const { rol } = useAuth()

  if (!roles.includes(rol)) {
    return <Navigate to="/no-autorizado" replace />
  }

  return <Outlet />
}
