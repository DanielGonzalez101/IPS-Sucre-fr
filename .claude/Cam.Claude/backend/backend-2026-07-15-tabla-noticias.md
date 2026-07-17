# Solicitud backend — Tabla `noticias`

**Fecha:** 2026-07-15

---

## Contexto para el backend

Construimos el módulo de noticias en el frontend:
- **Página pública** `/noticias` — layout tipo magazine con hero, grid bento, lista
- **Panel admin** `/gestion-interna/noticias` — CRUD completo

Las server actions ya están en `src/actions/noticias.ts` apuntando a la tabla `noticias` en Supabase.

---

## Solicitud concreta

Necesitamos:
1. Crear la tabla `noticias` en Supabase
2. Configurar RLS (Row Level Security)
3. (Opcional futuro) Bucket de Storage para las imágenes

---

## SQL listo para copiar y pegar

```sql
-- 1. Tabla principal
create table public.noticias (
  id         uuid primary key default gen_random_uuid(),
  slug       text not null unique,
  titulo     text not null check (char_length(titulo) <= 80),
  extracto   text not null check (char_length(extracto) <= 200),
  tag        text not null check (tag in ('Tecnología', 'Eventos', 'Institucional')),
  img_url    text not null default '',
  fecha      date not null,
  vistas     integer not null default 0,
  activo     boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2. Índices útiles
create index noticias_activo_fecha_idx on public.noticias (activo, fecha desc);
create index noticias_tag_idx          on public.noticias (tag);

-- 3. Trigger para updated_at automático
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger noticias_updated_at
  before update on public.noticias
  for each row execute function public.set_updated_at();

-- 4. RLS
alter table public.noticias enable row level security;

-- Lectura pública: solo noticias activas
create policy "noticias_public_read"
  on public.noticias for select
  using (activo = true);

-- Lectura admin: todas (usuario autenticado)
create policy "noticias_admin_read"
  on public.noticias for select
  to authenticated
  using (true);

-- Escritura: solo autenticados
create policy "noticias_admin_insert"
  on public.noticias for insert
  to authenticated
  with check (true);

create policy "noticias_admin_update"
  on public.noticias for update
  to authenticated
  using (true);

create policy "noticias_admin_delete"
  on public.noticias for delete
  to authenticated
  using (true);

-- 5. Datos de prueba (los 6 artículos del mock del frontend)
insert into public.noticias (slug, titulo, extracto, tag, img_url, fecha, vistas) values
  ('nueva-tecnologia-ecocardiograma',
   'Nueva tecnología de ecocardiograma 4D disponible en el Cardiocentro',
   'Incorporamos equipos de última generación que permiten diagnósticos más precisos y seguros para nuestros pacientes pediátricos.',
   'Tecnología', '/images/bgecocardio.png', '2026-06-10', 142),

  ('jornada-salud-cardiovascular',
   'Jornada gratuita de salud cardiovascular para niños en Sincelejo',
   'El próximo 5 de julio realizaremos una jornada de tamizaje cardíaco gratuita para niños entre 0 y 14 años en nuestra sede principal.',
   'Eventos', '/images/bgholter.png', '2026-06-03', 89),

  ('convenio-eps-coosalud',
   'Cardiocentro firma convenio con Coosalud para ampliar cobertura regional',
   'Gracias a este acuerdo, más familias de Sucre y Córdoba podrán acceder a nuestros servicios de cardiología pediátrica sin barreras.',
   'Institucional', '/images/bgmamografia.png', '2026-05-20', 214),

  ('nueva-sede-sampues',
   'Abrimos nueva sede de atención en Sampués',
   'Ampliamos nuestra cobertura con una nueva sede en Sampués, acercando los servicios de cardiología pediátrica a más familias del departamento.',
   'Institucional', '/images/bgelectro.png', '2026-05-08', 176),

  ('capacitacion-equipo-medico',
   'Nuestro equipo se capacita en técnicas de imagen cardiovascular de vanguardia',
   'Médicos y tecnólogos del Cardiocentro completaron un programa de actualización en resonancia magnética cardíaca pediátrica.',
   'Tecnología', '/images/hero-team.png', '2026-04-22', 98),

  ('feria-salud-sincelejo',
   'Participamos en la Feria de Salud de Sincelejo 2026',
   'El Cardiocentro estuvo presente con un stand de tamizaje gratuito y charlas educativas sobre salud cardiovascular en la infancia.',
   'Eventos', '/images/hero-2.png', '2026-04-10', 131);
```

---

## Impacto en el frontend cuando esto esté listo

1. El panel admin `/gestion-interna/noticias` dejará de mostrar error y cargará las noticias reales.
2. La página pública `/noticias` podrá conectarse a los datos reales reemplazando el mock en `NoticiasGrid.tsx` por una llamada a `getNoticiasPublicas()`.
3. El contador de vistas se puede incrementar desde una API route cuando el usuario entra a leer una noticia.

---

## Notas adicionales

- Los `check constraints` en SQL ya refuerzan los mismos límites que tiene el formulario admin (titulo ≤ 80, extracto ≤ 200, tag solo 3 valores). Doble capa de seguridad.
- Si en el futuro se quiere subida de imágenes directa: crear bucket `noticias-imagenes` en Supabase Storage con política pública de lectura y solo escritura para autenticados.
