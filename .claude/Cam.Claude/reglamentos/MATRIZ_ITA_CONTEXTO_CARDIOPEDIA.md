# MATRIZ DE CUMPLIMIENTO ITA — RESOLUCIÓN 1519/2020
## Contexto completo para el desarrollo web de IPS Cardiocentro Pediátrico de Sucre S.A.S.

---

## INFORMACIÓN DEL REPORTE

- **Entidad:** IPS Cardiocentro Pediátrico de Sucre S.A.S.
- **NIT:** 900.550.249-0
- **Tipo de formulario:** MinTIC Resolución 1519 de 2020
- **Periodo:** 2022 (último reporte disponible)
- **Total de ítems en la matriz:** 263
- **Columnas del Excel:** Categoría (Menú Nivel I), Subnivel (Menú Nivel II), Ítem (Menú Nivel II), Explicación, Normatividad, ID Pregunta, Cumplimiento (Sí/No/N/A), Observaciones

---

## LEYENDA DE COLORES

La matriz usa 4 colores de fondo en la columna de ítems para clasificar responsabilidades y estado:

| Color | Código hex | Significado | Cantidad | Implicación para el desarrollo |
|-------|-----------|-------------|----------|-------------------------------|
| ROJO | #FF0000 | **IPS** — Ítems que aplican a la IPS y están pendientes de implementar | 20 | HAY QUE CONSTRUIRLOS en la nueva web. Son obligatorios |
| VERDE | #00B050 | **Completado** — Ítems que ya se cumplen o se pueden cumplir fácilmente | 25 | Ya existen parcialmente o son requisitos técnicos que cumpliremos con el stack elegido |
| AZUL | #0070C0 | **Multi-screen** — Ítems que estaban a cargo del proveedor anterior | 5 | Fueron implementados parcialmente por Multi-screen en la web actual. Hay que rehacer/completar |
| MORADO | #7030A0 | **No Aplica (Solo Gobierno)** — Ítems exclusivos para entidades públicas | 145 | NO hay que implementarlos. La IPS es una entidad privada |
| SIN COLOR | — | Ítems sin clasificar o de contexto general | 68 | Evaluar caso por caso. Muchos son encabezados de sección o ítems que la IPS marcó como N/A en observaciones |

---

## ÍTEMS EN ROJO — IPS (20 ítems)

**Estos son los que HAY QUE CONSTRUIR. Son la columna vertebral del cumplimiento normativo.**

---

### BLOQUE 1: POLÍTICAS LEGALES (5 ítems)

**Fila 33 — Enlace a políticas en el footer**
- **Ítem:** Enlace para vincular a las políticas que hace referencia en el numeral 2.3 (Términos y condiciones, Política de privacidad y tratamiento de datos personales, Política de derechos de autor y/o autorización de uso sobre los contenidos).
- **Qué construir:** Links en el footer a cada política. Actualmente no existen.
- **Página afectada:** Footer (componente global), `/politicas/*`
- **Responsable sugerido:** Camilo (footer) + Edwin (páginas de políticas)

**Fila 34 — Términos y condiciones**
- **Ítem:** Términos y condiciones.
- **Explicación:** Todos los sujetos obligados deberán publicar los términos y condiciones para el uso de todos sus sitios web, plataformas, aplicaciones, trámites y servicios, servicios de pasarela de pago, consulta de acceso a información pública, otros procedimientos.
- **Qué construir:** Página `/politicas/terminos` con contenido editable desde el admin. El texto legal lo redacta o aprueba el cliente.
- **Responsable sugerido:** Cliente (redacción) + Edwin (maquetación) + Daniel (contenido dinámico desde tabla `pages`)

**Fila 35 — Política de privacidad**
- **Ítem:** Política de privacidad y tratamiento de datos personales.
- **Explicación:** Conforme las disposiciones de la Ley 1581 del 2012, y demás instrucciones o disposiciones relacionadas, o aquellas que las modifiquen, adicionen o sustituyan.
- **Normativa:** Ley 1581 de 2012.
- **Qué construir:** Página `/politicas/privacidad`. Debe incluir: responsable del tratamiento, finalidades, derechos del titular (acceso, rectificación, supresión, revocatoria), procedimiento para ejercerlos, vigencia, canal de contacto para datos personales.
- **Responsable sugerido:** Cliente (redacción/aprobación) + Edwin (maquetación)

