# Cardiocentro Pediátrico de Sucre — Sitio Web Institucional

Sitio web institucional con módulo de gestión de contenido para la IPS **Cardiocentro Pediátrico de Sucre**.

## Arquitectura

```
Next.js 15 (App Router)  ←→  Supabase (Postgres + Auth + Storage + Edge Functions)
         ↓
    VPS Hostinger (Ubuntu)
    Nginx  →  PM2  →  Node.js (next start)
```

- **Frontend y backend**: Next.js con App Router. No hay servidor Express/Nest separado.
- **Server Actions**: toda la lógica de mutación (CRUD) vive en `src/actions/`.
- **Route Handlers**: endpoints REST en `src/app/api/` para integraciones externas (PQRS pública, webhooks).
- **Base de datos**: Supabase Postgres con RLS activado.
- **Autenticación**: Supabase Auth + middleware Next.js que protege `/admin/*`.
- **Almacenamiento**: Supabase Storage para imágenes y archivos normativos.
- **Edge Functions**: Deno functions en `supabase/functions/` para notificaciones asíncronas.

## Estructura de rutas

| Ruta | Descripción |
|------|-------------|
| `/` | Home público |
| `/quienes-somos` | Presentación institucional |
| `/servicios` | Catálogo de servicios |
| `/equipo` | Equipo médico |
| `/normativa` | Documentos normativos |
| `/contacto` | Información de contacto |
| `/pqrs` | Formulario de PQRS |
| `/politicas/*` | Políticas legales |
| `/admin/login` | Acceso al panel |
| `/admin/dashboard` | Resumen administrativo |
| `/admin/paginas` | CRUD de páginas |
| `/admin/servicios` | CRUD de servicios |
| `/admin/equipo` | CRUD de equipo |
| `/admin/normativa` | CRUD de normativa |
| `/admin/pqrs` | Gestión de PQRS |
| `/admin/usuarios` | Gestión de usuarios |

## Correr en local

```bash
# 1. Clonar e instalar dependencias
git clone <repo-url>
cd cardiocentro-web
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
# Login (solo primera vez)
npx supabase login

# Vincular con el proyecto remoto
npx supabase link --project-ref <tu-project-id>

# Aplicar migraciones pendientes a producción
npx supabase db push

# Generar tipos TypeScript desde el esquema actual
npx supabase gen types typescript --project-id <tu-project-id> > src/types/database.types.ts
```

## Desplegar en VPS Hostinger

El despliegue es automático vía GitHub Actions (`push` a `main`).

### Configuración inicial del VPS (una sola vez)

```bash
# En el VPS (Ubuntu)
# 1. Instalar Node.js 20 via nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
nvm install 20

# 2. Instalar PM2
npm install -g pm2

# 3. Configurar Nginx como reverse proxy
# Apunta el puerto 80/443 → localhost:3000

# 4. Configurar las variables de entorno en el servidor
# Opción A: archivo .env en la carpeta de deploy (NO en git)
# Opción B: pm2 ecosystem.config.js con bloque env_production
```

### Secrets requeridos en GitHub

Ir a `Settings → Secrets and variables → Actions` y agregar:

| Secret | Descripción |
|--------|-------------|
| `VPS_HOST` | IP o dominio del VPS |
| `VPS_USER` | Usuario SSH |
| `VPS_SSH_KEY` | Clave privada SSH |
| `VPS_DEPLOY_PATH` | Ruta de deploy (ej: `/var/www/cardiocentro`) |
| `NEXT_PUBLIC_SUPABASE_URL` | URL del proyecto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Anon key pública |

> La `SUPABASE_SERVICE_ROLE_KEY` se configura **directamente en el servidor**, no como secret de GitHub, para que nunca aparezca en los logs del workflow.

## Tecnologías

- [Next.js 15](https://nextjs.org/) — App Router, Server Actions, Route Handlers
- [Supabase](https://supabase.com/) — Postgres, Auth, Storage, Edge Functions
- [Tailwind CSS](https://tailwindcss.com/) — Estilos utilitarios
- [Zod](https://zod.dev/) — Validación de esquemas
- [PM2](https://pm2.keymetrics.io/) — Gestor de procesos Node en producción
- [Nginx](https://nginx.org/) — Reverse proxy en el VPS

---

## Desarrollo (referencia original create-next-app)

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
# IPS-Sucre-fr
