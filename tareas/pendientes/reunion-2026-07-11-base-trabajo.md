# Base de trabajo — Reunión con cliente (2026-07-11)

Este documento es la referencia de contexto para las sesiones de "corrección de detalles en masa". No se ejecuta nada aquí de forma automática — cada punto se resuelve guiado por Camilo, uno por uno. Contiene el resumen de la reunión + verificación real contra el código (hecha 2026-07-11) para no repetir trabajo ya hecho ni asumir que algo falta cuando ya existe.

Reglas del proyecto que aplican a TODO lo de este documento (ver `CLAUDE.md` / `AGENTS.md`):
- Nada de commit/push/merge/instalación de dependencias sin autorización explícita.
- Ante error: parar, explicar síntoma + causa + opciones, recomendar, esperar aprobación.
- No documentar en la bitácora oficial (`.claude/Cam.Claude/bitacora/`) hasta que Camilo diga "documenta".

---

## Contexto de la reunión

- Proceso de entrega progresivo: se aprueba primero diseño/estilo de la home (colores, tipografía, distribución) antes de continuar con el resto.
- Cliente prefiere **rojo por encima de azul** como color dominante (dato de diseño, tenerlo en cuenta en ajustes visuales).
- Sitio alojado temporalmente en servidor gratuito → limita Google Maps embed. Se habilitará al pasar a servidor definitivo.
- Reunión pendiente esta semana para revisar el módulo administrador con el cliente.
- Reunión exhaustiva normativa punto por punto al final del proceso (PPS, transparencia, MinTIC 1519/2020).

---

## Estado verificado de cada punto (código real, 2026-07-11)

### 1. Servicios — ampliar y reorganizar
**Pedido:** incluir cardiología (pediátrica y adultos), diagnóstico por imágenes, y nuevos servicios (electrofisiología, monitoreo arterial, electrocardiograma, mesa vasculante). Organizar por especialidad y, dentro de cada una, separar consultas vs. procedimientos.

