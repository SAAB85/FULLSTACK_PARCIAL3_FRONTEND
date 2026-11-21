import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/client.js'
import BoletaService from '../services/BoletaService.js'
import { useAuth } from '../auth/AuthContext.jsx'

function formatearPrecio(valor) {
  return `$${Number(valor).toLocaleString('es-CL', { maximumFractionDigits: 2 })}`
}

export default function Tienda() {
  const { rol } = useAuth()
  const navegar = useNavigate()
  const [productos, setProductos] = useState([])
  const [cantidades, setCantidades] = useState({})
  const [observacion, setObservacion] = useState('')
  const [cargando, setCargando] = useState(true)
  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let activo = true

    api.get('/productos')
      .then(({ data }) => { if (activo) setProductos(data) })
      .catch((excepcion) => {
        if (activo) setError(excepcion.response?.data?.error ?? 'No se pudo cargar la tienda')
      })
      .finally(() => { if (activo) setCargando(false) })

    return () => { activo = false }
  }, [])

  function cambiarCantidad(producto, valor) {
    const cantidad = Math.max(0, Math.min(Number(valor) || 0, producto.stock))
    setCantidades((actual) => ({ ...actual, [producto.id]: cantidad }))
  }

  const seleccionados = productos
    .map((producto) => ({ producto, cantidad: cantidades[producto.id] ?? 0 }))
    .filter(({ cantidad }) => cantidad > 0)

  const total = seleccionados.reduce(
    (suma, { producto, cantidad }) => suma + Number(producto.precio) * cantidad,
    0,
  )

  async function confirmar(evento) {
    evento.preventDefault()

    if (seleccionados.length === 0) {
      setError('Agrega al menos un producto con cantidad mayor a 0')
      return
    }

    if (!window.confirm(`¿Confirmar compra por ${formatearPrecio(total)}?`)) {
      return
    }

    setEnviando(true)
    setError('')

    try {
      const items = seleccionados.map(({ producto, cantidad }) => ({
        productoId: producto.id,
        cantidad,
      }))
      const { data } = await BoletaService.crear(items, observacion.trim())
      navegar(`/boletas/${data.id}`, { state: { creada: true } })
    } catch (excepcion) {
      setError(excepcion.response?.data?.error ?? 'No se pudo registrar la compra')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
        <div>
          <h1 className="h3 mb-1">Tienda</h1>
          <p className="text-body-secondary mb-0">
            Elige productos y cantidades. El backend valida el stock y calcula el total.
          </p>
        </div>
        <Link className="btn btn-outline-secondary" to="/boletas">
          {rol === 'CLIENTE' ? 'Mis boletas' : 'Ver boletas'}
        </Link>
      </div>

      {error && <div className="alert alert-danger py-2" role="alert">{error}</div>}

      <div className="info-card p-0 overflow-hidden mb-3">
        {cargando ? (
          <div className="p-4 text-body-secondary">Cargando productos…</div>
        ) : productos.length === 0 ? (
          <div className="p-4 text-body-secondary">No hay productos disponibles.</div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Categoría</th>
                  <th className="text-end">Precio</th>
                  <th className="text-end">Stock</th>
                  <th className="text-center">Cantidad</th>
                  <th className="text-end">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {productos.map((producto) => {
                  const cantidad = cantidades[producto.id] ?? 0
                  const sinStock = producto.stock === 0

                  return (
                    <tr key={producto.id}>
                      <td>
                        <div className="fw-semibold">{producto.nombre}</div>
                        <div className="small text-body-secondary">{producto.codigo}</div>
                      </td>
                      <td>{producto.categoria}</td>
                      <td className="text-end">{formatearPrecio(producto.precio)}</td>
                      <td className="text-end">{producto.stock}</td>
                      <td className="text-center">
                        <input
                          type="number"
                          className="form-control form-control-sm mx-auto cantidad-input"
                          min="0"
                          max={producto.stock}
                          value={cantidad}
                          disabled={sinStock}
                          onChange={(evento) => cambiarCantidad(producto, evento.target.value)}
                        />
                      </td>
                      <td className="text-end">
                        {sinStock ? 'Sin stock' : formatearPrecio(Number(producto.precio) * cantidad)}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <form className="info-card" onSubmit={confirmar}>
        <div className="row g-3 align-items-end">
          <div className="col-md-5">
            <label className="form-label" htmlFor="observacion">Observación (opcional)</label>
            <input
              id="observacion"
              className="form-control"
              maxLength={300}
              placeholder="Ej.: retiro en tienda"
              value={observacion}
              onChange={(evento) => setObservacion(evento.target.value)}
            />
          </div>
          <div className="col-md-3">
            <div className="small text-body-secondary">Productos seleccionados</div>
            <div className="fs-5 fw-semibold">{seleccionados.length}</div>
          </div>
          <div className="col-md-2">
            <div className="small text-body-secondary">Total</div>
            <div className="fs-5 fw-semibold">{formatearPrecio(total)}</div>
          </div>
          <div className="col-md-2 d-grid">
            <button className="btn btn-brand" type="submit" disabled={enviando || cargando}>
              {enviando ? 'Registrando…' : 'Confirmar compra'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
