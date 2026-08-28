"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import {
  Stethoscope,
  Heartbeat,
  Heart,
  Bone,
  Waves,
  Microscope,
  Scan,
  DropHalf,
  MagnifyingGlass,
  type Icon,
} from "@phosphor-icons/react";
import type { ServicioCatalogo } from "@/actions/servicios";

const ICON_MAP: Record<string, Icon> = {
  Stethoscope,
  Heartbeat,
  Heart,
  Bone,
  Waves,
  Microscope,
  Scan,
  DropHalf,
};

interface Props {
  servicios: ServicioCatalogo[];
  total: number;
  mostrados: number;
  onVerMas?: () => void;
}

export function ServiciosAlfabeticoResultados({ servicios, total, mostrados, onVerMas }: Props) {
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

  const restantes = total - mostrados;

  return (
    <div className="flex flex-col gap-4">
      <div
        className="servicios-alfabetico-grid grid sm:grid-cols-2 gap-4"
        role="list"
        aria-label="Resultados de servicios"
      >
        {servicios.map((servicio) => {
          const Icon = ICON_MAP[servicio.icono] ?? Stethoscope;
          return (
            <div key={servicio.id} role="listitem" className="servicios-alfabetico-card">
              <Link
                href={`/servicios/catalogo/${servicio.slug}`}
                className="group participa-glass participa-glass--grid participa-glass--interactive rounded-2xl p-5 flex flex-col h-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                <div className="flex items-start justify-between mb-3">
                  <div
                    className="w-10 h-10 flex items-center justify-center"
                    style={{ backgroundColor: "var(--color-azul-50)", borderRadius: "10px" }}
                    aria-hidden="true"
                  >
                    <Icon size={20} weight="duotone" style={{ color: "var(--color-azul-700)" }} />
                  </div>
                  <div
                    className="w-7 h-7 flex items-center justify-center transition-colors duration-200 group-hover:bg-black"
                    style={{ borderRadius: "50%", backgroundColor: "var(--color-gris-100)" }}
                    aria-hidden="true"
                  >
                    <ArrowUpRight
                      size={14}
                      className="transition-colors duration-200 group-hover:text-white"
                      style={{ color: "var(--color-gris-500)" }}
                    />
                  </div>
                </div>

                <p className="font-heading font-semibold text-sm leading-snug mb-1" style={{ color: "var(--color-azul-900)" }}>
                  {servicio.titulo}
                </p>
                <p className="font-body text-xs" style={{ color: "var(--color-gris-500)" }}>
                  {servicio.categoria}
                </p>
              </Link>
            </div>
          );
        })}
      </div>

      {onVerMas && (
        <div className="flex items-center justify-center pt-2">
          <button
            type="button"
            onClick={onVerMas}
            className="font-heading font-semibold text-sm px-6 py-2.5 rounded-full border-2 transition-all duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{
              borderColor: "var(--color-azul-200)",
              color: "var(--color-azul-800)",
              backgroundColor: "transparent",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "var(--color-azul-50)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            Ver {restantes > 12 ? 12 : restantes} más de {total}
          </button>
        </div>
      )}
    </div>
  );
}
