# Arquitectura del Proyecto — Cardiocentro Pediátrico de Sucre

Documento de referencia técnica para entender cómo está organizado el proyecto, qué hace cada carpeta, y cómo fluyen los datos entre las capas.

---

## Índice

1. [Visión general](#1-visión-general)
2. [Stack tecnológico](#2-stack-tecnológico)
3. [Árbol completo de archivos](#3-árbol-completo-de-archivos)
4. [Capa de rutas — `src/app/`](#4-capa-de-rutas--srcapp)
5. [Capa de lógica — `src/actions/`](#5-capa-de-lógica--srcactions)
6. [Capa de datos — `src/lib/supabase/`](#6-capa-de-datos--srclibsupabase)
7. [Validaciones — `src/lib/validations/`](#7-validaciones--srclibvalidations)
8. [Componentes — `src/components/`](#8-componentes--srccomponents)
9. [Tipos — `src/types/`](#9-tipos--srctypes)
10. [Proxy (Middleware) — `src/proxy.ts`](#10-proxy-middleware--srcproxyts)
11. [Base de datos — `supabase/`](#11-base-de-datos--supabase)
12. [CI/CD — `.github/workflows/`](#12-cicd--githubworkflows)
13. [Variables de entorno](#13-variables-de-entorno)
14. [Flujo de datos completo](#14-flujo-de-datos-completo)
15. [Reglas de importación](#15-reglas-de-importación)

---

## 1. Visión general

```
Navegador
    │
    ▼
Nginx (puerto 80/443)          ← VPS Hostinger
    │
    ▼
PM2 → next start (puerto 3000)
    │
    ├── src/proxy.ts           ← intercepta TODAS las peticiones
    │
    ├── src/app/(public)/      ← sitio institucional público
    │
    ├── src/app/(admin)/       ← panel de gestión (requiere sesión)
    │
    └── src/app/api/           ← endpoints REST (PQRS pública, webhooks)
            │
            ▼
       Supabase (cloud)
       ├── Postgres + RLS
       ├── Auth
       ├── Storage
       └── Edge Functions (Deno)
```

El proyecto **no tiene servidor separado** (ni Express, ni NestJS). Todo el backend vive dentro de Next.js usando:

- **Server Actions** para mutaciones del panel admin.
- **Route Handlers** (`src/app/api/`) para endpoints que llaman terceros (formulario PQRS público, webhooks de Supabase).

---

## 2. Stack tecnológico

| Capa | Tecnología | Versión |
|------|-----------|---------|
| Framework | Next.js (App Router) | 16.x |
| Lenguaje | TypeScript | 5.x |
| Estilos | Tailwind CSS | 4.x |
| Runtime del servidor | React 19 + Node.js 20 | — |
| Base de datos | Supabase Postgres | — |
| Autenticación | Supabase Auth | — |
| Almacenamiento | Supabase Storage | — |
| Edge Functions | Supabase (Deno) | — |
| Cliente Supabase | `@supabase/ssr` + `@supabase/supabase-js` | ^0.12 / ^2.x |
| Validación | Zod | 4.x |
| Servidor producción | PM2 + Nginx | — |
| CI/CD | GitHub Actions | — |
| Hosting | VPS Hostinger (Ubuntu) | — |

---

## 3. Árbol completo de archivos

```
cardiocentro-web/
│
├── .env.local.example          ← plantilla de variables para desarrollo
├── .env.production.example     ← plantilla de variables para producción
├── .gitignore                  ← excluye .env*, node_modules, .next
├── .github/
│   └── workflows/
│       └── deploy.yml          ← pipeline CI/CD (build + rsync + PM2)
│
├── next.config.ts              ← configuración de Next.js
├── tsconfig.json               ← TypeScript (excluye supabase/functions)
├── eslint.config.mjs
├── postcss.config.mjs
├── package.json
│
├── public/                     ← assets estáticos servidos en /
│
├── supabase/                   ← todo lo gestionado por el Supabase CLI
│   ├── config.toml             ← configuración del entorno local
│   ├── migrations/
│   │   └── 0001_init_profiles.sql
│   └── functions/
│       └── send-pqrs-notification/
│           └── index.ts        ← Edge Function en Deno
│
└── src/
    ├── proxy.ts                ← guard de autenticación (Next.js 16)
    ├── types/
    │   └── index.ts            ← interfaces de dominio
    ├── lib/
    │   ├── supabase/
    │   │   ├── client.ts       ← cliente browser (anon key)
    │   │   ├── server.ts       ← cliente server-side (cookies)
    │   │   └── admin.ts        ← cliente con service_role ⚠️ solo server
    │   └── validations/
    │       ├── pqrs.ts
    │       ├── pagina.ts
    │       └── usuario.ts
    ├── actions/                ← Server Actions ("use server")
    │   ├── auth.ts
    │   ├── pqrs.ts
    │   ├── paginas.ts
    │   ├── servicios.ts
    │   ├── equipo.ts
    │   └── normativa.ts
    ├── components/
    │   ├── ui/
    │   │   └── Button.tsx
    │   ├── public/
    │   │   ├── Header.tsx
    │   │   ├── Footer.tsx
    │   │   └── ServicioCard.tsx
    │   └── admin/
    │       ├── Sidebar.tsx
    │       ├── DataTable.tsx
    │       └── RichTextEditor.tsx
    └── app/
        ├── globals.css
        ├── layout.tsx          ← Root Layout (HTML, fuentes, metadata global)
        ├── (public)/           ← route group: layout con Header + Footer
        │   ├── layout.tsx
        │   ├── page.tsx                              → /
        │   ├── quienes-somos/page.tsx                → /quienes-somos
        │   ├── servicios/page.tsx                    → /servicios
        │   ├── equipo/page.tsx                       → /equipo
        │   ├── normativa/page.tsx                    → /normativa
        │   ├── contacto/page.tsx                     → /contacto
        │   ├── pqrs/page.tsx                         → /pqrs
        │   └── politicas/
        │       ├── terminos-y-condiciones/page.tsx   → /politicas/terminos-y-condiciones
        │       ├── privacidad/page.tsx               → /politicas/privacidad
        │       └── derechos-de-autor/page.tsx        → /politicas/derechos-de-autor
        ├── (admin)/            ← route group: layout con Sidebar
        │   ├── layout.tsx
        │   └── admin/          ← segmento real que genera el prefijo /admin
        │       ├── login/page.tsx                    → /admin/login
        │       ├── dashboard/page.tsx                → /admin/dashboard
        │       ├── paginas/
        │       │   ├── page.tsx                      → /admin/paginas
        │       │   └── [id]/page.tsx                 → /admin/paginas/:id
        │       ├── servicios/page.tsx                → /admin/servicios
        │       ├── equipo/page.tsx                   → /admin/equipo
        │       ├── normativa/page.tsx                → /admin/normativa
        │       ├── pqrs/
        │       │   ├── page.tsx                      → /admin/pqrs
        │       │   └── [id]/page.tsx                 → /admin/pqrs/:id
        │       └── usuarios/page.tsx                 → /admin/usuarios
        └── api/
            ├── pqrs/route.ts                         → POST /api/pqrs
            └── webhooks/supabase/route.ts            → POST /api/webhooks/supabase
```

---

## 4. Capa de rutas — `src/app/`

### 4.1 Root Layout (`app/layout.tsx`)

Envuelve **todo** el árbol de páginas. Define el `<html lang="es">`, carga las fuentes Geist via `next/font` y aplica el CSS global de Tailwind. No tiene lógica de negocio.

### 4.2 Route Groups

Los **route groups** se escriben entre paréntesis `(nombre)` — el nombre **no aparece** en la URL, solo sirve para organizar código y compartir un layout parcial.

```
src/app/
  (public)/   ← agrupa páginas con Header + Footer
  (admin)/    ← agrupa páginas con Sidebar
```

> **Por qué existe la carpeta `admin/` dentro de `(admin)/`**
>
> Los route groups no aportan segmento de URL. Sin el subdirectorio `admin/`, las rutas `/equipo`, `/servicios`, etc. colisionarían entre el grupo público y el admin. La solución es poner un segmento real `admin/` dentro del grupo: `(admin)/admin/equipo/page.tsx` → URL `/admin/equipo`.

### 4.3 Layout del sitio público — `(public)/layout.tsx`

```tsx
<Header />
<main>{children}</main>
<Footer />
```

Todas las páginas bajo `(public)/` heredan este wrapping automáticamente.

### 4.4 Layout del panel admin — `(admin)/layout.tsx`

```tsx
<div className="flex min-h-screen">
  <Sidebar />
  <main>{children}</main>
</div>
```

Todas las páginas bajo `(admin)/admin/` heredan este layout. El `proxy.ts` garantiza que nadie llegue a estas páginas sin sesión activa.

### 4.5 Páginas dinámicas (`[id]`)

```
/admin/paginas/[id]   → edición de una página concreta
/admin/pqrs/[id]      → detalle de una PQRS concreta
```

El parámetro `id` se recibe via `params.id` en el componente de página.

### 4.6 Route Handlers (`app/api/`)

Son endpoints HTTP clásicos (no Server Actions). Se usan cuando:
- Un formulario público necesita un endpoint REST (`POST /api/pqrs`).
- Un sistema externo necesita llamar al proyecto (webhooks de Supabase).

```
src/app/api/
  pqrs/route.ts                ← acepta POST sin autenticación
  webhooks/supabase/route.ts   ← acepta POST, valida firma HMAC
```

---

## 5. Capa de lógica — `src/actions/`

Los **Server Actions** son funciones de TypeScript que se ejecutan **exclusivamente en el servidor**, pero pueden ser llamadas directamente desde componentes de React (incluso Client Components). Se declaran con la directiva `"use server"` al tope del archivo.

```
src/actions/
  auth.ts      → signIn(), signOut(), getSession()
  pqrs.ts      → createPqrs(), getPqrsList()
  paginas.ts   → createPagina(), getPaginas()
  servicios.ts → createServicio(), getServicios()
  equipo.ts    → createMiembroEquipo(), getMiembrosEquipo()
  normativa.ts → createNormativa(), getNormativas()
```

### Patrón interno de cada action

```
1. Recibe datos del componente
2. Valida con Zod (safeParse)
3. Si error → retorna { error: fieldErrors }
4. Crea cliente Supabase server-side
5. Ejecuta query en Postgres
6. Retorna { success: true } o { error }
7. redirect() si corresponde (auth)
```

### Ejemplo — `actions/pqrs.ts`

```ts
"use server";
export async function createPqrs(data: PqrsInput) {
  const parsed = pqrsSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors };
  const supabase = await createClient();          // cliente server.ts
  const { error } = await supabase.from("pqrs").insert(parsed.data);
  if (error) return { error: { _server: [error.message] } };
  return { success: true };
}
```

---

## 6. Capa de datos — `src/lib/supabase/`

Hay **tres clientes** de Supabase. Cada uno existe por una razón concreta:

### `client.ts` — cliente browser

```ts
import { createBrowserClient } from "@supabase/ssr";
export function createClient() { ... }
```

- Se usa en **Client Components** (`"use client"`).
- Usa la `NEXT_PUBLIC_SUPABASE_ANON_KEY` (segura para exponer).
- Limitado por las políticas RLS de Supabase.
- Ejemplo de uso: suscripciones en tiempo real, uploads desde el navegador.

### `server.ts` — cliente server-side

```ts
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
export async function createClient() { ... }
```

- Se usa en **Server Components**, **Server Actions** y **Route Handlers**.
- Lee y escribe las cookies de sesión de Supabase Auth.
- Usa la misma `ANON_KEY` pero con el contexto del usuario autenticado.
- Es **`async`** porque `cookies()` de Next.js 15+ es asíncrono.

### `admin.ts` — cliente con service_role

```ts
import { createClient } from "@supabase/supabase-js";
export function createAdminClient() { ... }
```

- Usa la `SUPABASE_SERVICE_ROLE_KEY`.
- **Bypasea completamente las políticas RLS**.
- Solo para operaciones administrativas que el RLS no puede resolver (ej: crear usuarios, borrar registros entre tablas con restricciones cruzadas).
- **Nunca importar desde Client Components**.

### Tabla resumen

| Cliente | Archivo | Key utilizada | Contexto seguro | RLS |
|---------|---------|---------------|-----------------|-----|
| Browser | `client.ts` | `ANON_KEY` (pública) | Client Components | Sí, respeta RLS |
| Server | `server.ts` | `ANON_KEY` + cookies | Server Components, Actions, Route Handlers | Sí, aplica RLS |
| Admin | `admin.ts` | `SERVICE_ROLE_KEY` (secreta) | Solo server-side | No, bypasea RLS |

---

## 7. Validaciones — `src/lib/validations/`

Usa **Zod** para definir los esquemas de datos antes de que toquen la base de datos. Cada archivo exporta un schema y su tipo inferido:

### `pqrs.ts`

```ts
z.object({
  tipo: z.enum(["peticion", "queja", "reclamo", "sugerencia"]),
  nombre: z.string().min(2).max(100),
  email: z.string().email(),
  telefono: z.string().regex(...).optional(),
  mensaje: z.string().min(20).max(2000),
  anonimo: z.boolean().default(false),
})
```

### `pagina.ts`

```ts
z.object({
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  titulo: z.string().min(2).max(200),
  contenido: z.string().min(1),
  meta_descripcion: z.string().max(160).optional(),
  publicado: z.boolean().default(false),
})
```

### `usuario.ts`

Exporta dos schemas:

- `usuarioSchema` — para crear/editar usuarios (email, nombre, role).
- `loginSchema` — solo para el formulario de login (email, password).

Los tipos TypeScript se derivan automáticamente con `z.infer<typeof schema>`, eliminando duplicación entre el schema de runtime y los tipos estáticos.

---

## 8. Componentes — `src/components/`

Los componentes están divididos en tres subgrupos por responsabilidad:

### `ui/` — componentes base reutilizables

Piezas atómicas sin lógica de dominio. Se pueden usar en cualquier parte del proyecto.

| Componente | Descripción |
|-----------|-------------|
| `Button.tsx` | Botón con variantes `primary`, `secondary`, `danger`. Acepta todos los props de `<button>`. |

### `public/` — componentes del sitio institucional

Solo se usan dentro del layout público.

| Componente | Descripción |
|-----------|-------------|
| `Header.tsx` | Barra de navegación superior con links a todas las secciones públicas. Server Component. |
| `Footer.tsx` | Pie de página con copyright y links a políticas. Server Component. |
| `ServicioCard.tsx` | Tarjeta para mostrar un servicio médico (título, descripción, ícono opcional). |

### `admin/` — componentes del panel de gestión

Solo se usan dentro del layout admin.

| Componente | Descripción |
|-----------|-------------|
| `Sidebar.tsx` | Navegación lateral del panel. Lista de links a cada sección admin. Server Component. |
| `DataTable.tsx` | Tabla genérica tipada con TypeScript generics. Acepta `columns` y `data`. |
| `RichTextEditor.tsx` | Editor de texto enriquecido placeholder. Client Component (`"use client"`). Preparado para integrar Tiptap o Quill. |

> `RichTextEditor` es el único componente admin marcado como `"use client"` porque necesita estado local y eventos del DOM para la edición interactiva.

---

## 9. Tipos — `src/types/`

### `index.ts`

Define las interfaces de dominio del proyecto que se usan en componentes y actions:

```ts
type Role = "admin" | "editor" | "viewer"

interface Profile { id, email, nombre, role, created_at }
interface Pqrs    { id, tipo, nombre, email, telefono?, mensaje, anonimo, estado, created_at }
interface Servicio { id, titulo, descripcion, icono_url?, orden }
interface MiembroEquipo { id, nombre, apellido, cargo, especialidad?, foto_url? }
interface Normativa { id, titulo, descripcion?, archivo_url?, fecha }
interface Pagina { id, slug, titulo, contenido, meta_descripcion?, publicado, updated_at }
```

### `database.types.ts` (a generar)

Este archivo **no existe aún** y debe generarse desde el esquema real de Supabase:

```bash
npx supabase gen types typescript --project-id <tu-project-id> \
  > src/types/database.types.ts
```

Una vez generado, las queries de Supabase quedan completamente tipadas y el compilador detecta errores de columnas o tablas inexistentes en tiempo de compilación.

---

## 10. Proxy (Middleware) — `src/proxy.ts`

> En Next.js 16, el archivo `middleware.ts` fue renombrado a `proxy.ts` y la función exportada de `middleware()` a `proxy()`.

El proxy intercepta **todas las peticiones** antes de que lleguen a cualquier página o API route. Su trabajo:

### Qué hace

1. **Refresca la sesión de Supabase Auth** en cada petición (necesario para que el JWT no expire silenciosamente entre navegaciones).
2. **Redirige a `/admin/login`** si alguien intenta acceder a cualquier ruta `/admin/*` sin sesión activa.
3. **Redirige a `/admin/dashboard`** si alguien con sesión activa intenta abrir `/admin/login`.

### Matcher

```ts
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|...)$).*)"],
};
```

Excluye assets estáticos para no ejecutar lógica de autenticación en cada imagen o fuente.

### Flujo de decisión

```
Petición entra
    │
    ├─ Refrescar sesión Supabase ──► actualizar cookies de respuesta
    │
    ├─ ¿Es ruta /admin/* y no /admin/login y sin usuario?
    │      └─► redirect → /admin/login
    │
    ├─ ¿Es /admin/login y tiene usuario?
    │      └─► redirect → /admin/dashboard
    │
    └─ Pasar la petición al handler correspondiente
```

---

## 11. Base de datos — `supabase/`

Esta carpeta es gestionada por el **Supabase CLI** y vive en la raíz del proyecto (no dentro de `src/`).

### `config.toml`

Configuración del entorno local de Supabase (puertos, auth, storage, edge runtime). Se usa con `npx supabase start` para levantar Postgres + Auth localmente con Docker.

### `migrations/0001_init_profiles.sql`

Primera migración del proyecto. Crea:

```sql
-- Tabla profiles ligada 1:1 con auth.users
CREATE TABLE public.profiles (
  id         uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email      text NOT NULL,
  nombre     text,
  role       text DEFAULT 'viewer' CHECK (role IN ('admin','editor','viewer')),
  created_at timestamptz DEFAULT now()
);
```

También incluye:

- **Trigger** `on_auth_user_created`: inserta automáticamente un perfil cada vez que Supabase Auth registra un nuevo usuario.
- **RLS activado**: los usuarios solo pueden leer su propio perfil; los admins pueden actualizar cualquier perfil.

> Las siguientes migraciones (tablas `pqrs`, `servicios`, `equipo`, `normativa`, `paginas`) se crearán a medida que se desarrolle cada módulo con `npx supabase migration new <nombre>`.

### `functions/send-pqrs-notification/index.ts`

Edge Function escrita en **Deno** (no Node.js). Se ejecuta en los servidores de Supabase, cerca del usuario.

- Se activa vía un **Database Webhook** de Supabase cuando se inserta una fila en la tabla `pqrs`.
- Su trabajo final: enviar un email de notificación al equipo de la IPS usando Resend, SendGrid u otro proveedor.
- Deploy independiente del proyecto Next.js: `npx supabase functions deploy send-pqrs-notification`.

> Los archivos de `supabase/functions/` están **excluidos del `tsconfig.json`** del proyecto (`"exclude": ["supabase/functions"]`) porque usan imports de URLs de Deno que TypeScript de Node no reconoce.

---

## 12. CI/CD — `.github/workflows/deploy.yml`

Pipeline que se ejecuta automáticamente en cada `push` a la rama `main`.

### Pasos

```
1. checkout  →  2. setup-node  →  3. npm ci
        │
        ▼
4. next build  (inyecta las NEXT_PUBLIC_* como env vars)
        │
        ▼
5. rsync al VPS  (excluye .env*, node_modules, .git)
        │
        ▼
6. SSH al VPS:
   - npm ci --omit=dev
   - pm2 restart cardiocentro-web
   - pm2 save
```

### Secrets requeridos en GitHub

| Secret | Dónde configurarlo |
|--------|-------------------|
| `VPS_HOST` | IP o dominio del VPS |
| `VPS_USER` | Usuario SSH |
| `VPS_SSH_KEY` | Clave privada SSH |
| `VPS_DEPLOY_PATH` | Ruta en el servidor (ej: `/var/www/cardiocentro`) |
| `NEXT_PUBLIC_SUPABASE_URL` | URL pública del proyecto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Anon key pública |

> La `SUPABASE_SERVICE_ROLE_KEY` se configura **directamente en el servidor** (nunca como secret de GitHub) para que jamás aparezca en los logs del workflow.

---

## 13. Variables de entorno

### Jerarquía de archivos `.env`

```
.env.local          ← desarrollo (git-ignorado, copia de .env.local.example)
.env.production     ← producción (nunca en git; configurar en el servidor)
```

Los archivos `.example` **sí se commitean** como documentación de qué variables necesita el proyecto.

### Variables y sus reglas

| Variable | Pública al cliente | Dónde se usa |
|----------|--------------------|--------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Sí (`NEXT_PUBLIC_`) | `client.ts`, `server.ts`, `proxy.ts` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Sí (`NEXT_PUBLIC_`) | `client.ts`, `server.ts`, `proxy.ts` |
| `SUPABASE_SERVICE_ROLE_KEY` | **No** — solo servidor | `admin.ts` |
| `SUPABASE_WEBHOOK_SECRET` | **No** | `api/webhooks/supabase/route.ts` |

> Cualquier variable sin el prefijo `NEXT_PUBLIC_` es invisible para el navegador. Next.js no la incluye en el bundle de cliente.

---

## 14. Flujo de datos completo

### Escenario A — Usuario rellena el formulario PQRS (público)

```
Navegador
  └─► POST /api/pqrs
        └─► route.ts valida con Zod
              └─► createClient() → server.ts (anon key)
                    └─► supabase.from("pqrs").insert(data)
                          └─► Postgres inserta la fila
                                └─► Database Webhook dispara
                                      └─► Edge Function: send-pqrs-notification
                                            └─► email al equipo de la IPS
```

### Escenario B — Admin edita una página desde el panel

```
Client Component (formulario)
  └─► llama Server Action: updatePagina(id, data)
        └─► "use server" — ejecuta en Node.js
              └─► paginaSchema.safeParse(data)
                    └─► createClient() → server.ts (lee cookies de sesión)
                          └─► supabase.from("paginas").update(data).eq("id", id)
                                └─► Postgres aplica RLS → ¿tiene rol adecuado?
                                      └─► { success: true } → UI actualiza
```

### Escenario C — Acceso no autorizado a `/admin/dashboard`

```
Petición GET /admin/dashboard
  └─► proxy.ts intercepta
        └─► supabase.auth.getUser() → null (sin sesión)
              └─► NextResponse.redirect("/admin/login")
                    └─► Nunca llega al layout ni a la página
```

---

## 15. Reglas de importación

Para mantener la arquitectura sana, seguir estas reglas:

```
✅ Componentes pueden importar de:
   - @/components/ui/*
   - @/lib/supabase/client.ts   (solo Client Components)
   - @/types/index.ts

✅ Server Actions pueden importar de:
   - @/lib/supabase/server.ts
   - @/lib/supabase/admin.ts    (con justificación)
   - @/lib/validations/*
   - @/types/index.ts

✅ Route Handlers pueden importar de:
   - @/lib/supabase/server.ts
   - @/lib/supabase/admin.ts    (con justificación)
   - @/lib/validations/*

❌ NUNCA importar en Client Components:
   - @/lib/supabase/server.ts   (usa cookies() de Next.js, solo servidor)
   - @/lib/supabase/admin.ts    (expone service_role key)
   - @/actions/*                (puede llamarlos, pero no importar tipos internos)

❌ NUNCA importar en código cliente:
   - Variables sin NEXT_PUBLIC_
   - Módulos de Node.js (fs, path, crypto...)
```

---

*Última actualización: junio 2026 — Next.js 16.2.9 / Supabase SSR 0.12 / Zod 4*
