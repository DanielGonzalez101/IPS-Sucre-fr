import { ShieldCheck, Zap, Baby, Handshake, type LucideIcon } from "lucide-react";

interface Diferenciador {
  icon: LucideIcon;
  titulo: string;
  descripcion: string;
}

const DIFERENCIADORES: Diferenciador[] = [
  {
    icon: ShieldCheck,
    titulo: "Especialistas certificados",
    descripcion: "Profesionales con formación y experiencia en cardiología pediátrica.",
  },
  {
    icon: Zap,
    titulo: "Resultados en línea",
    descripcion: "Consulta tus exámenes de forma rápida desde cualquier lugar.",
  },
  {
    icon: Baby,
    titulo: "Enfoque pediátrico",
    descripcion: "Atención especializada pensada para niñas, niños y adolescentes.",
  },
  {
    icon: Handshake,
    titulo: "19 entidades en convenio",
    descripcion: "Amplia cobertura con EPS y aseguradoras en la región Caribe.",
  },
];

export default function ServiciosDiferenciadores() {
  return (
    <section
      aria-labelledby="servicios-diferenciadores-title"
      className="py-16 md:py-20"
      style={{ backgroundColor: "#F8F9FC" }}
    >
      <div className="container-main">
        <h2 id="servicios-diferenciadores-title" className="sr-only">
          ¿Por qué elegirnos?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0">
          {DIFERENCIADORES.map(({ icon: Icon, titulo, descripcion }, i) => (
            <div
              key={titulo}
              className={`flex flex-col items-start gap-3 lg:px-6 ${i === 0 ? "lg:pl-0" : ""} ${
                i !== DIFERENCIADORES.length - 1 ? "lg:border-r" : ""
              }`}
              style={
                i !== DIFERENCIADORES.length - 1
                  ? { borderColor: "var(--color-gris-200)" }
                  : undefined
              }
            >
              <Icon
                className="w-6 h-6"
                aria-hidden="true"
                style={{ color: "var(--color-rojo-500)" }}
              />
              <p
                className="font-heading font-bold text-base"
                style={{ color: "var(--color-azul-900)" }}
              >
                {titulo}
              </p>
              <p
                className="font-body text-sm leading-relaxed"
                style={{ color: "var(--color-gris-600)" }}
              >
                {descripcion}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
