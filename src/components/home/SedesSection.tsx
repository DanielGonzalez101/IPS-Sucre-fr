"use client";

import { useRef, useState, useCallback } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { MapPin, Phone, Clock } from "lucide-react";

const sedes = [
  {
    id: "sincelejo",
    ciudad: "Sincelejo",
    direccion: "Calle 14 No. 17-72 / Barrio Ford",
    telefono: "(+57) 300 912 7565",
    horario: "L–V 7:00 a.m.–12:00 m. / 1:00–6:00 p.m.\nSáb 7:00–11:00 a.m.",
    mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3946.123!2d-75.39770!3d9.30470!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e5a504f0e6b9b7b%3A0x123456789abcdef!2sCalle%2014%20%2317-72%2C%20Sincelejo%2C%20Sucre!5e0!3m2!1ses!2sco!4v1700000000000!5m2!1ses!2sco",
  },
  {
    id: "carmen",
    ciudad: "El Carmen de Bolívar",
    direccion: "Calle 23 No. 54-20 / Barrio Bureche",
    telefono: "(+57) 300 912 7565",
    horario: "L–V 7:00 a.m.–12:00 m. / 1:00–6:00 p.m.",
    mapUrl: "",
  },
  {
    id: "magangue",
    ciudad: "Magangué",
    direccion: "Calle 16 No. 12-56 / Barrio San José",
    telefono: "(+57) 300 912 7565",
    horario: "L–V 7:00 a.m.–12:00 m. / 1:00–6:00 p.m.",
    mapUrl: "",
  },
];

