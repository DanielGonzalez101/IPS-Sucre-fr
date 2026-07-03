# Trazabilidad — Funcionalidades y Cambios

Registro de todo lo que se construye, modifica o elimina en el proyecto.
Cada entrada se agrega con el comando "documenta" — nunca se borra, solo se añade.

---

## Formato de entrada

```
### [YYYY-MM-DD] — Título del cambio
**Tipo:** Nueva funcionalidad | Modificación | Eliminación | Refactor
**Archivos afectados:** ruta/al/archivo.ts, otro/archivo.tsx
**Descripción:** Qué se hizo y por qué.
**Commit sugerido:** mensaje del commit
```

---

## Registro

### [2026-06-20] — Inicialización del sistema de trazabilidad Cam.Claude
**Tipo:** Nueva funcionalidad
**Archivos afectados:**
- `.claude/Cam.Claude/trazabilidad-funcionalidades.md` (este archivo)
- `.claude/Cam.Claude/trazabilidad-problemas.md`
- `.claude/Cam.Claude/trazabilidad-pendientes.md`
- `.claude/Cam.Claude/normativa-accesibilidad.md`
- `.claude/Cam.Claude/backend/` (carpeta)
- `CLAUDE.md` (skill documenta)

**Descripción:** Se construyó el sistema completo de trazabilidad y memoria operativa del proyecto. Incluye archivos separados por tema, skill de documentación, normativa de accesibilidad extraída de la Resolución MinTIC 1519/2020, y estructura de comunicación con el equipo de backend.

**Commit sugerido:**
```
git add .claude/Cam.Claude/ CLAUDE.md
git commit -m "feat: inicializar sistema de trazabilidad Cam.Claude con normativa y skill documenta"
```

---

### [2026-06-21] — Construcción completa de la página de inicio
**Tipo:** Nueva funcionalidad
**Archivos afectados:**
- `src/app/(public)/page.tsx` — ensamblaje de la home con 7 secciones
- `src/app/globals.css` — paleta completa, tokens de diseño, `.nav-link`, skip-to-content, prefers-reduced-motion
- `src/app/layout.tsx` — fuentes Montserrat + Raleway vía next/font, skip-to-content link, metadata completa
- `src/lib/gsap.ts` — registro global de GSAP + ScrollTrigger
- `src/components/home/HeroSection.tsx` — sección hero con animaciones GSAP, pills de servicios, 2 CTAs
- `src/components/home/StatsSection.tsx` — contador animado: 10.000+ pacientes, 16 años, 40.000+ procedimientos, 19 especialistas
- `src/components/home/ServicesSection.tsx` — grid 10 servicios con stagger GSAP + ScrollTrigger
- `src/components/home/TeamSection.tsx` — 2 médicos con avatares de iniciales y formación
- `src/components/home/NewsSection.tsx` — 2 tarjetas placeholder "Próximamente" (Noticias + Blog)
- `src/components/home/CTASection.tsx` — sección azul con 3 pills (PQRSD, estado cita, contacto) + tarjeta de contacto
- `src/components/home/SedesSection.tsx` — 3 sedes con selector interactivo + iframe Google Maps
- `src/components/public/Header.tsx` — reescritura como Server Component puro con top bar + nav sticky
- `src/components/public/Footer.tsx` — 4 columnas: marca/horario, contacto, enlaces, info legal

**Descripción:**
Home page completa siguiendo la guía de estilo UX/UI de Cardiopedia y la guía de animaciones GSAP. Todas las secciones usan `"use client"` con `useGSAP` y `ScrollTrigger`. Header reescrito como Server Component puro — hover de nav links resuelto con CSS en `globals.css` (ver trazabilidad-problemas [2026-06-21]). Tailwind v4 con sintaxis canónica: `rounded-(--radius-card)`, `shadow-(--shadow-card-hover)`, `shrink-0`, `aspect-16/10`. Cumple CC1 (skip-to-content), CC18 (prefers-reduced-motion), CC19 (aria-label en formularios/navegación), CC32 (idioma declarado en `<html lang="es">`).

**Commit sugerido:**
```
git add src/app/ src/components/ src/lib/
git commit -m "feat: construir página de inicio completa con 7 secciones, GSAP y diseño Cardiopedia"
```

---

