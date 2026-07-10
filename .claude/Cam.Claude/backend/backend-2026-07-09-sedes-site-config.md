# Solicitud Backend — Tablas `sedes` y `site_config`

## Contexto para el backend
Estamos construyendo un formulario en el panel admin que permite editar los datos de contacto del sitio (teléfonos por sede, email, dirección, horario y URL del mapa). Actualmente estos datos están hardcodeados en los componentes. El frontend ya está listo para leer de estas tablas.

---

## Solicitud concreta

Necesitamos dos tablas nuevas en Supabase: `sedes` y `site_config`.

---

## SQL listo para copiar y pegar

```sql
-- ── Tabla sedes ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS sedes (
  id       text PRIMARY KEY,   -- 'sincelejo' | 'carmen' | 'magangue'
  ciudad   text NOT NULL DEFAULT '',
  direccion text NOT NULL DEFAULT '',
  telefono  text NOT NULL DEFAULT '',
  horario   text NOT NULL DEFAULT '',
  map_url   text NOT NULL DEFAULT '',
  orden     int  NOT NULL DEFAULT 0
);

-- Datos iniciales (los mismos que están hardcodeados hoy)
INSERT INTO sedes (id, ciudad, direccion, telefono, horario, map_url, orden) VALUES
  (
    'sincelejo',
    'Sincelejo',
    'Calle 14 No. 17-72 / Barrio Ford',
    '(+57) 300 912 7565',
    'L–V 7:00 a.m.–12:00 m. / 1:00–6:00 p.m.\nSáb 7:00–11:00 a.m.',
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3946.123!2d-75.39770!3d9.30470!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e5a504f0e6b9b7b%3A0x123456789abcdef!2sCalle%2014%20%2317-72%2C%20Sincelejo%2C%20Sucre!5e0!3m2!1ses!2sco!4v1700000000000!5m2!1ses!2sco',
    1
  ),
  (
    'carmen',
    'El Carmen de Bolívar',
    'Calle 23 No. 54-20 / Barrio Bureche',
    '(+57) 300 912 7565',
    'L–V 7:00 a.m.–12:00 m. / 1:00–6:00 p.m.',
    '',
    2
  ),
  (
    'magangue',
    'Magangué',
    'Calle 16 No. 12-56 / Barrio San José',
    '(+57) 300 912 7565',
    'L–V 7:00 a.m.–12:00 m. / 1:00–6:00 p.m.',
    '',
    3
  )
ON CONFLICT (id) DO NOTHING;

-- ── Tabla site_config ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS site_config (
  key   text PRIMARY KEY,
  value text NOT NULL DEFAULT ''
);

INSERT INTO site_config (key, value) VALUES
  ('email_contacto', 'info@cardiopediasucre.com')
ON CONFLICT (key) DO NOTHING;

-- ── RLS ──────────────────────────────────────────────────────────
ALTER TABLE sedes      ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_config ENABLE ROW LEVEL SECURITY;

-- Lectura pública (el frontend público las necesita)
CREATE POLICY "public_read_sedes"  ON sedes       FOR SELECT USING (true);
CREATE POLICY "public_read_config" ON site_config  FOR SELECT USING (true);

-- Escritura solo desde service_role (el admin usa createAdminClient que bypasea RLS)
-- No se necesita policy de escritura pública.
```

---

## Impacto en el front
Cuando estas tablas existan, el formulario admin en `/gestion-interna/sitio` permite editar cada sede y el email de contacto. Los cambios se reflejan automáticamente en `SedesSection` (home) y `Footer`. Mientras las tablas no existan, el sitio sigue usando los valores hardcodeados como fallback.