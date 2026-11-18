import { useEffect, useState } from 'react'
import api from '../api/client.js'

export default function AdminUsuarios() {
  const [usuarios, setUsuarios] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let activo = true
    api.get('/usuarios')
      .then(({ data }) => { if (activo) setUsuarios(data) })
      .catch((excepcion) => { if (activo) setError(excepcion.response?.data?.error ?? 'No se pudieron cargar los usuarios') })
      .finally(() => { if (activo) setCargando(false) })
    return () => { activo = false }
  }, [])

  return (
    <div>
      <h1 className="h3 mb-1">Usuarios</h1>
      <p className="text-body-secondary">Vista exclusiva del rol ADMIN. La API rechaza esta consulta para los demás roles.</p>

      {error && <div className="alert alert-danger py-2" role="alert">{error}</div>}

      <div className="info-card p-0 overflow-hidden">
        {cargando ? (
          <div className="p-4 text-body-secondary">Cargando usuarios…</div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Usuario</th>
                  <th>Nombre</th>
                  <th>Rol</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((usuario) => (
                  <tr key={usuario.id}>
                    <td>{usuario.id}</td>
                    <td><code>{usuario.username}</code></td>
                    <td>{usuario.nombre}</td>
                    <td><span className="badge text-bg-light border">{usuario.rol}</span></td>
                    <td>{usuario.activo ? 'Activo' : 'Inactivo'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
