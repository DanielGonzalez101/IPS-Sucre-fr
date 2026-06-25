# GUÍA DE ESTILO UX/UI — CARDIOPEDIA WEB

## Archivos de referencia en el proyecto

```
Identidad de marca:
  .claude/Cam.Claude/frontend/estilo/Manual de Identidad IPS Cardiocentro Pediátrico de Sucre.pdf

Contenido de páginas:
  .claude/informacion/inicio.md
```

---

## FILOSOFÍA DE DISEÑO

El sitio debe sentirse como una clínica pediátrica de primer nivel: profesional, confiable, moderno, pero cálido y cercano. No es un sitio corporativo frío ni un sitio infantil colorido — es el equilibrio entre autoridad médica y calidez humana.

Tres principios guía:

**1. Minimalismo con personalidad:** Mucho espacio en blanco, tipografía grande y legible, colores limitados a la paleta de marca (azul + rojo + neutros). La personalidad viene de las formas orgánicas (blobs decorativos), las micro-animaciones con GSAP, y el uso inteligente del rojo como acento que atrae la mirada.

**2. Rendimiento primero:** Cada decisión visual debe pasar la prueba de "¿esto afecta el tiempo de carga?". Nada de imágenes decorativas de 2MB, nada de librerías de animación extra, nada de fondos en video. SVG para formas, WebP para fotos, CSS para sombras y gradientes.

**3. Accesibilidad es diseño:** No es una capa que se agrega después. El contraste, el tamaño de texto, el focus visible, la navegación por teclado y el orden de tabulación se diseñan desde el primer wireframe.

---

## LAYOUT GENERAL

### Contenedor principal

```
max-width: 1200px (max-w-[1200px])
padding horizontal: 16px en mobile, 24px en tablet, 32px en desktop
centrado: mx-auto
```

### Espaciado vertical entre secciones

```
Secciones principales: py-16 en mobile, py-24 en desktop (64px → 96px)
Separación entre subsecciones internas: gap de 48px (space-y-12)
```

### Fondos alternados

Las secciones alternan entre fondo blanco puro y un gris muy sutil para crear ritmo visual sin usar bordes ni líneas divisorias:

```
Sección 1 (Hero):        bg-white
Sección 2 (Servicios):   bg-gris-50 (#F9F9FA)
Sección 3 (Cifras):      bg-azul-900 (#06244D) con texto blanco
Sección 4 (Equipo):      bg-white
Sección 5 (Noticias):    bg-gris-50
Sección 6 (PQRSD CTA):   bg-azul-800 (#08338F) con texto blanco
Sección 7 (Sedes):       bg-white
```

---

## FORMAS DECORATIVAS (BLOBS)

Inspirado en el sitio de referencia que usa formas orgánicas verdes como decoración. Adaptamos el concepto al azul y rojo de Cardiocentro.

### Implementación con SVG inline

Las formas son SVGs posicionados con `absolute` dentro de contenedores `relative`, con `overflow-hidden` para que no se salgan. Se usan con opacidad baja para no interferir con el contenido.

```
Blob azul claro:    fill="#08338F" opacity="0.05" — detrás de secciones de contenido
Blob rojo suave:    fill="#EE3538" opacity="0.04" — detrás del hero, como acento sutil
Círculos cortados:  Semicírculos o cuartos de círculo en las esquinas de secciones
```

**Regla:** Máximo 2 blobs por sección. Nunca cubrir texto. Siempre con opacidad menor a 8%. En mobile se ocultan (`hidden md:block`) para no ocupar espacio visual.

**Accesibilidad:** Todas las formas decorativas llevan `aria-hidden="true"` y `role="presentation"`.

---

## HERO — SECCIÓN PRINCIPAL

Inspirado en el patrón del sitio de referencia: texto grande a la izquierda, imagen a la derecha, con tags de categorías debajo.

### Estructura

```
[Top bar: Transparencia · Atención · Participa | Tel | Redes]
[Header: Logo ··· Menú ··· CTA]

┌─────────────────────────────────────────────────────┐
│                                                     │
│   Texto (60%)              │  Imagen (40%)          │
│                            │                        │
│   Subtítulo pequeño        │  [Foto institucional   │
│   en rojo (#EE3538)        │   con bordes           │
│                            │   redondeados y        │
│   TÍTULO GRANDE            │   blob decorativo      │
│   en azul (#06244D)        │   detrás]              │
│   Montserrat Black         │                        │
│                            │                        │
│   Párrafo descriptivo      │                        │
│   Raleway Normal           │                        │
│   text-gris-700            │                        │
│                            │                        │
│   [Botón primario]         │                        │
│   [Botón secundario]       │                        │
│                                                     │
│   ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐              │
│   │Cardio│ │Radio.│ │Diagn.│ │Consul│ ← Pills      │
│   └──────┘ └──────┘ └──────┘ └──────┘              │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Especificaciones del hero

```
Subtítulo:    font-heading font-semibold text-small uppercase tracking-widest text-rojo-500
              Ejemplo: "Especialistas en cardiología pediátrica"

