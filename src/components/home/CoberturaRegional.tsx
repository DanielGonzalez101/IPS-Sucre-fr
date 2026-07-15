import { MapPin, Navigation } from "lucide-react";

const DEPARTAMENTOS = ["Sucre", "Bolívar", "Córdoba", "Magdalena"];

export function CoberturaRegional() {
  return (
    <section
      className="py-10 md:py-14"
      style={{ backgroundColor: "var(--color-azul-50)" }}
      aria-labelledby="cobertura-title"
    >
      <div className="container-main">
        <div
          className="flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-10 p-6 md:p-8"
          style={{
            borderRadius: "20px",
            backgroundColor: "#fff",
            boxShadow: "var(--shadow-card)",
          }}
        >
          <div
            className="w-12 h-12 flex items-center justify-center shrink-0"
            style={{ backgroundColor: "var(--color-azul-100)", borderRadius: "14px" }}
            aria-hidden="true"
          >
            <MapPin size={22} style={{ color: "var(--color-azul-800)" }} />
          </div>

          <div className="flex-1">
            <p
              className="font-heading font-semibold text-sm uppercase tracking-widest mb-1.5"
              style={{ color: "var(--color-rojo-500)" }}
            >
              Presencia regional
            </p>
            <h2
              id="cobertura-title"
              className="font-heading font-bold text-xl md:text-2xl mb-2"
              style={{ color: "var(--color-azul-900)" }}
            >
              Con cobertura en 4 departamentos de la región Caribe
            </h2>
            <p className="font-body text-sm md:text-base leading-relaxed" style={{ color: "var(--color-gris-600)" }}>
              Además de nuestras sedes, contamos con disposición de traslado a otros municipios de acuerdo a la demanda de nuestros usuarios.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5 md:max-w-[220px] md:justify-end">
            {DEPARTAMENTOS.map((depto) => (
              <span
                key={depto}
                className="inline-flex items-center gap-1.5 font-heading font-semibold text-sm px-4 py-1.5"
                style={{
                  backgroundColor: "var(--color-azul-50)",
                  color: "var(--color-azul-800)",
                  borderRadius: "999px",
                }}
              >
                <Navigation size={13} aria-hidden="true" />
                {depto}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