### [2026-06-21] — Rediseño completo del HeroSection a estilo Bento Box + refinamientos UI
**Tipo:** Modificación
**Archivos afectados:**
- `src/components/home/HeroSection.tsx` — rediseño total
- `src/components/public/Header.tsx` — logo real, top bar legible, links actualizados
- `src/app/globals.css` — container-main 1440px, nav-link hover, hero-rating-card curvas invertidas, avatar-stack hover escalonado
- `src/app/layout.tsx` — cambio de tipografía Montserrat → Inter
- `public/images/hero.png` — imagen del equipo copiada a public/

**Descripción:**
Rediseño del HeroSection siguiendo el patrón Bento Box + Soft UI documentado en `.claude/Cam.Claude/frontend/estilo/implentarestilo.md`. Cambios principales:

1. **Layout Bento Box**: Grid `40% / 1fr` (texto izq, imagen der) + 3 tarjetas inferiores (Cardiología, Diagnóstico, Agenda)
2. **Imagen hero**: Foto real del equipo (`public/images/hero.png`) con `fill` + `object-cover`
3. **Tarjeta calificación**: Efecto "inverted border radius" con pseudo-elementos CSS (`::before` / `::after`) y `box-shadow` sólido. Link a Google Maps (`https://maps.app.goo.gl/EPKgTqsSgwadC4Xd8`)
4. **Avatar stack**: 5 fotos reales del personal médico y administrativo superpuestas (52×52px), hover escalonado via CSS (`.avatar-stack:hover .avatar-item:nth-child(n)`), círculo `+15` en rojo marca
5. **Tipografía**: Cambiado a Inter — mejor legibilidad en números y tamaños pequeños (cumple CC5)
6. **Top bar Header**: Texto subido de `text-xs` a `text-sm`, opacidad de `70%` a `85%` (cumple CC5 contraste)
7. **Links top bar**: "Información Pública", "Peticiones y Solicitudes", "Voz Ciudadana"
8. **Logo real**: Reemplazado ícono Heart por `public/logo.png`
9. **Nav links**: Inicio, Quiénes somos, Servicios, Equipo, Multimedia, Calidad, Blog, Contactos, Consulta tu examen
10. **Container-main**: Ampliado de 1200px → 1440px para aprovechar pantallas anchas
11. **Hovers sutiles**: Tarjetas suben con sombra, botones `active:scale-95`, flecha `→` se aleja en `group-hover`
12. **Texto avatar**: "Tu familia en las mejores manos / Especialistas en cardiología pediátrica desde 2009"

**Commit sugerido:**
```
git add src/components/home/HeroSection.tsx src/components/public/Header.tsx src/app/globals.css src/app/layout.tsx public/images/hero.png
git commit -m "feat: rediseñar HeroSection con estilo Bento Box, avatar stack real, logo y refinamientos UI"
```

---

### [2026-06-21] — HeroSection rediseñado a imagen de fondo completa (Opción B)
**Tipo:** Modificación
**Archivos afectados:**
- `src/components/home/HeroSection.tsx` — layout cambiado de grid 40/60 a imagen de fondo full-width
- `src/app/globals.css` — eliminados estilos `.hero-rating-card` con pseudo-elementos (ya no aplican)
- `public/images/hero.png` — reemplazado con `4.png` recortado (espacio azul superior eliminado)

**Descripción:**
Se cambió el layout del HeroSection de grid Bento Box (40%/1fr) a imagen de fondo completa para resolver dos problemas: (1) la foto panorámica 1920×900 se cortaba en pantallas más estrechas, (2) el layout no era responsivo para móvil. Ahora la imagen ocupa el 100% del ancho con `fill` + `object-cover` + `object-top`. Overlay gradiente `azul-900` de 82% a 40% izq→der. Tarjeta 4,8 de Google Maps reubicada como `absolute bottom-6 right-6` con `backdrop-filter: blur`. Botón primario cambiado a rojo para contraste sobre fondo oscuro (CC5). Avatar borders en blanco semitransparente.

**Pendiente:** Efecto inverted border radius en tarjeta de calificación — Camilo lo solicitó, pendiente de definir contra qué color/superficie se aplica en el nuevo contexto.

---

