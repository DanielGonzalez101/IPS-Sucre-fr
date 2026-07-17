"use client";

import { useRef } from "react";
import { CalendarClock, CalendarDays } from "lucide-react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { getConvocatorias, getCalendario } from "@/lib/participa";
import { estadoConvocatoria } from "@/data/participa.mock";

// Ítem ITA 1940: convocatorias activas de participación.
// Ítem ITA 1941: calendario de actividades de participación del año.
export default function ParticipaConvocatorias() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const convocatorias = getConvocatorias();
  const calendario = getCalendario();

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      gsap.from(".convocatoria-card, .calendario-item", {
        y: 30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="relative py-16 md:py-20 overflow-hidden"
      style={{ backgroundColor: "#fff" }}
      aria-labelledby="convocatorias-title"
    >
      <div className="participa-section-blobs" aria-hidden="true" />

      <div className="container-main relative z-10 grid lg:grid-cols-2 gap-12">
        {/* Convocatorias */}
        <div>
          <h2
            id="convocatorias-title"
            className="font-heading font-bold text-2xl md:text-3xl mb-6 flex items-center gap-3"
            style={{ color: "var(--color-azul-900)" }}
          >
            <CalendarClock size={26} aria-hidden="true" style={{ color: "var(--color-rojo-500)" }} />
            Convocatorias
          </h2>

          {convocatorias.length === 0 ? (
            <p className="font-body text-base" style={{ color: "var(--color-gris-600)" }}>
              No hay convocatorias activas en este momento.
            </p>
          ) : (
            <ul className="space-y-5">
              {convocatorias.map((c) => {
                const estado = estadoConvocatoria(c.plazoISO);
                return (
                  <li
                    key={c.id}
                    className="convocatoria-card participa-glass participa-glass--interactive rounded-2xl p-6"
                  >
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <h3
                        className="font-heading font-bold text-lg"
                        style={{ color: "var(--color-azul-900)" }}
                      >
                        {c.tema}
                      </h3>
                      <span
                        className="flex-shrink-0 px-3 py-1 rounded-full font-heading font-semibold text-xs"
                        style={{
                          backgroundColor:
                            estado === "abierta" ? "rgba(22,163,74,0.12)" : "var(--color-gris-100)",
                          color: estado === "abierta" ? "var(--color-success)" : "var(--color-gris-500)",
                        }}
                      >
                        {estado === "abierta" ? "Abierta" : "Cerrada"}
                      </span>
                    </div>
                    <p className="font-body text-sm mb-2" style={{ color: "var(--color-gris-700)" }}>
                      <strong>Objetivo:</strong> {c.objetivo}
                    </p>
                    <p className="font-body text-sm mb-2" style={{ color: "var(--color-gris-700)" }}>
                      <strong>Requisitos:</strong> {c.requisitos}
                    </p>
                    <p className="font-body text-sm" style={{ color: "var(--color-gris-500)" }}>
                      Plazo: {c.plazo}
                    </p>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Calendario */}
        <div>
          <h2
            className="font-heading font-bold text-2xl md:text-3xl mb-6 flex items-center gap-3"
            style={{ color: "var(--color-azul-900)" }}
          >
            <CalendarDays size={26} aria-hidden="true" style={{ color: "var(--color-rojo-500)" }} />
            Calendario de actividades
          </h2>

          <ul className="space-y-3" aria-label="Calendario de actividades de participación del año">
            {calendario.map((a) => (
              <li
                key={a.id}
                className="calendario-item flex gap-4 p-4 rounded-xl transition-colors duration-200 hover:bg-[var(--color-gris-50)]"
                style={{ border: "1px solid var(--color-gris-100)" }}
              >
                <span
                  className="flex-shrink-0 w-24 font-heading font-bold text-sm pt-0.5"
                  style={{ color: "var(--color-rojo-500)" }}
                >
                  {a.mes}
                </span>
                <div>
                  <p className="font-heading font-semibold text-sm" style={{ color: "var(--color-azul-900)" }}>
                    {a.actividad}
                  </p>
                  <p className="font-body text-sm mt-0.5" style={{ color: "var(--color-gris-600)" }}>
                    {a.descripcion}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
