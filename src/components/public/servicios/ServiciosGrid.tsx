"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ServicioCard, { type ServicioCardData } from "./ServicioCard";

const PAGE_SIZE = 9;

type Filtro =
  | "todos"
  | "Cardiología Pediátrica"
  | "Cardiología Adultos"
  | "Gastroenterología"
  | "Diagnóstico por Imágenes";

const FILTROS: { value: Filtro; label: string }[] = [
  { value: "todos",                    label: "Todos" },
  { value: "Cardiología Pediátrica",   label: "Cardiología Pediátrica" },
  { value: "Cardiología Adultos",      label: "Cardiología Adultos" },
  { value: "Gastroenterología",        label: "Gastroenterología" },
  { value: "Diagnóstico por Imágenes", label: "Diagnóstico por Imágenes" },
];

const PREFIJOS_DIAGNOSTICO = ["Radiología", "Mamografía", "Tomografía", "Ecografías", "Estudios"];

interface ServicioConCategoria extends ServicioCardData {
  categoria: string;
  orden: number;
}

interface ServiciosGridProps {
  servicios: ServicioConCategoria[];
}

export default function ServiciosGrid({ servicios }: ServiciosGridProps) {
  const [filtro, setFiltro] = useState<Filtro>("todos");
  const [pagina, setPagina] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  const serviciosFiltrados = useMemo(() => {
    let lista: ServicioConCategoria[];
    if (filtro === "todos") {
      lista = servicios;
    } else if (filtro === "Diagnóstico por Imágenes") {
      lista = servicios.filter((s) =>
        PREFIJOS_DIAGNOSTICO.some((p) => s.categoria.startsWith(p))
      );
    } else {
      lista = servicios.filter((s) => s.categoria.startsWith(filtro));
    }
    return [...lista].sort((a, b) => a.orden - b.orden);
  }, [servicios, filtro]);

  const totalPaginas = Math.max(1, Math.ceil(serviciosFiltrados.length / PAGE_SIZE));

  const serviciosPagina = useMemo(
    () => serviciosFiltrados.slice((pagina - 1) * PAGE_SIZE, pagina * PAGE_SIZE),
    [serviciosFiltrados, pagina]
  );

  // Resetea a página 1 cuando cambia el filtro de categoría
  useEffect(() => { setPagina(1); }, [filtro]);

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
    { scope: containerRef, dependencies: [filtro, pagina] }
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

        <div
          className="flex flex-wrap gap-3 mb-10"
          role="tablist"
          aria-label="Filtrar servicios por categoría"
        >
          {FILTROS.map(({ value, label }) => {
            const activo = filtro === value;
            return (
              <button
                key={value}
                type="button"
                role="tab"
                aria-selected={activo}
                onClick={() => setFiltro(value)}
                className="font-heading font-semibold text-sm px-5 py-2.5 rounded-full transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-offset-2"
                style={
                  activo
                    ? { backgroundColor: "var(--color-azul-900)", color: "#fff" }
                    : { backgroundColor: "#F3F4F6", color: "#4B5563" }
                }
              >
                {label}
              </button>
            );
          })}
        </div>

        <div
          ref={containerRef}
          key={`${filtro}-${pagina}`}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {serviciosPagina.map((servicio, index) => (
            <ServicioCard
              key={servicio.id}
              servicio={servicio}
              index={(pagina - 1) * PAGE_SIZE + index}
              featured={pagina === 1 && index === 0}
            />
          ))}
        </div>

        {totalPaginas > 1 && (
          <div className="flex items-center justify-center gap-3 mt-12">
            <button
              type="button"
              onClick={() => setPagina((p) => Math.max(1, p - 1))}
              disabled={pagina === 1}
              aria-label="Página anterior"
              className="w-10 h-10 flex items-center justify-center rounded-full border-2 transition-all duration-150 disabled:opacity-40 disabled:pointer-events-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              style={{ borderColor: "var(--color-azul-200)", color: "var(--color-azul-800)" }}
            >
              <ChevronLeft size={16} />
            </button>

            <div className="flex items-center gap-1.5">
              {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setPagina(n)}
                  aria-label={`Página ${n}`}
                  aria-current={pagina === n ? "page" : undefined}
                  className="w-9 h-9 flex items-center justify-center rounded-full font-heading font-semibold text-sm transition-all duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                  style={
                    pagina === n
                      ? { backgroundColor: "var(--color-azul-900)", color: "#fff" }
                      : { backgroundColor: "transparent", color: "var(--color-azul-700)" }
                  }
                >
                  {n}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setPagina((p) => Math.min(totalPaginas, p + 1))}
              disabled={pagina === totalPaginas}
              aria-label="Página siguiente"
              className="w-10 h-10 flex items-center justify-center rounded-full border-2 transition-all duration-150 disabled:opacity-40 disabled:pointer-events-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              style={{ borderColor: "var(--color-azul-200)", color: "var(--color-azul-800)" }}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