Título:       font-heading font-black text-h1 md:text-display text-azul-900
              Ejemplo: "Cuidamos el corazón de tus hijos"
              Max 6-8 palabras. Directo, emocional, claro.

Párrafo:      font-body text-body text-gris-700 max-w-lg
              2-3 líneas máximo. Sin jerga médica.

Botón 1:      "Conoce nuestros servicios" → /servicios
              bg-azul-800 text-white rounded-full px-8 py-3.5

Botón 2:      "Agenda tu cita" → WhatsApp
              bg-white text-azul-800 border-2 border-azul-800 rounded-full px-8 py-3.5

Imagen:       Foto del equipo médico o instalaciones
              rounded-2xl con sombra sutil
              Blob decorativo azul detrás (SVG, opacity 0.06)

Pills:        Categorías de servicios como tags redondeados debajo del hero
              bg-azul-50 text-azul-800 font-heading font-semibold text-small
              rounded-full px-4 py-2
              hover:bg-azul-100 transition-colors cursor-pointer
              Cada pill enlaza a /servicios#categoria
```

### En mobile

El layout cambia a columna vertical: imagen arriba (aspect-video, full width), texto debajo. Los pills se vuelven scroll horizontal con `overflow-x-auto flex gap-2 pb-2`.

---

## PILLS / TABS DE CATEGORÍAS

Patrón repetido en múltiples secciones del sitio de referencia. Adaptamos para servicios médicos.

```
Inactivo:     bg-gris-100 text-gris-700 font-heading font-semibold text-small
              rounded-full px-5 py-2.5
              hover:bg-azul-50 hover:text-azul-800 transition-all duration-200
              cursor-pointer

Activo:       bg-azul-800 text-white font-heading font-semibold text-small
              rounded-full px-5 py-2.5
              shadow-button

Con ícono:    Icono de Lucide (16px) a la izquierda del texto, gap-2
```

Se usan en: hero (categorías de servicios), sección de servicios (filtros), sección de noticias (categorías si aplica).

---

## SECCIÓN DE CIFRAS / ESTADÍSTICAS

Fondo oscuro (azul-900) con números grandes en blanco. Conteo animado con GSAP al hacer scroll.

```
┌─────────────────────────────────────────────────────┐
│                 bg-azul-900 text-white               │
│                                                     │
│   10.000+         16            40.000+       19    │
│   Usuarios/año    Años de exp.  Familias      Conv. │
│                                                     │
│   Número: font-heading font-black text-4xl md:text-5xl text-white         │
│   Sufijo (+): text-rojo-500                         │
│   Label: font-body text-small text-white/70         │
│                                                     │
│   Grid: grid-cols-2 md:grid-cols-4 gap-8 text-center│
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## CARDS DE SERVICIOS

Inspirado en las cards del sitio de referencia: limpias, con icono arriba, hover con elevación.

```
┌─────────────────────┐
│                     │
│   [Icono azul-800]  │     ← Icono de Lucide, 32px, en un círculo bg-azul-50 p-3 rounded-full
│                     │
│   Nombre servicio   │     ← font-heading font-semibold text-h4 text-azul-900
│                     │
│   Descripción corta │     ← font-body text-small text-gris-600 line-clamp-3
│   del servicio...   │
│                     │
│   Leer más →        │     ← text-azul-800 font-heading font-semibold text-small
│                     │        hover:text-rojo-500 transition-colors
└─────────────────────┘

Card:   bg-white rounded-card p-6 border border-gris-200
        hover:shadow-card-hover hover:border-azul-200 hover:-translate-y-1
        transition-all duration-300
        
Grid:   grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6
```

---

## CARDS DE NOTICIAS

