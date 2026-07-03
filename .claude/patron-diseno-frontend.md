# Patrón de diseño frontend — Cardiocentro Pediátrico de Sucre

Documento de referencia para mantener coherencia visual en todas las páginas del proyecto.
Empieza con la página de inicio como caso base. Agregar nuevas páginas al final.

---

## 1. Stack tecnológico

| Capa | Tecnología |
|------|-----------|
| Framework | Next.js (App Router) |
| Estilos | Tailwind CSS v4 + clases utilitarias propias en `globals.css` |
| Tipografía | Inter (heading y body) vía `next/font` |
| Íconos | `lucide-react` (UI general) + `@phosphor-icons/react` weight="duotone" (iconos médicos) |
| Imágenes | `next/image` con `fill` + `object-cover` para fondos, dimensiones exactas para elementos decorativos |
| Animaciones | GSAP + ScrollTrigger (`useGSAP` con `scope`) / CSS puro para loops infinitos y hovers |

---

## 2. Tokens de diseño (`globals.css` — `@theme`)

### Paleta

| Token | Hex | Uso principal |
|-------|-----|---------------|
| `--color-azul-50` | `#EEF3FB` | Fondos de cards claras, chips informativos |
| `--color-azul-100` | `#D5E3F5` | Chips de etiqueta, bordes suaves |
| `--color-azul-200` | `#ADC7EB` | Texto sobre fondo azul oscuro |
| `--color-azul-600` | `#1A5CB8` | Acento en chips, gradientes |
| `--color-azul-700` | `#144FA0` | Gradiente de StatsSection |
| `--color-azul-800` | `#08338F` | Color primario de texto de marca, botones secundarios |
| `--color-azul-900` | `#06244D` | Fondos oscuros (StatsSection, TeamSection, CTASection) |
| `--color-rojo-400` | `#F15759` | Texto sobre fondo oscuro, chips de especialidad |
| `--color-rojo-500` | `#EE3538` | CTA primario, badges, iconos de acción |
| `--color-rojo-600` | `#D42E31` | Hover del botón rojo |
| `--color-gris-50` | `#F9F9FA` | Fondo base de la página, bento cards claras |
| `--color-gris-100` | `#F1F2F4` | Separadores, fondos de flecha en service cards |
| `--color-gris-500` | `#6B7280` | Texto secundario, metadatos |
| `--color-gris-700` | `#374151` | Texto cuerpo sobre fondo blanco |
| `--color-gris-800` | `#1F2937` | Color de texto base del `<body>` |

**Regla de contraste (CC5):** fondos oscuros (`azul-900`, `azul-800`) → usar logo variante clara (`logo-ftr`). Fondos claros → variante oscura.

### Radios y sombras

| Token | Valor | Uso |
|-------|-------|-----|
| `--radius-card` | `1rem` | Cards genéricas (`rounded-(--radius-card)`) |
| `--shadow-card` | sombra sutil | Cards en reposo |
| `--shadow-card-hover` | sombra pronunciada | Cards en hover |
| `--shadow-button` | sombra azulada | Botones primarios |

Radios especiales: `28px` (bento cards grandes, wrappers de sección), `16px` (cards de servicios, `bento-schedule`), `999px` (chips pill), `10px–12px` (contenedores de íconos).

---

## 3. Tipografía

```
font-family: Inter (heading y body — mismo font, distintos pesos)

Títulos de sección (h2):  font-bold, text-3xl md:text-4xl, color azul-900
Título hero (h1):         font-bold, clamp(1.65rem, 4.2vw, 3.8rem), color white, text-shadow
Subtítulo hero:           text-sm sm:text-base md:text-lg, font-weight 500
Labels de stats:          text-base sm:text-lg, rgba(255,255,255,0.88)
Números de stats:         font-black, text-3xl sm:text-4xl md:text-[2.75rem]
Card title:               font-semibold sm:font-bold, text-sm sm:text-base, color azul-900
Card body:                text-sm, color gris-600 o gris-700
Chips:                    font-semibold, text-sm, color contextual
Footer / metadatos:       text-sm (mínimo — norma CC5)
```

