import api from '../api/client.js'

class CategoriaService {
  listar() {
    return api.get('/categorias')
  }

  crear(datos) {
    return api.post('/categorias', datos)
  }

  actualizar(id, datos) {
    return api.put(`/categorias/${id}`, datos)
  }

  eliminar(id) {
    return api.delete(`/categorias/${id}`)
  }
}

export default new CategoriaService()