**Fila 36 — Política de derechos de autor**
- **Ítem:** Política de derechos de autor y/o autorización de uso sobre los contenidos.
- **Explicación:** Deberán incluir el alcance y limitaciones relacionados con el uso de datos, información, contenidos y códigos fuente publicados.
- **Qué construir:** Página `/politicas/derechos-autor`.
- **Responsable sugerido:** Cliente (redacción/aprobación) + Edwin (maquetación)

**Fila 37 — Otras políticas**
- **Ítem:** Otras políticas que correspondan conforme con la normativa vigente.
- **Explicación:** Anexo Técnico 2 de la Resolución 1519 de 2020.
- **Qué construir:** Espacio para políticas adicionales que el cliente necesite agregar en el futuro. Se resuelve con la tabla `documents` del admin (categoría "política").
- **Responsable sugerido:** Daniel (CRUD documentos)

---

### BLOQUE 2: ESTRUCTURA ORGANIZACIONAL (1 ítem)

**Fila 43 — Organigrama**
- **Ítem:** Organigrama.
- **Explicación:** Incluirá, de manera legible, la descripción de la estructura orgánica, y la información de las divisiones o dependencias, extensiones y al menos un correo electrónico de los mismos, informando los nombres, apellido y cargo de la persona que sea responsable.
- **Normativa:** Art. 9, lit a), Ley 1712 de 2014 — Información mínima obligatoria.
- **Qué construir:** Sección dentro de `/quienes-somos` con imagen o PDF descargable del organigrama. Gestionable desde el admin (tabla `documents`, categoría "organigrama").
- **BLOQUEANTE:** El cliente debe proporcionar el organigrama o los datos para diseñarlo.
- **Responsable sugerido:** Cliente (contenido) + Edwin (maquetación) + Daniel (upload PDF)

---

### BLOQUE 3: PLANEACIÓN Y GESTIÓN (3 ítems)

**Fila 68 — Calendario de actividades**
- **Ítem:** Calendario de actividades.
- **Explicación:** El sujeto obligado habilita un calendario de eventos y fechas clave relacionadas con sus procesos misionales.
- **Qué construir:** Sección dentro de `/transparencia` con calendario de actividades institucionales. Puede ser una lista de eventos editables desde el admin o un PDF descargable.
- **Prioridad:** Baja. Se puede lanzar con un documento PDF mientras se evalúa si necesitan un módulo de calendario.
- **Responsable sugerido:** Cliente (contenido) + Edwin (maquetación)

**Fila 101 — Manual de contratación**
- **Ítem:** Manual de contratación, que contiene los procedimientos, lineamientos y políticas en materia de adquisición y compras.
- **Normativa:** Art.11, Lit g), Ley 1712 de 2014. Art.9, Dec. 103 de 2015.
- **Observación del cliente:** "Existe pero no está cargado en la página web."
- **Qué construir:** Solo subir el PDF del manual existente a la sección de Transparencia. No hay desarrollo, solo upload desde el admin.
- **Responsable sugerido:** Cliente (documento) + Daniel (upload)

**Fila 112 — Distribución presupuestal**
- **Ítem:** Distribución presupuestal de proyectos de inversión junto a los indicadores de gestión.
- **Observación del cliente:** "Existe pero no está cargado en la página web."
- **Qué construir:** Igual que el anterior — subir PDF existente a Transparencia.
- **Responsable sugerido:** Cliente (documento) + Daniel (upload)

---

### BLOQUE 4: PQRSD — FORMULARIO (7 ítems)

**Este es el bloque más crítico. El cliente tiene el proceso documentado pero NADA implementado en la web.**

**Fila 259 — Selección de tipo PQRSD**
- **Ítem:** Selección de opción de la PQRSD (Petición, Queja/Reclamo, Solicitud de Información, Denuncia, Sugerencia/Propuesta).
- **Explicación:** Incluir una sección de ayuda, con ejemplos, para que el usuario pueda distinguir cada una de las tipologías de PQRSD.
- **Observación:** "El proceso está documentado, sin embargo, no está implementado en la página web, se procederá a publicar."
- **Qué construir:** Select con 6 opciones + sección de ayuda contextual con definición y ejemplo de cada tipo. Tooltip o acordeón expandible.

