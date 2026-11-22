import { useEffect, useState } from 'react'
import CategoriaService from '../services/CategoriaService.js'

const FORMULARIO_VACIO = { id: null, nombre: '', descripcion: '' }

export default function Categorias() {
  const [categorias, setCategorias] = useState([])
  const [formulario, setFormulario] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [ocupado, setOcupado] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let activo = true

    CategoriaService.listar()
      .then(({ data }) => { if (activo) setCategorias(data) })
      .catch((excepcion) => {
        if (activo) setError(excepcion.response?.data?.error ?? 'No se pudieron cargar las categorías')
      })
      .finally(() => { if (activo) setCargando(false) })

    return () => { activo = false }
  }, [])

  function abrirFormulario(categoria) {
    setError('')
    setFormulario({ ...categoria, descripcion: categoria.descripcion ?? '' })
  }

  async function guardar(evento) {
    evento.preventDefault()
    const { id, nombre, descripcion } = formulario
    const datos = { nombre: nombre.trim(), descripcion: descripcion.trim() }

    if (!datos.nombre) {
      setError('El nombre es obligatorio')
      return
    }

    setError('')
    setOcupado(true)
    try {
      if (id === null) {
        const { data } = await CategoriaService.crear(datos)
        setCategorias((actuales) => [...actuales, data])
      } else {
        const { data } = await CategoriaService.actualizar(id, datos)
        setCategorias((actuales) => actuales.map((categoria) => categoria.id === id ? data : categoria))
      }
      setFormulario(null)
    } catch (excepcion) {
      setError(excepcion.response?.data?.error ?? 'No se pudo guardar la categoría')
    } finally {
      setOcupado(false)
    }
  }

  async function eliminar(categoria) {
    if (!window.confirm(`¿Eliminar la categoría "${categoria.nombre}"?`)) return

    setError('')
    setOcupado(true)
    try {
      await CategoriaService.eliminar(categoria.id)
      setCategorias((actuales) => actuales.filter(({ id }) => id !== categoria.id))
      if (formulario?.id === categoria.id) setFormulario(null)
    } catch (excepcion) {
      setError(excepcion.response?.data?.error ?? 'No se pudo eliminar la categoría')
    } finally {
      setOcupado(false)
    }
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
        <h1 className="h3 mb-0">Categorías</h1>
        <button className="btn btn-brand" type="button" disabled={cargando || ocupado}
          onClick={() => abrirFormulario(FORMULARIO_VACIO)}>
          Nueva categoría
        </button>
      </div>

      {error && <div className="alert alert-danger" role="alert">{error}</div>}

      {formulario && (
        <form className="info-card p-3 mb-3" onSubmit={guardar}>
          <h2 className="h5">{formulario.id === null ? 'Nueva categoría' : 'Editar categoría'}</h2>
          <fieldset disabled={ocupado}>
            <div className="mb-3">
              <label className="form-label" htmlFor="categoria-nombre">Nombre</label>
              <input className="form-control" id="categoria-nombre" required maxLength={60}
                value={formulario.nombre}
                onChange={(evento) => setFormulario({ ...formulario, nombre: evento.target.value })} />
            </div>
            <div className="mb-3">
              <label className="form-label" htmlFor="categoria-descripcion">Descripción</label>
              <textarea className="form-control" id="categoria-descripcion" maxLength={300} rows={3}
                value={formulario.descripcion}
                onChange={(evento) => setFormulario({ ...formulario, descripcion: evento.target.value })} />
            </div>
            <div className="d-flex gap-2">
              <button className="btn btn-brand" type="submit">Guardar</button>
              <button className="btn btn-outline-secondary" type="button" onClick={() => setFormulario(null)}>
                Cancelar
              </button>
            </div>
          </fieldset>
        </form>
      )}

      <div className="info-card p-0 overflow-hidden">
        {cargando ? (
          <div className="p-4 text-body-secondary">Cargando categorías…</div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead>
                <tr><th>Nombre</th><th>Descripción</th><th className="text-end">Acciones</th></tr>
              </thead>
              <tbody>
                {categorias.length === 0 && !error && (
                  <tr><td colSpan={3} className="p-4 text-body-secondary">No hay categorías registradas.</td></tr>
                )}
                {categorias.map((categoria) => (
                  <tr key={categoria.id}>
                    <td>{categoria.nombre}</td>
                    <td>{categoria.descripcion || '—'}</td>
                    <td className="text-end">
                      <div className="d-inline-flex gap-2">
                        <button className="btn btn-outline-secondary btn-sm" type="button" disabled={ocupado}
                          onClick={() => abrirFormulario(categoria)}>Editar</button>
                        <button className="btn btn-outline-danger btn-sm" type="button" disabled={ocupado}
                          onClick={() => eliminar(categoria)}>Eliminar</button>
                      </div>
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
