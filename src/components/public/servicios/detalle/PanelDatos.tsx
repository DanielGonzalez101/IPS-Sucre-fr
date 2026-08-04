import { MapPin, UserRound, Clock, Video, Gauge } from "lucide-react";
import { SEDES, type NivelComplejidad } from "@/data/servicios-detalle";

interface Props {
  sedes?: string[];
  especialista?: string;
  horario?: string;
  modalidad?: string;
  nivelComplejidad?: NivelComplejidad;
  dark?: boolean;
}

export function PanelDatos({ sedes, especialista, horario, modalidad, nivelComplejidad, dark = false }: Props) {
  const sedesTexto = sedes && sedes.length > 0 ? sedes.map((clave) => SEDES[clave]?.nombre ?? clave).join(" · ") : undefined;

  const items = [
    { label: sedes && sedes.length > 1 ? "Sedes" : "Sede", valor: sedesTexto, Icon: MapPin },
    { label: "Especialista", valor: especialista, Icon: UserRound },
    { label: "Horario", valor: horario, Icon: Clock },
    { label: "Modalidad", valor: modalidad, Icon: Video },
    { label: "Nivel de complejidad", valor: nivelComplejidad, Icon: Gauge },
  ].filter((item) => item.valor);

  if (items.length === 0) return null;

  const textoPrincipal = dark ? "text-white" : "";
  const textoSecundario = dark ? "text-white/70" : "";

  return (
    <div className={`rounded-2xl p-6 ${dark ? "servicio-detalle-glass-navy" : "participa-glass"}`}>
      <p
        className="font-heading font-semibold text-sm mb-4"
        style={{ color: dark ? "#fff" : "var(--color-azul-900)" }}
      >
        Datos del servicio
      </p>
      <dl className="space-y-4">
        {items.map(({ label, valor, Icon }) => (
          <div key={label} className="flex items-start gap-3">
            <Icon
              size={18}
              aria-hidden="true"
              className={`shrink-0 mt-0.5 ${dark ? "text-white/80" : ""}`}
              style={!dark ? { color: "var(--color-azul-700)" } : undefined}
            />
            <div>
              <dt className={`font-heading font-semibold text-xs ${textoSecundario}`} style={!dark ? { color: "var(--color-gris-500)" } : undefined}>
                {label}
              </dt>
              <dd className={`font-body text-sm ${textoPrincipal}`} style={!dark ? { color: "var(--color-azul-900)" } : undefined}>
                {valor}
              </dd>
            </div>
          </div>
        ))}
      </dl>
    </div>
  );
}
