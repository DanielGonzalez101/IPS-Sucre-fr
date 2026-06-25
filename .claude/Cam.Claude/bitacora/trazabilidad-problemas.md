# Trazabilidad — Problemas y Resolución

Registro de errores encontrados, su diagnóstico y cómo se resolvieron.
Incluye problemas sin resolver para no perder contexto entre sesiones.

---

## Formato de entrada

```
### [YYYY-MM-DD] — Descripción breve del problema
**Estado:** Resuelto | En investigación | Bloqueado | Descartado
**Síntoma:** Qué se veía o pasaba mal.
**Diagnóstico:** Qué lo causaba (hipótesis o causa confirmada).
**Solución aplicada:** Qué se hizo para resolverlo.
**Archivos modificados:** ruta/archivo
**Lección aprendida:** Qué hay que recordar para no repetirlo.
```

---

## Problemas resueltos

### [2026-06-21] — onMouseEnter/onMouseLeave en Header rompe el render
**Estado:** Resuelto — Opción C aprobada y aplicada

**Síntoma:** `Error: Event handlers cannot be passed to Client Component props` → `GET / 500`

**Diagnóstico:**
`Header.tsx` es un Server Component (no tiene `"use client"`). En Next.js 16 con React Server Components, los event handlers como `onMouseEnter` y `onMouseLeave` no pueden pasarse como props a componentes que se renderizan en el servidor.

**Causa raíz:**
Tailwind v4 `@theme` custom properties no generan automáticamente clases utilitarias `hover:text-azul-800` / `hover:bg-azul-50`. Se recurrió a event handlers JS como workaround, lo cual es incompatible con Server Components.

**Solución aplicada (Opción C — aprobada por Camilo):**
- Añadidas `.nav-link` y `.nav-link:hover` en `src/app/globals.css` usando `var(--color-azul-800)` y `var(--color-azul-50)`
- Reemplazados `onMouseEnter`/`onMouseLeave` + `style` inline por `className="nav-link ..."` en Header

**Archivos modificados:**
- `src/app/globals.css`
- `src/components/public/Header.tsx`

**Lección aprendida:**
1. Hover en Server Components → CSS puro en `globals.css`, nunca event handlers JS.
2. Claude debe presentar opciones y esperar aprobación ANTES de editar cualquier archivo — violar esto es la falla más grave en el proyecto.
3. Tailwind v4 `@theme` no genera clases `hover:` para custom properties → resolver con clases CSS propias.

---

### [2026-06-22] — Next.js sirve imagen antigua desde caché de imágenes
**Estado:** Resuelto

**Síntoma:** Se reemplazó `doctor-2.jpg` por `doctor2.png` (con fondo transparente) pero Next.js seguía mostrando la imagen anterior incluso tras reiniciar el servidor.

**Diagnóstico:** Next.js mantiene un caché de imágenes optimizadas en `.next/cache/images/`. Este caché no se invalida al cambiar o reemplazar el archivo fuente.

**Solución aplicada:**
1. Se eliminó `.next/cache/images/` primero.
2. Como el problema persistió, se eliminó `.next/` completo.
3. Se reinició el servidor dev — imagen correcta cargó inmediatamente.

**Archivos modificados:** N/A (operación de caché)

**Lección aprendida:** Al reemplazar imágenes en `public/`, borrar `.next/` completo (no solo cache/images). El servidor puede servir versiones optimizadas del archivo anterior incluso si el original cambia.

---

### [2026-06-22] — GSAP hover en TeamSection deja cards en estado atascado
**Estado:** Resuelto — migrado a CSS puro

**Síntoma:** Al mover el ratón rápido entre tarjetas del carrusel, algunas quedaban con el panel reveal abierto permanentemente sin estar en hover. El estado no se reseteaba al mover el cursor fuera.

**Diagnóstico:** GSAP anima propiedades en el tiempo. Si `mouseenter` y `mouseleave` se disparan muy rápido, la animación de leave puede completarse antes de que la de enter termine, dejando la propiedad CSS en un valor intermedio. El segundo intento con `gsap.killTweensOf()` resolvía parcialmente pero no del todo.

**Solución aplicada:** Se eliminó todo el GSAP de hover y se reemplazó por CSS puro en `globals.css`:
- `.team-card-reveal`: `transform: translateY(100%)` → `transition: transform 0.35s cubic-bezier(0.22,1,0.36,1)`
- `.team-card:hover .team-card-reveal`: `transform: translateY(0)`
- `.team-card-btn`: `opacity: 0; transform: scale(0.7)` con `transition`
- `.team-card:hover .team-card-btn`: `opacity: 1; transform: scale(1)` (elástico con `cubic-bezier(0.34,1.56,0.64,1)`)
- `.team-card:hover .team-card-body`: `opacity: 0`

