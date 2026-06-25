# GUÍA DE INSTALACIÓN Y LIBRERÍAS — CARDIOPEDIA WEB

## Requisitos previos en Mac

Antes de empezar necesitas tener instalado Node.js, npm y Git. Si ya los tienes, salta al paso 2.

### Paso 1: Instalar herramientas base

**Homebrew** (gestor de paquetes para Mac):

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

**Node.js** (v18.17 o superior — requerido por Next.js 14):

```bash
brew install node
```

Verificar instalación:

```bash
node -v    # Debe mostrar v18.17.0 o superior
npm -v     # Debe mostrar 9.x o superior
```

**Git:**

```bash
brew install git
git --version
```

**VS Code** (recomendado):

```bash
brew install --cask visual-studio-code
```

---

## Paso 2: Crear el proyecto

```bash
# Ubicarte en la carpeta donde quieras el proyecto
cd ~/proyectos

# Crear proyecto Next.js con TypeScript y Tailwind
npx create-next-app@latest cardiopedia-web
```

Cuando pregunte las opciones, responder así:

```
✔ Would you like to use TypeScript?                  → Yes
✔ Would you like to use ESLint?                      → Yes
✔ Would you like to use Tailwind CSS?                → Yes
✔ Would you like your code inside a `src/` directory? → No
✔ Would you like to use App Router?                  → Yes
✔ Would you like to use Turbopack for next dev?      → Yes
✔ Would you like to customize the import alias?      → Yes (@/*)
```

```bash
# Entrar al proyecto
cd cardiopedia-web

# Abrir en VS Code
code .
```

---

## Paso 3: Instalar todas las dependencias

Copiar y pegar este bloque completo en la terminal. Está organizado por categoría.

```bash
# ═══════════════════════════════════════════
# SUPABASE — Base de datos, Auth, Storage
# ═══════════════════════════════════════════
npm install @supabase/supabase-js @supabase/ssr

# ═══════════════════════════════════════════
# GSAP — Animaciones (gratuita desde 2024)
# ═══════════════════════════════════════════
npm install gsap @gsap/react

# ═══════════════════════════════════════════
# FORMULARIOS Y VALIDACIÓN
# ═══════════════════════════════════════════
npm install react-hook-form @hookform/resolvers zod

# ═══════════════════════════════════════════
# EDITOR DE TEXTO ENRIQUECIDO (para noticias)
# ═══════════════════════════════════════════
npm install @tiptap/react @tiptap/starter-kit @tiptap/extension-image @tiptap/extension-link @tiptap/extension-placeholder @tiptap/pm

# ═══════════════════════════════════════════
# UI COMPLEMENTARIOS
# ═══════════════════════════════════════════
npm install lucide-react                  # Iconos (accesibles, consistentes)
npm install sonner                        # Notificaciones toast
npm install clsx tailwind-merge           # Utilidades para clases CSS condicionales

# ═══════════════════════════════════════════
# RATE LIMITING
# ═══════════════════════════════════════════
npm install @upstash/ratelimit @upstash/redis

# ═══════════════════════════════════════════
# EMAILS TRANSACCIONALES
# ═══════════════════════════════════════════
npm install resend

# ═══════════════════════════════════════════
# SEGURIDAD
# ═══════════════════════════════════════════
npm install dompurify
npm install -D @types/dompurify

# ═══════════════════════════════════════════
# RECAPTCHA
# ═══════════════════════════════════════════
npm install react-google-recaptcha-v3

# ═══════════════════════════════════════════
# UTILIDADES
# ═══════════════════════════════════════════
npm install date-fns                      # Formateo de fechas (más ligero que moment.js)
npm install nanoid                        # Generación de IDs únicos para radicados
```

---

## Paso 4: Extensiones recomendadas de VS Code

Instalar desde el marketplace de VS Code:

```
- ESLint
- Tailwind CSS IntelliSense
- Prettier - Code Formatter
- ES7+ React/Redux/React-Native snippets
- TypeScript Importer
- Auto Rename Tag
- GitLens
```

---

## CATÁLOGO COMPLETO DE LIBRERÍAS

### Librerías de producción (dependencies)

