"use client";

import { useMemo, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import ServicioCard from "./ServicioCard";
import type { Servicio, ServicioCategoria } from "@/data/servicios.mock";

type Filtro = "todos" | ServicioCategoria;

const FILTROS: { value: Filtro; label: string }[] = [
  { value: "todos", label: "Todos" },
  { value: "cardiologia", label: "Cardiología Pediátrica" },
  { value: "radiologia", label: "Radiología / Diagnóstico por Imágenes" },
];

interface ServiciosGridProps {
  servicios: Servicio[];
}

export default function ServiciosGrid({ servicios }: ServiciosGridProps) {
  const [filtro, setFiltro] = useState<Filtro>("todos");
  const containerRef = useRef<HTMLDivElement>(null);

  const serviciosFiltrados = useMemo(() => {
    const lista =
      filtro === "todos" ? servicios : servicios.filter((s) => s.categoria === filtro);
    return [...lista].sort((a, b) => a.orden - b.orden);
  }, [servicios, filtro]);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      gsap.set(".servicio-card", { opacity: 0, y: 24 });
      gsap.to(".servicio-card", {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 85%",
        },
      });
    },
    { scope: containerRef, dependencies: [filtro] }
  );

  return (
    <section
      aria-labelledby="servicios-grid-title"
      className="py-16 md:py-24"
      style={{ backgroundColor: "#fff" }}
    >
      <div className="container-main">
        <div className="mb-10 md:mb-14">
          <span
            className="inline-flex items-center gap-1.5 font-heading font-semibold text-sm px-4 py-1.5 mb-4"
            style={{
              backgroundColor: "var(--color-azul-100)",
              color: "var(--color-azul-800)",
              borderRadius: "999px",
            }}
          >
            + Nuestros Servicios
          </span>
          <h2
            id="servicios-grid-title"
            className="font-heading font-bold text-3xl md:text-4xl leading-tight"
            style={{ color: "var(--color-azul-900)" }}
          >
            Nuestros Servicios
          </h2>
        </div>

        <div className="flex flex-wrap gap-3 mb-10" role="tablist" aria-label="Filtrar servicios por categoría">
          {FILTROS.map(({ value, label }) => {
            const activo = filtro === value;
            return (
              <button
                key={value}
                type="button"
                role="tab"
                aria-selected={activo}
                onClick={() => setFiltro(value)}
                className={`font-heading font-semibold text-sm px-5 py-2.5 rounded-full transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 ${
                  activo
                    ? "text-white"
                    : "text-gray-600 bg-gray-100 hover:bg-gray-200"
                }`}
                style={activo ? { backgroundColor: "var(--color-azul-900)" } : undefined}
              >
                {label}
              </button>
            );
          })}
        </div>

        <div
          ref={containerRef}
          key={filtro}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {serviciosFiltrados.map((servicio, index) => (
            <ServicioCard
              key={servicio.id}
              servicio={servicio}
              index={index}
              featured={index === 0}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
