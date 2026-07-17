"use client";

import { useRef } from "react";
import Link from "next/link";
import { Users, MessageSquareText, ClipboardList, Phone, ArrowRight } from "lucide-react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { getMecanismos } from "@/lib/participa";
import type { MecanismoParticipacion } from "@/data/participa.mock";

const ICONS: Record<MecanismoParticipacion["icono"], typeof Users> = {
  usuarios: Users,
  pqrsd: MessageSquareText,
  encuestas: ClipboardList,
  canales: Phone,
};

// Ítems ITA 1935 (mecanismos de participación disponibles) y 1943
// (canales de contacto para participar).
export default function ParticipaMecanismos() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const mecanismos = getMecanismos();

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      gsap.from(".mecanismo-card", {
        y: 30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
      });
    },
    { scope: sectionRef }
  );

  if (mecanismos.length === 0) return null;

  return (
    <section
      id="mecanismos"
      ref={sectionRef}
      className="relative py-16 md:py-20 overflow-hidden"
      style={{ backgroundColor: "#fff" }}
      aria-labelledby="mecanismos-title"
    >
      <div className="participa-section-blobs" aria-hidden="true" />

      <div className="container-main relative z-10">
        <h2
          id="mecanismos-title"
          className="font-heading font-bold text-2xl md:text-3xl mb-8"
          style={{ color: "var(--color-azul-900)" }}
        >
          Mecanismos de participación
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {mecanismos.map((m) => {
            const Icon = ICONS[m.icono];
            const isExternalRoute = m.ctaHref.startsWith("/");
            return (
              <div
                key={m.id}
                className="mecanismo-card participa-glass participa-glass--grid participa-glass--interactive group rounded-2xl p-6 flex flex-col"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: "var(--color-azul-50)" }}
                >
                  <Icon size={22} aria-hidden="true" style={{ color: "var(--color-azul-800)" }} />
                </div>

                <h3
                  className="font-heading font-bold text-lg mb-2"
                  style={{ color: "var(--color-azul-900)" }}
                >
                  {m.titulo}
                </h3>
                <p
                  className="font-body text-sm leading-relaxed flex-1"
                  style={{ color: "var(--color-gris-600)" }}
                >
                  {m.descripcion}
                </p>

                {isExternalRoute ? (
                  <Link
                    href={m.ctaHref}
                    className="inline-flex items-center gap-2 mt-5 font-heading font-semibold text-sm transition-colors duration-150 group-hover:gap-3"
                    style={{ color: "var(--color-rojo-500)" }}
                  >
                    {m.ctaLabel}
                    <ArrowRight size={16} aria-hidden="true" />
                  </Link>
                ) : (
                  <a
                    href={m.ctaHref}
                    className="inline-flex items-center gap-2 mt-5 font-heading font-semibold text-sm transition-colors duration-150 group-hover:gap-3"
                    style={{ color: "var(--color-rojo-500)" }}
                  >
                    {m.ctaLabel}
                    <ArrowRight size={16} aria-hidden="true" />
                  </a>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
