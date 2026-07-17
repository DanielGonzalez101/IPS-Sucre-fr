# Matriz de Cumplimiento MinTIC Res. 1519/2020
**Entidad:** IPS Cardiocentro Pediátrico de Sucre S.A.S — NIT 900550249  
**Formulario:** Mintic Res. 1519 — Periodo 2022  
**Fuente:** `documentos/formatoMatrizCumplimiento cardiopedia pagina WEB.xlsx`  
**Revisado:** 2026-07-09

---

## Resumen General

| Estado | Cantidad |
|--------|----------|
| ✅ Cumplidas (SI) | 18 |
| ❌ Incumplidas (NO) | 44 |
| — No aplica (N/A) | 147 |
| ⚠️ Sin responder | 54 |
| **Total preguntas** | **263** |

---

## Incumplimientos (NO) — agrupados por categoría

### 2. Identidad Visual / Footer

| ID | Requisito |
|----|-----------|
| 1827 | Enlace para el **mapa del sitio** en el footer |

---

### 3. Información de la Entidad

| ID | Subnivel | Requisito |
|----|----------|-----------|
| 1837 | 3.1 Misión/Visión | **Funciones y deberes** |
| 1839 | 3.3 Procesos | **Mapas y cartas descriptivas de los procesos** |
| 1857 | 3.8 Servicio al público | Servicio al público, normas, formularios y protocolos de atención (general) |
| 1858 | 3.8 Servicio al público | **Normas** |
| 1859 | 3.8 Servicio al público | **Formularios** de atención |
| 1860 | 3.8 Servicio al público | **Protocolos de Atención** |
| 1862 | 3.10 PQRSD | **Mecanismo de presentación directa** de solicitudes, quejas y reclamos |
| 1865 | 3.13 Entes vigilantes | Nombre del ente que vigila |
| 1866 | 3.13 Entes vigilantes | Dirección del ente |
| 1867 | 3.13 Entes vigilantes | Teléfono del ente |
| 1868 | 3.13 Entes vigilantes | E-mail del ente |
| 1869 | 3.13 Entes vigilantes | Enlace al sitio web del ente |
| 1870 | 3.13 Entes vigilantes | Tipo de control (fiscal, regulatorio, etc.) |
| 1871 | 3.13 Entes vigilantes | Mecanismos internos de supervisión y vigilancia |

---

### 4. Normativa

| ID | Subnivel | Requisito |
|----|----------|-----------|
| 1884 | 4.3 Proyectos de normas | Proyectos normativos para comentarios |
| 1885 | 4.3 Proyectos de normas | Comentarios y documento de respuesta |
| 1886 | 4.3 Proyectos de normas | Participación ciudadana en normas vía SUCOP |

> **Nota:** Estos 3 ítems probablemente aplican como N/A para una IPS privada. Verificar con Camilo.

---

### 8. Menú PARTICIPA

| ID | Subnivel | Requisito |
|----|----------|-----------|
| 1945 | 8.2 Estructura | Publicación de temas de interés |
| 1946 | 8.2 Estructura | Caja de herramientas |
| 1947 | 8.2 Estructura | Herramienta de evaluación |
| 1948 | 8.2 Estructura | Divulgar resultados |

> **Nota:** Varios de estos pueden ser N/A para IPS privada. Revisar con Camilo.

---

### 13. PQRSD — Formulario en línea

Todos estos ítems corresponden al formulario de Peticiones, Quejas, Reclamos, Sugerencias y Denuncias. **El formulario actual no existe o no cumple los requisitos mínimos.**

**Condiciones técnicas del sistema:**

| ID | Requisito |
|----|-----------|
| 2045 | Acuse de recibo automático |
| 2046 | Validación de campos |
| 2047 | Mecanismos para evitar SPAM (ej. CAPTCHA) |
| 2048 | Mecanismo de seguimiento en línea |
| 2049 | Mensaje de falla en el sistema |
| 2050 | Integración con el sistema PQRSD de la entidad |
| 2051 | Disponibilidad en dispositivos móviles |

