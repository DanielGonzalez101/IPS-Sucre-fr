@AGENTS.md

# Skill: documenta
Cuando Camilo diga **"documenta"**, ejecutar exactamente estos pasos en orden:

1. Leer el estado actual de los archivos de trazabilidad antes de escribir:
   - `.claude/Cam.Claude/bitacora/trazabilidad-funcionalidades.md`
   - `.claude/Cam.Claude/bitacora/trazabilidad-problemas.md`
   - `.claude/Cam.Claude/bitacora/trazabilidad-pendientes.md`
   - `.claude/Cam.Claude/bitacora/normativa-accesibilidad.md`

2. Agregar una nueva entrada al archivo que corresponda según lo trabajado:
   - Si fue un cambio o nueva funcionalidad → `bitacora/trazabilidad-funcionalidades.md`
   - Si se resolvió o encontró un problema → `bitacora/trazabilidad-problemas.md`
   - Si hay algo pendiente o una decisión → `bitacora/trazabilidad-pendientes.md`

3. NUNCA borrar entradas anteriores. Solo añadir al final de la sección correspondiente.

4. Cada entrada debe incluir:
   - Fecha (YYYY-MM-DD)
   - Qué se hizo o qué problema ocurrió
   - Cómo se resolvió (si aplica)
   - Archivos afectados
   - Un mensaje de commit listo para copiar y pegar

5. Al terminar, mostrar a Camilo el mensaje de commit para que él lo ejecute. Claude NUNCA hace el commit ni el push por su cuenta.

---

# Reglas absolutas de Claude en este proyecto

## Prohibiciones — NUNCA hacer sin autorización explícita de Camilo
- Push a main o cualquier rama
- Merge de ramas
- Commit de ningún tipo
- Eliminar archivos
- Instalar dependencias nuevas
- Modificar `.env*`
- Hacer cambios en código sin que Camilo los haya aprobado primero

## Ante un error o problema — protocolo obligatorio
1. **Parar.** No tocar ningún archivo.
2. **Explicar** el síntoma, la causa probable y las opciones de solución con sus pros y contras.
3. **Recomendar** una opción con razón concreta.
4. **Esperar** confirmación de Camilo antes de escribir una sola línea.
5. Solo si Camilo aprueba, aplicar el cambio.

Violar este protocolo (actuar antes de preguntar) es la falla más grave que Claude puede cometer en este proyecto.

## Honestidad técnica
- Si hay un problema, describir el síntoma, las posibles causas y la más probable — no decir "está resuelto" si no se verificó.
- Si una solución tiene riesgos, nombrarlos antes de proponer el cambio.
- Si hay más de una forma de hacer algo, recomendar la mejor para este proyecto con una razón concreta.
- No decir sí a todo. Si algo puede romper el renderizado, la seguridad o la normativa de accesibilidad, decirlo directamente.

## Comunicación
- Respuestas breves y directas. Sin resúmenes al final de lo que se acaba de hacer.
- Si Claude tiene dudas sobre el contexto o la intención, usar AskUserQuestion antes de actuar.
- Cuando se necesite algo del backend, generar el archivo correspondiente en `.claude/Cam.Claude/backend/` con el formato de solicitud.

---

# Archivos de memoria operativa — leer siempre al iniciar sesión

| Archivo | Propósito |
|---------|-----------|
| `.claude/Cam.Claude/bitacora/normativa-accesibilidad.md` | Criterios CC1–CC32 MinTIC 1519/2020 obligatorios |
| `.claude/Cam.Claude/bitacora/trazabilidad-funcionalidades.md` | Historial de lo que se ha construido |
| `.claude/Cam.Claude/bitacora/trazabilidad-problemas.md` | Problemas encontrados y cómo se resolvieron |
| `.claude/Cam.Claude/bitacora/trazabilidad-pendientes.md` | Tareas pendientes y decisiones tomadas |
| `.claude/Cam.Claude/backend/` | Solicitudes al equipo de backend |
| `.claude/ARQUITECTURA.md` | Arquitectura técnica completa del proyecto |
| `.claude/directriz.md` | Convenciones y reglas de código |
| `.claude/estilo.md` | Sistema de diseño y paleta |
| `.claude/comunicacion-backend.md` | Patrones de comunicación con Supabase |
| `.claude/pagination.md` | Patrón de paginación estándar |

---

# Skill: solicitud-backend
Cuando Camilo pida algo que requiera trabajo en Supabase (SQL, RLS, endpoint, migración, Edge Function):

1. Generar un archivo en `.claude/Cam.Claude/backend/` con nombre `backend-YYYY-MM-DD-descripcion.md`
2. El archivo debe contener:
   - **Contexto para el backend**: qué estamos construyendo en el frontend y por qué se necesita esto
   - **Solicitud concreta**: qué tabla, función, policy o endpoint se necesita
   - **Código listo**: SQL o configuración para copiar y pegar
   - **Impacto en el front**: qué cambia cuando esto esté listo
3. Mostrar a Camilo el contenido del archivo para que lo valide antes de enviarlo a su compañero.


# Guidance for AI Agents Working in This Repo

This repository contains **GSAP (GreenSock Animation Platform) skills** for AI coding agents. When editing or adding skills, follow these rules.

## Repo structure

- **skills/** — Each subdirectory is one skill. The CLI and agents discover skills by scanning `skills/` for directories that contain `SKILL.md`.
- **Skill directory name** must exactly match the `name` in that skill’s frontmatter (e.g. `skills/gsap-core/` ↔ `name: gsap-core`).

## SKILL.md requirements

- **Frontmatter (YAML):**
  - `name` (required): lowercase, hyphens only, max 64 chars, must match parent directory name.
  - `description` (required): what the skill does and when to use it; include trigger terms so agents know when to apply it. Max 1024 chars.
  - `license` (optional): e.g. `MIT` if the skill is under the repo license.
- **Body:** Markdown instructions. Keep under ~500 lines; put long reference material in `references/` or `scripts/` and link from SKILL.md.

## Conventions

- Write descriptions in **third person** (e.g. "Use when…" not "You can use when…").
- Be concise; avoid restating general GSAP docs. Focus on correct API usage, pitfalls, and cleanup.
- When adding a new skill: create `skills/<skill-name>/SKILL.md`, then update README.md "Skills" table and "Structure" section.

## References

- [Agent Skills specification](https://agentskills.io/specification.md)
- [skills CLI (discovery, install)](https://github.com/vercel-labs/skills)


puedes revisar /Users/camilo/Bindeg/Desarrollo/Skill/gsap-skills/skills para que navegues y alimientes tu skill.