GSAP se mantiene solo para la animación de entrada ScrollTrigger.

**Archivos modificados:**
- `src/components/home/TeamSection.tsx`
- `src/app/globals.css`

**Lección aprendida:** Para hover con animación en carruseles donde el usuario puede mover el cursor muy rápido, CSS transitions son más robustas que GSAP. GSAP es ideal para animaciones de scroll/entrance; para hover rápido → CSS.

---

## En investigación

*(vacío)*

---

### [2026-06-21] — Imagen de fondo del hero se recortaba al reducir el ancho de pantalla
**Estado:** Resuelto

**Síntoma:** Al estrechar el frame del browser, la imagen panorámica del equipo (1920×711) se recortaba verticalmente, perdiendo personas visibles.

**Diagnóstico:**
Se usó `fill` + `height: clamp(...)` en el contenedor, lo que forzaba a la imagen a llenar una altura fija con `object-cover`. Al estrechar la pantalla, el contenedor mantenía su altura pero la imagen se recortaba horizontalmente para ajustarse.

**Causa raíz:**
`fill` + `object-cover` siempre recorta — es su comportamiento esperado. Para una imagen panorámica grupal donde NO se puede perder ninguna persona, `object-cover` no es válido.

**Solución aplicada:**
- Imagen con `width={1920} height={711}` + `className="w-full h-auto block"` — la imagen dicta su propia altura proporcionalmente
- El overlay y el contenido van `absolute inset-0` dentro del mismo `div relative` que contiene la imagen
- Al estrechar la pantalla, la imagen encoge proporcionalmente sin recortar a nadie

**Indicación de Camilo:** "la imagen de fondo no se puede cortar si reducemos la pantalla, debe quedarse estática — hablo solo de la imagen de fondo"

**Archivos modificados:**
- `src/components/home/HeroSection.tsx`

**Lección aprendida:**
Para imágenes panorámicas donde el contenido completo debe ser siempre visible: usar `w-full h-auto` con dimensiones explícitas, NUNCA `fill` + `object-cover`. Reservar `fill`+`object-cover` para imágenes decorativas donde el recorte es aceptable.

---

### [2026-06-21] — Hover de bento cards no funcionaba (conflicto CSS + GSAP)
**Estado:** Resuelto

**Síntoma:** Las tarjetas bento no levantaban al hacer hover. El efecto era inconsistente entre tarjetas.

**Diagnóstico:**
Conflicto entre `transition-all duration-300 hover:-translate-y-1` de Tailwind v4 y el `gsap.to()` del evento `mouseenter`. Tailwind v4 no genera utilidades `hover:` para clases de transformación en algunos contextos, y cuando sí las genera, pelean con las animaciones GSAP simultáneas.

**Solución aplicada:**
- Eliminado `transition-all` y `hover:-translate-y-1` de todas las `.bento-card`
- Hover manejado exclusivamente por GSAP con `mouseenter`/`mouseleave` scoped a `containerRef.current`
- `duration: 0.3`, `ease: "power2.out"`, `y: -6`

**Indicación de Camilo:** "ese hover reacciona distinto al de los demás — no los levanta"

**Archivos modificados:**
- `src/components/home/HeroSection.tsx`

**Lección aprendida:**
En componentes con GSAP activo, NO mezclar CSS transitions/hover con animaciones GSAP sobre las mismas propiedades. Elegir uno: si hay GSAP, el hover va en GSAP. Siempre usar `containerRef.current.querySelectorAll` en lugar de `document.querySelectorAll` para no capturar elementos fuera del scope.

---

### [2026-06-21] — Efecto inverted border radius en tarjeta Google Maps
**Estado:** Parcialmente resuelto — curva eliminada temporalmente

**Síntoma:** El objeto curvo aparecía en lugares incorrectos (arriba de la tarjeta, fuera de la imagen, desplazado a la izquierda).

**Diagnóstico:**
El método de pseudo-elementos (`::before`/`::after`) requiere que el wrapper padre NO tenga `overflow: hidden`. El hero necesitaba `overflow: hidden` para la imagen, lo que clippeaba los pseudo-elementos. Intentos con `mask-image`, con divs separados y con `box-shadow` en distintas direcciones no lograron el efecto correcto.