**Nunca usar menos de `text-sm` (14px) en contenido visible.** Los `text-xs` solo aplican en elementos ornamentales o labels de complemento donde el contexto ya es suficiente.

---

## 4. Layout y container

```css
/* globals.css */
.container-main {
  width: 100%;
  max-width: 1440px;
  margin-inline: auto;
  padding-inline: clamp(1rem, 4vw, 5rem);
}
```

Las secciones usan `py-16 md:py-24` como espaciado vertical estándar. Excepciones: `StatsSection` usa `py-8 md:py-10` (franja delgada), `BentoCtaRow` usa `pb-16`.

---

## 5. Patrón de sección — estructura base

Cada sección sigue este esquema:

```tsx
<section ref={sectionRef} className="py-16 md:py-24" aria-labelledby="section-title">
  <div className="container-main">
    {/* Chip de etiqueta */}
    <span className="chip-pill">+ Etiqueta</span>

    {/* Título */}
    <h2 id="section-title" className="font-heading font-bold text-3xl md:text-4xl" style={{ color: "var(--color-azul-900)" }}>
      Título de la sección
    </h2>

    {/* Contenido */}
  </div>
</section>
```

**Chip de etiqueta:** `inline-flex items-center gap-1.5`, `font-semibold text-sm`, `px-4 py-1.5`, `borderRadius: 999px`. Colores: azul claro (`azul-100` bg / `azul-800` text) para secciones sobre blanco; rojo semitransparente (`rgba(238,53,56,0.18)` bg / `rojo-400` text) para secciones sobre azul oscuro.

---

## 6. Animaciones — reglas generales

### GSAP (entrada al scroll)
- Siempre dentro de `useGSAP({ scope: ref })`.
- Verificar `prefers-reduced-motion` antes de animar — si está activo, aplicar estado final sin transición.
- Patrón estándar de entrada: `gsap.set(target, { opacity: 0, y: 24–32 })` → `gsap.to(target, { opacity: 1, y: 0, duration: 0.5–0.65, ease: "power3.out", stagger: 0.07–0.12 })`.
- `ScrollTrigger.start`: `"top 80%"` heading principal, `"top 85%"` cards, `"top 82%"` grids.

### CSS puro (loops / hovers)
- Carruseles infinitos: `@keyframes` con `translateX(0) → translateX(-50%)` sobre un track duplicado. Pausa en `:hover` con `animation-play-state: paused`.
- Hovers de panel: `transition` + `cubic-bezier(0.22,1,0.36,1)` (panel suave), `cubic-bezier(0.34,1.56,0.64,1)` (botón elástico).
- Avatar stack: nth-child escalonado con `transition-delay` incremental de 40ms.

### Convención
- GSAP para entradas al scroll y microinteracciones hover en cards.
- CSS puro para estado persistente (loops, hover panels) — evita bugs de estado atascado con GSAP en carruseles.

---

## 7. Página de inicio — secciones en orden

### 7.1 Header

**Archivo:** `src/components/public/Header.tsx` (Server Component puro)

```
Estructura:
  ┌─────────────────────────────────────────────────┐
  │ Top bar (azul-900) — contacto + links normativos │
  ├─────────────────────────────────────────────────┤
  │ Nav sticky — logo | links | CTA "Agenda tu cita" │
  └─────────────────────────────────────────────────┘
```

- Top bar: `hidden md:block`, `text-sm`, `text-white/85`. Links: Información Pública, Peticiones y Solicitudes, Voz Ciudadana.
- Nav: logo `public/logo.png`, links con clase `.nav-link` (hover manejado en CSS, no JS — el componente es Server).
- Hover nav: `.nav-link:hover { color: azul-800; background-color: azul-50; }` — definido en `globals.css`.
- WhatsApp flotante (`FloatingWhatsApp.tsx`): `fixed bottom-6 right-6 z-50`, 56×56px, `#25D366`, pulsación CSS animada.