| Librería | Versión | Peso aprox. | Para qué se usa | Quién la usa |
|----------|---------|-------------|-----------------|-------------|
| `next` | 14+ | — (framework) | Framework principal: SSR, SSG, API routes, middleware | Todos |
| `react` / `react-dom` | 18+ | — (incluido) | Librería base de UI | Todos |
| `typescript` | 5+ | — (dev) | Tipado fuerte, menos bugs | Todos |
| `tailwindcss` | 3+ | ~30KB | Estilos utility-first, responsive, accesibilidad | Todos |
| `@supabase/supabase-js` | 2+ | ~50KB | Cliente de Supabase: queries, auth, storage | Daniel |
| `@supabase/ssr` | 0.5+ | ~5KB | Helpers para server-side con Supabase en Next.js | Daniel |
| `gsap` | 3.12+ | ~23KB core | Animaciones profesionales | Camilo |
| `@gsap/react` | 2+ | ~3KB | Hook useGSAP() para React — cleanup automático | Camilo |
| `react-hook-form` | 7+ | ~9KB | Gestión de formularios sin re-renders innecesarios | Camilo |
| `@hookform/resolvers` | 3+ | ~2KB | Conectar Zod con react-hook-form | Camilo |
| `zod` | 3+ | ~13KB | Validación de schemas (client + server) | Daniel + Camilo |
| `@tiptap/react` | 2+ | ~80KB total | Editor rich text para noticias y páginas editables | Camilo |
| `@tiptap/starter-kit` | 2+ | (incluido) | Extensiones base: bold, italic, headings, lists, etc. | Camilo |
| `lucide-react` | 0.380+ | ~5KB (tree-shakeable) | Iconos SVG accesibles (solo carga los que usas) | Todos |
| `sonner` | 1+ | ~5KB | Toasts/notificaciones accesibles y elegantes | Camilo |
| `clsx` | 2+ | ~1KB | Clases CSS condicionales | Todos |
| `tailwind-merge` | 2+ | ~5KB | Merge inteligente de clases Tailwind sin conflictos | Todos |
| `@upstash/ratelimit` | 2+ | ~3KB | Rate limiting serverless (login, PQRSD, contacto) | Daniel |
| `@upstash/redis` | 1+ | ~10KB | Cliente Redis para Upstash (rate limiting) | Daniel |
| `resend` | 3+ | ~5KB | Envío de emails transaccionales (acuse PQRSD) | Daniel |
| `dompurify` | 3+ | ~15KB | Sanitización de HTML para prevenir XSS | Daniel |
| `react-google-recaptcha-v3` | 1+ | ~3KB | reCAPTCHA v3 invisible (antispam) | Daniel |
| `date-fns` | 3+ | ~5KB (tree-shakeable) | Formateo de fechas en español | Todos |
| `nanoid` | 5+ | ~1KB | Generación de radicados únicos (PQRSD-20260615-XXXX) | Daniel |

### Peso total estimado del bundle: ~250-300KB (gzipped ~80-100KB)

Es un bundle razonable para una web institucional. Para comparar, La Cardio (WordPress) carga ~1.5MB.

---

## GSAP — GUÍA DE USO EN EL PROYECTO

### Qué es GSAP

GSAP (GreenSock Animation Platform) es la librería de animación más robusta para la web. Desde 2024 es completamente gratuita (antes tenía plugins de pago). Pesa ~23KB el core y tiene integración oficial con React a través del hook `useGSAP()`.

### Plugins de GSAP que vamos a usar

| Plugin | Incluido en core | Para qué |
|--------|-----------------|----------|
| `gsap.to() / gsap.from() / gsap.fromTo()` | Sí | Animaciones básicas (fade, slide, scale) |
| `ScrollTrigger` | Sí (gratis) | Activar animaciones al hacer scroll |
| `TextPlugin` | Sí (gratis) | Animación de texto (conteo de números) |

### Dónde SÍ usar GSAP

| Página | Animación | Descripción |
|--------|-----------|-------------|
| Home — Hero | `gsap.from()` | Fade-in + slide-up del título, subtítulo y CTA al cargar la página |
| Home — Cifras | `ScrollTrigger` + conteo | Los números (10.000 usuarios, 16 años, etc.) cuentan de 0 al valor final al hacer scroll |
| Home — Cards servicios | `ScrollTrigger` + stagger | Las 6 cards aparecen una tras otra con fade-in al scroll |
| Home — Noticias | `ScrollTrigger` | Fade-in suave al entrar en viewport |
| Home — Sedes | `ScrollTrigger` | Fade-in del mapa y las cards de sedes |
| Servicios — Cards | `ScrollTrigger` + stagger | Grid de servicios aparece progresivamente |
| Noticias — Listado | `ScrollTrigger` | Cards con fade-in al scroll |

### Dónde NO usar GSAP

| Página | Por qué no |
|--------|-----------|
| PQRSD (formulario) | El formulario debe ser inmediato, funcional, sin distracciones. Animarlo confunde al usuario y afecta accesibilidad |
| Contacto (formulario) | Mismo motivo |
| Políticas legales | Son páginas de texto legal. Animarlas es innecesario y puede parecer poco profesional |
| Transparencia | Contenido institucional estático, no necesita animación |
| Participa | Igual que Transparencia |
| Calidad | Derechos y deberes del paciente, no animar |
| PQRSD Seguimiento | Página funcional de consulta, no decorativa |
| Dashboard admin (todo) | El admin es una herramienta de trabajo. Debe ser rápido y sin adornos |
| Mapa del sitio | Es una página utilitaria |

