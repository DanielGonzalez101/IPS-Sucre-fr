"use client";

import { useRef } from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { ArrowUpRight, ChatCircleText, MagnifyingGlass, Phone } from "@phosphor-icons/react";

const channels = [
  {
    icon: ChatCircleText,
    label: "Formulario PQRSD",
    desc: "Radica tu solicitud en línea. Respuesta en máximo 15 días hábiles.",
    href: "/pqrs",
  },
  {
    icon: MagnifyingGlass,
    label: "Consultar estado",
    desc: "Ingresa tu número de radicado y conoce en qué va tu solicitud.",
    href: "/pqrs/seguimiento",
  },
  {
    icon: Phone,
    label: "Contacto directo",
    desc: "Llámanos o escríbenos por WhatsApp al (+57) 310 411 4317.",
    href: "/contacto",
  },
];

export function CTASection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      gsap.from(".cta-mark", {
        y: 60, opacity: 0, duration: 1, ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
      });

      gsap.from(".cta-left", {
        x: -40, opacity: 0, duration: 0.7, ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 78%" },
      });

      gsap.from(".cta-channel", {
        x: 40, opacity: 0, duration: 0.6, stagger: 0.12, ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="cta-pqrs-section" aria-labelledby="cta-title">

      {/* Patrón de puntos — mismo que TeamSection */}
      <div className="cta-dots" aria-hidden="true" />

      {/* Signo de interrogación decorativo */}
      <div className="cta-mark" aria-hidden="true">?</div>

      <div className="container-main" style={{ position: "relative", zIndex: 2 }}>
        <div className="cta-inner">

          {/* ── Izquierda ── */}
          <div className="cta-left">
            <span className="cta-eyebrow">PQRSD</span>
            <h2
              id="cta-title"
              className="font-heading font-bold leading-tight"
              style={{ fontSize: "clamp(2rem, 4vw, 3.25rem)", color: "#fff" }}
            >
              Tu voz<br />
              <span style={{ color: "var(--color-rojo-400)" }}>nos importa.</span>
            </h2>
            <p
              className="font-body leading-relaxed mt-5"
              style={{ fontSize: "1.05rem", color: "rgba(255,255,255,0.65)", maxWidth: "340px" }}
            >
              Peticiones, quejas, reclamos o sugerencias — escúchate es nuestra obligación y nuestro compromiso.
            </p>
            <Link href="/pqrs" className="cta-main-btn">
              Ir al formulario
              <ArrowUpRight size={18} aria-hidden="true" />
            </Link>
          </div>

          {/* ── Derecha: canales ── */}
          <div className="cta-channels">
            {channels.map(({ icon: Icon, label, desc, href }) => (
              <Link key={label} href={href} className="cta-channel">
                <div className="cta-channel-icon" aria-hidden="true">
                  <Icon size={22} weight="duotone" />
                </div>
                <div>
                  <p className="cta-channel-label">{label}</p>
                  <p className="cta-channel-desc">{desc}</p>
                </div>
                <ArrowUpRight
                  size={16}
                  className="cta-channel-arrow"
                  aria-hidden="true"
                />
              </Link>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
