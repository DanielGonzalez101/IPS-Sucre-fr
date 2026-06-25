# Contexto del proyecto

## ¿Qué es?
Portal web del **Cardiocentro Pediátrico de Sucre**, una IPS (Institución Prestadora de Salud) especializada en cardiología pediátrica ubicada en Sucre, Colombia.

## Estructura de la aplicación

```
src/
├── app/
│   ├── (public)/          # Rutas públicas — no requieren autenticación
│   │   ├── page.tsx               # Inicio
│   │   ├── quienes-somos/
│   │   ├── equipo/
│   │   ├── servicios/
│   │   ├── contacto/
│   │   ├── pqrs/
│   │   ├── normativa/
│   │   └── politicas/             # derechos-de-autor, terminos, privacidad
│   ├── (admin)/           # Panel admin — requieren sesión
│   │   └── admin/
│   │       ├── login/
│   │       ├── dashboard/
│   │       ├── equipo/
│   │       ├── servicios/
│   │       ├── pqrs/
│   │       ├── normativa/
│   │       ├── paginas/
│   │       └── usuarios/
│   └── api/
│       ├── pqrs/route.ts
│       └── webhooks/supabase/route.ts
├── actions/               # Server Actions (siempre "use server")
├── components/
│   ├── admin/             # Componentes exclusivos del panel admin
│   ├── public/            # Componentes del sitio público
│   └── ui/                # Componentes genéricos reutilizables
├── lib/
│   ├── supabase/          # Clientes Supabase: client.ts, server.ts, admin.ts
│   └── validations/       # Esquemas Zod por entidad
├── types/
│   └── index.ts           # Tipos de dominio: Profile, Pqrs, Servicio, MiembroEquipo, Normativa, Pagina
└── proxy.ts               # Middleware (renombrado en Next.js 16)
```

## Entidades del dominio
| Entidad | Tabla Supabase | Descripción |
|---|---|---|
| `Profile` | `profiles` | Usuarios administrativos con rol |
| `Pqrs` | `pqrs` | Peticiones, Quejas, Reclamos y Sugerencias ciudadanas |
| `Servicio` | `servicios` | Servicios médicos ofrecidos por la IPS |
| `MiembroEquipo` | `equipo` | Médicos y personal del cardiocentro |
| `Normativa` | `normativa` | Documentos normativos y regulatorios |
| `Pagina` | `paginas` | Páginas con contenido editable (CMS básico) |

## Variables de entorno requeridas
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=   # solo para el cliente admin (lib/supabase/admin.ts)
```