### Cómo usar GSAP en Next.js con el hook useGSAP

GSAP en React requiere el hook `useGSAP()` para que el cleanup de animaciones sea automático cuando el componente se desmonta. Sin esto, las animaciones quedan en memoria y generan memory leaks.

```tsx
// components/sections/HeroSection.tsx
"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Registrar plugins UNA SOLA VEZ (fuera del componente)
gsap.registerPlugin(ScrollTrigger);

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Verificar si el usuario prefiere menos movimiento
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) return; // No animar si el usuario lo pidió

    // Animación del hero
    gsap.from(".hero-title", {
      y: 40,
      opacity: 0,
      duration: 0.8,
      ease: "power2.out",
    });

    gsap.from(".hero-subtitle", {
      y: 30,
      opacity: 0,
      duration: 0.8,
      delay: 0.2,
      ease: "power2.out",
    });

    gsap.from(".hero-cta", {
      y: 20,
      opacity: 0,
      duration: 0.6,
      delay: 0.4,
      ease: "power2.out",
    });
  }, { scope: containerRef }); // Scope limita las animaciones a este contenedor

  return (
    <section ref={containerRef} className="relative min-h-[60vh] flex items-center">
      <div className="container mx-auto px-4">
        <h1 className="hero-title text-4xl md:text-5xl font-bold">
          Cardiocentro Pediátrico de Sucre
        </h1>
        <p className="hero-subtitle mt-4 text-lg text-gray-600 max-w-2xl">
          Atención especializada en Cardiología Pediátrica...
        </p>
        <a href="/servicios" className="hero-cta mt-6 inline-block bg-blue-600 text-white px-6 py-3 rounded-lg">
          Conoce nuestros servicios
        </a>
      </div>
    </section>
  );
}
```

### Ejemplo: Conteo de cifras al scroll

```tsx
// components/sections/StatsSection.tsx
"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface StatItem {
  value: number;
  label: string;
  suffix?: string;
}

const stats: StatItem[] = [
  { value: 10000, label: "Usuarios por año", suffix: "+" },
  { value: 16, label: "Años de experiencia" },
  { value: 40000, label: "Familias satisfechas", suffix: "+" },
  { value: 19, label: "Entidades en convenio" },
];

export function StatsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      // Si no quiere animaciones, mostrar los números directamente
      document.querySelectorAll(".stat-number").forEach((el, i) => {
        el.textContent = stats[i].value.toLocaleString("es-CO");
      });
      return;
    }

    // Animar conteo de cada cifra
    stats.forEach((stat, i) => {
      const el = document.querySelectorAll(".stat-number")[i];
      const obj = { val: 0 };

      gsap.to(obj, {
        val: stat.value,
        duration: 2,
        ease: "power1.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",    // Empieza cuando la sección está al 80% del viewport
          toggleActions: "play none none none", // Solo reproduce una vez
        },
        onUpdate: () => {
          el.textContent = Math.floor(obj.val).toLocaleString("es-CO");
        },
      });
    });
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="py-16 bg-blue-900 text-white">
      <div className="container mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {stats.map((stat) => (
          <div key={stat.label}>
            <p className="stat-number text-4xl font-bold">0</p>
            <p className="text-sm mt-2 text-blue-200">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
```

### Ejemplo: Cards con stagger al scroll

```tsx
// components/sections/ServicesPreview.tsx
"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function ServicesPreview() {
  const gridRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.from(".service-card", {
      y: 60,
      opacity: 0,
      duration: 0.6,
      stagger: 0.1,     // Cada card aparece 0.1s después de la anterior
      ease: "power2.out",
      scrollTrigger: {
        trigger: gridRef.current,
        start: "top 85%",
        toggleActions: "play none none none",
      },
    });
  }, { scope: gridRef });

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-10">
          Nuestros Servicios
        </h2>
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Cada card tiene la clase service-card */}
          <div className="service-card bg-white rounded-xl shadow-sm p-6">
            {/* contenido */}
          </div>
          {/* ...más cards */}
        </div>
      </div>
    </section>
  );
}
```

---

## ACCESIBILIDAD CON ANIMACIONES — OBLIGATORIO

### CSS global para respetar prefers-reduced-motion

Agregar esto en `app/globals.css`:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

### En cada componente con GSAP

Siempre verificar `prefers-reduced-motion` antes de animar. El patrón es siempre el mismo:

```tsx
useGSAP(() => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  // ... animaciones
}, { scope: containerRef });
```

