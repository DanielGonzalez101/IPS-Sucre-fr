"use client";

import { useRef } from "react";
import { FileText, Download, Clock } from "lucide-react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { getDocumentos } from "@/lib/participa";

// Ítems ITA 1936-1939: política de participación social en salud,
// estrategia de rendición de cuentas, PAAC e informes de implementación.
export default function ParticipaDocumentos() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const documentos = getDocumentos();

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      gsap.from(".documento-card", {
        y: 30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
      });
    },
    { scope: sectionRef }
  );

  if (documentos.length === 0) return null;

  return (
    <section
      ref={sectionRef}
      className="py-16 md:py-20"
      style={{ backgroundColor: "var(--color-gris-50)" }}
      aria-labelledby="documentos-title"
    >
      {/* Sin blobs a propósito: esta sección es la única "sin glass" de la
          página (ver plan de la Fase 1) — sin glass no hay nada que refractar. */}
      <div className="container-main">
        <h2
          id="documentos-title"
          className="font-heading font-bold text-2xl md:text-3xl mb-2"
          style={{ color: "var(--color-azul-900)" }}
        >
          Documentos institucionales
        </h2>
        <p
          className="font-body text-base mb-8"
          style={{ color: "var(--color-gris-600)" }}
        >
          Documentos de participación social en salud de IPS Cardiocentro
          Pediátrico de Sucre.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {documentos.map((doc) => {
            const disponible = doc.url !== null;
            return (
              <div
                key={doc.id}
                className="documento-card participa-solid-card rounded-2xl p-6 flex flex-col"
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: "var(--color-azul-50)" }}
                >
                  <FileText size={20} aria-hidden="true" style={{ color: "var(--color-azul-800)" }} />
                </div>

                <h3
                  className="font-heading font-bold text-base mb-1"
                  style={{ color: "var(--color-azul-900)" }}
                >
                  {doc.titulo}
                  {doc.año && (
                    <span
                      className="ml-2 font-body font-normal text-sm"
                      style={{ color: "var(--color-gris-500)" }}
                    >
                      ({doc.año})
                    </span>
                  )}
                </h3>
                <p
                  className="font-body text-sm leading-relaxed flex-1 mb-4"
                  style={{ color: "var(--color-gris-600)" }}
                >
                  {doc.descripcion}
                </p>

                {disponible ? (
                  <a
                    href={doc.url!}
                    target={doc.url!.startsWith("/") ? undefined : "_blank"}
                    rel={doc.url!.startsWith("/") ? undefined : "noopener noreferrer"}
                    className="inline-flex items-center gap-2 font-heading font-semibold text-sm transition-colors duration-150"
                    style={{ color: "var(--color-rojo-500)" }}
                  >
                    <Download size={16} aria-hidden="true" />
                    Descargar / ver
                  </a>
                ) : (
                  <span
                    className="inline-flex items-center gap-2 font-heading font-semibold text-sm"
                    style={{ color: "var(--color-gris-500)" }}
                  >
                    <Clock size={16} aria-hidden="true" />
                    Documento en actualización
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
