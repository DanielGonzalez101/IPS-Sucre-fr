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

const ICONS: Record<string, LucideIcon> = {
  Stethoscope,
  Heartbeat: HeartPulse,
  Pulse: Activity,
  Timer: Watch,
  Gauge,
  Waves,
  DropHalf: Radar,
  FirstAid: ShieldPlus,
  HeartPulse,
  Dumbbell,
  RotateCw,
  Radar,
  Bone,
  Scan,
};

export interface ServicioCardData {
  id: string;
  titulo: string;
  descripcion: string;
  icono: string;
  slug: string;
  categoria?: string;
  preparacion?: string | null;
}

interface ServicioCardProps {
  servicio: ServicioCardData;
  index: number;
  featured?: boolean;
}

export default function ServicioCard({ servicio, index, featured = false }: ServicioCardProps) {
  const Icon = ICONS[servicio.icono] ?? Stethoscope;
  const numero = String(index + 1).padStart(2, "0");

  return (
    <div
      className="servicio-card group relative flex flex-col overflow-hidden rounded-2xl p-6 transition-all duration-300 hover:shadow-md hover:scale-[1.02] border bg-white border-[var(--color-gris-100)] hover:bg-[var(--color-azul-900)]! hover:border-transparent"
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      <span
        aria-hidden="true"
        className="absolute top-2 right-4 font-heading font-bold text-6xl leading-none opacity-10 select-none transition-colors duration-300 text-[var(--color-azul-900)] group-hover:text-white"
      >
        {numero}
      </span>

      <div className="relative z-10 w-8 h-8 flex items-center justify-center rounded-xl mb-5 transition-colors duration-300 bg-[var(--color-azul-50)] group-hover:bg-white/20">
        <Icon
          className="w-5 h-5 transition-colors duration-300 text-[var(--color-azul-800)] group-hover:text-white"
          aria-hidden="true"
        />
      </div>

      <h3 className="relative z-10 font-heading font-bold text-lg mb-2 transition-colors duration-300 text-[var(--color-azul-900)] group-hover:text-white">
        {servicio.titulo}
      </h3>

      <p
        className="relative z-10 font-body text-sm leading-relaxed line-clamp-2 transition-colors duration-300 text-[var(--color-gris-600)] group-hover:text-white/80"
      >
        {servicio.descripcion}
      </p>
    </div>
  );
}