### [2026-06-21] — Hero responsive, gradiente, posición del texto y botón WhatsApp flotante
**Tipo:** Modificación
**Archivos afectados:**
- `src/components/home/HeroSection.tsx` — layout responsive dual (panel móvil / overlay desktop), gradiente más transparente, posición del copy con `container-main`, social proof solo en `lg+`
- `src/components/public/FloatingWhatsApp.tsx` — botón flotante verde con logo SVG, `aria-label`, enlace `wa.me/573009127565`
- `src/app/(public)/layout.tsx` — integración del botón en todas las páginas públicas
- `src/app/globals.css` — clases `.hero-shell`, `.hero-image-wrap`, `.hero-gradient`, `.hero-overlay`, `.hero-copy`, `.hero-social-proof`, `.whatsapp-float` + animación pulse (respeta `prefers-reduced-motion`)

**Descripción:**
Iteración del HeroSection tras feedback de Camilo en sesión del 21-jun:

1. **Posición del texto:** alineado con `container-main` + `margin-left` progresivo (1.25rem tablet → 2rem desktop) para balance entre legibilidad y visibilidad del equipo en el fondo.
2. **Gradiente:** opacidades reducidas (62% → 2%) con `text-shadow` en título y párrafo para mantener contraste (CC5).
3. **Responsive mobile-first:** en `< 768px` la imagen va arriba sin recorte y el contenido en panel azul sólido debajo; en `≥ 768px` overlay sobre la foto; avatares solo en `≥ 1024px`. Botones full-width en móvil.
4. **WhatsApp flotante:** botón fijo `bottom-6 right-6 z-50` en layout público, según guía UX/UI Cardiopedia (`#25D366`, área táctil 56×56px, CC32 operable por teclado).

**Commit sugerido:**
```
git add src/components/home/HeroSection.tsx src/components/public/FloatingWhatsApp.tsx src/app/(public)/layout.tsx src/app/globals.css .claude/Cam.Claude/bitacora/
git commit -m "feat: hero responsive mobile/desktop, gradiente transparente y botón WhatsApp flotante"
```

---

### [2026-06-21] — StatsSection más delgada, etiquetas legibles y marca de agua con logo
**Tipo:** Modificación
**Archivos afectados:**
- `src/components/home/StatsSection.tsx` — padding reducido (`py-8 md:py-10`), labels `text-base sm:text-lg` con opacidad 88%, números ligeramente compactos; eliminado blob SVG circular; añadido logo translúcido con `next/image`
- `public/images/logo-watermark.png` — copia de `Copia de logo-ftr.png` del sitio original

**Descripción:**
Ajustes de la franja de cifras tras feedback de Camilo:

1. **Altura:** sección más delgada verticalmente — padding de `py-16 md:py-24` → `py-8 md:py-10`.
2. **Legibilidad (CC5):** frases descriptivas subidas de `text-sm` (70% opacidad) a `text-base sm:text-lg` (88% opacidad).
3. **Patrón decorativo:** eliminado círculo blanco semitransparente (aspecto genérico). Reemplazado por logo institucional pequeño (~80–96px, `opacity 14%`), centrado verticalmente a la derecha, solo en `md+`. Imagen decorativa con `alt=""` y `aria-hidden` (CC1).

**Commit sugerido:**
```
git add src/components/home/StatsSection.tsx public/images/logo-watermark.png .claude/Cam.Claude/bitacora/
git commit -m "refactor: afinar StatsSection — franja delgada, labels legibles y watermark con logo IPS"
```

---

### [2026-06-21] — HeroSection: ajustes de distribución, blur y opacidad mobile
**Tipo:** Modificación
**Archivos afectados:**
- `src/components/home/HeroSection.tsx` — avatar stack movido dentro del contenedor de botones como elemento sibling; en `≥ 1024px` aparece a la derecha de "Agenda tu cita" con `flex-wrap`; blur del botón reducido (`blur(8px)` → `blur(3px)`, `bg 0.10` → `0.06`); blur del span "de tus hijos" reducido (`blur(6px)` → `blur(2px)`, `bg 0.18` → `0.08`)
- `src/app/globals.css` — `.hero-overlay` mobile más transparente (`azul-900` al `0.50/0.42`); `.hero-copy` max-width ampliado en tablet (`26rem` → `34rem`) y desktop (`29rem` → `38rem`); `.hero-social-proof` visible desde `1024px`

**Descripción:**
Iteración de distribución responsive del hero. En dimensiones intermedias (~1000-1400px) el avatar stack y el texto "Tu familia en las mejores manos" aparecían apilados y cortados debajo de los botones. Solución: el social proof vive dentro del mismo `flex-wrap` que los botones — cuando hay ancho suficiente (`≥ lg`) se ubica a la derecha de "Agenda tu cita", separado por una línea vertical semitransparente. Cuando no cabe, baja solo por `flex-wrap`. Además se redujo el blur decorativo del hero para dar más transparencia visual sin sacrificar legibilidad (CC5).