**Campos obligatorios del formulario:**

| ID | Campo |
|----|-------|
| 2054 | Selección de tipo: Petición / Queja / Reclamo / Solicitud / Denuncia / Sugerencia |
| 2055 | Nombre y apellidos, o razón social (o posibilidad de denuncia anónima) |
| 2056 | Tipo de documento de identidad (CC, NUIP, NIT, etc.) |
| 2057 | Número de documento de identidad o NIT |
| 2058 | Modalidad de recepción de respuesta (correo electrónico / dirección postal) |
| 2059 | Correo electrónico |
| 2060 | Dirección de correspondencia (barrio, municipio, país) |
| 2061 | Número de contacto |
| 2062 | Objeto de la PQRSD (descripción) |
| 2063 | Adjuntar documentos o anexos |
| 2064 | Aviso de aceptación de condiciones |
| 2065 | Botón "Enviar" |

---

### 15. Seguridad Digital

| ID | Requisito |
|----|-----------|
| 2067 | Política de seguridad digital e información (MSPI) implementada |
| 2068 | Adopción del Modelo de Seguridad y Privacidad de la Información (MSPI) del MinTIC |
| 2069 | Comunicación de incidentes de seguridad (si los hubo en el último año) |

> **Nota:** Estos ítems son organizacionales/internos, no dependen del desarrollo web directamente.

---

## Sin responder — prioritarios para el sitio web

| ID | Requisito | Prioridad |
|----|-----------|-----------|
| 1811 | Formularios con advertencias e instrucciones multi-canal (colores, asteriscos, ayuda) | Alta |
| 1812 | Navegación por tabulación ordenada y con foco visible | Alta |
| 1829 | **Términos y condiciones** | Alta |
| 1830 | **Política de privacidad y tratamiento de datos personales** | Alta |
| 1831 | Política de derechos de autor sobre contenidos | Media |
| 1832 | Otras políticas normativas aplicables | Media |
| 1834 | Menú de Atención y Servicios a la Ciudadanía | Media |
| 1835 | Menú "Participa" | Baja |

---

## Plan de acción por prioridad

### Prioridad Alta — se puede implementar en el sitio

| # | Qué hacer | Dónde |
|---|-----------|-------|
| 1 | **Formulario PQRSD completo** con todos los campos requeridos (IDs 2045–2065) | Módulo nuevo `/pqrsd` |
| 2 | **Política de privacidad y tratamiento de datos** (Ley 1581/2012 + Res. 1519) | Página `/politica-privacidad` |
| 3 | **Términos y condiciones** del sitio | Página `/terminos-y-condiciones` |
| 4 | **Mapa del sitio** (sitemap HTML) con enlace en el footer | Página `/mapa-del-sitio` |
| 5 | **Accesibilidad**: foco visible por tabulación, instrucciones en formularios | Todos los formularios |

### Prioridad Media — requieren contenido de la entidad

| # | Qué hacer | Dónde |
|---|-----------|-------|
| 6 | **Entes que vigilan** (Supersalud, DIAN, etc.) con todos sus datos | Sección de transparencia |
| 7 | **Funciones y deberes** de la entidad | Página `/nosotros` o sección dedicada |
| 8 | **Mapas de procesos** (diagramas de flujo de procesos internos) | Sección de transparencia |
| 9 | **Normas, formularios y protocolos de atención** al público | Sección de transparencia |
| 10 | Política de derechos de autor sobre contenidos del sitio | Footer o página de políticas |

### Prioridad Baja — organizacional / posiblemente N/A

| # | Qué hacer |
|---|-----------|
| 11 | Política de seguridad digital (MSPI) — decisión interna de la entidad |
| 12 | Proyectos normativos y SUCOP — verificar si aplica para IPS privada |
| 13 | Menú "Participa" — verificar si aplica para IPS privada |