**Fila 260 — Nombre/Razón Social + opción anónima**
- **Ítem:** Nombre y Apellidos o Razón Social de la Empresa o posibilidad de presentar queja/denuncia anónima.
- **Explicación:** Indicar la posibilidad de presentar quejas anónimas, para lo cual, se deben indicar las condiciones para aceptarlas conforme con la siguiente normativa: artículo 38 de la Ley 190 de 1995; artículo 69 de la Ley 1437 de 2011.
- **Qué construir:** Campo de texto para nombre + checkbox "Deseo presentar de forma anónima" (solo visible si tipo = Queja o Denuncia). Si es anónimo, ocultar campos de identificación.

**Fila 261 — Tipo de documento de identidad**
- **Ítem:** Tipo de documento de identidad o el de la empresa (Cédula de Ciudadanía, NUIP, Cédula de Extranjería, NIT, Pasaporte, PPT, Otro).
- **Explicación:** Si es anónima no requiere identificación.
- **Qué construir:** Select con las 7 opciones listadas. Oculto si es anónimo.

**Fila 262 — Número de documento**
- **Ítem:** Número de documento de identidad o NIT de la empresa.
- **Qué construir:** Input numérico. Oculto si es anónimo.

**Fila 263 — Modalidad de recepción de respuesta**
- **Ítem:** Modalidad de recepción de la respuesta (correo electrónico, dirección de correspondencia).
- **Explicación:** Indicar si desea recibir la respuesta por correo electrónico o en la dirección de correspondencia. Si es anónima no requiere la información.
- **Qué construir:** Radio buttons: "Correo electrónico" o "Dirección de correspondencia". Oculto si es anónimo.

**Fila 267 — Objeto de la PQRSD**
- **Ítem:** Objeto de la PQRSD.
- **Explicación:** Texto, no se requiere justificación.
- **Qué construir:** Input text para el asunto/objeto.

**Fila 268 — Adjuntar documentos**
- **Ítem:** Adjuntar documentos o anexos.
- **Explicación:** Opción adjuntar documentos.
- **Qué construir:** File input múltiple. Formatos: PDF, JPG, PNG. Máximo 5MB por archivo. Máximo 3 archivos. Validación de MIME type real en servidor. Archivos se almacenan en Supabase Storage bucket `pqrsd-attachments` (privado).

---

### BLOQUE 5: NOTICIAS (1 ítem)

**Fila 271 — Sección de noticias**
- **Ítem:** Sección de noticias.
- **Explicación:** En la página principal, el sujeto obligado publicará las noticias más relevantes para la ciudadanía y los grupos de valor. La información deberá publicarse de acuerdo a las pautas o lineamientos en materia de lenguaje claro, accesibilidad y usabilidad.
- **Normativa:** Anexo técnico 2 — Resolución 1519 de 2020.
- **Observación:** "https://www.cardiopediasucre.com/404.html" — El enlace actual lleva a 404.
- **Qué construir:** Módulo completo de noticias: listado con paginación (`/noticias`), detalle por slug (`/noticias/[slug]`), 3 últimas en el home, CRUD en el admin con editor rich text y upload de imagen con alt obligatorio.

---

### BLOQUE 6: SEGURIDAD DIGITAL — ANEXO 3 (3 ítems)

**Fila 272 — Política de seguridad digital**
- **Ítem:** ¿La entidad ha implementado una política de seguridad digital y de seguridad de la información, de conformidad con el artículo 6 y el Anexo 3 de la Resolución MinTIC 1591 de 2020?
- **Explicación:** Proporcione el enlace o URL correspondiente donde se encuentre alojada la política de seguridad digital.
- **Normativa:** Anexo técnico 3 — Resolución 1519 de 2020.
- **Observación:** "Está en elaboración e implementación."
- **Qué construir:** El desarrollador implementa las medidas técnicas (SSL, headers, RLS, rate limiting). El cliente redacta el documento de política. Se sube como PDF a Transparencia.

**Fila 273 — Adopción del MSPI**
- **Ítem:** ¿La entidad ha adoptado el Modelo de Seguridad y Privacidad de la Información (MSPI), recomendado por la Dirección de Gobierno Digital del MinTIC?
- **Explicación:** Proporcione el enlace o URL correspondiente donde se pueda verificar evidencia de la implementación del MSPI.
- **Observación:** "Está en elaboración e implementación."
- **Qué construir:** Documento del cliente. El desarrollador entrega un informe de las medidas técnicas implementadas como evidencia de cumplimiento.