**Estado real:** NO resuelto.
- `src/components/public/servicios/ServiciosGrid.tsx` solo tiene 2 categorías de filtro: `"Cardiología Pediátrica"` y `"Radiología / Diagnóstico"` (línea 8-14 del archivo). No hay "adultos", no hay electrofisiología/monitoreo arterial/ECG/mesa vasculante, no hay separación consultas/procedimientos.
- La categoría es un string plano (`categoria: string`) sin estructura jerárquica — habrá que decidir si se modela como enum/tabla en Supabase (`especialidad` + `tipo: consulta|procedimiento`) o se resuelve solo en frontend con datos ya existentes.
- **Necesita:** el listado de servicios que el cliente se comprometió a enviar (to-do #1 y #2 de la reunión) antes de poder construir la estructura definitiva. Sin ese listado no se puede saber cuántas especialidades/categorías reales existen.

### 2. Botón "Otros servicios"
**Estado real:** NO existe. No hay ninguna referencia a "Otros servicios" en el código (`grep` sin resultados). Se necesita definir dónde vive (¿en `ServiciosGrid` como filtro adicional? ¿sección aparte en home?) — pendiente de decisión de Camilo.

### 3. Renombrar botón de resultados → "Tus resultados"
**Estado real:** el nav tiene un link `/consulta-examen` con label **"Consulta tu examen"** (`Header.tsx:19`). Es probablemente el botón al que se refiere el cliente, pero el texto actual no es "Tus resultados". Falta confirmar si es el mismo botón antes de renombrar (o si es una entrada distinta en el `CTASection`/home).

### 4. Preparación del paciente por servicio
**Estado real:** NO existe. `grep -rl "preparaci"` no devuelve nada en `src/`. La ficha de servicio (`src/app/(public)/servicios/[slug]/page.tsx`, `ServicioCard.tsx`) no tiene campo ni sección de preparación. Se necesita definir si es campo nuevo en Supabase (tabla `servicios`) o contenido estático por servicio.

### 5. Sede "La Fe"
**Estado real:** NO existe. `SedesSection.tsx` recibe `sedes: Sede[]` desde `src/actions/sitio.ts` (dato dinámico de Supabase, no hardcodeado en el componente) — confirmar con backend/admin si ya se puede agregar la sede desde el panel `/gestion-interna/sitio` o si falta soporte.
- Dato adicional: el campo `map_url` de cada sede ya existe en el tipo `Sede` y el componente ya sabe pintar el iframe si `map_url` tiene valor (fallback actual: "Mapa próximamente disponible"). Esto es justo el bloqueante ya conocido del servidor gratuito/Google Maps mencionado en la reunión — coincide con el pendiente ya registrado en `trazabilidad-pendientes.md` (URLs de Google Maps embed para Carmen de Bolívar y Magangué, agregado 2026-06-22). Al agregar "La Fe" habrá que traer también su `map_url`.

### 6. Personal médico dinámico desde BD
**Estado real:** ya existe infraestructura — `/gestion-interna/equipo/humano` en el admin y `EquipoSection.tsx` en público. Falta verificar en detalle si el CRUD desde el panel está completo o solo parcialmente armado (no verificado línea por línea todavía, pendiente de revisión puntual cuando se llegue a ese tema).

### 7. Renombrar "Voz Ciudadana" → "Participación ciudadana"
**Estado real:** confirmado — `Header.tsx:72` dice literalmente `Voz Ciudadana` apuntando a `/participa`. Cambio simple de texto, pero revisar si "Voz Ciudadana" aparece en otros lugares (footer, CTASection) antes de renombrar solo en un sitio.

### 8. Usuarios administradores (ingeniería/sistemas + información/calidad)
**Estado real:** ya existe `/gestion-interna/usuarios` y roles `admin | editor | viewer` en `src/types/index.ts` (según `directriz.md`). Falta verificar si esos 2 roles específicos del cliente mapean a los roles existentes o si se necesitan roles nuevos — pendiente de revisión con Daniel (backend).

### 9. Imágenes institucionales nuevas
**Estado real:** bloqueante de cliente — depende de que Bindeg envíe especificaciones de tamaño y el cliente tome fotos nuevas. No es tarea de código todavía.

---

## Pendientes ya registrados en `trazabilidad-pendientes.md` que se cruzan con esta reunión

- URLs Google Maps embed (Carmen de Bolívar y Magangué) — mismo bloqueante que sede "La Fe" (servidor gratuito).
- Página `/calidad` con datos mock — no mencionado en la reunión pero sigue pendiente.
- Bucket `pqrsd-adjuntos` en Supabase — no mencionado en la reunión pero sigue pendiente y es bloqueante técnico real.

---

## To-do list de la reunión (con dueño y estado)

| # | Tarea | Dueño | Prioridad | Estado |
|---|-------|-------|-----------|--------|
| 1 | Cliente envía listado completo de servicios nuevos por categoría | Cliente → Bindeg | Alta | Bloqueante — sin esto no se puede construir la estructura final de servicios |
| 2 | Cliente envía portafolio de servicios de la IPS | Cliente → Bindeg | Alta | Bloqueante |
| 3 | Aplicar correcciones home: "Tus resultados", "Otros servicios", tarjetas adultos+pediátrico, sede La Fe, "Participación ciudadana" | Bindeg (código) | Alta | Parcialmente accionable ahora — "Participación ciudadana" y el rename de botón se pueden hacer ya; el resto depende de #1/#2 |
| 4 | Habilitar Google Maps en "Estamos cerca de ti" | Bindeg (infra/servidor) | Alta | Bloqueado por hosting temporal |
| 5 | Organizar servicios por especialidad + consultas/procedimientos | Bindeg (código) | Alta | Bloqueante — depende de #1 |
| 6 | Crear 2 usuarios admin (ingeniería/sistemas, información/calidad) | Bindeg/Daniel (backend) | Media | Por verificar contra roles existentes |
| 7 | Reunión esta semana — explicar módulo admin al cliente | Bindeg | Alta | Agendar |
| 8 | Bindeg envía especificaciones de imágenes al cliente | Bindeg → Cliente | Media | Pendiente de envío |
| 9 | Cliente toma fotos nuevas de instalaciones/equipos | Cliente | Media | Bloqueante de cliente |
| 10 | Configurar preparación del paciente por ficha de servicio | Bindeg (código) | Media | Accionable, sin bloqueantes de contenido aparentes (confirmar con Camilo si hay copy de referencia ya disponible) |
| 11 | Reunión exhaustiva normativa final (PPS, transparencia) | Bindeg + Cliente | — | Al final del proceso, no ahora |

---

## Cómo se va a trabajar esto

- Camilo guía parte por parte, en el orden que él defina — no se asume orden de prioridad propio sobre esta lista.
- Antes de tocar código en cada punto: confirmar si aplica la fuente de verdad de estilo real (`.claude/Cam.Claude/frontend/estilo/implentarestilo.md` + `GUIA_ESTILO_UXUI_CARDIOPEDIA (1).md`), no `.claude/estilo.md` (desactualizado).
- Preferencia de marca confirmada por el cliente: **rojo por encima de azul** — tenerlo en cuenta en cualquier ajuste de paleta/jerarquía visual, sin que esto autorice un rediseño no pedido.
- No documentar en `.claude/Cam.Claude/bitacora/` hasta que Camilo diga "documenta" explícitamente.
- No marcar nada de esta lista como "resuelto" sin verificación real en el código (mismo criterio que ya se aplicó para armar este documento).
