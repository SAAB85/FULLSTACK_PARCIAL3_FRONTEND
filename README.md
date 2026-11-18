# Parcial 3 — Frontend (Full Stack II)

Aplicación **React** de la **Evaluación Parcial 3** de DSY1104 *Desarrollo Full Stack II* (Duoc UC).
Consume la API REST del backend, conserva la sesión con JWT y restringe las vistas según el rol.

> Backend del proyecto: [SAAB85/FULLSTACK_PARCIAL3_BACKEND](https://github.com/SAAB85/FULLSTACK_PARCIAL3_BACKEND)

## Stack

| Capa | Tecnología |
| --- | --- |
| Framework | React 19 |
| Build | Vite |
| Rutas | React Router 7 |
| HTTP | Axios (interceptor de token) |
| Estilos | Bootstrap 5 |

## Cómo ejecutar

```bash
cp .env.example .env
npm install
npm run dev
```

- Aplicación: <http://localhost:5173>

El backend debe estar corriendo en <http://localhost:8080>. Si la API está en otra URL,
cambia `VITE_API_URL` en `.env`.

## Usuarios de prueba

| Rol | Usuario | Contraseña | Acceso |
| --- | --- | --- | --- |
| ADMIN | `admin` | `admin123` | Productos y usuarios |
| VENDEDOR | `vendedor` | `vendedor123` | Productos (sin eliminar) |
| CLIENTE | `cliente` | `cliente123` | Solo consulta productos |

## Rutas

| Ruta | Acceso | Vista |
| --- | --- | --- |
| `/login` | Pública | Inicio de sesión |
| `/` | Autenticado | Inicio |
| `/productos` | Autenticado | CRUD de productos |
| `/usuarios` | Solo ADMIN | Listado de usuarios |
| `/no-autorizado` | — | Aviso de permisos insuficientes |

## Cómo funciona la sesión

1. El login llama a `POST /api/auth/login`.
2. La respuesta (token + datos del usuario) se guarda en `localStorage` con la clave `ep3.sesion`.
3. Un interceptor de Axios adjunta `Authorization: Bearer <token>` en cada petición.
4. `RutaProtegida` y `RutaConRol` bloquean el acceso según la sesión y el rol.
5. Si la API responde `401`, se borra la sesión y se redirige al login.

## Estructura

```
src/
├── api/          Cliente Axios con interceptor de token
├── auth/         Contexto de sesión y rutas protegidas
├── components/   Navbar
└── pages/        Inicio, Login, Productos, Usuarios
```
