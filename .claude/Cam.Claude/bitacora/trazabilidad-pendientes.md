# Trazabilidad — Pendientes y Decisiones

Registro de cosas por hacer, decisiones tomadas y cosas descartadas con su razón.

---

## Pendientes activos

### Obligatorios normativos (Matriz ITA — ítems ROJOS)

| Prioridad | Tarea | Contexto | Fecha agregada |
|-----------|-------|----------|----------------|
| Alta | Módulo PQRSD completo (14 campos + lógica anónimo) | Ítems rojos 259-268, azules 265-269. El enlace actual devuelve 404. Es lo más crítico. | 2026-06-20 |
| Alta | Página `/pqrsd/seguimiento` — consulta por radicado | Ítem sin color 253 — ciudadano ingresa radicado y ve estado | 2026-06-20 |
| Alta | Módulo de noticias completo | Ítem rojo 271 — listado `/noticias`, detalle `/noticias/[slug]`, 3 en home, CRUD admin | 2026-06-20 |
| Alta | Footer con enlaces a políticas legales | Ítem rojo 33 — Términos, Privacidad, Derechos de autor | 2026-06-20 |
| Alta | Páginas `/politicas/terminos`, `/politicas/privacidad`, `/politicas/derechos-autor` | Ítems rojos 34-36. Texto lo aprueba el cliente. | 2026-06-20 |
| Alta | Organigrama en `/quienes-somos` | Ítem rojo 43. BLOQUEANTE: cliente debe entregar el archivo. | 2026-06-20 |
| Media | Sección entes que vigilan (Supersalud) en Transparencia | Ítems sin color 70-76. Datos: nombre, dirección, teléfono, email, enlace. | 2026-06-20 |
| Media | Upload PDFs a Transparencia: manual contratación, distribución presupuestal, normativa | Ítems rojos 101, 112 y sin color 78-86. Los PDFs ya existen en la IPS. | 2026-06-20 |
| Media | Acuse de recibo automático PQRSD con radicado | Ítem sin color 249-250 — mensaje de confirmación + email 24h hábiles | 2026-06-20 |

### Técnicos del stack

| Prioridad | Tarea | Contexto | Fecha agregada |
|-----------|-------|----------|----------------|
| Alta | Generar `sitemap.xml` con Next.js | Normativa CC12 MinTIC | 2026-06-20 |
| Alta | Headers de seguridad en `next.config.ts` | Ítem rojo 272 (seguridad digital) | 2026-06-20 |
| Alta | reCAPTCHA v3 en PQRSD y contacto | Ítem verde 252 — evitar SPAM | 2026-06-20 |
| Alta | Añadir enlace "saltar al contenido" en layout público | Normativa CC10 | 2026-06-20 |
| Alta | Verificar contraste paleta `blue-600`/`gray-*` con herramienta WCAG (mínimo 4.5:1) | Normativa CC5 | 2026-06-20 |
| Media | Generar `database.types.ts` desde Supabase CLI | Documentado en ARQUITECTURA.md §9 | 2026-06-20 |
| Media | Integrar editor real en `RichTextEditor.tsx` (Tiptap o Quill) | Requerido para módulo de noticias y páginas CMS | 2026-06-20 |
| Baja | Crear tabla `pqrs_estados` para historial de cambios de estado | Documentado en trazabilidad.md original | 2026-06-20 |

### UI/UX en progreso

| Prioridad | Tarea | Contexto | Fecha agregada |
|-----------|-------|----------|----------------|
| Media | URLs Google Maps embed para Carmen de Bolívar y Magangué | Sin estas URLs no se puede activar el cambio de mapa con animación en SedesSection | 2026-06-22 |

---

### Bloqueantes del cliente (no se puede avanzar sin esto)

| Tarea | Por qué bloquea |
|-------|-----------------|
| Textos de las 3 políticas legales | No se puede publicar `/politicas/*` sin contenido aprobado |
| Organigrama institucional | Ítem rojo 43 — no hay desarrollo que suplir esto |
| Visión actualizada (la actual dice "2022") | Está visible en la web como error |
| Mínimo 3-5 noticias para lanzamiento | El módulo de noticias necesita contenido para probar y mostrar |
| Correo de notificaciones judiciales | Ítem sin color 31 — puede ser el correo general si no tienen uno específico |

---

## Decisiones tomadas

| Fecha | Decisión | Por qué |
|-------|----------|---------|
| 2026-06-20 | Trazabilidad en archivos separados por tema | Evitar un único .md que crezca sin control y sea difícil de consultar |
| 2026-06-20 | Backend requests en .md por solicitud con fecha | Permite enviarle a la IA del compañero un archivo limpio y con contexto completo |
| 2026-06-20 | Claude no hace push ni merge sin autorización explícita de Camilo | Regla de seguridad del proyecto |

---

## Descartado

| Fecha | Qué se descartó | Por qué |
|-------|-----------------|---------|
| — | — | — |