```
┌─────────────────────┐
│ ┌─────────────────┐ │
│ │                 │ │     ← Imagen con aspect-[16/10] rounded-t-card object-cover
│ │   Imagen        │ │
│ │                 │ │
│ └─────────────────┘ │
│                     │
│ 15 Jun 2026         │     ← font-body text-xs text-gris-500
│                     │
│ Título noticia      │     ← font-heading font-semibold text-h4 text-azul-900
│ en dos líneas       │        line-clamp-2 hover:text-azul-700
│                     │
│ Extracto breve      │     ← font-body text-small text-gris-600 line-clamp-2
│ de la noticia...    │
│                     │
│ Leer más →          │     ← text-azul-800 font-heading font-semibold text-small
│                     │
└─────────────────────┘

Card:   bg-white rounded-card overflow-hidden border border-gris-200
        hover:shadow-card-hover transition-all duration-300 group
        
Imagen: group-hover:scale-105 transition-transform duration-500
        (contenedor con overflow-hidden para que el zoom no se salga)
```

---

## SECCIÓN CTA (PQRSD / CONTACTO)

Sección de call-to-action con fondo azul corporativo, inspirada en el patrón de "Get Your Free Quote" del sitio de referencia.

```
┌─────────────────────────────────────────────────────┐
│                 bg-azul-800 rounded-2xl              │
│                 (dentro del contenedor, con margen)   │
│                                                     │
│   Texto (55%)              │  Formulario (45%)      │
│                            │                        │
│   ¿Tienes una petición,   │  ┌─────────────────┐   │
│   queja o sugerencia?      │  │ Formulario       │   │
│                            │  │ rápido de        │   │
│   Usa nuestro sistema      │  │ contacto         │   │
│   PQRSD para que podamos   │  │ bg-white         │   │
│   atenderte.               │  │ rounded-xl       │   │
│                            │  │ p-6              │   │
│   [Ir al formulario PQRSD] │  │ shadow-lg        │   │
│   [Consultar estado]       │  └─────────────────┘   │
│                                                     │
│   ┌──────┐ ┌──────┐ ┌──────┐                       │
│   │PQRSD │ │Contac│ │WhatsA│ ← Pills blancos        │
│   └──────┘ └──────┘ └──────┘                       │
│                                                     │
└─────────────────────────────────────────────────────┘
```

Pills sobre fondo azul:
```
bg-white/15 text-white border border-white/25 rounded-full px-5 py-2.5
hover:bg-white/25 transition-colors
```

---

## SECCIÓN EQUIPO MÉDICO

Cards de equipo con foto circular, inspirado en el patrón "Meet Our Expert Team".

```
┌─────────────────────┐
│                     │
│     ┌──────┐        │     ← Foto: w-24 h-24 rounded-full object-cover
│     │ Foto │        │        border-4 border-azul-100 mx-auto
│     └──────┘        │
│                     │
│   Dr. Leandro       │     ← font-heading font-semibold text-h4 text-azul-900 text-center
│   Ruíz Moreno       │
│                     │
│   Cardiólogo        │     ← font-body text-small text-rojo-500 text-center font-medium
│   Pediatra          │
│                     │
│   Hospital Garrahan │     ← font-body text-xs text-gris-500 text-center
│   Univ. Buenos Aires│
│                     │
└─────────────────────┘

Card:   bg-white rounded-card p-8 text-center border border-gris-200
        hover:shadow-card-hover transition-all duration-300
```

---

## SECCIÓN SEDES / MAPA

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│   Mapa interactivo (60%)    │  Cards sedes (40%)    │
│                            │                        │
│   ┌─────────────────┐      │  ┌─────────────────┐  │
│   │                 │      │  │ 📍 Sincelejo     │  │
│   │   Google Maps   │      │  │   Calle 14 #17-72│  │
│   │   o Leaflet     │      │  │   Tel: ...       │  │
│   │   con 3         │      │  │   L-V 7am-6pm   │  │
│   │   marcadores    │      │  └─────────────────┘  │
│   │                 │      │  ┌─────────────────┐  │
│   │                 │      │  │ 📍 El Carmen     │  │
│   │                 │      │  └─────────────────┘  │
│   │                 │      │  ┌─────────────────┐  │
│   │                 │      │  │ 📍 Magangué      │  │
│   └─────────────────┘      │  └─────────────────┘  │
│                                                     │
└─────────────────────────────────────────────────────┘
```

Card sede activa (la que el usuario seleccionó en el mapa):
```
bg-white border-l-4 border-l-rojo-500 rounded-card p-4 shadow-card
```

Card sede inactiva:
```
bg-gris-50 border-l-4 border-l-transparent rounded-card p-4
hover:bg-white hover:shadow-card transition-all cursor-pointer
```

---

## FAQ / PREGUNTAS FRECUENTES (opcional en Contacto)

Patrón de acordeón del sitio de referencia:

```
┌─────────────────────────────────────────────┐
│  ¿Qué servicios ofrece el Cardiocentro?   ▼│     ← Pregunta: font-heading font-semibold text-h4
│                                             │        text-azul-900
│  Respuesta expandida en Raleway Normal...   │        bg-white rounded-card border border-gris-200
│  con texto text-gris-700                    │        p-5 mb-3
│                                             │
│  ▼ se convierte en ▲ con rotate-180         │        Chevron: text-azul-800 transition-transform
└─────────────────────────────────────────────┘

