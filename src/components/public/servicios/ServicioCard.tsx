import Link from "next/link";
import {
  Stethoscope,
  HeartPulse,
  Activity,
  Watch,
  Gauge,
  Dumbbell,
  RotateCw,
  Waves,
  Radar,
  Bone,
  ShieldPlus,
  Scan,
  type LucideIcon,
} from "lucide-react";
import type { Servicio } from "@/data/servicios.mock";

const ICONS: Record<string, LucideIcon> = {
  Stethoscope,
  HeartPulse,
  Activity,
  Watch,
  Gauge,
  Dumbbell,
  RotateCw,
  Waves,
  Radar,
  Bone,
  ShieldPlus,
  Scan,
};

interface ServicioCardProps {
  servicio: Servicio;
  index: number;
  featured?: boolean;
}

export default function ServicioCard({ servicio, index, featured = false }: ServicioCardProps) {
  const Icon = ICONS[servicio.icono] ?? Stethoscope;
  const numero = String(index + 1).padStart(2, "0");

  return (
    <Link
      href={`/servicios/${servicio.slug}`}
      className={`servicio-card group relative flex flex-col overflow-hidden rounded-2xl p-6 transition-all duration-200 hover:shadow-md hover:scale-[1.02] focus-visible:ring-2 focus-visible:ring-offset-2 ${
        featured
          ? "text-white focus-visible:ring-white"
          : "bg-white border"
      }`}
      style={
        featured
          ? { backgroundColor: "var(--color-azul-900)" }
          : { borderColor: "var(--color-gris-100)", boxShadow: "var(--shadow-card)" }
      }
    >
      <span
        aria-hidden="true"
        className="absolute top-2 right-4 font-heading font-bold text-6xl leading-none opacity-10 select-none"
        style={{ color: featured ? "#fff" : "var(--color-azul-900)" }}
      >
        {numero}
      </span>

      <div
        className="relative z-10 w-8 h-8 flex items-center justify-center rounded-xl mb-5"
        style={{ backgroundColor: featured ? "rgba(255,255,255,0.20)" : "var(--color-azul-50)" }}
      >
        <Icon
          className="w-5 h-5"
          aria-hidden="true"
          style={{ color: featured ? "#fff" : "var(--color-azul-800)" }}
        />
      </div>

      <h3
        className={`relative z-10 font-heading font-bold text-lg mb-2 ${featured ? "text-white" : ""}`}
        style={!featured ? { color: "var(--color-azul-900)" } : undefined}
      >
        {servicio.titulo}
      </h3>

      <p
        className={`relative z-10 font-body text-sm leading-relaxed line-clamp-2 mb-6 ${
          featured ? "text-white/80" : "text-gris-600"
        }`}
        style={!featured ? { color: "var(--color-gris-600)" } : undefined}
      >
        {servicio.descripcion}
      </p>

      <span
        className={`relative z-10 mt-auto font-heading font-medium text-sm ${
          featured ? "text-white underline" : ""
        }`}
        style={!featured ? { color: "var(--color-rojo-500)" } : undefined}
      >
        Ver detalle →
      </span>
    </Link>
  );
}
