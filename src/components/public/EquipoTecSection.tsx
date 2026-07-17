"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";

import type { EquipoTec } from "@/types";

type Equipment = {
  id: string;
  name: string;
  category: string;
  description: string;
  img: string;
};

function EquipmentCard({ name, description, img }: Omit<Equipment, "id" | "category">) {
  return (
    <div className="equipo-tec-card">
      <div className="equipo-tec-card-img">
        <Image
          src={img}
          alt={name}
          fill
          style={{ objectFit: "cover" }}
          sizes="(max-width: 640px) 50vw, 300px"
          unoptimized={img.startsWith("http")}
        />
      </div>
      <div className="equipo-tec-card-overlay" aria-hidden="true" />
      <div className="equipo-tec-card-body">
        <p className="equipo-tec-card-name">{name}</p>
        <p className="equipo-tec-card-desc">{description}</p>
      </div>
    </div>
  );
}

export function EquipoTecSection({ equipos: equiposDB }: { equipos: EquipoTec[] }) {
  const equipos: Equipment[] = equiposDB.map((e) => ({
    id: e.id,
    name: e.nombre,
    category: e.categoria,
    description: e.descripcion,
    img: e.imagen_url,
  }));
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      gsap.fromTo(
        ".equipo-tec-header",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 78%" },
        }
      );

      gsap.fromTo(
        ".equipo-tec-card",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.55,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: { trigger: ".equipo-tec-grid", start: "top 80%" },
        }
      );

      const cards = sectionRef.current?.querySelectorAll(".equipo-tec-card");
      cards?.forEach((card) => {
        card.addEventListener("mouseenter", () =>
          gsap.to(card, { y: -6, duration: 0.25, ease: "power2.out" })
        );
        card.addEventListener("mouseleave", () =>
          gsap.to(card, { y: 0, duration: 0.25, ease: "power2.out" })
        );
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="equipo-tec-section"
      aria-label="Equipos tecnológicos"
    >
      <div className="container-main">

        <div className="equipo-tec-header">
          <p className="equipo-side-eyebrow">Infraestructura y tecnología</p>
          <h2 className="equipo-tec-heading">Nuestros equipos médicos</h2>
          <p className="equipo-tec-desc">
            Tecnología de última generación para el diagnóstico y monitoreo
            cardiovascular en pacientes pediátricos.
          </p>
        </div>

        <div className="equipo-tec-grid">
          {equipos.map((equipo) => (
            <EquipmentCard key={equipo.id} {...equipo} />
          ))}
        </div>

      </div>
    </section>
  );
}