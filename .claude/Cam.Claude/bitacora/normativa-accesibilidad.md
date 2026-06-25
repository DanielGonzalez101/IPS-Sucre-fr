# Normativa de Accesibilidad Web — Cardiocentro Pediátrico de Sucre

Fuente: Resolución MinTIC 1519 del 2020 — Directrices de Accesibilidad Web (WCAG 2.1 nivel AA)
Obligatorio desde el 1 de enero de 2022 para sujetos obligados del Estado colombiano.

---

## Principios POUR (base de todo)

| Principio | Qué significa en la práctica |
|-----------|------------------------------|
| **Perceptible** | Todo contenido debe poder percibirse por más de un sentido. Imagen = alt text. Video = subtítulos. |
| **Operable** | Toda la interfaz debe funcionar con teclado, no solo con mouse. Foco visible, orden de tabulación lógico. |
| **Comprensible** | Lenguaje claro. Instrucciones expresas. Errores de formulario descriptivos. Idioma declarado en `<html lang="es">`. |
| **Robusto** | El HTML debe ser semánticamente correcto para que los lectores de pantalla lo interpreten bien. |

---

## Criterios de Cumplimiento (CC1–CC32) — Nivel AA

### Alternativas sensoriales
| ID | Regla |
|----|-------|
| CC1 | Toda imagen, ícono o elemento no textual debe tener `alt` descriptivo del propósito, no del aspecto. |
| CC2 | Videos deben tener subtítulos sincronizados (closed caption). Usar LSC para contenido oficial. |
| CC3 | Contenido solo-audio o solo-video debe tener transcripción de guión disponible como texto. |

### Visual
| ID | Regla |
|----|-------|
| CC4 | Textos e imágenes deben escalar hasta 200% sin deformarse ni generar scroll horizontal. |
| CC5 | Contraste mínimo: texto claro sobre fondo oscuro o viceversa. No usar solo color para transmitir información. |
| CC6 | Preferir texto acompañado de imagen ilustrativa cuando sea posible (no obligatorio pero recomendado). |
| CC7 | Elementos con la misma acción deben tener el mismo nombre y apariencia en todo el sitio. |

### Estructura
| ID | Regla |
|----|-------|
| CC8 | Usar encabezados semánticos `<h1>`–`<h6>` y regiones ARIA (`<header>`, `<main>`, `<nav>`, `<footer>`). |
| CC9 | Tablas para datos relacionados (no para layout). Listas para ítems del mismo tipo. |
| CC10 | Incluir enlace "saltar al contenido principal" al inicio de cada página. |
| CC11 | HTML semántico correcto: roles ARIA solo cuando el HTML nativo no es suficiente. |
| CC12 | El sitio debe tener mapa del sitio en footer y `sitemap.xml` para motores de búsqueda. |
| CC13 | Navegación coherente: el menú debe estar en la misma posición en todas las páginas. |

### Secuencia y orden
| ID | Regla |
|----|-------|
| CC14 | El orden visual del contenido debe coincidir con el orden en el DOM. |
| CC15 | Advertencias y mensajes de error deben estar cerca del elemento al que hacen referencia. |
| CC16 | El orden de tabulación (Tab) debe seguir el flujo lógico de lectura. |
| CC17 | El foco del teclado debe ser siempre visible (no eliminar `outline` de CSS sin reemplazarlo). |

### Eventos automáticos
| ID | Regla |
|----|-------|
| CC18 | No reproducir audio automáticamente. Si se reproduce, ofrecer control de pausa/silencio. |
| CC19 | Todo contenido con tiempo límite debe poder pausarse o extenderse. |
| CC20 | Contenido en movimiento o parpadeante debe poder detenerse. |
| CC21 | No actualizar la página automáticamente sin aviso y sin control del usuario. |
| CC22 | No cambiar el contexto al recibir foco (el solo hecho de tabular a un elemento no debe disparar acciones). |

### Etiquetas e instrucciones
| ID | Regla |
|----|-------|
| CC23 | Títulos de páginas y secciones deben ser descriptivos y únicos. |
| CC24 | Campos de formulario deben tener `<label>` asociado, no solo `placeholder`. |
| CC25 | Instrucciones de formulario deben ser claras antes del campo (no solo en el error). |
| CC26 | Los enlaces deben describir su destino. Evitar "clic aquí" o "ver más" sin contexto. |
| CC27 | Declarar el idioma en `<html lang="es">` y cambiar si hay fragmentos en otro idioma. |
| CC28 | Errores de formulario deben identificar el campo afectado y sugerir cómo corregirlo. |
| CC29 | No usar imágenes de texto cuando el mismo efecto puede lograrse con texto real y CSS. |

### Elementos capturables
| ID | Regla |
|----|-------|
| CC30 | Objetos embed, iframes, canvas deben tener alternativa textual accesible. |
| CC31 | Cualquier interacción compleja (modales, dropdowns, acordeones) debe funcionar con teclado. |
| CC32 | Toda la interfaz debe ser 100% operable con teclado. Ninguna acción solo por mouse. |

---

## Obligaciones específicas para el proyecto