**Commit sugerido:**
```
git add src/components/home/HeroSection.tsx src/app/globals.css .claude/Cam.Claude/bitacora/
git commit -m "refactor: hero responsive — social proof junto a botones, blur reducido y overlay más transparente"
```

---

### [2026-06-22] — ServicesSection: rediseño completo con iconos médicos y pop-out del doctor
**Tipo:** Modificación
**Archivos afectados:**
- `src/components/home/ServicesSection.tsx`
- `src/app/globals.css`
- `public/personal Medico/Gemini_Generated_Image_iohtubiohtubioht.png` — imagen nueva con fondo transparente

**Descripción:**
1. Grid reducido de 10 a 8 servicios (2×4) para eliminar fila desbalanceada.
2. Iconos médicos reemplazados — `lucide-react` → `@phosphor-icons/react` con `Stethoscope`, `Heartbeat`, `Pulse`, `Timer`, `Gauge`, `Waves`, `DropHalf`, `FirstAid` (weight="duotone").
3. Doctor pop-out: imagen nueva 1728×2432px con fondo transparente (PNG RGBA), posición `absolute bottom-0 right-2%`, altura `145%` del contenedor para que sobresalga por arriba.
4. Glow orgánico detrás del doctor: `::before` con `radial-gradient` + `filter: blur(80px)`.
5. Fondo del wrapper cambiado de `gris-50` → `azul-50` + `box-shadow` azulado sutil para diferenciarlo del fondo blanco de la página.
6. Responsive: móvil/tablet (< 1024px) → 2 columnas, doctor oculto, contenido 100% ancho. Desktop (≥ 1024px) → 4 columnas, doctor visible, contenido al 62%.
7. Flechas de tarjetas vuelven a `backgroundColor: gris-100` tras feedback de Camilo.

**Commit sugerido:**
```
git add src/components/home/ServicesSection.tsx src/app/globals.css
git commit -m "feat: rediseñar ServicesSection — iconos Phosphor, doctor pop-out, grid 4x2, responsive completo"
```

---

### [2026-06-22] — BentoCtaRow: fila de beneficios + horario
**Tipo:** Nueva funcionalidad
**Archivos afectados:**
- `src/components/home/BentoCtaRow.tsx` — nuevo componente
- `src/app/(public)/page.tsx` — importado entre ServicesSection y TeamSection
- `src/app/globals.css` — estilos `.bento-cta-*`
- `public/images/bgelectro.png` — imagen copiada desde `.claude/Cam.Claude/frontend/`

**Descripción:**
Sección entre ServicesSection y TeamSection con dos columnas: izquierda imagen `bgelectro.png` + tarjeta de horario de atención (Lun–Vie / Sábados), derecha título "Su bienestar..." + 4 beneficios en grid 2×2 (CalendarCheck, Stethoscope, Handshake, Cpu). Diseño Bento Box con `border-radius: 24px`. Responsive: 1 col móvil → 2 col desktop (35fr/65fr). Contenido extraído del `inicio.md` real del sitio para no repetir información del hero.

**Commit sugerido:**
```
git add src/components/home/BentoCtaRow.tsx src/app/(public)/page.tsx src/app/globals.css public/images/bgelectro.png
git commit -m "feat: añadir BentoCtaRow con horario de atención y 4 beneficios institucionales"
```

---

### [2026-06-22] — TeamSection: carrusel de personal sobre fondo ECG
**Tipo:** Modificación completa
**Archivos afectados:**
- `src/components/home/TeamSection.tsx` — reescritura total
- `src/app/globals.css` — estilos `.team-*`

**Descripción:**
Rediseño completo del TeamSection:

