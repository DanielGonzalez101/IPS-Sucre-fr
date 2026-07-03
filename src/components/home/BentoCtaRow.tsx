"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { Clock, Stethoscope, Handshake, Cpu, CalendarCheck } from "lucide-react";

const benefits = [
  {
    icon: CalendarCheck,
    title: "Reserva de citas en línea",
    desc: "Solicita tu cita desde cualquier lugar con tu celular o computador.",
  },
  {
    icon: Stethoscope,
    title: "Equipo médico cualificado",
    desc: "Profesionales con los más altos estándares de calidad y experiencia.",
  },
  {
    icon: Handshake,
    title: "Convenios",
    desc: "Convenios con distintas instituciones para soluciones integrales.",
  },
  {
    icon: Cpu,
    title: "Equipo tecnológico",
    desc: "Equipos de última generación que garantizan la calidad del diagnóstico.",
  },
];

export function BentoCtaRow() {
  const rowRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      gsap.set(".bento-cta-row > *", { opacity: 0, y: 28 });
      gsap.to(".bento-cta-row > *", {
        opacity: 1,
        y: 0,
        duration: 0.55,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: rowRef.current,
          start: "top 85%",
        },
      });
    },
    { scope: rowRef }
  );

  return (
    <section ref={rowRef} className="bento-cta-section" aria-labelledby="benefits-title">
      <div className="container-main">
        <div className="bento-cta-row">

          {/* ── Izquierda: imagen + horario ── */}
          <div className="bento-cta-left">
            <div className="bento-cta-img" aria-hidden="true">
              <Image
                src="/images/bgelectro.png"
                alt=""
                fill
                style={{ objectFit: "cover", objectPosition: "center" }}
                sizes="(min-width: 1024px) 35vw, 100vw"
              />
            </div>
            <div className="bento-schedule">
              <div className="bento-schedule-icon" aria-hidden="true">
                <Clock size={20} style={{ color: "var(--color-azul-700)" }} />
              </div>
              <div>
                <p className="font-heading font-semibold text-base mb-1" style={{ color: "var(--color-azul-900)" }}>
                  Horario de atención
                </p>
                <p className="font-body text-sm leading-relaxed" style={{ color: "var(--color-gris-600)" }}>
                  Lun – Vie: 7:00 a.m. – 12:00 m. / 1:00 – 6:00 p.m.<br />
                  Sábados: 7:00 a.m. – 11:00 a.m.
                </p>
              </div>
            </div>
          </div>

          {/* ── Derecha: título + beneficios 2×2 ── */}
          <div className="bento-cta-center">
            <p
              id="benefits-title"
              className="font-heading font-bold text-3xl md:text-4xl leading-tight mb-3"
              style={{ color: "var(--color-azul-900)" }}
            >
              Su bienestar y el de los suyos es lo más importante
            </p>
            <p className="font-body text-base leading-relaxed mb-8" style={{ color: "var(--color-gris-600)" }}>
              Hemos diseñado un conjunto de beneficios para ofrecerle respaldo y acompañamiento continuo.
            </p>
            <div className="bento-benefits-grid">
              {benefits.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="bento-benefit-item">
                  <div className="bento-benefit-icon" aria-hidden="true">
                    <Icon size={20} style={{ color: "var(--color-azul-700)" }} />
                  </div>
                  <div>
                    <p className="font-heading font-semibold text-base mb-1" style={{ color: "var(--color-azul-900)" }}>
                      {title}
                    </p>
                    <p className="font-body text-sm leading-relaxed" style={{ color: "var(--color-gris-600)" }}>
                      {desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
