"use client";

import { MagnifyingGlass } from "@phosphor-icons/react";

interface Props {
  letras: string[];
  letraActiva: string | null;
  busqueda: string;
  onLetraChange: (letra: string | null) => void;
  onBusquedaChange: (valor: string) => void;
}

export function ServiciosAlfabeticoFiltro({
  letras,
  letraActiva,
  busqueda,
  onLetraChange,
  onBusquedaChange,
}: Props) {
  return (
    <div className="flex flex-col gap-6">
      <div className="relative">
        <MagnifyingGlass
          size={18}
          weight="bold"
          className="absolute left-4 top-1/2 -translate-y-1/2"
          style={{ color: "var(--color-gris-400)" }}
          aria-hidden="true"
        />
        <label htmlFor="buscador-servicios" className="sr-only">
          Buscar servicio por nombre
        </label>
        <input
          id="buscador-servicios"
          type="text"
          value={busqueda}
          onChange={(e) => onBusquedaChange(e.target.value)}
          placeholder="Buscar un servicio..."
          className="w-full font-body text-sm rounded-full py-3 pl-11 pr-4 border transition-colors duration-150 focus:outline-none"
          style={{
            borderColor: "var(--color-gris-200)",
            backgroundColor: "#fff",
            color: "var(--color-azul-900)",
          }}
          onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(27, 43, 94, 0.5)")}
          onBlur={(e) => (e.currentTarget.style.borderColor = "var(--color-gris-200)")}
        />
      </div>

      <div
        className="flex flex-wrap gap-2"
        role="group"
        aria-label="Filtrar servicios por letra inicial"
      >
        {letras.map((letra) => {
          const activa = letraActiva === letra;
          return (
            <button
              key={letra}
              type="button"
              onClick={() => onLetraChange(activa ? null : letra)}
              aria-pressed={activa}
              aria-label={`Servicios que empiezan con ${letra}`}
              className="w-10 h-10 flex items-center justify-center font-heading font-bold text-sm rounded-full border-2 transition-all duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              style={
                activa
                  ? {
                      backgroundColor: "#1B2B5E",
                      borderColor: "#1B2B5E",
                      color: "#fff",
                    }
                  : {
                      backgroundColor: "#fff",
                      borderColor: "var(--color-gris-200)",
                      color: "var(--color-azul-900)",
                    }
              }
            >
              {letra}
            </button>
          );
        })}
      </div>
    </div>
  );
}