export function SedesSection() {
  const sectionRef   = useRef<HTMLDivElement>(null);
  const mapWrapRef   = useRef<HTMLDivElement>(null);
  const cardsRef     = useRef<HTMLDivElement>(null);
  const [activeSede, setActiveSede] = useState(sedes[0].id);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      // Heading entrada
      gsap.from(".sedes-heading", {
        y: 36,
        opacity: 0,
        duration: 0.65,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      });

      // Logo decorativo — fade + float suave
      gsap.from(".sedes-logo", {
        opacity: 0,
        scale: 0.85,
        duration: 1.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });
      gsap.to(".sedes-logo", {
        y: -10,
        duration: 3.5,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        delay: 1.1,
      });

      // Mapa entrada
      gsap.from(".sedes-map", {
        x: -40,
        opacity: 0,
        duration: 0.75,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".sedes-content",
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });

      // Cards entrada escalonada
      gsap.from(".sede-card", {
        x: 40,
        opacity: 0,
        duration: 0.55,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".sedes-content",
          start: "top 78%",
          toggleActions: "play none none none",
        },
      });

      // Hover lift en cards inactivas
      const cards = cardsRef.current?.querySelectorAll(".sede-card") ?? [];
      cards.forEach((card) => {
        card.addEventListener("mouseenter", () => {
          if (!card.getAttribute("aria-pressed") || card.getAttribute("aria-pressed") === "false") {
            gsap.to(card, { y: -4, duration: 0.25, ease: "power2.out" });
          }
        });
        card.addEventListener("mouseleave", () => {
          gsap.to(card, { y: 0, duration: 0.25, ease: "power2.out" });
        });
      });
    },
    { scope: sectionRef, dependencies: [] }
  );

  const handleSedeClick = useCallback((id: string) => {
    if (id === activeSede) return;

    // Pulse en la card clickeada
    const clickedCard = cardsRef.current?.querySelector(`[data-sede="${id}"]`);
    if (clickedCard) {
      gsap.fromTo(clickedCard,
        { scale: 0.97 },
        { scale: 1.02, duration: 0.3, ease: "back.out(2)" }
      );
    }

    // Fade out mapa → cambiar sede → fade in
    if (mapWrapRef.current) {
      gsap.to(mapWrapRef.current, {
        opacity: 0,
        scale: 0.97,
        duration: 0.25,
        ease: "power2.in",
        onComplete: () => {
          setActiveSede(id);
          gsap.to(mapWrapRef.current, {
            opacity: 1,
            scale: 1,
            duration: 0.45,
            ease: "power3.out",
          });
        },
      });
    } else {
      setActiveSede(id);
    }
  }, [activeSede]);

  const sede = sedes.find((s) => s.id === activeSede) ?? sedes[0];

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden py-16 md:py-24"
      style={{ backgroundColor: "#fff" }}
      aria-labelledby="sedes-title"
    >
      {/* Logo decorativo — fondo */}
      <div
        className="sedes-logo pointer-events-none select-none absolute"
        aria-hidden="true"
        style={{
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          opacity: 0.045,
          zIndex: 0,
        }}
      >
        <Image
          src="/images/logo-watermark.png"
          alt=""
          width={320}
          height={320}
          style={{ width: 320, height: 320, objectFit: "contain" }}
        />
      </div>

      <div className="container-main relative z-10">
        {/* Heading */}
        <div className="sedes-heading text-center mb-12">
          <p
            className="font-heading font-semibold text-sm uppercase tracking-widest mb-3"
            style={{ color: "var(--color-rojo-500)" }}
          >
            Nuestras sedes
          </p>
          <h2
            id="sedes-title"
            className="font-heading font-bold text-3xl md:text-4xl"
            style={{ color: "var(--color-azul-900)" }}
          >
            Estamos cerca de ti
          </h2>
        </div>

        <div className="sedes-content grid grid-cols-1 md:grid-cols-[60%_40%] gap-6 items-start">

          {/* Mapa */}
          <div
            ref={mapWrapRef}
            className="sedes-map rounded-2xl overflow-hidden aspect-video"
            style={{
              border: "1px solid var(--color-gris-200)",
              backgroundColor: "var(--color-gris-50)",
              boxShadow: "0 4px 24px rgba(6,36,77,0.08)",
            }}
          >
            {sede.mapUrl ? (
              <iframe
                src={sede.mapUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={`Mapa de sede ${sede.ciudad}`}
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-3">
                <MapPin size={40} aria-hidden="true" style={{ color: "var(--color-azul-200)" }} />
                <p className="font-body text-sm" style={{ color: "var(--color-gris-400)" }}>
                  Mapa próximamente disponible
                </p>
              </div>
            )}
          </div>

          {/* Cards */}
          <div ref={cardsRef} className="flex flex-col gap-4">
            {sedes.map(({ id, ciudad, direccion, telefono, horario }) => {
              const isActive = id === activeSede;
              return (
                <button
                  key={id}
                  data-sede={id}
                  onClick={() => handleSedeClick(id)}
                  className="sede-card text-left w-full focus-visible:ring-2 focus-visible:ring-azul-600 focus-visible:ring-offset-2"
                  style={{
                    borderRadius: "20px",
                    padding: "1.25rem 1.5rem",
                    backgroundColor: isActive ? "var(--color-azul-900)" : "#fff",
                    boxShadow: isActive
                      ? "0 8px 32px rgba(6,36,77,0.22)"
                      : "0 1px 4px rgba(0,0,0,0.07)",
                    transform: isActive ? "scale(1.02)" : "scale(1)",
                    transition: "background-color 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease",
                  }}
                  aria-pressed={isActive}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: "12px",
                          backgroundColor: isActive ? "rgba(255,255,255,0.12)" : "var(--color-azul-50)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          transition: "background-color 0.3s ease",
                        }}
                        aria-hidden="true"
                      >
                        <MapPin size={18} style={{ color: isActive ? "#fff" : "var(--color-azul-700)", transition: "color 0.3s ease" }} />
                      </div>
                      <div>
                        <h3
                          className="font-heading font-bold text-lg leading-tight"
                          style={{ color: isActive ? "#fff" : "var(--color-azul-900)", transition: "color 0.3s ease" }}
                        >
                          {ciudad}
                        </h3>
                        <p
                          className="font-body text-sm mt-0.5"
                          style={{ color: isActive ? "rgba(255,255,255,0.60)" : "var(--color-gris-500)", transition: "color 0.3s ease" }}
                        >
                          Sucre — Colombia
                        </p>
                      </div>
                    </div>
                    {isActive && (
                      <span
                        className="font-heading font-semibold text-xs px-2.5 py-1 rounded-full shrink-0"
                        style={{ backgroundColor: "var(--color-rojo-500)", color: "#fff" }}
                      >
                        Activa
                      </span>
                    )}
                  </div>

                  {/* Dirección */}
                  <p
                    className="font-body text-sm leading-relaxed mb-3"
                    style={{
                      color: isActive ? "rgba(255,255,255,0.78)" : "var(--color-gris-600)",
                      paddingLeft: "52px",
                      transition: "color 0.3s ease",
                    }}
                  >
                    {direccion}
                  </p>

                  {/* Detalles — solo activa */}
                  {isActive && (
                    <div
                      className="space-y-2 pt-3"
                      style={{ borderTop: "1px solid rgba(255,255,255,0.12)", paddingLeft: "52px" }}
                    >
                      <p className="font-body text-sm flex items-center gap-2" style={{ color: "rgba(255,255,255,0.75)" }}>
                        <Phone size={14} aria-hidden="true" style={{ color: "var(--color-rojo-400)", flexShrink: 0 }} />
                        {telefono}
                      </p>
                      <p className="font-body text-sm flex items-start gap-2 whitespace-pre-line" style={{ color: "rgba(255,255,255,0.75)" }}>
                        <Clock size={14} className="mt-0.5 shrink-0" aria-hidden="true" style={{ color: "var(--color-rojo-400)" }} />
                        {horario}
                      </p>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