---

### 7.2 HeroSection

**Archivo:** `src/components/home/HeroSection.tsx` — `"use client"`  
**Datos:** slides desde Supabase (`hero_slides`). Fallback estático si la tabla falla.

```
Estructura visual:
  ┌──────────────────────────────────────────┐
  │  Imagen de fondo (fill + object-cover)   │
  │  Gradiente: 62% → 2% izq→der azul-900   │
  │                                           │
  │  Overlay (hero-copy):                    │
  │  [Badge pill]                             │
  │  H1 — clamp(1.65rem, 4.2vw, 3.8rem)     │
  │  Párrafo subtítulo                        │
  │  [Btn rojo] [Btn glass] | avatar stack   │
  │  Dots de progreso (solo multiSlide)       │
  │                               [Card 4.8★]│
  └──────────────────────────────────────────┘
  ┌──────────────────────────────────────────┐
  │  Fila bento (gris-50):                   │
  │  [Cardiología] [Diagnóstico] [Agenda]    │
  └──────────────────────────────────────────┘
```

**Transición de slides:** CSS `@keyframes slideOutLeft` / `slideInRight`, 700ms, `cubic-bezier(0.4,0,0.2,1)`. Auto-avance cada 6000ms con barra de progreso. Se pausa en `mouseenter`.

**Responsive:**
- Mobile (< 768px): imagen 260px alto, overlay con `background azul-900/50` sólido debajo del fold.
- Tablet (≥ 768px): overlay sobre foto, 480px alto.
- Desktop (≥ 1024px): overlay completo, 711px alto, avatar stack visible.

**Fila bento — 3 cards:**
1. Cardiología Pediátrica: fondo `gris-50`, imagen `3.png` que desborda (140% × 140%).
2. Diagnóstico por Imágenes: fondo `gradiente azul-900→azul-700`, chips pill con variantes de opacidad.
3. Agenda tu cita: fondo `azul-50`, ícono rojo en contenedor `12px border-radius`.

**Tarjeta Google Maps:** `position: absolute bottom-0 right-0`, `hero-rating-card` con `border-top-left-radius: 28px`. Solo visible en `md+`.

---

### 7.3 StatsSection

**Archivo:** `src/components/home/StatsSection.tsx` — `"use client"`

```
Fondo: gradiente azul-700 → azul-900 (horizontal)
Contenido: grid 2 col mobile / 4 col desktop
Watermark: logo-ftr.png, opacity 0.12, absolute right-8, solo md+
```

- Números animados con GSAP `obj.val` + `onUpdate` → `toLocaleString("es-CO")`.
- Sufijo `+` en `rojo-500`.
- `py-8 md:py-10` — sección intencionalmente delgada.
- `prefers-reduced-motion`: muestra valores finales directamente sin animación.

---

### 7.4 ServicesSection

**Archivo:** `src/components/home/ServicesSection.tsx` — `"use client"`

```
Wrapper: services-wrapper (azul-50, border-radius 28px, sombra azulada)
  ├── Cabecera + grid (62% ancho en desktop)
  │     Grid: 2 col mobile → 4 col desktop
  │     Card: bg white, border-radius 16px, shadow-card
  │           ícono (azul-50 bg, duotone) + flecha (gris-100 → negro en hover)
  └── Doctor pop-out (solo ≥ 1024px)
        position: absolute bottom-0 right-2%
        height: 145% (sobresale por arriba del wrapper)
        Glow: ::before radial-gradient azul, blur 80px
```

- Íconos: `@phosphor-icons/react` weight="duotone", 18px, `color azul-700`.
- Hover card: GSAP `y: -5` entrada/salida.
- Doctor: PNG con fondo transparente, `drop-shadow(-10px 0px 24px rgba(6,36,77,0.40))`.

---

### 7.5 BentoCtaRow

**Archivo:** `src/components/home/BentoCtaRow.tsx` — `"use client"`

