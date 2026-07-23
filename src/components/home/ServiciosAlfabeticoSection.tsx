"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { CursorClick } from "@phosphor-icons/react";
import { ServiciosAlfabeticoFiltro } from "./ServiciosAlfabeticoFiltro";
import { ServiciosAlfabeticoResultados } from "./ServiciosAlfabeticoResultados";
import type { ServicioAlfabetico } from "@/data/servicios-alfabetico.mock";

interface Props {
  servicios: ServicioAlfabetico[];
}

export function ServiciosAlfabeticoSection({ servicios }: Props) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const resultadosRef = useRef<HTMLDivElement>(null);

  const [letraActiva, setLetraActiva] = useState<string | null>(null);
  const [busquedaInput, setBusquedaInput] = useState("");
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    const timeout = setTimeout(() => setBusqueda(busquedaInput.trim().toLowerCase()), 200);
    return () => clearTimeout(timeout);
  }, [busquedaInput]);

  const letras = useMemo(
    () => Array.from(new Set(servicios.map((s) => s.letra))).sort(),
    [servicios]
  );

  const interactuando = letraActiva !== null || busqueda.length > 0;

  const resultados = useMemo(() => {
    if (!interactuando) return [];
    return servicios.filter((s) => {
      const coincideLetra = !letraActiva || s.letra === letraActiva;
      const coincideBusqueda = !busqueda || s.nombre.toLowerCase().includes(busqueda);
      return coincideLetra && coincideBusqueda;
    });
  }, [servicios, letraActiva, busqueda, interactuando]);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      gsap.set(".servicios-alfabetico-heading", { opacity: 0, y: 24 });
      gsap.to(".servicios-alfabetico-heading", {
        opacity: 1,
        y: 0,
        duration: 0.55,
        ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 85%" },
      });

      gsap.set(".servicios-alfabetico-panel", { opacity: 0, y: 32 });
      gsap.to(".servicios-alfabetico-panel", {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
      });
    },
    { scope: sectionRef }
  );

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      if (!resultadosRef.current) return;

      gsap.fromTo(
        resultadosRef.current.children,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.35, stagger: 0.04, ease: "power2.out" }
      );
    },
    { dependencies: [resultados], scope: resultadosRef }
  );

  if (servicios.length === 0) return null;

  return (
    <section
      ref={sectionRef}
      className="relative py-16 md:py-24 overflow-hidden"
      style={{ backgroundColor: "#fff" }}
      aria-labelledby="servicios-alfabetico-title"
    >
      <div className="participa-section-blobs" aria-hidden="true" />

      <div className="container-main relative z-10">
        <div className="servicios-alfabetico-heading mb-10">
          <span
            className="inline-flex items-center gap-1.5 font-heading font-semibold text-sm px-4 py-1.5 mb-4"
            style={{
              backgroundColor: "var(--color-azul-100)",
              color: "var(--color-azul-800)",
              borderRadius: "999px",
            }}
          >
            + Servicios
          </span>
          <h2
            id="servicios-alfabetico-title"
            className="font-heading font-bold text-3xl md:text-4xl leading-tight"
            style={{ color: "var(--color-azul-900)" }}
          >
            Encuentra tu servicio de A a Z
          </h2>
        </div>

        <div className="grid lg:grid-cols-[300px_1fr] gap-8 items-start">
          <div className="servicios-alfabetico-panel participa-glass rounded-3xl p-6">
            <ServiciosAlfabeticoFiltro
              letras={letras}
              letraActiva={letraActiva}
              busqueda={busquedaInput}
              onLetraChange={setLetraActiva}
              onBusquedaChange={setBusquedaInput}
            />
          </div>

          <div ref={resultadosRef} className="servicios-alfabetico-panel">
            {interactuando ? (
              <ServiciosAlfabeticoResultados servicios={resultados} />
            ) : (
              <div
                className="participa-glass rounded-3xl flex flex-col items-center justify-center text-center gap-3 py-16 px-6"
                role="status"
              >
                <CursorClick size={28} style={{ color: "var(--color-gris-400)" }} aria-hidden="true" />
                <p className="font-heading font-semibold text-base" style={{ color: "var(--color-azul-900)" }}>
                  Elige una letra o escribe el nombre de un servicio
                </p>
                <p className="font-body text-sm max-w-xs" style={{ color: "var(--color-gris-500)" }}>
                  Los resultados aparecerán aquí apenas empieces a filtrar.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
