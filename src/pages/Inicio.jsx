import { Link } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext.jsx'

const CREDENCIALES = [
  { rol: 'ADMIN', usuario: 'admin', clave: 'admin123', detalle: 'Todo: productos y usuarios' },
  { rol: 'VENDEDOR', usuario: 'vendedor', clave: 'vendedor123', detalle: 'Crea y edita productos' },
  { rol: 'CLIENTE', usuario: 'cliente', clave: 'cliente123', detalle: 'Solo consulta' },
]

export default function Inicio() {
  const { autenticado } = useAuth()

  return (
    <div className="py-3">
      <section className="hero-card mb-4">
        <span className="badge text-bg-dark mb-3">DSY1104 · Evaluación Parcial 3</span>
        <h1 className="display-6 fw-bold mb-2">Integración REST con JWT, roles y sesión</h1>
        <p className="lead mb-4">
          Esqueleto del proyecto: API Spring Boot protegida con tokens y un frontend React que
          conserva la sesión y restringe las vistas según el rol.
        </p>
        <div className="d-flex gap-2 flex-wrap">
          <Link className="btn btn-brand" to={autenticado ? '/productos' : '/login'}>
            {autenticado ? 'Ir a productos' : 'Iniciar sesión'}
          </Link>
          <a className="btn btn-outline-secondary" href="http://localhost:8080/swagger-ui/index.html" target="_blank" rel="noreferrer">
            Abrir Swagger
          </a>
        </div>
      </section>

      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="info-card h-100">
            <span className="info-kicker">Backend</span>
            <h2 className="h5">Spring Boot 4</h2>
            <p className="mb-1">API REST en <code>:8080</code> con Spring Security, JPA y H2.</p>
            <p className="small text-body-secondary mb-0">JWT firmado con HS256 y roles ADMIN, VENDEDOR y CLIENTE.</p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="info-card h-100">
            <span className="info-kicker">Frontend</span>
            <h2 className="h5">React 19 + Vite</h2>
            <p className="mb-1">Aplicación en <code>:5173</code> con rutas protegidas.</p>
            <p className="small text-body-secondary mb-0">La sesión se guarda en <code>localStorage</code> y se reenvía en cada petición.</p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="info-card h-100">
            <span className="info-kicker">Permisos</span>
            <h2 className="h5">Tres niveles</h2>
            <p className="mb-1">La API y la interfaz aplican las mismas reglas.</p>
            <p className="small text-body-secondary mb-0">El backend siempre valida el token; el frontend solo oculta acciones.</p>
          </div>
        </div>
      </div>

      <section className="info-card">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
          <h2 className="h5 mb-0">Usuarios de prueba</h2>
          <span className="small text-body-secondary">Creados automáticamente por el backend</span>
        </div>
        <div className="table-responsive">
          <table className="table table-sm align-middle mb-0">
            <thead>
              <tr>
                <th>Rol</th>
                <th>Usuario</th>
                <th>Contraseña</th>
                <th>Alcance</th>
              </tr>
            </thead>
            <tbody>
              {CREDENCIALES.map((fila) => (
                <tr key={fila.usuario}>
                  <td><span className="badge text-bg-light border">{fila.rol}</span></td>
                  <td><code>{fila.usuario}</code></td>
                  <td><code>{fila.clave}</code></td>
                  <td className="text-body-secondary">{fila.detalle}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
