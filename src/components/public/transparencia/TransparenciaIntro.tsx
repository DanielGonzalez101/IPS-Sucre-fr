"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";

const ITEMS = [
  {
    id: 1,
    pregunta: "¿Qué es la información pública?",
    respuesta:
      "Es toda información que una entidad genera, obtiene, adquiere o controla en el ejercicio de sus actividades. Toda persona tiene derecho a acceder a ella sin necesidad de justificar su solicitud.",
  },
  {
    id: 2,
    pregunta: "¿Cuál es su derecho?",
    respuesta:
      "Cualquier ciudadano puede solicitar información pública de forma gratuita. La entidad está obligada a responder en un plazo máximo de 10 días hábiles, prorrogable por 10 días adicionales.",
  },
  {
    id: 3,
    pregunta: "¿Cómo solicitarla?",
    respuesta:
      "Puede radicar su solicitud a través del formulario PQRSD disponible en este sitio web, por correo electrónico o de forma presencial en nuestra sede principal en Sincelejo, Sucre.",
  },
];

export default function TransparenciaIntro() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.from(".trans-intro-item", {
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

  return (
    <section
      ref={sectionRef}
      className="relative py-16 md:py-20 overflow-hidden"
      style={{ backgroundColor: "var(--color-gris-50)" }}
      aria-labelledby="trans-intro-title"
    >
      <div className="participa-section-blobs" aria-hidden="true" />

      <div className="container-main relative z-10">
        <h2
          id="trans-intro-title"
          className="font-heading font-bold text-2xl md:text-3xl mb-8"
          style={{ color: "var(--color-azul-900)" }}
        >
          Información pública
        </h2>

        <div className="participa-glass rounded-2xl p-6 md:p-10 grid md:grid-cols-3 gap-8">
          {ITEMS.map((item) => (
            <div key={item.id} className="trans-intro-item">
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
