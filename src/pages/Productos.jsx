import { useCallback, useEffect, useState } from 'react'
import api from '../api/client.js'
import { useAuth } from '../auth/AuthContext.jsx'

const FORMULARIO_VACIO = {
  codigo: '',
  nombre: '',
  descripcion: '',
  categoria: '',
  precio: '',
  stock: '',
}

export default function Productos() {
  const { rol } = useAuth()
  const puedeEditar = rol === 'ADMIN' || rol === 'VENDEDOR'
  const [productos, setProductos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [formulario, setFormulario] = useState(null)
  const [guardando, setGuardando] = useState(false)

  const cargar = useCallback(async () => {
    setCargando(true)
    setError('')
    try {
      const { data } = await api.get('/productos')
      setProductos(data)
    } catch (excepcion) {
      setError(excepcion.response?.data?.error ?? 'No se pudo cargar el catálogo')
    } finally {
      setCargando(false)
    }
  }, [])

  useEffect(() => {
    cargar()
  }, [cargar])

  function abrirNuevo() {
    setFormulario({ ...FORMULARIO_VACIO })
  }

  function abrirEdicion(producto) {
    setFormulario({
      id: producto.id,
      codigo: producto.codigo,
      nombre: producto.nombre,
      descripcion: producto.descripcion ?? '',
      categoria: producto.categoria,
      precio: String(producto.precio),
      stock: String(producto.stock),
    })
  }

  function cambiar(campo, valor) {
    setFormulario((actual) => ({ ...actual, [campo]: valor }))
  }

  async function guardar(evento) {
    evento.preventDefault()
    setGuardando(true)
    setError('')
    const cuerpo = {
      codigo: formulario.codigo.trim(),
      nombre: formulario.nombre.trim(),
      descripcion: formulario.descripcion.trim(),
      categoria: formulario.categoria.trim(),
      precio: Number(formulario.precio),
      stock: Number(formulario.stock),
    }
    try {
      if (formulario.id) {
        await api.put(`/productos/${formulario.id}`, cuerpo)
      } else {
        await api.post('/productos', cuerpo)
      }
      setFormulario(null)
      await cargar()
    } catch (excepcion) {
      setError(excepcion.response?.data?.error ?? 'No se pudo guardar el producto')
    } finally {
      setGuardando(false)
    }
  }

  async function eliminar(producto) {
    if (!window.confirm(`¿Eliminar ${producto.nombre}?`)) return
    setError('')
    try {
      await api.delete(`/productos/${producto.id}`)
      await cargar()
    } catch (excepcion) {
      setError(excepcion.response?.data?.error ?? 'No se pudo eliminar el producto')
    }
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
        <div>
          <h1 className="h3 mb-1">Productos</h1>
          <p className="text-body-secondary mb-0">Catálogo protegido por token; las acciones dependen del rol.</p>
        </div>
        {puedeEditar && (
          <button className="btn btn-brand" type="button" onClick={abrirNuevo}>
            Nuevo producto
          </button>
        )}
      </div>

      {error && <div className="alert alert-danger py-2" role="alert">{error}</div>}

      {formulario && (
        <form className="info-card mb-3" onSubmit={guardar}>
          <h2 className="h6 mb-3">{formulario.id ? 'Editar producto' : 'Nuevo producto'}</h2>
          <div className="row g-2">
            <div className="col-md-3">
              <input className="form-control" placeholder="Código" value={formulario.codigo}
                onChange={(e) => cambiar('codigo', e.target.value)} required maxLength={30} />
            </div>
            <div className="col-md-5">
              <input className="form-control" placeholder="Nombre" value={formulario.nombre}
                onChange={(e) => cambiar('nombre', e.target.value)} required maxLength={120} />
            </div>
            <div className="col-md-4">
              <input className="form-control" placeholder="Categoría" value={formulario.categoria}
                onChange={(e) => cambiar('categoria', e.target.value)} required maxLength={60} />
            </div>
            <div className="col-md-3">
              <input className="form-control" placeholder="Precio" type="number" min="0" step="1"
                value={formulario.precio} onChange={(e) => cambiar('precio', e.target.value)} required />
            </div>
            <div className="col-md-3">
              <input className="form-control" placeholder="Stock" type="number" min="0" step="1"
                value={formulario.stock} onChange={(e) => cambiar('stock', e.target.value)} required />
            </div>
            <div className="col-md-6">
              <input className="form-control" placeholder="Descripción (opcional)" value={formulario.descripcion}
                onChange={(e) => cambiar('descripcion', e.target.value)} maxLength={500} />
            </div>
          </div>
          <div className="d-flex gap-2 mt-3">
            <button className="btn btn-brand btn-sm" type="submit" disabled={guardando}>
              {guardando ? 'Guardando…' : 'Guardar'}
            </button>
            <button className="btn btn-outline-secondary btn-sm" type="button" onClick={() => setFormulario(null)}>
              Cancelar
            </button>
          </div>
        </form>
      )}

      <div className="info-card p-0 overflow-hidden">
        {cargando ? (
          <div className="p-4 text-body-secondary">Cargando productos…</div>
        ) : productos.length === 0 ? (
          <div className="p-4 text-body-secondary">No hay productos registrados.</div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Nombre</th>
                  <th>Categoría</th>
                  <th className="text-end">Precio</th>
                  <th className="text-end">Stock</th>
                  {puedeEditar && <th className="text-end">Acciones</th>}
                </tr>
              </thead>
              <tbody>
                {productos.map((producto) => (
                  <tr key={producto.id}>
                    <td><code>{producto.codigo}</code></td>
                    <td>
                      <div className="fw-semibold">{producto.nombre}</div>
                      {producto.descripcion && (
                        <div className="small text-body-secondary">{producto.descripcion}</div>
                      )}
                    </td>
                    <td>{producto.categoria}</td>
                    <td className="text-end">${Number(producto.precio).toLocaleString('es-CL')}</td>
                    <td className="text-end">{producto.stock}</td>
                    {puedeEditar && (
                      <td className="text-end text-nowrap">
                        <button className="btn btn-outline-secondary btn-sm me-1" type="button"
                          onClick={() => abrirEdicion(producto)}>
                          Editar
                        </button>
                        {rol === 'ADMIN' && (
                          <button className="btn btn-outline-danger btn-sm" type="button"
                            onClick={() => eliminar(producto)}>
                            Eliminar
                          </button>
                        )}
                      </td>
                    )}
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
