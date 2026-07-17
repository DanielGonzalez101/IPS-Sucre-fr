# Análisis Matriz de Cumplimiento — IPS Cardiocentro Pediátrico de Sucre
**Fuente:** `formatoMatrizCumplimiento cardiopedia pagina WEB.xlsx`  
**Formulario:** MinTIC Res. 1519  
**Fecha de análisis:** 2026-07-17  
**Última actualización:** 2026-07-17

---

## Resumen ejecutivo (original)

| Estado (matriz 2022) | Cantidad |
|----------------------|----------|
| ✅ SÍ cumple | 18 |
| ❌ NO cumple | 44 |
| ⚪ N/A (no aplica) | 147 |
| — Sin clasificar | 54 |
| **Total evaluado** | **263** |

---

## Estado actual del proyecto (2026-07-17)

### ✅ Resuelto en esta sesión

| Ítem | Solución |
|------|----------|
| Mapa del sitio (ID 1827) | Página `/mapa-del-sitio` creada y enlazada en footer |
| Entes de vigilancia (IDs 1865–1871) | Componente `EntesVigilancia` en `/quienes-somos` con Supersalud, MinSalud y Sec. Salud Sucre |
| Menú PARTICIPA (IDs 1945–1948) | Sección completa construida en `/participa` con mecanismos, documentos, convocatorias, calendario y formulario de inscripción conectado a Supabase |
| Política de seguridad digital (IDs 2067–2068) | Página `/politicas/seguridad-digital` publicada con declaración, medidas técnicas, estado MSPI y canal de reporte |

### ✅ Ya estaba resuelto (antes de esta sesión)

| Ítem | Dónde |
|------|-------|
| Misión y visión (ID 1836) | `/quienes-somos` |
| Organigrama (ID 1838) | `/quienes-somos` |
| Directorio institucional — contacto, dirección, horarios (IDs 1840–1844) | `SedesSection` en home + `/contacto` |
| Footer completo — nombre, redes, teléfono, canales (IDs 1819–1825) | Footer |
| Accesibilidad web — alt, subtítulos, idioma, movimiento (IDs 1807–1814) | Global |
| PQRSD completo — 19 campos + validación + radicado + adjuntos + seguimiento (IDs 2045–2066) | `/pqrs` y `/pqrs/consulta` |
| Noticias (ID 2066) | `/noticias` |

---

## Pendiente de nosotros (técnico)

| Ítem | Detalle |
|------|---------|
| **Variables de entorno reCAPTCHA** | Agregar `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` y `RECAPTCHA_SECRET_KEY` al `.env` de producción — obtener en google.com/recaptcha (tipo v3) |

---

## Pendiente del cliente (contenido que debe suministrar la IPS)

| Ítem | Categoría | Archivo de solicitud |
|------|-----------|----------------------|
| Funciones y deberes institucionales | 3.1 | `solicitud-contenido-cliente-2026-07-17.md` |
| Organigrama actualizado | 3.2 | `solicitud-contenido-cliente-2026-07-17.md` |
| Mapa y cartas descriptivas de procesos | 3.3 | `solicitud-contenido-cliente-2026-07-17.md` |
| Protocolos de atención al usuario | 3.8 | `solicitud-contenido-cliente-2026-07-17.md` |
| Normativa aplicable (llenar `/normativa`) | 3.8 / 4 | `solicitud-contenido-cliente-2026-07-17.md` |
| PDFs de Participa (PAAC, Política PPS, Estrategia rendición de cuentas, Informes PPSS 2024–2025) | 8 | `solicitud-contenido-participa-cliente-2026-07-17.md` |

---

## Ítems descartados / no aplican

| ID | Ítem | Razón |
|----|------|-------|
| 1884–1886 | Proyectos de normas para comentarios / SUCOP | Solo aplica a entidades públicas — IPS privada |
| 2069 | Reporte de incidentes a Supersalud | Observación original: no hubo incidentes — cumple por omisión |

---

## Páginas del proyecto — estado final

| Ruta | Estado |
|------|--------|
| `/` | ✅ |
| `/quienes-somos` | ✅ Completa + entes de vigilancia |
| `/servicios` | ✅ |
| `/equipo` | ✅ |
| `/noticias` | ✅ |
| `/normativa` | ⚠️ Stub — esperando contenido del cliente |
| `/calidad` | ✅ |
| `/multimedia/galeria` | ✅ |
| `/participa` | ✅ Completa — conectada a Supabase |
| `/pqrs` | ✅ Formulario completo |
| `/pqrs/consulta` | ✅ |
| `/contacto` | ✅ |
| `/mapa-del-sitio` | ✅ Nuevo |
| `/politicas/privacidad` | ✅ |
| `/politicas/terminos-y-condiciones` | ✅ |
| `/politicas/derechos-de-autor` | ✅ |
| `/politicas/seguridad-digital` | ✅ Nuevo |

---

*Fuente: `formatoMatrizCumplimiento cardiopedia pagina WEB.xlsx` — MinTIC Res. 1519*
