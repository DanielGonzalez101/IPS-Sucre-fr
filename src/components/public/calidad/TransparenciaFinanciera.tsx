import { FileText } from "lucide-react";
import { DOCUMENTOS_FINANCIEROS_MOCK } from "@/data/calidad.mock";

export default function TransparenciaFinanciera() {
  return (
    <section
      className="py-16 md:py-24"
      style={{ backgroundColor: "var(--color-gris-50)" }}
      aria-labelledby="transparencia-title"
    >
      <div className="container-main">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span
            className="inline-flex items-center rounded-full px-4 py-1.5 font-heading font-semibold text-sm mb-4"
            style={{ backgroundColor: "var(--color-azul-50)", color: "var(--color-azul-800)" }}
          >
            + Transparencia
          </span>

          <h2
            id="transparencia-title"
            className="font-heading font-bold leading-tight mb-4"
            style={{ fontSize: "clamp(1.75rem, 3vw, 2.5rem)", color: "var(--color-azul-900)" }}
          >
            Transparencia Financiera
          </h2>

          <p className="font-body text-base leading-relaxed" style={{ color: "var(--color-gris-600)" }}>
            Conoce nuestros estados financieros, dictámenes y certificaciones,
            disponibles para consulta pública.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {DOCUMENTOS_FINANCIEROS_MOCK.map((doc) => (
            <a
              key={doc.id}
              href={doc.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-2xl p-6 bg-white transition-all duration-200 hover:shadow-md hover:scale-[1.01]"
              style={{ boxShadow: "var(--shadow-card)" }}
            >
              <FileText
                className="w-7 h-7 mb-4"
                aria-hidden="true"
                style={{ color: "var(--color-rojo-500)" }}
              />

              <h3
                className="font-heading font-semibold text-base mb-1"
                style={{ color: "var(--color-azul-900)" }}
              >
                {doc.titulo}
              </h3>

              {doc.año && (
                <p className="font-body text-sm mb-4" style={{ color: "var(--color-gris-500)" }}>
                  {doc.año}
                </p>
              )}

              <span
                className="font-heading font-medium text-sm inline-block mt-2"
                style={{ color: "var(--color-rojo-500)" }}
              >
                Descargar PDF →
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