**Fila 274 — Incidentes de seguridad**
- **Ítem:** En caso de que la entidad haya sufrido algún incidente de seguridad de la información en el último año, ¿ha comunicado los incidentes a la Superintendencia de Industria y Comercio?
- **Observación:** "No se han presentado incidentes en la seguridad de la información en el último año."
- **Qué construir:** Nada técnico. Solo documentar el protocolo de notificación de incidentes. El cliente declara que no ha habido incidentes.

---

## ÍTEMS EN VERDE — COMPLETADOS (25 ítems)

**Estos ya se cumplen total o parcialmente. Al construir con Next.js + Tailwind + buenas prácticas, se resuelven automáticamente.**

---

### ACCESIBILIDAD — ANEXO 1 (8 ítems verdes)

| Fila | Ítem | Cómo se cumple en el nuevo sitio |
|------|------|----------------------------------|
| 13 | Videos con subtítulos y audio descripción | Exigir subtítulos en todo video que el cliente suba. Implementar con `<track>` en HTML5 |
| 14 | Texto mínimo 12pts, contraste, zoom 200% | Tailwind con `text-base` (16px), contraste 4.5:1 en el theme, layout responsive que no se rompe al 200% |
| 15 | Código ordenado, lenguaje de marcado comprensible, estructura de encabezados | HTML5 semántico: `header`, `nav`, `main`, `article`, `section`, `footer`. Jerarquía h1→h2→h3 sin saltos |
| 16 | Formularios con advertencias e instrucciones claras, campos obligatorios señalados | Labels con `htmlFor`, asteriscos + texto en campos obligatorios, `aria-describedby` para errores, no depender solo del color |
| 17 | Navegación por tabulación en orden, resaltando selección | `focus-visible` en Tailwind para todos los interactivos, `tabindex` natural (nunca >0), skip-to-content |
| 18 | Control de contenidos con movimiento y parpadeo | No autoplay en videos/carruseles, botón pausa si hay carrusel, no flashes ni parpadeos |
| 19 | Lenguaje claro en español | Títulos, enlaces, mensajes de error, campos de formularios en español claro. Sin jerga técnica innecesaria |
| 270 | Botón "Enviar" | Botón submit visible y accesible en formulario PQRSD |

### DATOS DE CONTACTO Y FOOTER (5 ítems verdes)

| Fila | Ítem | Cómo se cumple |
|------|------|----------------|
| 24 | Nombre de la entidad | "IPS Cardiocentro Pediátrico de Sucre S.A.S." en footer + dirección Calle 14 No. 17-72, Barrio Ford, Sincelejo, Sucre |
| 25 | Vínculo a redes sociales | Iconos FB + IG en footer y top bar, enlazados a perfiles reales |
| 27 | Teléfono conmutador con prefijo +57 | (+57) 300 912 7565 en footer y contacto |
| 28 | Línea de servicio al ciudadano | WhatsApp (+57) 310 411 4317 |
| 30 | Canales físicos y electrónicos de atención | Dirección + teléfono + email + WhatsApp + redes en footer y contacto |

### INFORMACIÓN INSTITUCIONAL (5 ítems verdes)

| Fila | Ítem | Cómo se cumple |
|------|------|----------------|
| 41 | Misión y visión | Página `/quienes-somos`. Misión actual vigente. Visión necesita actualización (dice "2022") |
| 42 | Funciones y deberes | Página `/quienes-somos` o `/calidad` |
| 45 | Información de contacto institucional | Teléfono, línea de atención, canales — en footer y contacto |
| 46 | Ubicación física | Dirección de sede principal en contacto y footer |
| 47-49 | Dirección con departamento, horarios, datos de contacto por sede | 3 sedes con dirección completa, horario, teléfono, email |

### CONDICIONES TÉCNICAS PQRSD (7 ítems verdes)

