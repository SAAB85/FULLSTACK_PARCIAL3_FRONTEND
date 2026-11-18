import { createContext, useContext, useEffect, useState } from 'react'
import api from '../api/client.js'
import { borrarSesion, guardarSesion, leerSesion } from './sesion.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [sesion, setSesion] = useState(() => leerSesion())
  const [cargando, setCargando] = useState(false)

  useEffect(() => {
    function cerrarPorExpiracion() {
      setSesion(null)
    }
    window.addEventListener('ep3:sesion-expirada', cerrarPorExpiracion)
    return () => window.removeEventListener('ep3:sesion-expirada', cerrarPorExpiracion)
  }, [])

  async function iniciarSesion(username, password) {
    setCargando(true)
    try {
      const { data } = await api.post('/auth/login', { username, password })
      guardarSesion(data)
      setSesion(data)
      return data
    } finally {
      setCargando(false)
    }
  }

  function cerrarSesion() {
    borrarSesion()
    setSesion(null)
  }

  const valor = {
    sesion,
    cargando,
    iniciarSesion,
    cerrarSesion,
    autenticado: Boolean(sesion?.token),
    rol: sesion?.rol ?? null,
  }

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const contexto = useContext(AuthContext)
  if (!contexto) {
    throw new Error('useAuth debe usarse dentro de AuthProvider')
  }
  return contexto
}
