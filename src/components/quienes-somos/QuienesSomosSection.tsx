"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Building2,
  Users,
  Award,
  Handshake,
} from "lucide-react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger, SplitText } from "@/lib/gsap";

const stats = [
  { value: 15,    suffix: "+", label: "Años de experiencia", icon: Award },
  { value: 3,     suffix: "",  label: "Sedes en la región",  icon: Building2 },
  { value: 40000, suffix: "+", label: "Familias satisfechas", icon: Users },
  { value: 19,    suffix: "",  label: "Entidades en convenio", icon: Handshake },
];

// 2010–2017: hitos fundacionales — efecto llamativo (sticky stack pineado).
const timelineStack = [
  {
    year: "2010",
    text: "Inicia como consultorio en Sincelejo con el Dr. Leandro Ruiz Moreno en cardiología pediátrica.",
  },
  {
    year: "2015",
    text: "Se constituye formalmente como IPS bajo el nombre Cardiocentro Pediátrico de Sucre.",
  },
  {
    year: "2016",
    text: "Ingresa la Dra. Alicia Llach López, ampliando los servicios de Ecografía y Doppler.",
  },
  {
    year: "2017",
    text: "Traslado a la sede actual en el Barrio Ford, en una edificación nueva y amplia.",
  },
];

// 2018–2026: grilla compacta, sin pin — placeholders de ejemplo a
// reemplazar con el texto real de cada año.
const timelineRecent = [
  { year: "2018", text: "Se incorpora un nuevo equipo de ecocardiografía Doppler color, ampliando la capacidad diagnóstica para cardiopatías congénitas." },
  { year: "2019", text: "Inicia el convenio con nuevas EPS de la región, ampliando la cobertura de atención para familias de Sucre y Bolívar." },
  { year: "2020", text: "Se adaptan los protocolos de atención con medidas de bioseguridad reforzadas para garantizar la continuidad del servicio." },
  { year: "2021", text: "Se abre la segunda sede en El Carmen de Bolívar, acercando la atención especializada a más municipios de la región." },
  { year: "2022", text: "Se implementa el sistema de agendamiento de citas en línea, facilitando el acceso de los pacientes al servicio." },
  { year: "2023", text: "Se incorpora un nuevo especialista en radiología pediátrica, fortaleciendo el equipo de diagnóstico por imágenes." },
  { year: "2024", text: "Se abre la tercera sede en Magangué, consolidando la presencia del Cardiocentro en tres municipios de la región." },
  { year: "2025", text: "Se renueva el equipo de rayos X digital, mejorando la calidad y el tiempo de entrega de los estudios." },
  { year: "2026", text: "Se lanza el nuevo portal web institucional, con módulo de PQRSD y consulta de citas en línea para los usuarios." },
];

