"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";

type Equipment = {
  name: string;
  category: string;
  description: string;
  img: string;
};

const equipos: Equipment[] = [
  {
    name: "Equipo 1",
    category: "Por definir",
    description: "Descripción pendiente.",
    img: "/images/equipo tecnologico/eq1.jpg",
  },
  {
    name: "Equipo 2",
    category: "Por definir",
    description: "Descripción pendiente.",
    img: "/images/equipo tecnologico/eq2.jpg",
  },
  {
    name: "Equipo 3",
    category: "Por definir",
    description: "Descripción pendiente.",
    img: "/images/equipo tecnologico/eq3.jpg",
  },
  {
    name: "Equipo 4",
    category: "Por definir",
    description: "Descripción pendiente.",
    img: "/images/equipo tecnologico/eq4.jpg",
  },
  {
    name: "Equipo 5",
    category: "Por definir",
    description: "Descripción pendiente.",
    img: "/images/equipo tecnologico/eq5.jpg",
  },
  {
    name: "Equipo 6",
    category: "Por definir",
    description: "Descripción pendiente.",
    img: "/images/equipo tecnologico/eq6.jpg",
  },
  {
    name: "Equipo 7",
    category: "Por definir",
    description: "Descripción pendiente.",
    img: "/images/equipo tecnologico/eq7.jpg",
  },
];

function EquipmentCard({ name, category, description, img }: Equipment) {
  return (
    <div className="equipo-tec-card">
      <div className="equipo-tec-card-img">
        <Image
          src={img}
          alt={name}
          fill
          style={{ objectFit: "cover" }}
          sizes="(max-width: 640px) 50vw, 300px"
        />
      </div>
      <div className="equipo-tec-card-overlay" aria-hidden="true" />
      <span className="equipo-tec-card-chip">{category}</span>
      <div className="equipo-tec-card-body">
        <p className="equipo-tec-card-name">{name}</p>
        <p className="equipo-tec-card-desc">{description}</p>
      </div>
    </div>
  );
}

export function EquipoTecSection() {
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
            <EquipmentCard key={equipo.name} {...equipo} />
          ))}
        </div>

      </div>
    </section>
  );
}