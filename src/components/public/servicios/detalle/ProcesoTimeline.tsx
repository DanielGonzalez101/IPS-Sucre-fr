import type { PasoProceso } from "@/data/servicios-detalle";

interface Props {
  pasos?: PasoProceso[];
  orientacion: "vertical" | "horizontal";
  dark?: boolean;
}

export function ProcesoTimeline({ pasos, orientacion, dark = false }: Props) {
  if (!pasos || pasos.length === 0) return null;

  const textoTitulo = dark ? "#fff" : "var(--color-azul-900)";
  const textoDetalle = dark ? "rgba(255,255,255,0.75)" : "var(--color-gris-600)";

  if (orientacion === "horizontal") {
    const COLS_LG: Record<number, string> = {
      1: "lg:grid-cols-1",
      2: "lg:grid-cols-2",
      3: "lg:grid-cols-3",
      4: "lg:grid-cols-4",
    };
    const colsClase = COLS_LG[Math.min(pasos.length, 4)];

    return (
      <div>
        <h2 className="font-heading font-bold text-xl mb-6" style={{ color: "var(--color-azul-900)" }}>
          Cómo es el proceso
        </h2>
        <ol className={`grid gap-4 sm:grid-cols-2 ${colsClase}`}>
          {pasos.map((paso, i) => (
            <li
              key={paso.titulo}
              className="servicio-detalle-paso-horizontal relative participa-glass rounded-2xl p-5 pt-6"
            >
              <span
                className="inline-flex items-center justify-center w-8 h-8 rounded-full font-heading font-bold text-sm mb-3"
                style={{ backgroundColor: "var(--color-azul-50)", color: "var(--color-azul-800)" }}
                aria-hidden="true"
              >
                {i + 1}
              </span>
              <p className="font-heading font-semibold text-sm mb-1" style={{ color: "var(--color-azul-900)" }}>
                {paso.titulo}
              </p>
              <p className="font-body text-sm leading-relaxed" style={{ color: "var(--color-gris-600)" }}>
                {paso.detalle}
              </p>
            </li>
          ))}
        </ol>
      </div>
    );
  }

  return (
    <div>
      <h2 className="font-heading font-bold text-xl mb-6" style={{ color: textoTitulo }}>
        Cómo es el proceso
      </h2>
      <ol className="relative">
        <span
          aria-hidden="true"
          className={`absolute top-2 bottom-2 left-[15px] w-px ${
            dark ? "servicio-detalle-timeline-linea--navy" : "servicio-detalle-timeline-linea"
          }`}
        />
        {pasos.map((paso, i) => (
          <li key={paso.titulo} className="relative flex gap-4 pb-6 last:pb-0">
            <span
              className={`relative z-10 shrink-0 inline-flex items-center justify-center w-8 h-8 rounded-full font-heading font-bold text-sm ${
                dark ? "servicio-detalle-glass-navy text-white" : "participa-glass"
              }`}
              style={!dark ? { color: "var(--color-azul-800)" } : undefined}
              aria-hidden="true"
            >
              {i + 1}
            </span>
            <div className="pt-1">
              <p className="font-heading font-semibold text-sm mb-1" style={{ color: textoTitulo }}>
                {paso.titulo}
              </p>
              <p className="font-body text-sm leading-relaxed" style={{ color: textoDetalle }}>
                {paso.detalle}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
