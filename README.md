# Parcial 3 — Frontend (Full Stack II)

Aplicación **React** de la **Evaluación Parcial 3** de DSY1104 *Desarrollo Full Stack II* (Duoc UC).
Consume la API REST versionada del backend, conserva la sesión con JWT y restringe las vistas según el rol.

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
cambia `VITE_API_URL` en `.env`. La URL debe incluir la versión, por ejemplo
`http://localhost:8080/api/v1`.

## Usuarios de prueba

| Rol | Usuario | Contraseña | Acceso |
| --- | --- | --- | --- |
| ADMIN | `admin` | `admin123` | Tienda, catálogo, boletas y usuarios |
| VENDEDOR | `vendedor` | `vendedor123` | Consulta productos y boletas |
| CLIENTE | `cliente` | `cliente123` | Tienda: compra y ve sus boletas |

## Rutas

| Ruta | Acceso | Vista |
| --- | --- | --- |
| `/login` | Pública | Inicio de sesión |
| `/` | Autenticado | Inicio |
| `/tienda` | ADMIN y CLIENTE | Compra de productos |
| `/productos` | ADMIN y VENDEDOR | Catálogo; solo ADMIN puede crear, editar o eliminar |
| `/boletas` | Autenticado | CLIENTE ve las propias; ADMIN y VENDEDOR ven todas |
| `/boletas/:id` | Autenticado | Detalle; ADMIN puede pagar o anular |
| `/categorias` | Solo ADMIN | Crear, editar y eliminar categorías |
| `/usuarios` | Solo ADMIN | Listado de usuarios |
| `/no-autorizado` | — | Aviso de permisos insuficientes |

## Flujo de compra

1. El CLIENTE entra a `/tienda`, elige cantidades y confirma la compra.
2. El frontend envía `POST /api/v1/boletas` con los productos y cantidades.
3. El backend valida el stock, descuenta y calcula el total.
4. El detalle muestra la boleta creada y el CLIENTE puede revisarla en `/boletas`.
5. El ADMIN puede marcar la boleta como pagada o anularla; al anular se repone el stock.

## Cómo funciona la sesión

1. El login llama a `POST /api/v1/auth/login`.
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
├── services/     Llamadas a la API de boletas
└── pages/        Inicio, Login, Tienda, Productos, Boletas, Detalle y Usuarios
```