Esto cumple el ítem verde fila 18 de la matriz ITA: "Control de contenidos con movimiento y parpadeo."

---

## CONSIDERACIONES IMPORTANTES PARA EL PROYECTO

### Rendimiento

No importar GSAP en páginas que no lo usan. Cada componente que use GSAP debe tener `"use client"` porque GSAP necesita el DOM. Las páginas estáticas (Políticas, Transparencia, Participa, Calidad) deben ser Server Components puros sin GSAP, para que carguen más rápido y pesen menos.

La forma correcta de importar ScrollTrigger es con registración una sola vez:

```tsx
// lib/gsap.ts — archivo centralizado (opcional)
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };
```

Y luego en los componentes:

```tsx
import { gsap, ScrollTrigger } from "@/lib/gsap";
```

### Imágenes

Usar formato WebP con fallback a JPG. Next.js tiene el componente `<Image>` que optimiza automáticamente:

```tsx
import Image from "next/image";

<Image
  src="/images/equipo-cardiologia-pediatrica.webp"
  alt="Equipo de cardiología pediátrica del Cardiocentro realizando un ecocardiograma"
  width={800}
  height={600}
  loading="lazy"       // Lazy load por defecto excepto hero
  placeholder="blur"   // Muestra blur mientras carga
/>
```

Para el hero del home, usar `priority` en vez de lazy:

```tsx
<Image src="/images/hero-cardiocentro.webp" alt="..." priority />
```

### Variables de entorno

Crear archivo `.env.local` en la raíz del proyecto (nunca subirlo a Git):

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# reCAPTCHA
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=6Le...
RECAPTCHA_SECRET_KEY=6Le...

# Resend (emails)
RESEND_API_KEY=re_...

# Upstash Redis (rate limiting)
UPSTASH_REDIS_REST_URL=https://...
UPSTASH_REDIS_REST_TOKEN=AX...
```

Las variables con `NEXT_PUBLIC_` son visibles en el frontend. Las que no tienen ese prefijo solo están disponibles en el servidor (API routes, middleware).

### .gitignore

Verificar que `.gitignore` incluya:

```
node_modules/
.next/
.env.local
.env*.local
.vercel
```

### Estructura de branches en Git

```
main          → producción (lo que está en Vercel)
develop       → desarrollo (rama de integración)
feature/*     → features nuevas (feature/pqrsd, feature/noticias)
fix/*         → correcciones (fix/validacion-pqrsd)
```

Flujo: crear branch desde `develop` → desarrollar → Pull Request a `develop` → revisar → merge → cuando esté listo, merge `develop` → `main` para deploy.

---

## SERVICIOS EXTERNOS — CUENTAS NECESARIAS

| Servicio | URL | Plan | Para qué | Quién lo configura |
|----------|-----|------|----------|-------------------|
| Supabase | supabase.com | Free | Base de datos, Auth, Storage | Daniel |
| Vercel | vercel.com | Free | Deploy, SSL, CDN | Daniel |
| Upstash | upstash.com | Free | Redis para rate limiting | Daniel |
| Resend | resend.com | Free (100 emails/día) | Emails PQRSD y contacto | Daniel |
| Google reCAPTCHA | google.com/recaptcha | Free | Antispam formularios | Daniel |
| GitHub | github.com | Free | Repositorio de código | Daniel |
| UptimeRobot | uptimerobot.com | Free | Monitoreo de disponibilidad | Daniel |

### Cuentas del cliente que necesitamos

El acceso al panel DNS del dominio `cardiopediasucre.com` para apuntar a Vercel, y la decisión sobre si usan Resend o el SMTP de su correo corporativo para los emails automáticos.

---

## COMANDO RÁPIDO — SETUP COMPLETO EN MAC

Si quieres instalar todo de una vez, copia y pega esto:

```bash
# 1. Crear proyecto
npx create-next-app@latest cardiopedia-web --typescript --tailwind --eslint --app --turbopack --import-alias "@/*"
cd cardiopedia-web

# 2. Instalar todas las dependencias
npm install @supabase/supabase-js @supabase/ssr gsap @gsap/react react-hook-form @hookform/resolvers zod @tiptap/react @tiptap/starter-kit @tiptap/extension-image @tiptap/extension-link @tiptap/extension-placeholder @tiptap/pm lucide-react sonner clsx tailwind-merge @upstash/ratelimit @upstash/redis resend dompurify react-google-recaptcha-v3 date-fns nanoid

# 3. Instalar tipos para desarrollo
npm install -D @types/dompurify

# 4. Crear archivo de variables de entorno
touch .env.local

# 5. Abrir en VS Code
code .
```

Mac no afecta la instalación de ninguna de estas librerías. Todo es npm estándar y funciona igual en Mac, Linux o Windows.