**Solución temporal aplicada:**
Tarjeta Google Maps posicionada `absolute bottom-0 right-0` dentro del wrapper externo (sin overflow) con `borderTopLeftRadius: 28px` y fondo `#F9F9FA`. Sin curvas invertidas por ahora.

**Indicación de Camilo:** "si quieres quita el objeto de arriba curvo y deja solo lo del google maps" / "analiza la imagen, identifica en donde están ubicados los objetos"

**Archivos modificados:**
- `src/components/home/HeroSection.tsx`
- `src/app/globals.css`

**Pendiente:** El efecto de borde mordido (inverted border radius) en la esquina donde la tarjeta emerge de la imagen queda pendiente para una próxima iteración con más contexto visual.

---

### [2026-06-21] — Grid en hero generaba franja vacía debajo de la imagen
**Estado:** Resuelto

**Síntoma:** Aparecía un espacio horizontal (franja con gradiente) entre la foto del equipo y las tarjetas bento inferiores.

**Diagnóstico:**
Se usó layout CSS Grid superponiendo imagen y contenido. Cuando el bloque de texto era más alto que la imagen, la fila del grid crecía más allá de la altura natural de la foto, dejando zona vacía con overlay visible.

**Causa raíz:**
En grid con ítems en la misma celda, la altura de la fila es el máximo entre imagen y contenido — no la altura de la imagen sola.

**Solución aplicada:**
Se descartó el grid para el hero. La imagen vuelve a dictar la altura con `w-full h-auto`; el contenido usa overlay absoluto (desktop) o panel apilado (mobile), sin expandir la fila más allá de la foto.

**Archivos modificados:**
- `src/components/home/HeroSection.tsx`
- `src/app/globals.css`

**Lección aprendida:**
No usar CSS Grid superpuesto cuando la imagen debe mantener su altura natural y el contenido puede ser más alto — genera franjas vacías. Para fotos panorámicas: imagen manda la altura; el texto va en overlay (desktop) o en bloque separado (mobile).

---

### [2026-06-21] — Contenido del hero se superponía a tarjetas bento en tablet/móvil
**Estado:** Resuelto

**Síntoma:** En viewports intermedios, avatares y texto ("Tu familia en las mejores manos") aparecían encima de las tarjetas bento; desorden visual general en el hero.

**Diagnóstico:**
Imagen panorámica 1920×711 → ~140px de alto en móvil (~375px). Contenido en `position: absolute` con `justify-center` excedía la altura de la imagen y desbordaba hacia la sección siguiente.

**Causa raíz:**
Proporción extrema de la foto + overlay absoluto sin estrategia mobile-first. Avatares visibles desde `sm` (640px) en un canvas demasiado bajo.

**Solución aplicada:**
- **< 768px:** imagen arriba + panel azul sólido debajo con todo el contenido (sin overlay).
- **≥ 768px:** overlay sobre imagen con gradiente transparente.
- **≥ 1024px:** social proof (avatares) visible.
- Bento con `z-20` y fondo sólido como red de seguridad.

**Indicación de Camilo:** "pensemos en las dimensiones del responsive ya que genera mucho desorden visual"

**Archivos modificados:**
- `src/components/home/HeroSection.tsx`
- `src/app/globals.css`

**Lección aprendida:**
Fotos panorámicas grupales no son compatibles con overlay de mucho contenido en móvil. Patrón correcto: imagen completa arriba + bloque de texto debajo en `< md`; reservar overlay solo cuando la imagen tiene altura suficiente (tablet/desktop).

---

## Descartados / No reproducibles

*(vacío)*

---

## Patrones recurrentes — alertas para Claude

### [2026-06-22] — Claude incumplió normativa de tamaños mínimos en NewsSection
**Estado:** Corregido tras feedback de Camilo

**Síntoma:** NewsSection se entregó con tamaños `0.75rem`, `0.875rem`, `0.8rem` — ilegibles para adultos mayores.

**Causa:** Claude no aplicó por defecto la normativa MinTIC 1519/2020 al crear un componente nuevo.

**Corrección:** tag `0.875rem`, título `1.15rem`, extracto `1rem`, "Leer más" `1rem`, meta `0.9rem`.

**Regla a respetar siempre:** Todo texto visible en componentes públicos debe cumplir tamaños mínimos accesibles. Aplicar sin que Camilo lo pida. Mínimos: cuerpo `1rem`, secundario `0.875rem`, etiquetas/meta `0.875rem`. Nunca usar `0.75rem` o `0.8rem` en texto de contenido.
