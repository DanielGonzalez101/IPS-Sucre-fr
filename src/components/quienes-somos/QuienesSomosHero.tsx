"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";

/*
  Imagen real: colocar en /public/images/equipo/equipo-grupal.jpg
  Mientras no exista, se usa /images/hero-team.png como placeholder.
*/
const HERO_IMG = "/images/hero-team.png";

export default function QuienesSomosHero() {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      // Mismos valores exactos que HeroSection del Inicio
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
      className="relative w-full overflow-hidden"
      style={{ height: "clamp(500px, 60vw, 700px)" }}
      aria-label="Quiénes somos — presentación"
    >
      {/* 1. Imagen de fondo */}
      <Image
        src={HERO_IMG}
        alt="Equipo médico IPS Cardiocentro Pediátrico de Sucre"
        fill
        className="object-cover object-top"
        priority
        sizes="100vw"
      />

      {/* 2. Gradiente sutil izquierda → transparente (no tapa la foto) */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(105deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.28) 38%, rgba(0,0,0,0.08) 62%, transparent 100%)",
        }}
        aria-hidden="true"
      />

      {/* 3. Contenido — esquina inferior izquierda */}
      <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 lg:p-16 pb-14 md:pb-16">

        {/* Badge — primer elemento en aparecer (stagger 0) */}
        <div
          className="hero-content inline-flex items-center gap-2 px-4 py-2 mb-5"
          style={{
            borderRadius: "999px",
            backgroundColor: "rgba(255,255,255,0.18)",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(255,255,255,0.28)",
          }}
        >
          <Heart size={13} aria-hidden="true" style={{ color: "var(--color-rojo-400)" }} />
          <span className="font-heading font-semibold text-sm text-white">
            Cardiocentro Pediátrico de Sucre
          </span>
        </div>

        {/* Título — segundo (stagger 0.12) */}
        <h1
          className="hero-content font-heading font-bold text-white leading-tight mb-4"
          style={{
            fontSize: "clamp(2rem, 4.5vw, 3.75rem)",
            maxWidth: "36rem",
            textShadow: "0 2px 12px rgba(0,0,0,0.40)",
          }}
        >
          Conoce al equipo que cuida a tu familia
        </h1>

        {/* Subtítulo — tercero (stagger 0.24) */}
        <p
          className="hero-content font-body text-base md:text-lg leading-relaxed mb-8"
          style={{
            color: "rgba(255,255,255,0.90)",
            maxWidth: "32rem",
            textShadow: "0 1px 8px rgba(0,0,0,0.45)",
          }}
        >
          Más de 15 años de experiencia en cardiología pediátrica y diagnóstico
          por imágenes en Sucre y la región Caribe.
        </p>

        {/* CTA — último en aparecer (stagger 0.36) */}
        <Link
          href="/equipo"
          className="hero-content inline-flex items-center gap-2 font-heading font-semibold text-sm text-white rounded-full px-6 py-3 transition-all duration-200 hover:opacity-90 active:scale-95 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2"
          style={{
            backgroundColor: "var(--color-rojo-500)",
            boxShadow: "0 4px 16px 0 rgba(238,53,56,0.45)",
          }}
        >
          Ver nuestro equipo →
        </Link>
      </div>

      {/* 4. Franja roja decorativa — borde inferior derecho */}
      <div
        className="absolute bottom-0 right-0 h-1.5"
        style={{
          width: "33%",
          backgroundColor: "var(--color-rojo-500)",
        }}
        aria-hidden="true"
      />
    </section>
  );
}
