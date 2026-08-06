import { MapPin, Phone } from "lucide-react";
import { SEDES } from "@/data/servicios-detalle";

interface Props {
  sedes?: string[];
  dark?: boolean;
}

export function ContactoSedes({ sedes, dark = false }: Props) {
  if (!sedes || sedes.length === 0) return null;

  return (
    <div>
      <p
        className="font-heading font-semibold text-sm mb-3"
        style={{ color: dark ? "#fff" : "var(--color-azul-900)" }}
      >
        {sedes.length > 1 ? "Sedes donde se presta" : "Sede donde se presta"}
      </p>
      <ul className="space-y-3" role="list">
        {sedes.map((clave) => {
          const sede = SEDES[clave];
          if (!sede) return null;
          return (
            <li key={clave} className="font-body text-sm">
              <p className={`font-heading font-semibold ${dark ? "text-white" : ""}`} style={!dark ? { color: "var(--color-azul-900)" } : undefined}>
                {sede.nombre}
              </p>
              {sede.direccion && (
                <p className={`flex items-center gap-1.5 mt-1 ${dark ? "text-white/75" : ""}`} style={!dark ? { color: "var(--color-gris-600)" } : undefined}>
                  <MapPin size={14} aria-hidden="true" className="shrink-0" />
                  {sede.direccion}
                </p>
              )}
              {sede.telefono && (
                <p className={`flex items-center gap-1.5 mt-0.5 ${dark ? "text-white/75" : ""}`} style={!dark ? { color: "var(--color-gris-600)" } : undefined}>
                  <Phone size={14} aria-hidden="true" className="shrink-0" />
                  {sede.telefono}
                </p>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