| Fila | Ítem | Cómo se cumple |
|------|------|----------------|
| 251 | Validación de campos | Zod schemas + mensajes de error accesibles. "El aviso de error debe ser visible y accesible para todos los usuarios" |
| 252 | Mecanismos para evitar SPAM | reCAPTCHA v3 invisible en formularios PQRSD y contacto |
| 254 | Mensaje de falla en el sistema | Try/catch en la API route. Mensaje: "Lo sentimos, ocurrió un error al enviar su solicitud. Por favor intente nuevamente o contáctenos al (+57) 300 912 7565" |
| 256 | Disponibilidad en dispositivos móviles | Formulario responsive, mobile-first con Tailwind, `inputmode` apropiado (numeric para documento, email para correo) |
| 257 | Seguridad digital | SSL (Vercel), headers de seguridad, RLS, rate limiting, validación server-side |

---

## ÍTEMS EN AZUL — MULTI-SCREEN (5 ítems)

**Estos fueron responsabilidad del proveedor anterior. Algunos están parcialmente implementados, otros hay que rehacer.**

| Fila | Ítem | Estado actual | Qué hacer en la nueva web |
|------|------|--------------|--------------------------|
| 12 | Texto alternativo en imágenes | Parcial — algunas imágenes tienen alt, otras no | Implementar alt obligatorio en todas las imágenes. En el admin, el campo alt es required y no permite guardar sin él |
| 67 | Mecanismo de presentación de PQRSD | Existe un enlace pero no funciona | Construir el módulo PQRSD completo (los 14 ítems del bloque rojo) |
| 265 | Dirección de correspondencia en PQRSD | Documentado pero no implementado | Campos: dirección, barrio/vereda/corregimiento, municipio/distrito, país |
| 266 | Número de contacto en PQRSD | Documentado pero no implementado | Campo de teléfono (numérico, opcional si no es anónimo) |
| 269 | Aviso de aceptación de condiciones | Documentado pero no implementado | Checkbox con leyenda: "Al hacer clic en el botón enviar, usted acepta la remisión de la PQRS a IPS Cardiocentro Pediátrico de Sucre S.A.S. Sus datos serán recolectados y tratados conforme con la Política de Tratamiento de Datos Personales de la entidad conforme a la Ley 1581 de 2012." |

---

## ÍTEMS EN MORADO — NO APLICA / SOLO GOBIERNO (145 ítems)

**Estos NO se implementan. La IPS es una entidad privada.**

Resumen de los bloques que no aplican:

| Categoría | Sub-categoría | Cantidad ítems | Razón de N/A |
|-----------|--------------|----------------|-------------|
| Top Bar GOV.CO | Barra superior GOV.CO | 1 | Solo rama ejecutiva nacional/territorial |
| Footer GOV.CO | Logo Portal Único del Estado | 2 | Solo rama ejecutiva |
| Directorio de servidores públicos | Nombres, formación, salario, contratos | 10 | Solo entidades de naturaleza pública (Decreto 1081/2015) |
| Directorio de agremiaciones | Grupos de interés | 1 | Solo entidades públicas |
| Decisiones que afectan al público | Políticas adoptadas | 1 | Solo entidades públicas |
| Publicación de hojas de vida | Aspirantes a cargos | 1 | Entidad de carácter privado |
| Búsqueda de normas | SUIN, sistema propio | 2 | Solo entidades de orden ejecutivo |
| Proyectos de normas | Normas para comentarios, SUCOP | 3 | Solo entidades públicas |
| Contratación | Plan de adquisiciones, SECOP, ejecución contratos | 9 | Solo entidades públicas |
| Planeación | Presupuesto, ejecución presupuestal, plan de acción, proyectos de inversión, empalme, informes | 20 | Solo entidades públicas |
| Informes de gestión y auditoría | Gestión, rendición de cuentas, contraloría, control interno | 12 | Solo entidades públicas |
| Trámites SUIT | Normatividad, procesos, costos, formularios | 4 | Solo entidades públicas |
| Participa (sub-ítems específicos) | Presupuesto participativo, consulta ciudadana, colaboración e innovación, rendición de cuentas detallada, control social | ~40 | Solo entidades públicas |
| Datos abiertos | Instrumentos de gestión, registros de activos, datos.gov.co | 20 | Solo entidades públicas |
| Información específica grupos | NNA, mujeres, otros | 3 | Solo entidades públicas |
| Normatividad especial | Reportes específicos por naturaleza jurídica | 1 | Solo entidades públicas |
| Información tributaria | Recaudo rentas, ICA | 10 | Solo municipios y distritos |
| Trámites y canales (sección 13) | SUIT, agendar cita | 2 | Solo entidades públicas |

---

