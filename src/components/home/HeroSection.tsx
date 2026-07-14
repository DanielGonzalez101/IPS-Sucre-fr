"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { Heart, MapPin, Star } from "lucide-react";
import type { HeroSlide } from "@/types";

const avatars = [
  { src: "/personal Medico/Dr. Leandro Ruiz Moreno/perso9.png",                            alt: "Dr. Leandro Ruiz Moreno" },
  { src: "/personal Medico/Dra. Alicia Llach López/doctor2.png",                            alt: "Dra. Alicia Llach López" },
  { src: "/personal Medico/Mileinis Tilano Barraza/perso14 (1).png",                       alt: "Mileinis Tilano Barraza" },
  { src: "/personal asistencial y administrativo/José Quintero Pinzón/Auxiliar de Admisiones.png", alt: "José Quintero Pinzón" },
  { src: "/personal asistencial y administrativo/Julieth Contreras Romero/Administradora.png",     alt: "Julieth Contreras Romero" },
];

interface Props {
  slides: HeroSlide[];
}

const SLIDE_DURATION = 6000; // ms por slide

export function HeroSection({ slides }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(0);
  const [next, setNext] = useState<number | null>(null);
  const [transitioning, setTransitioning] = useState(false);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const slide = slides[current];
  const nextSlide = next !== null ? slides[next] : null;
  const hasMultiple = slides.length > 1;

  const goTo = useCallback(
    (index: number) => {
      if (index === current || transitioning) return;
      setProgress(0);
      setNext(index);
      setTransitioning(true);
      setTimeout(() => {
        setCurrent(index);
        setNext(null);
        setTransitioning(false);
      }, 700);
    },
    [current, transitioning]
  );

  // Auto-avance
  useEffect(() => {
    if (!hasMultiple || paused) return;

    const tick = 50;
    const step = (tick / SLIDE_DURATION) * 100;

    progressRef.current = setInterval(() => {
      setProgress((p) => {
        if (p + step >= 100) {
          const nextIndex = (current + 1) % slides.length;
          goTo(nextIndex);
          return 0;
        }
        return p + step;
      });
    }, tick);

    return () => {
      if (progressRef.current) clearInterval(progressRef.current);
    };
  }, [current, paused, hasMultiple, slides.length, goTo]);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      gsap.set(".hero-content", { opacity: 0, y: 32 });
      gsap.to(".hero-content", {
        opacity: 1,
        y: 0,
        duration: 0.65,
        stagger: 0.12,
        ease: "power3.out",
        delay: 0.15,
      });

      gsap.set(".bento-card", { opacity: 0, y: 24 });
      gsap.to(".bento-card", {
        opacity: 1,
        y: 0,
        duration: 0.55,
        stagger: 0.1,
        ease: "power3.out",
        delay: 0.5,
      });

      gsap.set(".diagnostico-chip", { opacity: 0, scale: 0.7, y: 10 });
      gsap.to(".diagnostico-chip", {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.4,
        stagger: 0.08,
        ease: "back.out(1.4)",
        scrollTrigger: {
          trigger: ".diagnostico-chips",
          start: "top 90%",
        },
      });

      const cards = containerRef.current?.querySelectorAll(".bento-card") ?? [];
      cards.forEach((card) => {
        card.addEventListener("mouseenter", () => {
          gsap.to(card, { y: -6, duration: 0.3, ease: "power2.out" });
        });
        card.addEventListener("mouseleave", () => {
          gsap.to(card, { y: 0, duration: 0.3, ease: "power2.out" });
        });
      });
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      className="w-full relative"
      aria-label="Presentación principal"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* ── Hero con imagen de fondo ── */}
      <div className="hero-shell">
        <div className="hero-image-wrap">
          {/* Wrapper que recorta el slide — solo las imágenes */}
          <div className="hero-clip">
            {/* Imagen actual — sale por la izquierda */}
            <div
              key={`slide-${current}`}
              style={{
                position: "absolute",
                inset: 0,
                animation: next !== null
                  ? "slideOutLeft 0.65s cubic-bezier(0.4,0,0.2,1) forwards"
                  : undefined,
              }}
            >
              <Image
                src={slide.imagen_url}
                alt={slide.imagen_alt}
                fill
                className="object-cover"
                priority
                unoptimized={slide.imagen_url.startsWith("http")}
              />
            </div>

            {/* Imagen siguiente — entra por la derecha */}
            {nextSlide && (
              <div
                key={`next-${next}`}
                style={{
                  position: "absolute",
                  inset: 0,
                  animation: "slideInRight 0.65s cubic-bezier(0.4,0,0.2,1) forwards",
                }}
              >
                <Image
                  src={nextSlide.imagen_url}
                  alt={nextSlide.imagen_alt}
                  fill
                  className="object-cover"
                  unoptimized={nextSlide.imagen_url.startsWith("http")}
                />
              </div>
            )}
          </div>

          <div
            className="hero-gradient"
            style={{
              background:
                "linear-gradient(105deg, rgba(6,36,77,0.62) 0%, rgba(6,36,77,0.48) 32%, rgba(6,36,77,0.18) 52%, rgba(6,36,77,0.02) 100%)",
            }}
            aria-hidden="true"
          />
        </div>{/* fin hero-image-wrap */}

        <div className="hero-overlay container-main">
            <div className="hero-copy">

              <span
                className="hero-content inline-flex items-center gap-1.5 font-heading font-semibold text-xs sm:text-sm px-3 sm:px-4 py-1.5 mb-3 sm:mb-5"
                style={{
                  backgroundColor: "rgba(255,255,255,0.06)",
                  color: "#fff",
                  borderRadius: "999px",
                  backdropFilter: "blur(3px)",
                  border: "1px solid rgba(255,255,255,0.25)",
                }}
              >
                <Heart size={13} aria-hidden="true" />
                {slide.badge_texto ?? "Cardiocentro Pediátrico de Sucre"}
              </span>

              <h1
                className="hero-content font-heading font-bold leading-[1.08] mb-3 sm:mb-4 text-white"
                style={{
                  fontSize: "clamp(1.65rem, 4.2vw, 3.8rem)",
                  textShadow: "0 2px 12px rgba(0,0,0,0.35)",
                  transition: "opacity 0.5s ease",
                  opacity: transitioning ? 0 : 1,
                }}
              >
                {slide.titulo}
              </h1>

              {slide.subtitulo && (
                <p
                  className="hero-content font-body text-sm sm:text-base md:text-lg leading-relaxed mb-4 sm:mb-6 md:mb-8"
                  style={{
                    color: "rgba(255,255,255,1)",
                    textShadow: "0 1px 12px rgba(0,0,0,0.55), 0 2px 24px rgba(0,0,0,0.35)",
                    fontWeight: 500,
                    transition: "opacity 0.5s ease",
                    opacity: transitioning ? 0 : 1,
                  }}
                >
                  {slide.subtitulo}
                </p>
              )}

              {/* Botones + avatar stack */}
              <div className="hero-content flex flex-wrap items-center gap-3">
                <Link
                  href="/servicios"
                  className="inline-flex w-full sm:w-auto items-center justify-center font-heading font-semibold text-sm sm:text-[15px] text-white rounded-full px-6 sm:px-7 py-3 sm:py-3.5 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 transition-all duration-200 hover:opacity-90 active:scale-95"
                  style={{
                    backgroundColor: "var(--color-rojo-500)",
                    boxShadow: "0 4px 16px 0 rgba(238,53,56,0.40)",
                  }}
                >
                  Ver nuestros servicios
                </Link>
                <a
                  href="https://cardiocentro.gomedicaltm.co/portal-pacientes"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full sm:w-auto items-center justify-center font-heading font-semibold text-sm sm:text-[15px] rounded-full px-6 sm:px-7 py-3 sm:py-3.5 border-2 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 transition-all duration-200 active:scale-95"
                  style={{
                    color: "#fff",
                    borderColor: "rgba(255,255,255,0.50)",
                    backgroundColor: "rgba(255,255,255,0.06)",
                    backdropFilter: "blur(3px)",
                  }}
                >
                  Tus resultados
                </a>

                <div
                  className="hero-social-proof flex-row items-center gap-3"
                  style={{ borderLeft: "1px solid rgba(255,255,255,0.20)", paddingLeft: "1rem" }}
                >
                  <div className="avatar-stack flex flex-row items-center shrink-0">
                    {avatars.map(({ src, alt }, i) => (
                      <div
                        key={alt}
                        title={alt}
                        className="avatar-item"
                        style={{
                          width: 44,
                          height: 44,
                          borderRadius: "50%",
                          overflow: "hidden",
                          border: "2.5px solid rgba(255,255,255,0.70)",
                          marginLeft: i === 0 ? 0 : -8,
                          flexShrink: 0,
                          boxShadow: "0 2px 8px 0 rgba(0,0,0,0.25)",
                        }}
                      >
                        <Image
                          src={src}
                          alt={alt}
                          width={44}
                          height={44}
                          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }}
                        />
                      </div>
                    ))}
                    <div
                      className="avatar-item"
                      aria-hidden="true"
                      style={{
                        width: 50,
                        height: 50,
                        borderRadius: "50%",
                        border: "2.5px solid rgba(255,255,255,0.70)",
                        marginLeft: -8,
                        flexShrink: 0,
                        backgroundColor: "var(--color-rojo-500)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "0 2px 8px 0 rgba(0,0,0,0.25)",
                      }}
                    >
                      <span className="font-heading font-bold text-xs text-white">+15</span>
                    </div>
                  </div>
                  <div>
                    <p className="font-heading font-bold text-sm text-white leading-snug">
                      Tu familia en las mejores manos
                    </p>
                    <p className="font-body text-sm mt-0.5" style={{ color: "rgba(255,255,255,0.75)" }}>
                      Especialistas en cardiología pediátrica desde 2009
                    </p>
                  </div>
                </div>
              </div>

              {/* Dots con barra de progreso — solo si hay más de un slide */}
              {hasMultiple && (
                <div
                  className="hero-content flex items-center gap-2 mt-6"
                  role="tablist"
                  aria-label="Navegación de slides"
                >
                  {slides.map((s, i) => (
                    <button
                      key={s.id}
                      role="tab"
                      aria-selected={i === current}
                      aria-label={`Slide ${i + 1}: ${s.titulo}`}
                      onClick={() => goTo(i)}
                      className="relative overflow-hidden rounded-full focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 transition-all duration-300"
                      style={{
                        width: i === current ? 48 : 8,
                        height: 4,
                        backgroundColor: "rgba(255,255,255,0.30)",
                        border: "none",
                        cursor: "pointer",
                        padding: 0,
                        flexShrink: 0,
                      }}
                    >
                      {i === current && (
                        <span
                          className="absolute inset-y-0 left-0 rounded-full"
                          style={{
                            width: `${progress}%`,
                            backgroundColor: "#fff",
                            transition: "width 50ms linear",
                          }}
                        />
                      )}
                    </button>
                  ))}
                </div>
              )}

            </div>{/* fin hero-copy */}
        </div>{/* fin hero-overlay */}

        {/* Tarjeta Google Maps — solo desktop */}
        <a
          href="https://maps.app.goo.gl/EPKgTqsSgwadC4Xd8"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Ver reseñas en Google Maps — 4,8 estrellas"
          className="hero-rating-card hidden md:flex items-center gap-3 px-5 py-4 z-20"
          style={{ minWidth: "190px" }}
        >
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
            style={{ backgroundColor: "#FEE2E2" }}
            aria-hidden="true"
          >
            <MapPin size={15} style={{ color: "#EF4444" }} />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <p className="font-heading font-black text-xl leading-none" style={{ color: "var(--color-azul-900)" }}>
                4,8
              </p>
              <div className="flex items-center gap-0.5" aria-label="4.8 de 5 estrellas">
                {[1,2,3,4].map((s) => (
                  <Star key={s} size={13} fill="#FBBF24" stroke="none" aria-hidden="true" />
                ))}
                <Star size={13} fill="#FBBF24" stroke="none" style={{ opacity: 0.45 }} aria-hidden="true" />
              </div>
            </div>
            <p className="font-body text-xs" style={{ color: "var(--color-gris-500)" }}>
              en Google Maps
            </p>
          </div>
        </a>
      </div>{/* fin hero-shell */}

      {/* ── Fila inferior: 3 tarjetas bento ── */}
      <div
        className="relative z-20 w-full py-6 px-6 md:px-10 lg:px-14"
        style={{ backgroundColor: "var(--color-gris-50)" }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

          <Link
            href="/servicios#cardiologia"
            className="bento-card group relative flex flex-row focus-visible:ring-2 focus-visible:ring-azul-600 focus-visible:ring-offset-2"
            style={{ borderRadius: "28px", boxShadow: "var(--shadow-card)", backgroundColor: "#F9F9FA", minHeight: "180px" }}
          >
            <div className="flex flex-col justify-between p-7 z-10" style={{ flex: "0 0 58%" }}>
              <div>
                <h2 className="font-heading font-bold text-lg mb-2 leading-snug" style={{ color: "var(--color-azul-900)" }}>
                  Cardiología Pediátrica y Adultos
                </h2>
                <p className="font-body text-sm leading-relaxed" style={{ color: "var(--color-gris-600)" }}>
                  Consulta, ecocardiograma, Holter 24h y monitoreo de presión arterial — para niños y adultos
                </p>
              </div>
              <span
                className="mt-4 font-heading font-semibold text-sm inline-flex items-center gap-1.5 group-hover:gap-2.5 transition-all duration-200"
                style={{ color: "var(--color-azul-800)" }}
              >
                Conocer más →
              </span>
            </div>
            <div className="flex items-end justify-end overflow-hidden" style={{ flex: "1 1 0", borderRadius: "0 28px 28px 0" }}>
              <Image
                src="/3.png"
                alt="Especialistas en cardiología pediátrica"
                width={480}
                height={320}
                style={{ objectFit: "contain", objectPosition: "bottom right", width: "140%", height: "140%" }}
              />
            </div>
          </Link>

          <Link
            href="/servicios#diagnostico"
            className="bento-card group flex flex-col p-7 focus-visible:ring-2 focus-visible:ring-azul-600 focus-visible:ring-offset-2"
            style={{ borderRadius: "28px", background: "linear-gradient(135deg, var(--color-azul-900) 0%, var(--color-azul-700) 100%)", boxShadow: "var(--shadow-button)" }}
          >
            <h2 className="font-heading font-bold text-lg mb-5 leading-snug text-white">
              Diagnóstico por Imágenes
            </h2>
            <div className="diagnostico-chips flex flex-wrap gap-2.5">
              {[
                { label: "Ecografía",     bg: "var(--color-azul-800)",  color: "var(--color-azul-100)" },
                { label: "Doppler color", bg: "rgba(255,255,255,0.12)", color: "#fff" },
                { label: "Rayos X",       bg: "var(--color-azul-600)",  color: "#fff" },
                { label: "Mamografía",    bg: "rgba(255,255,255,0.08)", color: "var(--color-azul-100)" },
                { label: "Tomografía",    bg: "var(--color-azul-800)",  color: "var(--color-azul-100)" },
                { label: "Resonancia",    bg: "var(--color-azul-600)",  color: "#fff" },
              ].map(({ label, bg, color }) => (
                <span
                  key={label}
                  className="diagnostico-chip inline-flex items-center gap-2 font-body text-sm font-medium px-4 py-2"
                  style={{ backgroundColor: bg, color, borderRadius: "9999px" }}
                >
                  <span className="font-bold text-base leading-none">+</span>
                  {label}
                </span>
              ))}
            </div>
            <div style={{ marginTop: "auto" }}>
              <hr style={{ border: "none", borderTop: "1px solid rgba(255,255,255,0.12)", marginBottom: "1.25rem" }} />
              <span
                className="font-heading font-semibold text-sm inline-flex items-center gap-1.5 group-hover:gap-2.5 transition-all duration-200"
                style={{ color: "var(--color-azul-200)" }}
              >
                Ver todos los servicios →
              </span>
            </div>
          </Link>

        </div>
      </div>
    </section>
  );
}