"use client";

import { useRef } from "react";
import { Eye } from "lucide-react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";

export default function TransparenciaHero() {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.set(".trans-hero-content", { opacity: 0, y: 32 });
      gsap.to(".trans-hero-content", {
        opacity: 1,
        y: 0,
        duration: 0.65,
        stagger: 0.12,
        ease: "power3.out",
        delay: 0.15,
      });
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      className="relative w-full overflow-hidden"
      style={{ backgroundColor: "var(--color-azul-900)" }}
      aria-label="Transparencia y acceso a la información pública — presentación"
    >
      <div className="participa-hero-blobs" aria-hidden="true">
        <span className="participa-hero-blob participa-hero-blob--red" />
        <span className="participa-hero-blob participa-hero-blob--blue" />
      </div>
      <div className="participa-hero-dots" aria-hidden="true" />

      <div className="container-main relative z-10 py-20 md:py-28 lg:py-32">
        <div
          className="trans-hero-content participa-glass-dark inline-flex items-center gap-2 px-4 py-2 mb-6"
          style={{ borderRadius: "999px" }}
        >
          <Eye size={14} aria-hidden="true" style={{ color: "var(--color-rojo-400)" }} />
          <span className="font-heading font-semibold text-sm text-white">
            Ley 1712 de 2014 · Resolución MinTIC 1519/2020
          </span>
        </div>

        <h1
          className="trans-hero-content font-heading font-bold text-white leading-tight mb-4"
          style={{
            fontSize: "clamp(2.25rem, 5vw, 4rem)",
            maxWidth: "42rem",
            textShadow: "0 2px 12px rgba(0,0,0,0.35)",
          }}
        >
          Transparencia y Acceso a la Información Pública
        </h1>

        <p
          className="trans-hero-content font-body text-lg md:text-xl leading-relaxed"
          style={{ color: "rgba(255,255,255,0.90)", maxWidth: "36rem" }}
        >
          Consultá aquí la información institucional, documentos de gestión y normativa de IPS Cardiocentro Pediátrico de Sucre S.A.S.
        </p>
      </div>
    </section>
  );
}