1. **Carrusel full-bleed**: overflow-x scroll que llega a los bordes de pantalla con `padding-inline` + `margin-inline` negativos compensados por breakpoint.
2. **6 personas**: Dra. Alicia Llach, Dr. Leandro Ruiz, Mileinis Tilano, Julieth Contreras, José Quintero, Maura López. Array duplicado para masa visual mientras se añaden más fotos.
3. **Fondo innovador**: `azul-900` + patrón de puntos CSS `::before` (radial-gradient 28px) + SVG de trazado ECG en rojo semitransparente cruzando horizontalmente.
4. **Tarjetas glass**: `background rgba(255,255,255,0.02)`, `backdrop-filter blur(3px)`, borde semitransparente. Altura fija `460px`, imagen `400px absolute bottom-0`.
5. **Hover CSS puro** (migrado desde GSAP tras bug de estado atascado): panel `translateY(100%)→0` con `cubic-bezier(0.22,1,0.36,1)`, botón ↗ rojo con efecto elástico `cubic-bezier(0.34,1.56,0.64,1)`, texto base se oculta con `opacity:0`.
6. **Formación académica**: visible en panel hover para Dra. Alicia y Dr. Leandro (los únicos con INFO.txt completo).
7. **Imagen Dra. Alicia**: cambiada de `doctor-2.jpg` a `doctor2.png` (con fondo removido).
8. **CTA**: botón rojo "Conocer todo el equipo" → `/equipo`.
9. **Chip de especialidad en rojo**: `background rgba(238,53,56,0.18)`, `color rojo-400`.
10. **Orden en card**: nombre arriba, chip rojo abajo (reordenado por indicación de Camilo).

**Commit sugerido:**
```
git add src/components/home/TeamSection.tsx src/app/globals.css
git commit -m "feat: rediseñar TeamSection — carrusel full-bleed, fondo ECG, glass cards, hover CSS puro"
```

---

### [2026-06-21] — StatsSection: reemplazo de logo watermark por logo-ftr claro
**Tipo:** Modificación
**Archivos afectados:**
- `public/images/logo-watermark.png` — reemplazado con `.claude/Cam.Claude/frontend/Imag_pag_original/Copia de logo-ftr.png` (logo blanco/claro del footer)
- `src/components/home/StatsSection.tsx` — tamaño del logo subido de `96px` a `160px` (`w-40 h-40`); opacidad ajustada de `0.14` a `0.12` para compensar mayor visibilidad del logo claro

**Descripción:**
El logo anterior (`logo-watermark.png`) era oscuro y no se apreciaba bien sobre el fondo azul-900 de la StatsSection. Camilo identificó que el logo del footer (`Copia de logo-ftr.png`) es de trazo claro/blanco y funciona mejor como patrón decorativo translúcido. Se usa también como referencia de identidad visual para futuros patrones decorativos en secciones de fondo oscuro.

**Decisión de diseño:** Para fondos oscuros (`azul-900`, `azul-800`) usar siempre la variante clara del logo (`logo-ftr`). Para fondos claros, usar la variante oscura.

**Commit sugerido:**
```
git add public/images/logo-watermark.png src/components/home/StatsSection.tsx .claude/Cam.Claude/bitacora/
git commit -m "refactor: watermark StatsSection — logo-ftr claro reemplaza logo oscuro, tamaño 160px"
```

---

### [2026-06-22] — TeamSection: refinamiento del panel hover + auto-scroll
**Tipo:** Modificación
**Archivos afectados:**
- `src/components/home/TeamSection.tsx`
- `src/app/globals.css`

**Descripción:**
1. **Fondo panel hover más transparente**: `rgba(6,36,77,0.88)` → `rgba(6,36,77,0.60)`, blur intacto.
2. **Textos más grandes** (accesibilidad personas mayores): chip `0.72→0.8rem`, nombre `1.2→1.35rem`, rol `0.85→0.95rem`, formación `0.8→0.88rem`.
3. **Botón "Ver perfil" eliminado** del panel hover — en cards con poca info el botón se perdía fuera del panel.
4. **Contenido anclado abajo**: `justify-content: flex-start` → `flex-end`, panel `height: 58%` → `height: auto` para que no quede espacio vacío en cards con poco contenido.
5. **Chip rojo eliminado del panel hover**: queda solo en el estado normal (sin hover), evitando repetición.
6. **Auto-scroll CSS infinito**: carrusel manual reemplazado por animación `@keyframes team-scroll` (`translateX(0) → translateX(-50%)`). Velocidad final: 80s por ciclo. Se pausa al hacer hover. Fade en bordes con `mask-image`.
7. **Estructura JSX**: cards envueltas en `.team-track` (flex row, `width: max-content`). Animación GSAP de entrada por card reemplazada por fade-in del carrusel completo.

**Commit sugerido:**
```
git add src/components/home/TeamSection.tsx src/app/globals.css
git commit -m "feat: TeamSection — panel hover refinado, auto-scroll CSS infinito, textos accesibles"
```

---

