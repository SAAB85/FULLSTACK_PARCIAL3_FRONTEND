import { Link } from 'react-router-dom'

export default function NoEncontrado() {
  return (
    <div className="row justify-content-center py-5">
      <div className="col-md-7">
        <div className="info-card text-center">
          <div className="display-5 mb-2">404</div>
          <h1 className="h4">Página no encontrada</h1>
          <p className="text-body-secondary mb-4">La ruta solicitada no existe en esta aplicación.</p>
          <Link className="btn btn-brand" to="/">Volver al inicio</Link>
        </div>
      </div>
    </div>
  )
}
