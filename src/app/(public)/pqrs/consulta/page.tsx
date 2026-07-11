import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import PqrsConsulta from "@/components/public/pqrs/PqrsConsulta";

export const metadata: Metadata = {
  title: "Consultar estado de PQRSD | IPS Sucre",
  description:
    "Ingrese su número de radicado y correo electrónico para conocer el estado actual de su solicitud PQRSD.",
};

export default function PqrsConsultaPage() {
  return (
    <>
      {/* Hero */}
      <section
        aria-labelledby="consulta-heading"
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
            Consulta de estado
          </span>
          <h1
            id="consulta-heading"
            className="font-bold text-3xl md:text-4xl text-white mb-4"
          >
            ¿Cómo va mi solicitud?
          </h1>
          <p
            className="text-base md:text-lg max-w-lg mx-auto"
            style={{ color: "rgba(255,255,255,0.75)" }}
          >
            Ingrese el número de radicado y el correo electrónico con el que
            registró su solicitud.
          </p>
        </div>
      </section>

      {/* Contenido */}
      <section
        className="py-12 md:py-16"
        style={{ backgroundColor: "var(--color-gris-50)" }}
        aria-label="Formulario de consulta"
      >
        <div className="container-main">
          <div
            className="max-w-2xl mx-auto rounded-2xl p-6 md:p-10"
            style={{
              backgroundColor: "#fff",
              boxShadow: "var(--shadow-card)",
            }}
          >
            <PqrsConsulta />
          </div>

          {/* Enlace a radicar */}
          <div className="max-w-2xl mx-auto mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
            <Link
              href="/pqrs"
              className="inline-flex items-center gap-2 font-semibold transition-all duration-200 hover:gap-3"
              style={{ color: "var(--color-azul-800)" }}
            >
              <ArrowLeft size={16} aria-hidden="true" />
              Radicar nueva solicitud
            </Link>
            <p style={{ color: "var(--color-gris-500)" }}>
              ¿Necesita ayuda?{" "}
              <Link
                href="/contacto"
                className="font-semibold"
                style={{ color: "var(--color-azul-800)" }}
              >
                Contáctenos
              </Link>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
