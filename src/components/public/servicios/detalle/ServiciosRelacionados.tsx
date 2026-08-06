import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { ServicioDetalle } from "@/data/servicios-detalle";

interface Props {
  servicios: ServicioDetalle[];
  dark?: boolean;
}

export function ServiciosRelacionados({ servicios, dark = false }: Props) {
  if (servicios.length === 0) return null;

  return (
    <div>
      <p
        className="font-heading font-semibold text-sm mb-3"
        style={{ color: dark ? "#fff" : "var(--color-azul-900)" }}
      >
        Servicios relacionados
      </p>
      <ul className="space-y-2" role="list">
        {servicios.map((servicio) => (
          <li key={servicio.id}>
            <Link
              href={`/servicios/catalogo/${servicio.slug}`}
              className={`group flex items-center justify-between gap-3 rounded-xl px-4 py-3 font-body text-sm transition-colors duration-200 ${
                dark ? "servicio-detalle-glass-navy text-white/90 hover:text-white" : "participa-glass participa-glass--interactive"
              }`}
              style={!dark ? { color: "var(--color-azul-900)" } : undefined}
            >
              <span className="line-clamp-1">{servicio.nombre}</span>
              <ArrowUpRight size={16} aria-hidden="true" className="shrink-0" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
