"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { getQueEsParticipa } from "@/lib/participa";

// Ítem ITA 1934 (matriz de cumplimiento, sección 8. Participa): solo se
// cumple si las tres preguntas quedan visibles al mismo tiempo, por eso
// se listan las tres explícitamente en vez de un acordeón que las oculte.
export default function ParticipaQueEs() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const items = getQueEsParticipa();

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      gsap.from(".que-es-item", {
        y: 30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
      });
    },
    { scope: sectionRef }
  );

  if (items.length === 0) return null;

  return (
    <section
      ref={sectionRef}
      className="relative py-16 md:py-20 overflow-hidden"
      style={{ backgroundColor: "var(--color-gris-50)" }}
      aria-labelledby="que-es-participa-title"
    >
      <div className="participa-section-blobs" aria-hidden="true" />

      <div className="container-main relative z-10">
        <h2
          id="que-es-participa-title"
          className="font-heading font-bold text-2xl md:text-3xl mb-8"
          style={{ color: "var(--color-azul-900)" }}
        >
          ¿Qué es Participa?
        </h2>

        <div className="participa-glass rounded-2xl p-6 md:p-10 grid md:grid-cols-3 gap-8">
          {items.map((item) => (
            <div key={item.id} className="que-es-item">
              <h3
                className="font-heading font-bold text-lg mb-3"
                style={{ color: "var(--color-azul-800)" }}
              >
                {item.pregunta}
              </h3>
              <p
                className="font-body text-base leading-relaxed"
                style={{ color: "var(--color-gris-700)" }}
              >
                {item.respuesta}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
