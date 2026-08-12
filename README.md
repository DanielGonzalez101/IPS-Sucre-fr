# Cardiocentro Pediátrico de Sucre — Sitio Web Institucional

Portal web institucional de la IPS **Cardiocentro Pediátrico de Sucre**, con panel de gestión de contenido, formulario PQRSD, sección de participación ciudadana y cumplimiento de la normativa MinTIC Resolución 1519 de 2020 (accesibilidad y transparencia web).

## Arquitectura

```
Next.js 16 (App Router)  ←→  Supabase (Postgres + Auth + Storage + Edge Functions)
         ↓
    VPS Hostinger (Ubuntu)
    Nginx  →  PM2  →  Node.js (next start)
```

- **Frontend y backend**: Next.js con App Router. No hay servidor Express/Nest separado.
- **Server Actions**: lógica de mutación (CRUD) en `src/actions/`.
- **Route Handlers**: endpoints REST en `src/app/api/` para integraciones externas (PQRSD público, participación, webhooks).
- **Base de datos**: Supabase Postgres con RLS activado.
- **Autenticación**: Supabase Auth + `src/proxy.ts` (middleware Next.js 16) que protege el panel de gestión.
- **Almacenamiento**: Supabase Storage para imágenes y archivos normativos.
- **Edge Functions**: Deno functions en `supabase/functions/` para notificaciones asíncronas.
- **Animación**: GSAP + `@gsap/react` (con guardia `prefers-reduced-motion` en todos los usos).
- **Accesibilidad**: widget propio (`src/components/public/accesibilidad/`) — perfiles, lupa, texto a voz, comandos de voz, colores personalizados.

## Estructura de rutas (estado actual)

### Sitio público — `src/app/(public)/`

| Ruta | Descripción |
|------|-------------|
| `/` | Inicio — hero, servicios destacados, filtro alfabético de servicios |
| `/quienes-somos` | Misión, visión, organigrama, entes de vigilancia |
| `/servicios` | Catálogo de servicios (tabla `servicios` de Supabase) |
| `/servicios/[slug]` | Ficha de servicio por especialidad (dato real de Supabase) |
| `/servicios/catalogo/[slug]` | Ficha de detalle de los 104 servicios numerados del portafolio (layout adaptativo por densidad de datos) |
| `/equipo` | Equipo médico |
| `/equipo/tecnologico` | Equipo/infraestructura tecnológica |
| `/normativa` | Documentos normativos — *stub, pendiente de contenido del cliente* |
| `/calidad` | Página de calidad institucional |
| `/multimedia/galeria` | Galería multimedia |
| `/noticias` | Noticias institucionales |
| `/participa` | Participación ciudadana — mecanismos, documentos, convocatorias, calendario, formulario conectado a Supabase |
| `/pqrs`, `/pqrs/consulta` | Formulario PQRSD (19 campos, radicado, adjuntos, seguimiento) |
| `/contacto` | Información de contacto |
| `/mapa-del-sitio` | Mapa del sitio |
| `/transparencia` | Sección de transparencia |
| `/politicas/privacidad`, `/politicas/terminos-y-condiciones`, `/politicas/derechos-de-autor`, `/politicas/seguridad-digital` | Políticas legales |

### Panel de gestión — `src/app/(admin)/gestion-interna/`

> El segmento real es `gestion-interna` (no `/admin`), protegido por `src/proxy.ts` vía Supabase Auth.

| Ruta | Descripción |
|------|-------------|
| `/gestion-interna/login` | Acceso al panel |
| `/gestion-interna/dashboard` | Resumen administrativo |
| `/gestion-interna/sitio` | Configuración general del sitio |
| `/gestion-interna/hero` | Edición del hero de Inicio |
| `/gestion-interna/paginas`, `/gestion-interna/paginas/[id]` | CRUD de páginas (CMS) |
| `/gestion-interna/servicios` | CRUD de servicios |
| `/gestion-interna/equipo`, `/gestion-interna/equipo/humano`, `/gestion-interna/equipo/tecnologico` | CRUD de equipo |
| `/gestion-interna/normativa` | CRUD de normativa |
| `/gestion-interna/noticias` | CRUD de noticias |
| `/gestion-interna/participa` | Gestión de participación ciudadana |
| `/gestion-interna/pqrs`, `/gestion-interna/pqrs/[id]` | Gestión de PQRSD |
| `/gestion-interna/usuarios` | Gestión de usuarios |

### API — `src/app/api/`

