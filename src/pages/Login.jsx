import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext.jsx'

const ACCESOS = [
  { etiqueta: 'ADMIN', usuario: 'admin', clave: 'admin123' },
  { etiqueta: 'VENDEDOR', usuario: 'vendedor', clave: 'vendedor123' },
  { etiqueta: 'CLIENTE', usuario: 'cliente', clave: 'cliente123' },
]

export default function Login() {
  const { iniciarSesion, cargando, autenticado, rol } = useAuth()
  const navegar = useNavigate()
  const ubicacion = useLocation()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  if (autenticado) {
    return <Navigate to={rol === 'CLIENTE' ? '/tienda' : '/productos'} replace />
  }

  async function enviar(evento) {
    evento.preventDefault()
    setError('')
    try {
      const sesion = await iniciarSesion(username.trim(), password)
      const destino = sesion.rol === 'CLIENTE' ? '/tienda' : '/productos'
      navegar(ubicacion.state?.desde ?? destino, { replace: true })
    } catch (excepcion) {
      setError(excepcion.response?.data?.error ?? 'No se pudo conectar con la API')
    }
  }

  function usarAcceso(acceso) {
    setUsername(acceso.usuario)
    setPassword(acceso.clave)
    setError('')
  }

  return (
    <div className="row justify-content-center py-4">
      <div className="col-md-7 col-lg-5">
        <div className="info-card">
          <h1 className="h4 mb-1">Iniciar sesión</h1>
          <p className="text-body-secondary mb-4">La API entrega un JWT y el frontend conserva la sesión.</p>

          {error && <div className="alert alert-danger py-2" role="alert">{error}</div>}

          <form onSubmit={enviar} className="d-grid gap-3">
            <div>
              <label className="form-label" htmlFor="username">Usuario</label>
              <input
                id="username"
                className="form-control"
                autoComplete="username"
                value={username}
                onChange={(evento) => setUsername(evento.target.value)}
                required
              />
            </div>
            <div>
              <label className="form-label" htmlFor="password">Contraseña</label>
              <input
                id="password"
                type="password"
                className="form-control"
                autoComplete="current-password"
                value={password}
                onChange={(evento) => setPassword(evento.target.value)}
                required
              />
            </div>
            <button className="btn btn-brand" type="submit" disabled={cargando}>
              {cargando ? 'Ingresando…' : 'Ingresar'}
            </button>
          </form>

          <hr className="my-4" />
          <p className="small text-body-secondary mb-2">Rellenar con un usuario de prueba:</p>
          <div className="d-flex gap-2 flex-wrap">
            {ACCESOS.map((acceso) => (
              <button
                key={acceso.etiqueta}
                type="button"
                className="btn btn-outline-secondary btn-sm"
                onClick={() => usarAcceso(acceso)}
              >
                {acceso.etiqueta}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
