import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import BoletaService from '../services/BoletaService.js'
import { useAuth } from '../auth/AuthContext.jsx'

const COLOR_ESTADO = {
  PENDIENTE: 'text-bg-warning',
  PAGADA: 'text-bg-success',
  ANULADA: 'text-bg-secondary',
}

function formatearPrecio(valor) {
  return `$${Number(valor).toLocaleString('es-CL', { maximumFractionDigits: 2 })}`
}

function formatearFecha(valor) {
  return new Date(valor).toLocaleString('es-CL')
}

export default function Boletas() {
  const { rol } = useAuth()
  const [boletas, setBoletas] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let activo = true

    BoletaService.listar()
      .then(({ data }) => { if (activo) setBoletas(data) })
      .catch((excepcion) => {
        if (activo) setError(excepcion.response?.data?.error ?? 'No se pudieron cargar las boletas')
      })
      .finally(() => { if (activo) setCargando(false) })

    return () => { activo = false }
  }, [])

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
        <div>
          <h1 className="h3 mb-1">Boletas</h1>
          <p className="text-body-secondary mb-0">
            {rol === 'CLIENTE'
              ? 'Tus compras registradas en la tienda.'
              : 'Todas las boletas de la tienda.'}
          </p>
        </div>
        {rol === 'CLIENTE' && (
          <Link className="btn btn-brand" to="/tienda">Nueva compra</Link>
        )}
      </div>

      {error && <div className="alert alert-danger py-2" role="alert">{error}</div>}

      <div className="info-card p-0 overflow-hidden">
        {cargando ? (
          <div className="p-4 text-body-secondary">Cargando boletas…</div>
        ) : boletas.length === 0 ? (
          <div className="p-4 text-body-secondary">Todavía no hay boletas registradas.</div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead>
                <tr>
                  <th>Número</th>
                  <th>Fecha</th>
                  <th>Cliente</th>
                  <th>Estado</th>
                  <th className="text-end">Total</th>
                  <th className="text-end">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {boletas.map((boleta) => (
                  <tr key={boleta.id}>
                    <td><code>{boleta.numero}</code></td>
                    <td>{formatearFecha(boleta.fecha)}</td>
                    <td>{boleta.clienteNombre}</td>
                    <td>
                      <span className={`badge ${COLOR_ESTADO[boleta.estado] ?? 'text-bg-light'}`}>
                        {boleta.estado}
                      </span>
                    </td>
                    <td className="text-end">{formatearPrecio(boleta.total)}</td>
                    <td className="text-end">
                      <Link className="btn btn-outline-secondary btn-sm" to={`/boletas/${boleta.id}`}>
                        Ver detalle
                      </Link>
                    </td>
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
