"use client";

import { useRef } from "react";
import { Megaphone } from "lucide-react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { getParticipaHero } from "@/lib/participa";

export default function ParticipaHero() {
  const containerRef = useRef<HTMLElement>(null);
  const hero = getParticipaHero();

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      gsap.set(".participa-hero-content", { opacity: 0, y: 32 });
      gsap.to(".participa-hero-content", {
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

  if (!hero) return null;

  return (
    <section
      ref={containerRef}
      className="relative w-full overflow-hidden"
      style={{ backgroundColor: "var(--color-azul-900)" }}
      aria-label="Participa — presentación"
    >
      {/* Blobs difuminados decorativos — sin imagen de stock */}
      <div className="participa-hero-blobs" aria-hidden="true">
        <span className="participa-hero-blob participa-hero-blob--red" />
        <span className="participa-hero-blob participa-hero-blob--blue" />
      </div>
      <div className="participa-hero-dots" aria-hidden="true" />

      <div className="container-main relative z-10 py-20 md:py-28 lg:py-32">
        <div
          className="participa-hero-content participa-glass-dark inline-flex items-center gap-2 px-4 py-2 mb-6"
          style={{ borderRadius: "999px" }}
        >
          <Megaphone size={14} aria-hidden="true" style={{ color: "var(--color-rojo-400)" }} />
          <span className="font-heading font-semibold text-sm text-white">
            {hero.eyebrow}
          </span>
        </div>

        <h1
          className="participa-hero-content font-heading font-bold text-white leading-tight mb-4"
          style={{
            fontSize: "clamp(2.25rem, 5vw, 4rem)",
            maxWidth: "40rem",
            textShadow: "0 2px 12px rgba(0,0,0,0.35)",
          }}
        >
          {hero.titulo}
        </h1>

        <p
          className="participa-hero-content font-body text-lg md:text-xl leading-relaxed"
          style={{ color: "rgba(255,255,255,0.90)", maxWidth: "34rem" }}
        >
          {hero.subtitulo}
        </p>
      </div>
    </section>
  );
}
