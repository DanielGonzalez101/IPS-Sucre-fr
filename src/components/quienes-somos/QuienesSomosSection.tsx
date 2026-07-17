"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Eye,
  Building2,
  Users,
  Award,
  Handshake,
} from "lucide-react";
import { Compass } from "@phosphor-icons/react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";

const stats = [
  { value: 15,    suffix: "+", label: "Años de experiencia", icon: Award },
  { value: 3,     suffix: "",  label: "Sedes en la región",  icon: Building2 },
  { value: 40000, suffix: "+", label: "Familias satisfechas", icon: Users },
  { value: 19,    suffix: "",  label: "Entidades en convenio", icon: Handshake },
];

const timeline = [
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

      gsap.set(".mision-icon-wrap", { opacity: 0, scale: 0.6, rotate: -35 });
      gsap.to(".mision-icon-wrap", {
        opacity: 1,
        scale: 1,
        rotate: 0,
        duration: 0.7,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: ".mision-card",
          start: "top 85%",
        },
      });

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
          <span
            className="inline-flex items-center gap-1.5 font-heading font-semibold text-sm px-4 py-1.5 mb-4"
            style={{
              backgroundColor: "var(--color-azul-100)",
              color: "var(--color-azul-800)",
              borderRadius: "999px",
            }}
          >
            + Quiénes Somos
          </span>

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

          {/* Card C — Misión (col-span-5) */}
          <div
            className="mision-card col-span-12 md:col-span-5 flex flex-col p-7 md:p-8 relative overflow-hidden transition-all duration-300 hover:-translate-y-1"
            style={{
              borderRadius: "1.5rem",
              backgroundColor: "#fff",
              border: "1px solid var(--color-gris-200)",
              boxShadow: "var(--shadow-card)",
            }}
          >
            <div
              className="mision-icon-wrap w-14 h-14 flex items-center justify-center mb-5 relative transition-transform duration-500"
              style={{
                backgroundColor: "var(--color-azul-50)",
                borderRadius: "16px",
              }}
              aria-hidden="true"
            >
              <Compass size={28} weight="duotone" style={{ color: "var(--color-azul-700)" }} />
            </div>

            <span
              className="inline-flex items-center gap-1.5 font-heading font-semibold text-xs px-3 py-1.5 mb-3 self-start"
              style={{
                backgroundColor: "var(--color-azul-100)",
                color: "var(--color-azul-800)",
                borderRadius: "999px",
              }}
            >
              + Misión
            </span>

            <h2
              className="font-heading font-bold text-xl mb-3"
              style={{ color: "var(--color-azul-900)" }}
            >
              Misión
            </h2>

            <p
              className="font-body text-sm leading-relaxed"
              style={{ color: "var(--color-gris-700)" }}
            >
              Somos una organización que nos apasiona ofrecer un excelente servicio en la atención especializada en
              Cardiología Pediátrica, Radiología, y Diagnóstico por imágenes; que cuenta con un talento humano capacitado,
              íntegro y comprometido con las actividades que se realizan, ofreciendo servicios de calidad y logrando
              diagnósticos confiables y oportunos, caracterizada por el más alto desarrollo profesional y tecnológico.
            </p>
          </div>

          {/* Card D — Reseña Histórica / Timeline (col-span-7) */}
          <div
            className="col-span-12 md:col-span-7 p-7 md:p-8 transition-transform duration-200 hover:scale-[1.01]"
            style={{
              borderRadius: "1.5rem",
              backgroundColor: "var(--color-gris-50)",
              border: "1px solid var(--color-gris-200)",
            }}
          >
            <span
              className="inline-flex items-center gap-1.5 font-heading font-semibold text-xs px-3 py-1.5 mb-4 self-start"
              style={{
                backgroundColor: "var(--color-azul-100)",
                color: "var(--color-azul-800)",
                borderRadius: "999px",
              }}
            >
              + Reseña histórica
            </span>

            <h2
              className="font-heading font-bold text-xl mb-6"
              style={{ color: "var(--color-azul-900)" }}
            >
              Nuestra historia
            </h2>

            {/* Timeline vertical en mobile, grid simétrico horizontal en desktop */}
            <div className="flex flex-col md:grid md:grid-cols-4 md:gap-4 relative">
              {/* Línea conectora continua — solo desktop, detrás de los puntos */}
              <div
                className="hidden md:block absolute top-1.5 left-0 right-0 h-px"
                style={{ backgroundColor: "var(--color-gris-300)" }}
                aria-hidden="true"
              />

              {timeline.map((hito, i) => (
                <div key={hito.year} className="flex flex-row md:flex-col relative">

                  {/* Punto + línea vertical (mobile) */}
                  <div className="flex flex-col md:block items-center mr-4 md:mr-0 md:mb-4">
                    <div
                      className="w-3 h-3 rounded-full shrink-0 z-10 relative"
                      style={{ backgroundColor: "var(--color-rojo-500)" }}
                      aria-hidden="true"
                    />
                    {i < timeline.length - 1 && (
                      <div
                        className="md:hidden flex-1 w-px"
                        style={{ backgroundColor: "var(--color-gris-300)" }}
                        aria-hidden="true"
                      />
                    )}
                  </div>

                  {/* Contenido del hito */}
                  <div className="pb-6 md:pb-0">
                    <p
                      className="font-heading font-black text-xl md:text-2xl leading-none mb-1.5"
                      style={{ color: "var(--color-rojo-500)" }}
                    >
                      {hito.year}
                    </p>
                    <p
                      className="font-body text-sm leading-relaxed"
                      style={{ color: "var(--color-gris-700)" }}
                    >
                      {hito.text}
                    </p>
                  </div>

                </div>
              ))}
            </div>
          </div>

        </div>{/* fin bento grid */}
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
            <div className="vision-fade flex items-center gap-2 mb-4">
              <Eye className="w-6 h-6" aria-hidden="true" style={{ color: "var(--color-azul-900)" }} />
              <span className="font-heading font-medium text-sm" style={{ color: "var(--color-rojo-500)" }}>
                + Visión
              </span>
            </div>

            <h2
              className="vision-fade font-heading font-bold text-2xl mb-4"
              style={{ color: "var(--color-azul-900)" }}
            >
              Visión
            </h2>

            <p
              className="vision-fade font-body text-base leading-relaxed"
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
