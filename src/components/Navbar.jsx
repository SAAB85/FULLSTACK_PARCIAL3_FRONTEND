import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext.jsx'

function enlaceNav({ isActive }) {
  return `nav-link${isActive ? ' active' : ''}`
}

export default function Navbar() {
  const { autenticado, sesion, rol, cerrarSesion } = useAuth()
  const navegar = useNavigate()

  function salir() {
    cerrarSesion()
    navegar('/login')
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark app-navbar">
      <div className="container flex-wrap gap-2">
        <Link className="navbar-brand" to="/">
          EP3 <span className="brand-dot">·</span> Full Stack II
        </Link>

        <div className="d-flex align-items-center gap-3 flex-wrap">
          {autenticado ? (
            <>
              <NavLink className={enlaceNav} to="/productos">Productos</NavLink>
              {rol === 'ADMIN' && <NavLink className={enlaceNav} to="/usuarios">Usuarios</NavLink>}
              <span className="badge text-bg-warning">{rol}</span>
              <span className="navbar-text small d-none d-md-inline">{sesion?.nombre}</span>
              <button className="btn btn-outline-light btn-sm" type="button" onClick={salir}>
                Salir
              </button>
            </>
          ) : (
            <NavLink className="btn btn-outline-light btn-sm" to="/login">
              Iniciar sesión
            </NavLink>
          )}
        </div>
      </div>
    </nav>
  )
}