1. **`<html lang="es">`** en el root layout — ya en `src/app/layout.tsx`. Verificar en cada despliegue.
2. **Alt text** en todo `<Image>` de Next.js. El prop `alt` es obligatorio, no decorativo.
3. **Contraste** mínimo 4.5:1 para texto normal, 3:1 para texto grande. Revisar paleta de `blue-600` sobre blanco y `gray-*`.
4. **Formularios** (PQRS, contacto): todo campo con `<label>` real, mensajes de error con `role="alert"`.
5. **Navegación por teclado**: verificar que el Sidebar admin y el Header público sean 100% operables sin mouse.
6. **Mapa del sitio**: agregar enlace en Footer y generar `sitemap.xml` con Next.js.
7. **"Saltar al contenido"**: enlace oculto visible al recibir foco al inicio del layout público.
8. **Outline CSS**: no remover `focus:outline-none` sin reemplazar por alternativa visible.

---

## Matriz ITA — Estado real del cumplimiento (Resolución 1519/2020)

Fuente: `MATRIZ_ITA_CONTEXTO_CARDIOPEDIA.md` — 263 ítems evaluados para la IPS.

### Resumen por color

| Color | Significado | Ítems | Acción |
|-------|-------------|-------|--------|
| ROJO | Pendiente de construir (IPS) | 20 | HAY QUE HACERLOS — obligatorios |
| VERDE | Ya se cumplen con el stack | 25 | Verificar en cada despliegue |
| AZUL | Incompletos del proveedor anterior | 5 | Rehacer/completar |
| MORADO | Solo aplica a entidades públicas | 145 | NO implementar |
| Sin color | Evaluar caso por caso | 68 | Ver matriz |

### Ítems ROJOS — Lo que hay que construir (20 ítems críticos)

**Políticas legales** (5 ítems — páginas `/politicas/*`):
- Footer con enlaces a: Términos y condiciones, Política de privacidad (Ley 1581/2012), Política de derechos de autor, Otras políticas
- Páginas editables desde admin, texto lo aprueba el cliente

**Formulario PQRSD** (7 ítems — el más crítico):
- Select de tipo: Petición, Queja/Reclamo, Solicitud de Información, Denuncia, Sugerencia/Propuesta + sección de ayuda con ejemplos
- Campo nombre + checkbox anónimo (solo en Queja/Denuncia) — si anónimo, ocultar identificación
- Select tipo documento (CC, NUIP, CE, NIT, Pasaporte, PPT, Otro) — oculto si anónimo
- Campo número de documento — oculto si anónimo
- Radio de modalidad de respuesta: correo o correspondencia — oculto si anónimo
- Input asunto/objeto
- File upload múltiple (PDF/JPG/PNG, max 5MB, max 3 archivos, MIME validation, bucket `pqrsd-attachments` privado)

**Módulo de Noticias** (1 ítem):
- `/noticias` con paginación, `/noticias/[slug]`, 3 últimas en home, CRUD admin con rich text + alt obligatorio en imagen
- Urgente: el enlace actual devuelve 404

**Seguridad digital** (3 ítems):
- Medidas técnicas: SSL, headers HTTP, RLS, rate limiting (el desarrollador)
- Documentos de política: MSPI, seguridad digital (el cliente redacta, se sube como PDF)

**Organigrama** (1 ítem):
- Sección en `/quienes-somos` — imagen o PDF del organigrama. BLOQUEANTE: cliente debe entregar el archivo.

**Documentos de transparencia** (3 ítems):
- Calendario de actividades, manual de contratación, distribución presupuestal — solo upload de PDFs existentes

### Ítems AZULES — Incompletos del proveedor anterior (5 ítems)

- `alt` obligatorio en todas las imágenes — en el admin el campo no puede guardarse vacío
- Módulo PQRSD completo (el enlace actual no funciona)
- Campos adicionales PQRSD: dirección de correspondencia, teléfono de contacto
- Checkbox de aceptación de condiciones en PQRSD con texto de Ley 1581/2012

### Ítems sin color que SÍ aplican

- Correo de notificaciones judiciales — preguntar al cliente
- Página `/mapa-del-sitio` — ya en la arquitectura
- Sección entes que vigilan en Transparencia (Supersalud)
- Acuse de recibo PQRSD con radicado automático + email de confirmación
- Página `/pqrsd/seguimiento` — ciudadano ingresa radicado y consulta estado

### Lo que el cliente DEBE entregar (bloqueantes)

- Textos de las 3 políticas legales (o aprobación de borradores)
- Organigrama institucional
- Visión actualizada (la actual dice "2022")
- Política de seguridad digital (documento)
- Mínimo 3-5 noticias para el lanzamiento
- Manual de contratación y distribución presupuestal (PDFs ya existen)
- Información de Supersalud para entes que vigilan

---

## Checklist rápido antes de hacer merge

- [ ] Toda imagen nueva tiene `alt` descriptivo (obligatorio — no puede guardarse vacío)
- [ ] Formulario nuevo tiene `<label>` por campo
- [ ] Errores de formulario tienen `role="alert"`
- [ ] Contraste mínimo 4.5:1 verificado
- [ ] Probado con Tab en Chrome/Firefox (100% operable sin mouse)
- [ ] Título de página (`<title>`) único y descriptivo
- [ ] Sin audio/video autoplay sin control
- [ ] reCAPTCHA v3 activo en formularios públicos (PQRSD, contacto)
- [ ] Headers de seguridad en `next.config.ts`

---

*Fuente legal: Resolución MinTIC 1519/2020 — WCAG 2.1 nivel AA obligatorio desde enero 2022.*
*Matriz ITA específica: `.claude/Cam.Claude/MATRIZ_ITA_CONTEXTO_CARDIOPEDIA.md`*
