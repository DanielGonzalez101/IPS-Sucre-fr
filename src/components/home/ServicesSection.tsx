"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { ArrowUpRight } from "lucide-react";
import {
  Stethoscope,
  Heartbeat,
  Pulse,
  Timer,
  Gauge,
  Waves,
  DropHalf,
  FirstAid,
  Heart,
  Brain,
  Bone,
  Eye,
  Ear,
  Tooth,
  Baby,
  Syringe,
  Pill,
  Bandaids,
  Flask,
  Microscope,
  Thermometer,
  type Icon,
} from "@phosphor-icons/react";

const ICON_MAP: Record<string, Icon> = {
  Stethoscope,
  Heartbeat,
  Pulse,
  Timer,
  Gauge,
  Waves,
  DropHalf,
  FirstAid,
  Heart,
  Brain,
  Bone,
  Eye,
  Ear,
  Tooth,
  Baby,
  Syringe,
  Pill,
  Bandaids,
  Flask,
  Microscope,
  Thermometer,
};

interface Servicio {
  id: string;
  titulo: string;
  categoria: string;
  icono: string;
  slug: string;
}

interface Props {
  servicios: Servicio[];
}

export function ServicesSection({ servicios }: Props) {
  const sectionRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      gsap.set(".services-heading", { opacity: 0, y: 24 });
      gsap.to(".services-heading", {
        opacity: 1,
        y: 0,
        duration: 0.55,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 85%",
        },
      });

      gsap.set(".service-card", { opacity: 0, y: 32 });
      gsap.to(".service-card", {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.07,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".services-grid",
          start: "top 82%",
        },
      });

      gsap.set(".doctor-popout", { opacity: 0, y: 20 });
      gsap.to(".doctor-popout", {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
        },
      });

      const cards = sectionRef.current?.querySelectorAll(".service-card") ?? [];
      cards.forEach((card) => {
        card.addEventListener("mouseenter", () => {
          gsap.to(card, { y: -5, duration: 0.25, ease: "power2.out" });
        });
        card.addEventListener("mouseleave", () => {
          gsap.to(card, { y: 0, duration: 0.25, ease: "power2.out" });
        });
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="py-16 md:py-24"
      style={{ backgroundColor: "#fff" }}
      aria-labelledby="services-title"
    >
      <div className="container-main">
        <div
          className="services-wrapper"
          style={{
            borderRadius: "28px",
            padding: "clamp(24px, 4vw, 48px) clamp(20px, 4vw, 48px) clamp(28px, 4vw, 52px)",
          }}
        >
          {/* Cabecera */}
          <div className="services-heading services-content-width mb-8">
            <span
              className="inline-flex items-center gap-1.5 font-heading font-semibold text-sm px-4 py-1.5 mb-4"
              style={{
                backgroundColor: "var(--color-azul-100)",
                color: "var(--color-azul-800)",
                borderRadius: "999px",
              }}
            >
              + Servicios
            </span>
            <h2
              id="services-title"
              className="font-heading font-bold text-3xl md:text-4xl leading-tight"
              style={{ color: "var(--color-azul-900)" }}
            >
              Atención especializada<br />
              para el corazón de tus hijos
            </h2>
          </div>

          {/* Grid */}
          <div className="services-grid services-content-width grid gap-4">
            {servicios.map(({ id, icono, titulo, categoria, slug }) => {
              const Icon = ICON_MAP[icono] ?? Stethoscope;
              return (
                <Link
                  key={id}
                  href={`/servicios/${slug}`}
                  className="service-card group flex flex-col justify-between bg-white p-5 focus-visible:ring-2 focus-visible:ring-offset-2"
                  style={{
                    borderRadius: "16px",
                    boxShadow: "var(--shadow-card)",
                    minHeight: "130px",
                    position: "relative",
                    zIndex: 2,
                    outline: "none",
                  }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div
                      className="w-9 h-9 flex items-center justify-center"
                      style={{
                        backgroundColor: "var(--color-azul-50)",
                        borderRadius: "10px",
                      }}
                      aria-hidden="true"
                    >
                      <Icon size={18} weight="duotone" style={{ color: "var(--color-azul-700)" }} />
                    </div>
                    <div
                      className="w-7 h-7 flex items-center justify-center transition-colors duration-200 group-hover:bg-black"
                      style={{ borderRadius: "50%", backgroundColor: "var(--color-gris-100)" }}
                      aria-hidden="true"
                    >
                      <ArrowUpRight
                        size={14}
                        className="transition-colors duration-200 group-hover:text-white"
                        style={{ color: "var(--color-gris-500)" }}
                      />
                    </div>
                  </div>

                  <div>
                    <p
                      className="font-heading font-semibold text-sm leading-snug mb-0.5"
                      style={{ color: "var(--color-azul-900)" }}
                    >
                      {titulo}
                    </p>
                    <p
                      className="font-body text-xs"
                      style={{ color: "var(--color-gris-500)" }}
                    >
                      {categoria}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Enlace ver todos */}
          <div className="services-content-width mt-10">
            <Link
              href="/servicios"
              className="inline-flex items-center gap-2 font-heading font-semibold text-sm transition-all duration-200 hover:gap-3"
              style={{ color: "var(--color-azul-800)" }}
            >
              Ver todos los servicios
              <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
          </div>

          {/* Doctor pop-out */}
          <div className="doctor-popout" aria-hidden="true">
            <Image
              src="/personal Medico/Gemini_Generated_Image_iohtubiohtubioht.png"
              alt="Médico cardiólogo pediatra"
              width={1728}
              height={2432}
              style={{ width: "auto", height: "100%", objectFit: "contain", objectPosition: "bottom right", filter: "drop-shadow(-10px 0px 24px rgba(6,36,77,0.40))" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