## ÍTEMS SIN COLOR — EVALUAR (68 ítems)

**Muchos son encabezados de sección, ítems de contexto, o elementos que la IPS marcó como N/A en sus observaciones. Los relevantes son:**

### Ítems sin color que SÍ hay que considerar:

| Fila | Ítem | Observación del cliente | Acción |
|------|------|------------------------|--------|
| 20 | Documentos (Word, Excel, PDF, PPT) accesibles según Anexo 1 | Sin observación | Los PDFs que suba el cliente deben ser accesibles (texto seleccionable, no imagen escaneada). Incluir en la capacitación |
| 26 | Datos de contacto | Encabezado de sección | Ya cubierto por ítems verdes 27-30 |
| 31 | Correo de notificaciones judiciales | Sin observación | Preguntar al cliente si tienen uno. Si no, puede ser el correo general |
| 32 | Enlace al mapa del sitio | Sin observación | Página `/mapa-del-sitio` — ya incluida en la arquitectura |
| 44 | Mapas y cartas descriptivas de procesos | Sin observación | Si la IPS tiene procesos documentados, se suben como PDF a Transparencia |
| 70-76 | Entes y autoridades que vigilan | "En construcción" | Sección en Transparencia: Superintendencia Nacional de Salud — nombre, dirección, teléfono, email, enlace web, tipo de control |
| 78-86 | Normativa de la entidad | "Políticas documentadas pero no cargadas en la web" | Subir PDFs de políticas, lineamientos y manuales existentes a Transparencia. Solo upload, no desarrollo |
| 139-148 | Menú Participa — descripción general | "RES 2063 PPSS" | Implementar al menos: descripción general, mecanismos de participación, estrategia, canales de interacción |
| 249-250 | Condiciones técnicas PQRSD + acuse de recibo | "Documentado pero no implementado" | Acuse de recibo automático: al enviar, generar mensaje de confirmación con fecha/hora y radicado. Email automático dentro de 24 horas hábiles |
| 253 | Mecanismo de seguimiento en línea | "Documentado pero no implementado" | Página `/pqrsd/seguimiento` donde el ciudadano ingresa su radicado y consulta el estado |
| 255 | Integración PQRSD con sistema interno | "Documentado pero no implementado" | Las solicitudes de información pública deben estar como tipología dentro del sistema PQRSD |
| 258 | Condiciones del formulario | Encabezado | Ya cubierto por los ítems 259-270 |
| 264 | Correo electrónico en formulario PQRSD | "Documentado pero no implementado" | Campo email en el formulario. Si es anónima, no se requiere |

---

## RESUMEN EJECUTIVO PARA EL EQUIPO

### Lo que hay que CONSTRUIR (desarrollo)
- 4 páginas de políticas legales (términos, privacidad, derechos de autor, índice)
- Formulario PQRSD completo con 14 campos + lógica condicional de anónimo
- Sistema de seguimiento PQRSD por radicado
- Módulo de noticias completo (listado, detalle, 3 en home)
- Organigrama en Quiénes Somos
- Enlaces a políticas en el footer
- Sección de entes que vigilan en Transparencia

### Lo que el CLIENTE debe entregar (contenido)
- Textos de las 3 políticas legales (o aprobar borradores que redactemos)
- Organigrama institucional
- Visión actualizada (la actual dice "2022")
- Política de seguridad digital (documento)
- Al menos 3-5 noticias para lanzamiento
- Manual de contratación y distribución presupuestal (PDFs existentes)
- Información de entes que vigilan (Supersalud)

### Lo que se resuelve con el STACK técnico (automático)
- Accesibilidad WCAG 2.1 AA (Tailwind + HTML semántico + buenas prácticas)
- SSL (Vercel automático)
- Validación de formularios (Zod)
- Antispam (reCAPTCHA v3)
- Responsive (Tailwind mobile-first)
- Seguridad de cabeceras HTTP (next.config.ts)
- Mapa del sitio XML (Next.js automático)

### Lo que NO hay que hacer (145 ítems morados)
- Barra GOV.CO
- Directorio de servidores públicos con salarios
- SECOP, SUIN, datos.gov.co
- Presupuestos participativos
- Proyectos normativos para comentarios
- Informes de contraloría
- Trámites SUIT
- Impuestos territoriales
- Y ~130 ítems más exclusivos de entidades públicas