```
Layout: grid 1 col → 2 col (35fr / 65fr) en desktop
  ├── Columna izquierda (bento-cta-left):
  │     imagen bgelectro.png (border-radius 24px)
  │     tarjeta horario (azul-50, border-radius 16px, ícono en bg white)
  └── Columna derecha (bento-cta-center):
        gris-50, border-radius 24px, padding 32px
        Chip + título + grid 2×2 beneficios
        Beneficio: ícono rojo + título semibold + desc text-sm
```

---

### 7.6 TeamSection

**Archivo:** `src/components/home/TeamSection.tsx` — `"use client"`

```
Fondo: azul-900
  ::before → patrón de puntos CSS (radial-gradient 28px)
  SVG ECG en rojo semitransparente (horizontal, aria-hidden)

Carrusel: auto-scroll CSS infinito
  Track duplicado (6 personas × 2 = 12 cards)
  @keyframes team-scroll: translateX(0) → translateX(-50%), 80s linear infinite
  Pausa en hover del track: animation-play-state: paused
  Fade en bordes: mask-image con gradiente transparente en los extremos

Card (460px alto, 300px ancho):
  background: rgba(255,255,255,0.02), backdrop-filter blur(3px)
  Imagen: 400px, absolute bottom-0, object-position top
  
  Estado normal:
    Chip especialidad (rojo semitransparente, rojo-400 text)
    Nombre: font-bold 1.35rem
    Rol: 0.95rem, rgba(255,255,255,0.70)
  
  Hover (CSS puro, no GSAP):
    Panel: translateY(100%) → 0, background rgba(6,36,77,0.60), blur
    Nombre + rol: opacity 0 (se ocultan)
    Formación académica: ícono GraduationCap + texto
    Transición panel: cubic-bezier(0.22,1,0.36,1)
```

---

### 7.7 NewsSection

**Archivo:** `src/components/home/NewsSection.tsx` — `"use client"`

```
Header: chip rojo + título bold (izquierda) | botones ← → circulares (derecha)
Grid: 1 col → 2 col tablet → 3 col desktop
Card:
  Imagen: 260px alto, object-cover
  Tag azul: text-sm, azul-100 bg, azul-800 text, pill
  Título: font-bold 1.15rem, azul-900
  Extracto: 1rem, gris-600
  Footer: "Leer más ↗" (rojo) | fecha | vistas (0.9rem)
```

Datos placeholder hasta integración con Supabase. Imágenes: `bgecocardio.png`, `bgholter.png`, `bgmamografia.png`.

---

### 7.8 SedesSection

**Archivo:** `src/components/home/SedesSection.tsx` — `"use client"`

```
Layout: sidebar de cards + iframe Google Maps
Cards:
  Estado inactivo: fondo blanco, borde gris
  Estado activo:   fondo azul-900, scale(1.02), sombra pronunciada
  Badge "Activa":  rojo-500, absolute top-right
  Ciudad:          text-lg font-bold
  Detalle:         text-sm
  Ícono:           contenedor cuadrado redondeado

Mapa: iframe Google Maps, border-radius 16px
```

**Pendiente:** URLs embed para Carmen de Bolívar y Magangué.

---

### 7.9 CTASection (PQRSD)

**Archivo:** `src/components/home/CTASection.tsx` — actualmente comentada en `page.tsx`

```
Fondo: azul-900 + patrón de puntos CSS (igual que TeamSection)
Elemento decorativo: "?" tipográfico, clamp(200px,22vw,340px), rojo semitransparente
Layout asimétrico:
  Izquierda: chip PQRSD + título "Tu voz / nos importa." + bajada + botón rojo
  Derecha:   3 filas — Formulario, Consultar estado, Contacto directo
             Cada fila: ícono rojo | título | descripción | flecha animada hover
```

---

### 7.10 Footer

**Archivo:** `src/components/public/Footer.tsx` (Server Component)

```
4 columnas: Marca + horario | Contacto | Navegación | Info legal
Fondo: azul-900
Texto mínimo: text-sm (norma CC5 — nunca text-xs en contenido visible)
```

---

## 8. Patrones de componentes reutilizables