Cerrado:  Solo la pregunta visible, fondo bg-gris-50
Abierto:  Fondo bg-white, borde izquierdo border-l-4 border-l-azul-800
```

---

## ENCABEZADOS DE SECCIÓN

Patrón consistente para el título de cada sección del home:

```
Subtítulo:   font-heading font-semibold text-small uppercase tracking-widest text-rojo-500
             Ejemplo: "Nuestros servicios" o "Últimas noticias"
             mb-3

Título:      font-heading font-bold text-h2 md:text-h2-lg text-azul-900
             Ejemplo: "Atención especializada para el corazón de tus hijos"
             mb-4

Descripción: font-body text-body text-gris-600 max-w-2xl
             (centrada si la sección es centrada, alineada a izquierda si no)
             mb-10 md:mb-14

Alineación:  Centrado por defecto (text-center mx-auto)
             Alineado izquierda si la sección tiene layout 50/50
```

---

## BOTONES — VARIANTES COMPLETAS

### Primario (acciones principales)
```
bg-azul-800 text-white font-heading font-semibold
rounded-full px-8 py-3.5
hover:bg-azul-700 active:bg-azul-900
focus-visible:ring-2 focus-visible:ring-azul-600 focus-visible:ring-offset-2
shadow-button hover:shadow-md
transition-all duration-200
text-[15px]
```

### Secundario (acciones complementarias)
```
bg-white text-azul-800 font-heading font-semibold
border-2 border-azul-800
rounded-full px-8 py-3.5
hover:bg-azul-50 active:bg-azul-100
focus-visible:ring-2 focus-visible:ring-azul-600 focus-visible:ring-offset-2
transition-all duration-200
text-[15px]
```

### Ghost (sobre fondos oscuros)
```
bg-white/15 text-white font-heading font-semibold
border border-white/30
rounded-full px-8 py-3.5
hover:bg-white/25
backdrop-blur-sm
transition-all duration-200
text-[15px]
```

### WhatsApp flotante
```
fixed bottom-6 right-6 z-50
bg-[#25D366] text-white
rounded-full p-4 shadow-lg
hover:bg-[#1DA851] hover:shadow-xl hover:scale-105
transition-all duration-200
aria-label="Contáctanos por WhatsApp"

Icono WhatsApp de Lucide: 24px
Animación sutil de pulse en el borde (CSS puro, no GSAP):
  animate-pulse ring-4 ring-[#25D366]/30
```

### Tamaño de área táctil
Todos los botones y links interactivos deben tener un área táctil mínima de 44x44px (WCAG 2.1 AA). Si el botón visualmente es más pequeño, usar padding para alcanzar el mínimo.

---

## FORMULARIOS — ESTILO VISUAL

### Inputs y selects
```
w-full px-4 py-3.5 bg-gris-50 border border-gris-300 rounded-xl
font-body text-body text-gris-900 placeholder:text-gris-400
focus:bg-white focus:border-azul-600 focus:ring-2 focus:ring-azul-100 focus:outline-none
transition-all duration-200
```

### Labels
```
font-body font-medium text-gris-800 text-small mb-2 block
```

### Campo obligatorio
```html
<label>
  Nombre completo <span class="text-rojo-500 ml-0.5">*</span>
  <span class="sr-only">(obligatorio)</span>
</label>
```

### Mensaje de error
```
text-error text-small mt-1.5 flex items-center gap-1.5
Icono AlertCircle de Lucide (14px) + texto del error
aria-live="polite" para lectores de pantalla
```

### Textarea
```
Mismo estilo que input pero con min-h-[120px] resize-y
```

### Checkbox y radio
```
Checkbox: w-5 h-5 rounded-md border-2 border-gris-300 text-azul-800
          focus:ring-2 focus:ring-azul-100 cursor-pointer
Radio:    w-5 h-5 rounded-full (mismos estilos)
```

---

## ANIMACIONES CON GSAP — PATRONES ESPECÍFICOS

### Fade-in desde abajo al scroll (patrón más usado)
```tsx
gsap.from(element, {
  y: 40,
  opacity: 0,
  duration: 0.7,
  ease: "power2.out",
  scrollTrigger: {
    trigger: element,
    start: "top 85%",
    toggleActions: "play none none none",
  },
});
```

### Stagger de cards (servicios, noticias, equipo)
```tsx
gsap.from(".card", {
  y: 50,
  opacity: 0,
  duration: 0.6,
  stagger: 0.1,
  ease: "power2.out",
  scrollTrigger: { trigger: grid, start: "top 80%" },
});
```

### Conteo de números (cifras)
```tsx
gsap.to(counter, {
  val: targetNumber,
  duration: 2,
  ease: "power1.out",
  scrollTrigger: { trigger: section, start: "top 80%" },
  onUpdate: () => { el.textContent = Math.floor(counter.val).toLocaleString("es-CO"); },
});
```

### Hero — entrada del texto
```tsx
const tl = gsap.timeline();
tl.from(".hero-subtitle", { y: 20, opacity: 0, duration: 0.5 })
  .from(".hero-title", { y: 30, opacity: 0, duration: 0.6 }, "-=0.3")
  .from(".hero-text", { y: 20, opacity: 0, duration: 0.5 }, "-=0.3")
  .from(".hero-buttons", { y: 20, opacity: 0, duration: 0.5 }, "-=0.2")
  .from(".hero-pills", { y: 15, opacity: 0, duration: 0.4, stagger: 0.05 }, "-=0.2");
```

**Siempre antes de toda animación:**
```tsx
if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
```

---

## RESPONSIVE — BREAKPOINTS Y ADAPTACIONES

### Breakpoints en Tailwind
```
sm: 640px   → Tablets verticales
md: 768px   → Tablets horizontales
lg: 1024px  → Desktop
xl: 1280px  → Desktop grande
```

### Adaptaciones por breakpoint

**Mobile (< 640px):**
- Hero: layout vertical, imagen arriba, texto abajo
- Pills: scroll horizontal con `overflow-x-auto`
- Cards: una columna, full width
- Cifras: grid 2x2
- Mapa y sedes: columna vertical (mapa arriba, cards abajo)
- Footer: columna vertical, una columna por bloque
- Blobs decorativos: ocultos (`hidden md:block`)
- Menú: hamburguesa con overlay full-screen
- Botones: full width (`w-full`) en formularios
- Formulario CTA: debajo del texto, no al lado

**Tablet (640-1023px):**
- Cards: 2 columnas
- Hero: puede mantener 50/50 o ir a vertical según el contenido
- Footer: 2x2 columnas

**Desktop (1024px+):**
- Layout completo tal como se diseñó
- Cards: 3 columnas
- Hero: 60/40 horizontal
- Footer: 4 columnas

---

## DARK MODE

No implementar dark mode en esta fase. Es un sitio institucional de salud donde los colores de marca tienen significado específico (azul = confianza, rojo = vitalidad). Un dark mode alteraría la identidad visual sin aportar valor al público objetivo. Si en el futuro se decide implementar, los CSS custom properties ya están preparados para ello.

---

## RENDIMIENTO VISUAL

### Imágenes
- Formato WebP con fallback JPG
- Lazy loading en todo excepto la imagen del hero (hero lleva `priority`)
- Tamaño máximo: 1200px de ancho para fotos de ancho completo, 600px para cards
- Placeholder blur mientras carga (Next.js `placeholder="blur"`)
- Nomenclatura descriptiva: `equipo-cardiologia-pediatrica.webp`

### Fuentes
- Solo 2 familias: Montserrat (600, 700, 900) y Raleway (400, 500, 600)
- `display: swap` para evitar FOIT (Flash of Invisible Text)
- Precarga de la fuente principal con `<link rel="preload">`

### CSS
- Tailwind purga automáticamente las clases no usadas en producción
- Animaciones con GSAP solo en componentes `"use client"`
- Las transiciones CSS (hover, focus) son más livianas que GSAP para interacciones simples

### Objetivo Lighthouse
- Performance: > 90
- Accessibility: > 95
- Best Practices: > 90
- SEO: > 95
