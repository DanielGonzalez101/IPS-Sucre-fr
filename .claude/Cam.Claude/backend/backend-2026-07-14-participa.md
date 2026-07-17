# Solicitud backend — Sección Participa

**Fecha:** 2026-07-14
**Contexto:** Se construyó la página pública `/participa` (mecanismos de participación, ítem ITA 1934-1943 de la matriz de cumplimiento). Hoy todo el contenido sale de mocks en `src/data/participa.mock.ts`, leídos a través de `src/lib/participa.ts`. Cuando estas tablas existan en Supabase, solo hay que cambiar las funciones de `src/lib/participa.ts` para que consulten la base de datos — los componentes no cambian porque ya reciben datos con esta misma forma.

El formulario de inscripción (`src/components/public/participa/ParticipaForm.tsx`) ya está construido y valida en cliente con Zod (`src/lib/validations/participa.ts`), pero **no envía nada todavía** — muestra un mensaje "disponible próximamente" en vez de hacer `fetch`, porque no existe el endpoint ni la tabla. Está marcado con la constante `BACKEND_PENDING = true` en ese archivo.

---

## 1. Tablas de contenido (lectura pública, edición solo admin)

Espejo de las interfaces en `src/data/participa.mock.ts`.

```sql
-- ── participa_hero ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS participa_hero (
  id        uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  eyebrow   text NOT NULL DEFAULT '',
  titulo    text NOT NULL DEFAULT '',
  subtitulo text NOT NULL DEFAULT '',
  visible   bool NOT NULL DEFAULT true,
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ── participa_que_es (las 3 respuestas del ítem ITA 1934) ───────
CREATE TABLE IF NOT EXISTS participa_que_es (
  id        text PRIMARY KEY,   -- 'que-es' | 'secciones' | 'como-participar'
  pregunta  text NOT NULL,
  respuesta text NOT NULL,
  orden     int  NOT NULL DEFAULT 0,
  visible   bool NOT NULL DEFAULT true
);

-- ── participa_mecanismos ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS participa_mecanismos (
  id          text PRIMARY KEY,
  titulo      text NOT NULL,
  descripcion text NOT NULL,
  icono       text NOT NULL, -- 'usuarios' | 'pqrsd' | 'encuestas' | 'canales'
  cta_label   text NOT NULL DEFAULT 'Conocer más',
  cta_href    text NOT NULL,
  orden       int  NOT NULL DEFAULT 0,
  visible     bool NOT NULL DEFAULT true
);

-- ── participa_documentos ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS participa_documentos (
  id          text PRIMARY KEY,
  titulo      text NOT NULL,
  descripcion text NOT NULL,
  url         text, -- NULL = "Documento en actualización" en el front
  anio        text, -- opcional, ej. '2024'
  orden       int  NOT NULL DEFAULT 0,
  visible     bool NOT NULL DEFAULT true
);

-- ── participa_convocatorias ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS participa_convocatorias (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tema        text NOT NULL,
  objetivo    text NOT NULL,
  requisitos  text NOT NULL,
  plazo       date NOT NULL, -- el estado Abierta/Cerrada se calcula comparando con hoy
  orden       int  NOT NULL DEFAULT 0,
  visible     bool NOT NULL DEFAULT true,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- ── participa_calendario ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS participa_calendario (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  mes         text NOT NULL,   -- nombre del mes, ej. 'Marzo'
  actividad   text NOT NULL,
  descripcion text NOT NULL,
  orden       int  NOT NULL DEFAULT 0, -- número de mes 1-12, para ordenar
  visible     bool NOT NULL DEFAULT true
);
```

### RLS — tablas de contenido

Lectura pública (anon) solo de filas visibles; escritura solo desde el panel admin (autenticado / service role):