### Chip pill de etiqueta
```tsx
<span
  className="inline-flex items-center gap-1.5 font-heading font-semibold text-sm px-4 py-1.5"
  style={{ backgroundColor: "var(--color-azul-100)", color: "var(--color-azul-800)", borderRadius: "999px" }}
>
  + Etiqueta
</span>
```

### Card con hover lift (GSAP)
```tsx
// En useGSAP:
card.addEventListener("mouseenter", () => gsap.to(card, { y: -5, duration: 0.25, ease: "power2.out" }));
card.addEventListener("mouseleave", () => gsap.to(card, { y:  0, duration: 0.25, ease: "power2.out" }));
```

### Botón primario (rojo)
```tsx
<Link
  href="/..."
  className="inline-flex items-center justify-center font-heading font-semibold text-sm text-white rounded-full px-7 py-3.5 transition-all duration-200 hover:opacity-90 active:scale-95 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2"
  style={{ backgroundColor: "var(--color-rojo-500)", boxShadow: "0 4px 16px 0 rgba(238,53,56,0.40)" }}
>
  Texto del botón
</Link>
```

### Botón secundario (glass sobre fondo oscuro)
```tsx
style={{
  color: "#fff",
  borderColor: "rgba(255,255,255,0.50)",
  backgroundColor: "rgba(255,255,255,0.06)",
  backdropFilter: "blur(3px)",
}}
```

### Contenedor de ícono
```tsx
<div
  className="w-9 h-9 flex items-center justify-center"
  style={{ backgroundColor: "var(--color-azul-50)", borderRadius: "10px" }}
  aria-hidden="true"
>
  <Icon size={18} weight="duotone" style={{ color: "var(--color-azul-700)" }} />
</div>
```

### Flecha "Conocer más →" con hover gap
```tsx
<span
  className="font-heading font-semibold text-sm inline-flex items-center gap-1.5 group-hover:gap-2.5 transition-all duration-200"
  style={{ color: "var(--color-azul-800)" }}
>
  Conocer más →
</span>
```

---

## 9. Accesibilidad obligatoria (MinTIC 1519/2020)

| Criterio | Implementación concreta |
|----------|------------------------|
| CC1 — Skip to content | `.skip-to-content` en `layout.tsx`, `position: absolute top: -100%`, visible en `:focus` |
| CC5 — Contraste mínimo 4.5:1 | Verificar paleta con herramienta WCAG antes de agregar colores nuevos |
| CC10 — Saltar al contenido | `id="main-content"` en `<div>` que envuelve el contenido de cada página |
| CC12 — Sitemap | Pendiente: `sitemap.xml` con Next.js |
| CC18 — Reducir movimiento | `@media (prefers-reduced-motion: reduce)` en `globals.css` + verificación en cada `useGSAP` |
| CC19 — ARIA labels | `aria-label` en sección hero, nav, botones de slide, avatar stack |
| CC32 — Idioma | `<html lang="es">` en `layout.tsx` |
| Imágenes decorativas | `alt=""` + `aria-hidden="true"` en logos watermark, doctor pop-out, fondo ECG |

---

## 10. Convenciones de archivos

```
src/
  app/
    (public)/
      page.tsx           ← home — Server Component, importa secciones
      layout.tsx         ← layout público con FloatingWhatsApp
    globals.css          ← tokens, base, clases utilitarias por sección
    layout.tsx           ← fuentes, metadata global, skip-to-content
  components/
    home/                ← secciones de la home (todas "use client")
    public/              ← Header (Server), Footer (Server), FloatingWhatsApp (Client)
  lib/
    gsap.ts              ← registro global GSAP + ScrollTrigger
    supabase/            ← cliente server y browser
  types/                 ← tipos compartidos (HeroSlide, etc.)
public/
  images/                ← imágenes generales
  personal Medico/       ← fotos del equipo médico por carpeta de persona
  personal asistencial y administrativo/
```

---

*Este archivo se actualiza cada vez que se construye una nueva página o se modifica un patrón existente.*
