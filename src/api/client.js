import axios from 'axios'
import { borrarSesion, leerSesion } from '../auth/sesion.js'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:8080/api/v1',
  timeout: 10000,
})

api.interceptors.request.use((configuracion) => {
  const sesion = leerSesion()
  if (sesion?.token) {
    configuracion.headers.Authorization = `Bearer ${sesion.token}`
  }
  return configuracion
})

api.interceptors.response.use(
  (respuesta) => respuesta,
  (error) => {
    if (error.response?.status === 401) {
      borrarSesion()
      window.dispatchEvent(new Event('ep3:sesion-expirada'))
    }
    return Promise.reject(error)
  },
)

export default api