export default function QuienesSomosSection() {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (prefersReduced) {
        document.querySelectorAll<HTMLElement>(".stat-number").forEach((el, i) => {
          el.textContent = stats[i].value.toLocaleString("es-CO");
        });
        return;
      }

      // Misión — reveal palabra por palabra: cada palabra pasa de opacidad
      // tenue a opacidad plena en scrub, como si el texto "se encendiera"
      // a medida que se hace scroll. Distinto del split-por-líneas de Visión.
      const misionStatement = document.querySelector<HTMLElement>(".mision-statement");
      if (misionStatement) {
        gsap.set(".mision-word", { opacity: 0.15 });
        gsap.to(".mision-word", {
          opacity: 1,
          stagger: 0.04,
          ease: "none",
          scrollTrigger: {
            trigger: misionStatement,
            start: "top 75%",
            end: "top 20%",
            scrub: true,
          },
        });

        gsap.set([".mision-eyebrow", ".mision-detail"], { opacity: 0, y: 16 });
        gsap.to(".mision-eyebrow", {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "power3.out",
          scrollTrigger: {
            trigger: misionStatement,
            start: "top 80%",
          },
        });
        gsap.to(".mision-detail", {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".mision-detail",
            start: "top 88%",
          },
        });
      }

      gsap.set(".stat-fade", { opacity: 0, y: 24 });
      gsap.to(".stat-fade", {
        opacity: 1,
        y: 0,
        duration: 0.55,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".trayectoria-stats",
          start: "top 90%",
        },
      });

      stats.forEach((stat, i) => {
        const el = document.querySelectorAll<HTMLElement>(".stat-number")[i];
        if (!el) return;
        const obj = { val: 0 };

        gsap.to(obj, {
          val: stat.value,
          duration: 2,
          ease: "power1.out",
          scrollTrigger: {
            trigger: ".trayectoria-stats",
            start: "top 90%",
            toggleActions: "play none none none",
          },
          onUpdate() {
            el.textContent = Math.floor(obj.val).toLocaleString("es-CO");
          },
        });
      });

      gsap.set(".vision-fade", { opacity: 0, y: 24 });
      gsap.to(".vision-fade", {
        opacity: 1,
        y: 0,
        duration: 0.55,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".vision-section",
          start: "top 90%",
        },
      });

      // Line split on scroll — responsive: SplitText recalcula las líneas
      // automáticamente si cambia el ancho del contenedor (autoSplit).
      const visionParagraph = document.querySelector<HTMLElement>(".vision-paragraph");
      if (visionParagraph) {
        SplitText.create(visionParagraph, {
          type: "lines",
          linesClass: "vision-line",
          autoSplit: true,
          mask: "lines",
          onSplit(self) {
            gsap.set(self.lines, { yPercent: 110, opacity: 0 });
            return gsap.to(self.lines, {
              yPercent: 0,
              opacity: 1,
              duration: 0.7,
              stagger: 0.12,
              ease: "power3.out",
              scrollTrigger: {
                trigger: visionParagraph,
                start: "top 88%",
              },
            });
          },
        });
      }

      // Paneles apilados (sticky stack): cada card se pinea al tope del
      // viewport y se queda fija mientras la siguiente sube por encima y
      // la cubre. z-index creciente + leve scale/oscurecido dan la
      // sensación de profundidad del apilado.
      //
      // El scroll POR CARD se calcula a partir de un total fijo para toda
      // la sección (no un % fijo por card) — así, si se agregan o quitan
      // hitos con el tiempo, el recorrido total de la sección no crece:
      // solo se reparte entre más o menos paneles.
      const historiaCards = gsap.utils.toArray<HTMLElement>(".historia-card");
      if (historiaCards.length > 0) {
        const HISTORIA_TOTAL_VH = 180; // % de alto de viewport para TODA la sección
        const perCard = HISTORIA_TOTAL_VH / historiaCards.length;

        historiaCards.forEach((card, i) => {
          const isLast = i === historiaCards.length - 1;

          // Cada card pinea por su porción de la distancia total y SIEMPRE
          // reserva su propio spacer (pinSpacing) — así el layout de las
          // secciones siguientes (Trayectoria, Visión) nunca colapsa ni
          // se recalcula mal.
          ScrollTrigger.create({
            trigger: card,
            start: "top top",
            end: isLast ? "+=10%" : `+=${perCard}%`,
            pin: true,
            pinSpacing: true,
          });

          if (!isLast) {
            gsap.to(card, {
              scale: 0.94,
              opacity: 0.5,
              ease: "none",
              scrollTrigger: {
                trigger: historiaCards[i + 1],
                start: "top bottom",
                end: "top top",
                scrub: true,
              },
            });
          }
        });
      }

      // Historia reciente — reveal ligero por scroll normal (sin pin, sin
      // scrub): no consume distancia de scroll extra, cada item aparece al
      // entrar en viewport.
      gsap.set(".historia-recent-item", { opacity: 0, y: 20 });
      gsap.to(".historia-recent-item", {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".historia-recent",
          start: "top 85%",
        },
      });
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      aria-labelledby="quienes-somos-title"
      className="py-16 md:py-24"
      style={{ backgroundColor: "#fff" }}
    >
      <div className="container-main mb-6 md:mb-8">

        {/* ── Bloque 1: Encabezado ── */}
        <div className="mb-10 md:mb-14">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <h1
              id="quienes-somos-title"
              className="font-heading font-bold text-3xl md:text-4xl lg:text-5xl leading-tight"
              style={{ color: "var(--color-azul-900)", maxWidth: "36rem" }}
            >
              Más de 15 años cuidando corazones en la región Caribe
            </h1>
            <p
              className="font-body text-base md:text-lg leading-relaxed md:text-right"
              style={{ color: "var(--color-gris-600)", maxWidth: "28rem" }}
            >
              Especialistas en Cardiología Pediátrica, Radiología y Diagnóstico por Imágenes al servicio de Sucre y la región.
            </p>
          </div>
        </div>

        {/* ── Bloque 2: Bento grid ── */}
        <div className="grid grid-cols-12 gap-4">

          {/* Card A — Imagen equipo (col-span-12) */}
          <div
            className="col-span-12 relative overflow-hidden transition-transform duration-200 hover:scale-[1.01]"
            style={{ borderRadius: "1.5rem", minHeight: "360px" }}
          >
            <Image
              src="/images/hero-team.png"
              alt="Equipo médico del Cardiocentro Pediátrico de Sucre"
              fill
              className="object-cover object-top"
              sizes="(max-width: 768px) 100vw, 58vw"
              priority
            />
            {/* Gradiente inferior para legibilidad del texto */}
            <div
              className="absolute inset-0"
              style={{
                background: "linear-gradient(to top, rgba(6,36,77,0.82) 0%, rgba(6,36,77,0.30) 45%, transparent 100%)",
              }}
              aria-hidden="true"
            />

            {/* Badge flotante */}
            <div className="absolute top-5 left-5">
              <span
                className="inline-flex items-center gap-1.5 font-heading font-semibold text-xs px-3 py-1.5"
                style={{
                  backgroundColor: "rgba(255,255,255,0.15)",
                  backdropFilter: "blur(8px)",
                  border: "1px solid rgba(255,255,255,0.30)",
                  borderRadius: "999px",
                  color: "#fff",
                }}
              >
                Desde 2010 en Sincelejo
              </span>
            </div>

            {/* Texto Nosotros sobre la imagen */}
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
              <h2 className="font-heading font-bold text-xl text-white mb-2">
                Nosotros
              </h2>
              <p className="font-body text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.88)" }}>
                Somos una organización dedicada a prestar servicios de atención especializada en Cardiología Pediátrica,
                Radiología, y Diagnóstico por Imágenes; con más de siete años de experiencia en el sector salud lo que
                nos permite un conocimiento profundo del servicio, para aplicarlo en beneficio de todos nuestros usuarios
                en Sincelejo y los departamentos de Bolívar, Córdoba y Magdalena.
              </p>
            </div>
          </div>

        </div>{/* fin bento grid */}
      </div>

      {/* ── Bloque 2.3: Misión — statement editorial centrado, fondo blanco ── */}
      <div className="mision-statement">
        <div className="container-main">
          <p className="mision-eyebrow">— Misión</p>
          <p className="mision-quote">
            <span className="mision-word">Somos</span>{" "}
            <span className="mision-word">una</span>{" "}
            <span className="mision-word">organización</span>{" "}
            <span className="mision-word">que</span>{" "}
            <span className="mision-word">nos</span>{" "}
            <span className="mision-word mision-word--accent">apasiona</span>{" "}
            <span className="mision-word">ofrecer</span>{" "}
            <span className="mision-word">un</span>{" "}
            <span className="mision-word">excelente</span>{" "}
            <span className="mision-word">servicio</span>{" "}
            <span className="mision-word">en</span>{" "}
            <span className="mision-word">la</span>{" "}
            <span className="mision-word">atención</span>{" "}
            <span className="mision-word">especializada</span>{" "}
            <span className="mision-word">en</span>{" "}
            <span className="mision-word">Cardiología</span>{" "}
            <span className="mision-word">Pediátrica,</span>{" "}
            <span className="mision-word">Radiología</span>{" "}
            <span className="mision-word">y</span>{" "}
            <span className="mision-word">Diagnóstico</span>{" "}
            <span className="mision-word">por</span>{" "}
            <span className="mision-word">imágenes.</span>
          </p>
          <p className="mision-detail">
            Contamos con un talento humano capacitado, íntegro y comprometido con las actividades que se
            realizan, ofreciendo servicios de calidad y logrando diagnósticos confiables y oportunos,
            caracterizada por el más alto desarrollo profesional y tecnológico.
          </p>
        </div>
      </div>

      {/* ── Bloque 2.4: Reseña histórica — paneles apilados (sticky stack) en scroll vertical ── */}
      <div className="historia-section">
        <div className="container-main historia-header">
          {/* <span
            className="inline-flex items-center gap-1.5 font-heading font-semibold text-xs px-3 py-1.5 mb-4"
            style={{
              backgroundColor: "var(--color-azul-100)",
              color: "var(--color-azul-800)",
              borderRadius: "999px",
            }}
          >
            + Reseña histórica
          </span> */}

          <h2
            className="font-heading font-bold text-2xl mb-3"
            style={{ color: "var(--color-azul-900)" }}
          >
            Nuestra historia
          </h2>
          <p className="font-body text-sm mb-4 text-center" style={{ color: "var(--color-gris-500)" }}>
            Desplázate para recorrer la línea de tiempo ↓
          </p>
        </div>

        <div role="list" aria-label="Línea de tiempo de hitos fundacionales de la institución">
          {timelineStack.map((hito, i) => (
            <div
              key={hito.year}
              className="historia-card"
              role="listitem"
              style={{ zIndex: i + 1 }}
            >
              <div className="container-main historia-card-inner">
                <span className="historia-card-index">
                  {String(i + 1).padStart(2, "0")}/{String(timelineStack.length).padStart(2, "0")}
                </span>
                <p className="historia-card-year" aria-hidden="true">{hito.year}</p>
                <div className="historia-card-body">
                  <p className="historia-card-year-small">{hito.year}</p>
                  <p className="historia-card-text">{hito.text}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Bloque 2.45: Historia reciente — grilla compacta, sin pin, sección propia ── */}
      <div className="historia-recent">
        <div className="container-main">
          {/* <span
            className="inline-flex items-center gap-1.5 font-heading font-semibold text-xs px-3 py-1.5 mb-4"
            style={{
              backgroundColor: "var(--color-azul-100)",
              color: "var(--color-azul-800)",
              borderRadius: "999px",
            }}
          >
            Últimos años
          </span> */}
          <h2
            className="font-heading font-bold text-2xl mb-8"
            style={{ color: "var(--color-azul-900)" }}
          >
            Seguimos creciendo
          </h2>

          <div className="historia-recent-grid" role="list" aria-label="Línea de tiempo reciente de la institución">
            {timelineRecent.map((hito) => (
              <div key={hito.year} className="historia-recent-item" role="listitem">
                <p className="historia-recent-year">{hito.year}</p>
                <p className="historia-recent-text">{hito.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Bloque 2.5: Nuestra trayectoria en números ── */}
      <div className="trayectoria-stats py-16 px-4" style={{ backgroundColor: "#F8F9FC" }}>
        <div className="container-main">
          <div className="mb-10 md:mb-12 text-left">
            <span
              className="stat-fade inline-flex items-center gap-1.5 font-heading font-semibold text-xs px-3 py-1.5 mb-4"
              style={{
                backgroundColor: "rgba(238,53,56,0.10)",
                color: "var(--color-rojo-500)",
                borderRadius: "999px",
              }}
            >
              + Trayectoria
            </span>
            <h2
              className="stat-fade font-heading font-bold text-2xl"
              style={{ color: "var(--color-azul-900)" }}
            >
              Nuestra trayectoria en números
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-0">
            {stats.map(({ value, suffix, label, icon: Icon }, i) => (
              <div
                key={label}
                className={`stat-fade flex flex-col items-start gap-2 md:px-6 ${i === 0 ? "md:pl-0" : ""} ${
                  i !== stats.length - 1 ? "md:border-r" : ""
                }`}
                style={i !== stats.length - 1 ? { borderColor: "var(--color-gris-200)" } : undefined}
              >
                <Icon className="w-5 h-5" aria-hidden="true" style={{ color: "var(--color-rojo-500)" }} />
                <p
                  className="font-heading font-black text-3xl sm:text-4xl md:text-[2.75rem] leading-none"
                  style={{
                    color: "var(--color-azul-900)",
                    fontVariantNumeric: "tabular-nums",
                    minWidth: `${value.toLocaleString("es-CO").length + suffix.length}ch`,
                  }}
                >
                  <span className="stat-number">0</span>
                  {suffix && <span style={{ color: "var(--color-rojo-500)" }}>{suffix}</span>}
                </p>
                <p className="font-body text-sm" style={{ color: "var(--color-gris-500)" }}>
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Bloque 2.6: Visión ── */}
      <div className="vision-section" style={{ backgroundColor: "#fff" }}>
        <div className="max-w-4xl mx-auto py-16 px-4">
          <div
            className="flex-1 md:pr-8 md:border-r"
            style={{ borderColor: "var(--color-gris-200)" }}
          >
            <h2
              className="vision-fade font-heading font-bold text-2xl mb-4"
              style={{ color: "var(--color-azul-900)" }}
            >
              Visión
            </h2>

            <p
              className="vision-paragraph font-body text-base leading-relaxed"
              style={{ color: "var(--color-gris-600)" }}
            >
              En el año {new Date().getFullYear()} seremos una empresa sólida y reconocida por la excelente prestación de servicio en la
              atención especializada en Cardiología pediátrica, Radiología, y Diagnóstico por imágenes; por su calidad
              técnica, excelente atención, seguridad y oportunidad; buscando la exquisitez, satisfaciendo las
              perspectivas y necesidades de nuestros usuarios.
            </p>
          </div>
        </div>
      </div>

      <div className="container-main">
        {/* ── Bloque 3: CTA final ── */}
        <div
          className="mt-10 md:mt-14 flex flex-col md:flex-row items-center justify-between gap-6 p-8 md:p-10"
          style={{
            borderRadius: "1.5rem",
            backgroundColor: "var(--color-azul-900)",
          }}
        >
          <div>
            <p
              className="font-heading font-bold text-xl md:text-2xl text-white mb-1"
            >
              ¿Quieres conocer a nuestro equipo?
            </p>
            <p className="font-body text-sm" style={{ color: "rgba(255,255,255,0.70)" }}>
              Conéctate con los profesionales que cuidan la salud de tu familia.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <Link
              href="/equipo"
              className="inline-flex items-center justify-center font-heading font-semibold text-sm text-white rounded-full px-6 py-3 transition-all duration-200 hover:opacity-90 active:scale-95 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2"
              style={{
                backgroundColor: "var(--color-rojo-500)",
                boxShadow: "0 4px 16px 0 rgba(238,53,56,0.40)",
              }}
            >
              Ver equipo humano
            </Link>
            <Link
              href="/contactos"
              className="inline-flex items-center justify-center font-heading font-semibold text-sm rounded-full px-6 py-3 border-2 transition-all duration-200 active:scale-95 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2"
              style={{
                color: "#fff",
                borderColor: "rgba(255,255,255,0.40)",
                backgroundColor: "rgba(255,255,255,0.06)",
                backdropFilter: "blur(4px)",
              }}
            >
              Contáctanos
            </Link>
          </div>
        </div>
      </div>

    </section>
  );
}
