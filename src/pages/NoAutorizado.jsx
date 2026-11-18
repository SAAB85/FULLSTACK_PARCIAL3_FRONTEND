import { Link } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext.jsx'

export default function NoAutorizado() {
  const { rol } = useAuth()

  return (
    <div className="row justify-content-center py-5">
      <div className="col-md-7">
        <div className="info-card text-center">
          <div className="display-5 mb-2">403</div>
          <h1 className="h4">No autorizado</h1>
          <p className="text-body-secondary mb-4">
            Tu rol actual {rol ? <code>{rol}</code> : 'no definido'} no tiene permiso para esta sección.
          </p>
          <Link className="btn btn-brand" to="/productos">Volver a productos</Link>
        </div>
      </div>
    </div>
  )
}
