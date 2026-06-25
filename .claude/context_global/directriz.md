# Directrices generales — Cardiocentro Pediátrico de Sucre

## Identidad del proyecto
Sitio web institucional del Cardiocentro Pediátrico de Sucre. Tiene dos zonas diferenciadas:
- **Pública** (`(public)`): vitrina institucional para pacientes y público general.
- **Administrativa** (`(admin)`): panel de gestión de contenido restringido a usuarios autenticados.

## Stack técnico
| Tecnología | Versión | Notas |
|---|---|---|
| Next.js | 16 | APIs con cambios breaking — ver `node_modules/next/dist/docs/` |
| React | 19 | |
| TypeScript | 5 | Tipado estricto en todo el proyecto |
| Tailwind CSS | 4 | Config vía `@import "tailwindcss"` en `globals.css` |
| Supabase | 2 | Backend as a Service (BaaS) — base de datos, auth, storage |
| Zod | 4 | Validación en Server Actions |

## Convenciones de nomenclatura
- Archivos de componentes: PascalCase (`ServicioCard.tsx`)
- Archivos de actions, lib y types: camelCase (`paginas.ts`, `supabase/server.ts`)
- Rutas de app router: kebab-case (`quienes-somos/page.tsx`)
- Variables y funciones: camelCase
- Tipos e interfaces TypeScript: PascalCase

## Reglas de código
- **Nada de comentarios** a menos que el "por qué" no sea obvio desde el código.
- No introducir abstracciones especulativas; resolver lo que el ticket pide.
- No agregar manejo de errores para escenarios que no pueden ocurrir.
- Confiar en las garantías del framework; solo validar en las fronteras del sistema (input del usuario, APIs externas).
- Preferir editar archivos existentes antes de crear nuevos.

## Flujo de autenticación
- El archivo `src/proxy.ts` reemplaza al `middleware.ts` tradicional (cambio breaking de Next.js 16).
- Las rutas `/admin/*` requieren sesión activa; la excepción es `/admin/login`.
- Supabase gestiona la sesión mediante cookies SSR (`@supabase/ssr`).

## Roles de usuario
`admin` | `editor` | `viewer` — definidos en `src/types/index.ts`.