### [2026-06-22] — SedesSection: rediseño de cards + bloqueo CTASection + footer legible
**Tipo:** Modificación
**Archivos afectados:**
- `src/components/home/SedesSection.tsx` — cards rediseñadas: fondo azul-900 activo con escala, ícono en contenedor, tipografía `text-lg` ciudad / `text-sm` detalle, badge "Activa" en rojo, sin border-l-4
- `src/app/(public)/page.tsx` — CTASection comentada (`{/* <CTASection /> */}`)
- `src/components/public/Footer.tsx` — todos los `text-xs` subidos a `text-sm`

**Descripción:**
1. **Cards sedes**: eliminado el patrón genérico `border-l-4`. Rediseño con card activa en `azul-900` + sombra pronunciada + `scale(1.02)`. Ciudad en `text-lg bold`, detalles en `text-sm`. Badge rojo "Activa" en esquina superior derecha. Íconos en contenedor cuadrado redondeado.
2. **CTASection bloqueada**: sección "Tu voz nos importa" comentada en `page.tsx`. El componente `CTASection.tsx` no se elimina — solo se oculta hasta que el contenido esté listo.
3. **Footer**: tipografía subida de `text-xs` (12px) a `text-sm` (14px) en todos los textos para cumplir CC5 de legibilidad.

**Pendiente:** URLs de Google Maps embed para Carmen de Bolívar y Magangué — sin esto no se puede activar el cambio de mapa con animación al hacer click.

**Commit sugerido:**
```
git add src/components/home/SedesSection.tsx src/app/(public)/page.tsx src/components/public/Footer.tsx .claude/Cam.Claude/bitacora/
git commit -m "refactor: sedes cards rediseño, CTASection bloqueada, footer text-sm"
```

---

### [2026-06-22] — NewsSection: rediseño completo estilo publicaciones
**Tipo:** Modificación completa
**Archivos afectados:**
- `src/components/home/NewsSection.tsx`
- `src/app/globals.css`
- `public/images/bgecocardio.png` — copiada desde `.claude/Cam.Claude/frontend/`
- `public/images/bgholter.png` — copiada desde `.claude/Cam.Claude/frontend/`
- `public/images/bgmamografia.png` — copiada desde `.claude/Cam.Claude/frontend/`

**Descripción:**
Rediseño completo del placeholder anterior. Nuevo diseño inspirado en referencia de clínica rusa:
- Header: chip rojo `+ Noticias` + título bold a la izquierda, botones `←` `→` circulares funcionales a la derecha
- Grid 3 columnas (2 tablet, 1 móvil), cards con imagen 260px arriba, tag azul, título, extracto, footer con "Leer más ↗" + fecha + ojo + vistas
- Datos de ejemplo con 3 noticias placeholder hasta integración con Supabase
- Tamaños accesibles para adultos mayores: tag `0.875rem`, título `1.15rem`, extracto `1rem`, "Leer más" `1rem`, meta `0.9rem`

**Commit sugerido:**
```
git add src/components/home/NewsSection.tsx src/app/globals.css public/images/bgecocardio.png public/images/bgholter.png public/images/bgmamografia.png
git commit -m "feat: rediseñar NewsSection — grid 3 cols, imagen 260px, botones nav, textos accesibles"
```

---

### [2026-06-22] — CTASection PQRSD: rediseño creativo "Tu voz nos importa"
**Tipo:** Modificación completa
**Archivos afectados:**
- `src/components/home/CTASection.tsx`
- `src/app/globals.css`

**Descripción:**
Reemplazo del diseño genérico (card blanca flotante + texto azul) por una sección de impacto visual:
- Fondo `azul-900` con patrón de puntos CSS (coherente con TeamSection)
- `?` tipográfico gigante (`clamp(200px,22vw,340px)`) en rojo semitransparente como elemento decorativo de fondo
- Layout asimétrico: izquierda — chip PQRSD + título "Tu voz / nos importa." (rojo) + bajada + botón rojo principal
- Derecha — 3 canales (Formulario PQRSD, Consultar estado, Contacto directo) como filas con ícono rojo, título, descripción y flecha animada en hover
- Iconos de `@phosphor-icons/react`: `ChatCircleText`, `MagnifyingGlass`, `Phone`
- Responsive: 1 columna en móvil

**Commit sugerido:**
```
git add src/components/home/CTASection.tsx src/app/globals.css
git commit -m "feat: rediseñar CTASection PQRSD — layout creativo con signo decorativo, canales y fondo azul-900"
```

---
