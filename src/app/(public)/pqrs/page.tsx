import type { Metadata } from "next";
import PqrsForm from "@/components/public/pqrs/PqrsForm";

export const metadata: Metadata = {
  title: "PQRSD — Peticiones, Quejas, Reclamos y Sugerencias | IPS Sucre",
  description:
    "Radique sus Peticiones, Quejas, Reclamos, Solicitudes, Denuncias o Sugerencias. Su opinión nos ayuda a mejorar.",
};

export default function PqrsPage() {
  return (
    <>
      {/* Hero */}
      <section
        aria-labelledby="pqrs-heading"
        className="py-16 md:py-20"
        style={{ backgroundColor: "var(--color-azul-900)" }}
      >
        <div className="container-main text-center">
          <span
            className="inline-flex items-center gap-1.5 font-semibold text-sm px-4 py-1.5 mb-6"
            style={{
              backgroundColor: "rgba(238,53,56,0.18)",
              color: "var(--color-rojo-400)",
              borderRadius: "999px",
            }}
          >
            Sistema PQRSD
          </span>
          <h1
            id="pqrs-heading"
            className="font-bold text-3xl md:text-4xl lg:text-5xl text-white mb-4"
          >
            Su voz nos importa
          </h1>
          <p
            className="text-base md:text-lg max-w-xl mx-auto"
            style={{ color: "rgba(255,255,255,0.75)" }}
          >
            Radique aquí sus Peticiones, Quejas, Reclamos, Solicitudes,
            Denuncias o Sugerencias. Damos respuesta en un plazo máximo de{" "}
            <strong className="text-white">15 días hábiles</strong>.
          </p>
        </div>
      </section>

      {/* Formulario */}
      <section
        className="py-12 md:py-16"
        style={{ backgroundColor: "var(--color-gris-50)" }}
        aria-label="Formulario de radicación PQRSD"
      >
        <div className="container-main">
          <div
            className="max-w-3xl mx-auto rounded-2xl p-6 md:p-10"
            style={{
              backgroundColor: "#fff",
              boxShadow: "var(--shadow-card)",
            }}
          >
            <PqrsForm />
          </div>
        </div>
      </section>
    </>
  );
}
