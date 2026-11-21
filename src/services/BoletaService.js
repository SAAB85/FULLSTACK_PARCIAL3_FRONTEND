import api from '../api/client.js'

class BoletaService {
  listar() {
    return api.get('/boletas')
  }

  obtener(id) {
    return api.get(`/boletas/${id}`)
  }

  crear(items, observacion) {
    return api.post('/boletas', { items, observacion })
  }

  cambiarEstado(id, estado) {
    return api.patch(`/boletas/${id}/estado`, { estado })
  }
}

export default new BoletaService()
