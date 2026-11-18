const CLAVE = 'ep3.sesion'

export function leerSesion() {
  try {
    const valor = window.localStorage.getItem(CLAVE)
    return valor ? JSON.parse(valor) : null
  } catch {
    return null
  }
}

export function guardarSesion(sesion) {
  window.localStorage.setItem(CLAVE, JSON.stringify(sesion))
}

export function borrarSesion() {
  window.localStorage.removeItem(CLAVE)
}