| Endpoint | Descripción |
|----------|-------------|
| `POST /api/pqrsd` | Radicación de PQRSD público (rate-limited por IP) |
| `GET /api/pqrsd/consulta` | Consulta de seguimiento por radicado |
| `POST /api/participa/inscripcion` | Inscripción a mecanismos de participación |
| `POST /api/webhooks/supabase` | Webhook con validación de firma HMAC |

## Datos y contenido

- **104 servicios numerados** (por código CUPS) alimentan el filtro alfabético de Inicio y las fichas `/servicios/catalogo/[slug]` — fuente: `src/data/servicios-alfabetico.ts` / `src/data/servicios-detalle.ts`, hoy como **mock tipado**, pendiente de migrar a Supabase (ver `.claude/Cam.Claude/backend/`).
- Los 104 registros tienen `numero`, `codigoCups`, `nombre`, `categoria`, `sedes`, `modalidad` y `nivelComplejidad` reales (auditados contra el PDF oficial del portafolio). **No tienen** especialista, imagen, pasos del proceso ni descripción clínica extendida — esos campos no existen en ninguna fuente disponible hoy y no se inventan.
- El catálogo de `/servicios` (tabla `servicios` real de Supabase) es una granularidad distinta (por especialidad), independiente del catálogo numerado.

## Correr en local

```bash
# 1. Clonar e instalar dependencias
git clone https://github.com/DanielGonzalez101/IPS-Sucre-fr.git
cd IPS-Sucre-fr
npm install

# 2. Configurar variables de entorno
cp .env.local.example .env.local
# Edita .env.local con tus keys de Supabase

# 3. Iniciar Supabase localmente (requiere Docker)
npx supabase start

# 4. Aplicar migraciones
npx supabase db push

# 5. Correr el servidor de desarrollo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Aplicar migraciones con Supabase CLI

```bash
npx supabase login
npx supabase link --project-ref <tu-project-id>
npx supabase db push
npx supabase gen types typescript --project-id <tu-project-id> > src/types/database.types.ts
```

## Desplegar en VPS Hostinger

Despliegue automático vía GitHub Actions (`push` a `main`): checkout → build → rsync al VPS → `pm2 restart`.

### Secrets requeridos en GitHub

| Secret | Descripción |
|--------|-------------|
| `VPS_HOST` | IP o dominio del VPS |
| `VPS_USER` | Usuario SSH |
| `VPS_SSH_KEY` | Clave privada SSH |
| `VPS_DEPLOY_PATH` | Ruta de deploy en el servidor |
| `NEXT_PUBLIC_SUPABASE_URL` | URL del proyecto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Anon key pública |

> `SUPABASE_SERVICE_ROLE_KEY` se configura directamente en el servidor, nunca como secret de GitHub.

## Tecnologías

- [Next.js 16](https://nextjs.org/) — App Router, Server Actions, Route Handlers (⚠️ tiene cambios respecto a versiones previas — ver `AGENTS.md` antes de escribir código)
- [Supabase](https://supabase.com/) — Postgres, Auth, Storage, Edge Functions
- [Tailwind CSS 4](https://tailwindcss.com/) — Estilos utilitarios
- [Zod 4](https://zod.dev/) — Validación de esquemas
- [GSAP](https://gsap.com/) — Animaciones (con `prefers-reduced-motion`)
- [PM2](https://pm2.keymetrics.io/) + [Nginx](https://nginx.org/) — Producción en VPS

## Normativa y accesibilidad

El proyecto se construye contra la **Resolución MinTIC 1519 de 2020** (accesibilidad y transparencia web). Ver `.claude/Cam.Claude/bitacora/` para trazabilidad de funcionalidades, problemas y pendientes, y `analisis-matriz-cumplimiento.md` en la raíz para el estado de cumplimiento contra la matriz oficial del proyecto.

## Documentación interna

Este repo usa Claude Code con memoria operativa en `.claude/`:

| Archivo | Contenido |
|---------|-----------|
| `.claude/context_global/ARQUITECTURA.md` | Arquitectura técnica de referencia |
| `.claude/context_global/directriz.md` | Convenciones de código |
| `.claude/context_global/estilo.md` | Sistema de diseño y paleta |
| `.claude/context_global/comunicacion-backend.md` | Patrones de comunicación con Supabase |
| `.claude/context_global/pagination.md` | Patrón de paginación estándar |
| `.claude/Cam.Claude/bitacora/` | Trazabilidad de funcionalidades, problemas y pendientes |
| `.claude/Cam.Claude/backend/` | Solicitudes al equipo de backend |
| `analisis-matriz-cumplimiento.md` | Estado de cumplimiento contra la matriz MinTIC del cliente |

---

*Última actualización de este README: 2026-08-09.*
