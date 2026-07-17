"use client";

import { useRef } from "react";
import Image from "next/image";
import { Images } from "lucide-react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";

const HERO_IMG = "/images/hero-2.png";

export default function GaleriaHero() {
  const containerRef = useRef<HTMLElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      if (imgRef.current) {
        gsap.from(imgRef.current, {
          scale: 1.07,
          duration: 1.8,
          ease: "power2.out",
        });

        gsap.to(imgRef.current, {
          yPercent: 18,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }

      gsap.set(".galeria-hero-content", { opacity: 0, y: 36 });
      gsap.to(".galeria-hero-content", {
        opacity: 1,
        y: 0,
        duration: 0.7,
        stagger: 0.13,
        ease: "power3.out",
        delay: 0.2,
      });

      gsap.from(".galeria-hero-stripe", {
        scaleX: 0,
        transformOrigin: "right center",
        duration: 0.9,
        ease: "power3.out",
        delay: 0.5,
      });
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      className="relative w-full overflow-hidden h-[400px] md:h-[500px]"
      aria-label="Galería — presentación"
    >
      <div ref={imgRef} className="absolute inset-0">
        <Image
          src={HERO_IMG}
          alt="Galería del Cardiocentro Pediátrico de Sucre"
          fill
          className="object-cover object-top"
          priority
          sizes="100vw"
        />
      </div>

      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to right, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.25) 55%, transparent 100%)",
        }}
        aria-hidden="true"
      />

      <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 lg:p-16 pb-14 md:pb-16">
        <div
          className="galeria-hero-content inline-flex items-center gap-2 px-4 py-2 mb-5"
          style={{
            borderRadius: "999px",
            backgroundColor: "rgba(255,255,255,0.18)",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(255,255,255,0.28)",
          }}
        >
          <Images size={13} aria-hidden="true" style={{ color: "var(--color-rojo-400)" }} />
          <span className="font-heading font-semibold text-sm text-white">
            Multimedia
          </span>
        </div>

        <h1
          className="galeria-hero-content font-heading font-bold text-white leading-tight mb-4"
          style={{
            fontSize: "clamp(2rem, 4.5vw, 3.75rem)",
            maxWidth: "36rem",
            textShadow: "0 2px 12px rgba(0,0,0,0.40)",
          }}
        >
          Galería
        </h1>

        <p
          className="galeria-hero-content font-body text-base md:text-lg leading-relaxed"
          style={{
            color: "rgba(255,255,255,0.90)",
            maxWidth: "32rem",
            textShadow: "0 1px 8px rgba(0,0,0,0.45)",
          }}
        >
          Momentos capturados de nuestra institución,<br />
          equipo médico e instalaciones.
        </p>
      </div>

      <div
        className="galeria-hero-stripe absolute bottom-0 right-0 h-1.5"
        style={{ width: "33%", backgroundColor: "var(--color-rojo-500)" }}
        aria-hidden="true"
      />
    </section>
  );
}
