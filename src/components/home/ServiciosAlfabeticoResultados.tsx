"use client";

import Link from "next/link";
import {
  Stethoscope,
  Heartbeat,
  Pulse,
  Timer,
  Gauge,
  Waves,
  Heart,
  Bone,
  Baby,
  Flask,
  Microscope,
  ArrowUpRight,
  MagnifyingGlass,
  type Icon,
} from "@phosphor-icons/react";
import type { ServicioAlfabetico } from "@/data/servicios-alfabetico.mock";

const ICON_MAP: Record<string, Icon> = {
  Stethoscope,
  Heartbeat,
  Pulse,
  Timer,
  Gauge,
  Waves,
  Heart,
  Bone,
  Baby,
  Flask,
  Microscope,
};

interface Props {
  servicios: ServicioAlfabetico[];
}

export function ServiciosAlfabeticoResultados({ servicios }: Props) {
  if (servicios.length === 0) {
    return (
      <div
        className="participa-glass rounded-3xl flex flex-col items-center justify-center text-center gap-3 py-16 px-6"
        role="status"
      >
        <MagnifyingGlass size={28} style={{ color: "var(--color-gris-400)" }} aria-hidden="true" />
        <p className="font-heading font-semibold text-base" style={{ color: "var(--color-azul-900)" }}>
          No encontramos servicios con ese criterio
        </p>
        <p className="font-body text-sm max-w-xs" style={{ color: "var(--color-gris-500)" }}>
          Prueba con otra letra o escribe otro término de búsqueda.
        </p>
      </div>
    );
  }

  return (
    <div
      className="servicios-alfabetico-grid grid sm:grid-cols-2 gap-4"
      role="list"
      aria-label="Resultados de servicios"
    >
      {servicios.map((servicio) => {
        const Icon = ICON_MAP[servicio.icono ?? ""] ?? Stethoscope;
        return (
          <div
            key={servicio.id}
            role="listitem"
            className="participa-glass participa-glass--grid participa-glass--interactive rounded-2xl p-5 flex flex-col"
          >
            <div
              className="w-10 h-10 flex items-center justify-center mb-3"
              style={{ backgroundColor: "var(--color-azul-50)", borderRadius: "10px" }}
              aria-hidden="true"
            >
              <Icon size={20} weight="duotone" style={{ color: "var(--color-azul-700)" }} />
            </div>

            <p className="font-heading font-semibold text-sm leading-snug mb-1" style={{ color: "var(--color-azul-900)" }}>
              {servicio.nombre}
            </p>
            <p className="font-body text-xs leading-relaxed mb-4 flex-1" style={{ color: "var(--color-gris-600)" }}>
              {servicio.descripcion}
            </p>

            <Link
              href={servicio.url ?? "/servicios"}
              className="inline-flex items-center gap-1.5 font-heading font-semibold text-xs transition-all duration-150 hover:gap-2.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 rounded"
              style={{ color: "#E63B2E" }}
            >
              Explorar
              <ArrowUpRight size={14} aria-hidden="true" />
            </Link>
          </div>
        );
      })}
    </div>
  );
}
