import { Outlet, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import { RutaConRol, RutaProtegida } from './auth/ProtectedRoute.jsx'
import Inicio from './pages/Inicio.jsx'
import Login from './pages/Login.jsx'
import Productos from './pages/Productos.jsx'
import Categorias from './pages/Categorias.jsx'
import Tienda from './pages/Tienda.jsx'
import Boletas from './pages/Boletas.jsx'
import BoletaDetalle from './pages/BoletaDetalle.jsx'
import AdminUsuarios from './pages/AdminUsuarios.jsx'
import NoAutorizado from './pages/NoAutorizado.jsx'
import NoEncontrado from './pages/NoEncontrado.jsx'

function Layout() {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="container py-4">
        <Outlet />
      </main>
      <footer className="app-footer">
        <div className="container d-flex flex-wrap justify-content-between gap-2">
          <span>DSY1104 · Desarrollo Full Stack II</span>
          <span>EP3 — Integración REST con JWT y roles</span>
        </div>
      </footer>
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Inicio />} />
        <Route path="login" element={<Login />} />

        <Route element={<RutaProtegida />}>
          <Route element={<RutaConRol roles={['ADMIN', 'VENDEDOR']} />}>
            <Route path="productos" element={<Productos />} />
          </Route>

          <Route element={<RutaConRol roles={['ADMIN', 'CLIENTE']} />}>
            <Route path="tienda" element={<Tienda />} />
          </Route>

          <Route path="boletas" element={<Boletas />} />
          <Route path="boletas/:id" element={<BoletaDetalle />} />

          <Route element={<RutaConRol roles={['ADMIN']} />}>
            <Route path="categorias" element={<Categorias />} />
            <Route path="usuarios" element={<AdminUsuarios />} />
          </Route>
        </Route>

        <Route path="no-autorizado" element={<NoAutorizado />} />
        <Route path="*" element={<NoEncontrado />} />
      </Route>
    </Routes>
  )
}
