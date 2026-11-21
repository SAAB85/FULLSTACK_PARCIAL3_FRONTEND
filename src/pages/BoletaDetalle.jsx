import { useEffect, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
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

export default function BoletaDetalle() {
  const { id } = useParams()
  const { rol } = useAuth()
  const ubicacion = useLocation()
  const [boleta, setBoleta] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [mensaje, setMensaje] = useState(
    ubicacion.state?.creada ? 'Boleta creada correctamente.' : '',
  )
  const [cambiando, setCambiando] = useState(false)

  useEffect(() => {
    let activo = true

    BoletaService.obtener(id)
      .then(({ data }) => { if (activo) setBoleta(data) })
      .catch((excepcion) => {
        if (activo) setError(excepcion.response?.data?.error ?? 'No se pudo cargar la boleta')
      })
      .finally(() => { if (activo) setCargando(false) })

    return () => { activo = false }
  }, [id])

  async function cambiarEstado(estado) {
    if (!window.confirm(`¿Cambiar la boleta a ${estado}?`)) return

    setCambiando(true)
    setError('')

    try {
      const { data } = await BoletaService.cambiarEstado(id, estado)
      setBoleta(data)
      setMensaje(`Boleta actualizada a ${estado}.`)
    } catch (excepcion) {
      setError(excepcion.response?.data?.error ?? 'No se pudo cambiar el estado')
    } finally {
      setCambiando(false)
    }
  }

  if (cargando) {
    return <div className="info-card text-body-secondary">Cargando boleta…</div>
  }

  if (!boleta) {
    return (
      <div className="row justify-content-center py-4">
        <div className="col-md-7">
          <div className="info-card text-center">
            <h1 className="h4">No se pudo abrir la boleta</h1>
            <p className="text-body-secondary">{error}</p>
            <Link className="btn btn-brand" to="/boletas">Volver a boletas</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-3">
        <div>
          <h1 className="h3 mb-1">Boleta {boleta.numero}</h1>
          <p className="text-body-secondary mb-0">
            {formatearFecha(boleta.fecha)} · Cliente: {boleta.clienteNombre}
          </p>
        </div>
        <div className="d-flex align-items-center gap-2">
          <span className={`badge ${COLOR_ESTADO[boleta.estado] ?? 'text-bg-light'}`}>
            {boleta.estado}
          </span>
          <Link className="btn btn-outline-secondary btn-sm" to="/boletas">Volver</Link>
        </div>
      </div>

      {mensaje && <div className="alert alert-success py-2" role="status">{mensaje}</div>}
      {error && <div className="alert alert-danger py-2" role="alert">{error}</div>}

      <div className="info-card p-0 overflow-hidden mb-3">
        <div className="table-responsive">
          <table className="table align-middle mb-0">
            <thead>
              <tr>
                <th>Código</th>
                <th>Producto</th>
                <th className="text-end">Cantidad</th>
                <th className="text-end">Precio unitario</th>
                <th className="text-end">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {boleta.detalles.map((detalle) => (
                <tr key={detalle.productoId}>
                  <td><code>{detalle.codigo}</code></td>
                  <td>{detalle.nombre}</td>
                  <td className="text-end">{detalle.cantidad}</td>
                  <td className="text-end">{formatearPrecio(detalle.precioUnitario)}</td>
                  <td className="text-end">{formatearPrecio(detalle.subtotal)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <th colSpan="4" className="text-end">Total</th>
                <th className="text-end">{formatearPrecio(boleta.total)}</th>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {boleta.observacion && (
        <div className="info-card mb-3">
          <div className="small text-body-secondary mb-1">Observación</div>
          <div>{boleta.observacion}</div>
        </div>
      )}

      {rol === 'ADMIN' && (
        <div className="info-card">
          <div className="small text-body-secondary mb-2">Acciones de administrador</div>
          {boleta.estado === 'ANULADA' ? (
            <p className="mb-0 text-body-secondary">La boleta está anulada y no admite cambios.</p>
          ) : (
            <div className="d-flex gap-2 flex-wrap">
              {boleta.estado === 'PENDIENTE' && (
                <button className="btn btn-brand" type="button" disabled={cambiando}
                  onClick={() => cambiarEstado('PAGADA')}>
                  Marcar pagada
                </button>
              )}
              <button className="btn btn-outline-danger" type="button" disabled={cambiando}
                onClick={() => cambiarEstado('ANULADA')}>
                Anular boleta
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