```sql
ALTER TABLE participa_hero ENABLE ROW LEVEL SECURITY;
ALTER TABLE participa_que_es ENABLE ROW LEVEL SECURITY;
ALTER TABLE participa_mecanismos ENABLE ROW LEVEL SECURITY;
ALTER TABLE participa_documentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE participa_convocatorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE participa_calendario ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lectura pública de contenido visible" ON participa_hero
  FOR SELECT TO anon USING (visible = true);
CREATE POLICY "Lectura pública de contenido visible" ON participa_que_es
  FOR SELECT TO anon USING (visible = true);
CREATE POLICY "Lectura pública de contenido visible" ON participa_mecanismos
  FOR SELECT TO anon USING (visible = true);
CREATE POLICY "Lectura pública de contenido visible" ON participa_documentos
  FOR SELECT TO anon USING (visible = true);
CREATE POLICY "Lectura pública de contenido visible" ON participa_convocatorias
  FOR SELECT TO anon USING (visible = true);
CREATE POLICY "Lectura pública de contenido visible" ON participa_calendario
  FOR SELECT TO anon USING (visible = true);

-- Escritura: solo vía admin (revisar cómo lo hacen las demás tablas de
-- contenido del sitio — mismo patrón que "sedes"/"site_config" del
-- 2026-07-09, sin policy de INSERT/UPDATE para anon).
```

## 2. Tabla de inscripciones (sin lectura pública)

```sql
CREATE TABLE IF NOT EXISTS participa_inscripciones (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name   varchar NOT NULL,
  doc_type    doc_type_enum NOT NULL,   -- reutilizar el enum ya existente de la tabla pqrsd
  doc_number  varchar NOT NULL,
  email       varchar NOT NULL,
  phone       varchar NOT NULL,
  espacio_id  text NOT NULL REFERENCES participa_mecanismos(id),
  message     text,
  created_at  timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE participa_inscripciones ENABLE ROW LEVEL SECURITY;
-- Sin policy de SELECT para anon (nadie externo puede leer inscripciones).
-- Sin policy de INSERT para anon tampoco: el insert lo hace la API route
-- con el cliente admin (service_role), igual que pqrsd.
```

## 3. API route requerida

`src/app/api/participa/inscripcion/route.ts` — **no existe, hay que crearla** (no se creó en esta tarea por instrucción explícita de no tocar `src/app/api/`).

- Método: `POST`
- Payload esperado (ya validado en cliente con `src/lib/validations/participa.ts`, revalidar igual server-side con el mismo schema):
  ```json
  {
    "full_name": "string",
    "doc_type": "CC | CE | NUIP | TI | NIT | Pasaporte | PPT | Otro",
    "doc_number": "string",
    "email": "string",
    "phone": "string (7-10 dígitos)",
    "espacio_id": "string (id de participa_mecanismos)",
    "message": "string (opcional)"
  }
  ```
- Respuesta éxito: `201 { ok: true }`
- Respuesta error validación: `422 { error: "Datos inválidos", fields: {...} }` (mismo formato que `/api/pqrsd`)
- Debe usar `rateLimit()` de `src/lib/rate-limit.ts` igual que `/api/pqrsd` (5 por hora por IP es razonable).
- Insertar con `createAdminClient()` en `participa_inscripciones`.

Cuando esta route exista, el único cambio en el frontend es reemplazar el bloque marcado `TODO(backend)` en `ParticipaForm.tsx` por el `fetch` real y quitar `BACKEND_PENDING`.

## 4. Storage

No se requiere bucket nuevo: los documentos institucionales (`participa_documentos.url`) pueden vivir en el bucket público de documentos que ya use Transparencia/Calidad, si existe uno. Si no existe ninguno público reutilizable, se necesitaría un bucket `participa-documentos` (público, solo PDF, sin restricción de tamaño estricta ya que son documentos institucionales, no adjuntos de usuarios).

## 5. Qué necesita el panel admin

- CRUD simple sobre `participa_hero` (1 fila), `participa_que_es` (3 filas fijas), `participa_mecanismos`, `participa_documentos`, `participa_convocatorias`, `participa_calendario`.
- Para `participa_documentos`: subir/reemplazar PDF y que el admin escriba la URL resultante (o mejor, integrar con Storage para que el admin suba el archivo directo).
- Listado simple (no requiere estados ni flujo) de `participa_inscripciones` para que el equipo de participación vea quién se inscribió — similar a como ya se lista `pqrsd` en `/gestion-interna/pqrs`.

## Impacto en el front

Cuando estas tablas y la route existan: cambiar las 6 funciones de `src/lib/participa.ts` de leer los mocks a hacer `await supabase.from(...).select(...)`, y activar el envío real en `ParticipaForm.tsx`. Ningún componente visual cambia.
