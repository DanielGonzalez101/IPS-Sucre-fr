"use client";

import { useRef } from "react";
import Image from "next/image";
import { ShieldCheck } from "lucide-react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";

const HERO_IMG = "/images/calidad/calidad-hero.jpg";

export default function CalidadHero() {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      gsap.set(".hero-content", { opacity: 0, y: 32 });
      gsap.to(".hero-content", {
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
      className="relative w-full overflow-hidden h-[400px] md:h-[500px]"
      style={{ backgroundColor: "var(--color-azul-900)" }}
      aria-label="Calidad — presentación"
    >
      <Image
        src={HERO_IMG}
        alt="Compromiso de calidad del Cardiocentro Pediátrico de Sucre"
        fill
        className="object-cover object-top"
        priority
        sizes="100vw"
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).style.display = "none";
        }}
      />

      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to right, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)",
        }}
        aria-hidden="true"
      />

      <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 lg:p-16 pb-14 md:pb-16">
        <div
          className="hero-content inline-flex items-center gap-2 px-4 py-2 mb-5"
          style={{
            borderRadius: "999px",
            backgroundColor: "rgba(255,255,255,0.18)",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(255,255,255,0.28)",
          }}
        >
          <ShieldCheck size={13} aria-hidden="true" style={{ color: "var(--color-rojo-400)" }} />
          <span className="font-heading font-semibold text-sm text-white">
            Calidad y Transparencia
          </span>
        </div>

        <h1
          className="hero-content font-heading font-bold text-white leading-tight mb-4"
          style={{
            fontSize: "clamp(2rem, 4.5vw, 3.75rem)",
            maxWidth: "36rem",
            textShadow: "0 2px 12px rgba(0,0,0,0.40)",
          }}
        >
          Tu bienestar, nuestra responsabilidad
        </h1>

        <p
          className="hero-content font-body text-base md:text-lg leading-relaxed"
          style={{
            color: "rgba(255,255,255,0.90)",
            maxWidth: "32rem",
            textShadow: "0 1px 8px rgba(0,0,0,0.45)",
          }}
        >
          Conoce tus derechos y deberes como paciente de IPS Cardiocentro
          Pediátrico de Sucre.
        </p>
      </div>

      <div
        className="absolute bottom-0 right-0 h-1.5"
        style={{ width: "33%", backgroundColor: "var(--color-rojo-500)" }}
        aria-hidden="true"
      />
    </section>
  );
}
