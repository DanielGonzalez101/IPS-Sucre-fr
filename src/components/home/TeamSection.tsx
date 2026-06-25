"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { ArrowUpRight, GraduationCap } from "lucide-react";

const teamBase = [
  {
    name: "Dra. Alicia Llach López",
    role: "Médico Radiólogo especialista en diagnóstico por imágenes",
    specialty: "Diagnóstico por Imágenes",
    formation: ["Universidad del Salvador", "Buenos Aires, Argentina"],
    img: "/personal Medico/Dra. Alicia Llach López/doctor2.png",
  },
  {
    name: "Dr. Leandro Ruiz Moreno",
    role: "Cardiólogo Pediatra",
    specialty: "Cardiología Pediátrica",
    formation: ["Hospital Garrahan", "Universidad de Buenos Aires", "Argentina"],
    img: "/personal Medico/Dr. Leandro Ruiz Moreno/perso9.png",
  },
  {
    name: "Mileinis Tilano Barraza",
    role: "Tecnóloga en Radiología",
    specialty: "Radiología",
    formation: [],
    img: "/personal Medico/Mileinis Tilano Barraza/perso14 (1).png",
  },
  {
    name: "Julieth Contreras Romero",
    role: "Administradora",
    specialty: "Gestión Administrativa",
    formation: [],
    img: "/personal asistencial y administrativo/Julieth Contreras Romero/Administradora.png",
  },
  {
    name: "José Quintero Pinzón",
    role: "Auxiliar de Admisiones",
    specialty: "Atención al Paciente",
    formation: [],
    img: "/personal asistencial y administrativo/José Quintero Pinzón/Auxiliar de Admisiones.png",
  },
  {
    name: "Maura López Vergara",
    role: "Asistente Administrativa",
    specialty: "Gestión Administrativa",
    formation: [],
    img: "/personal asistencial y administrativo/Maura López Vergara/Asistente Admon..png",
  },
];

const team = [...teamBase, ...teamBase];

export function TeamSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      gsap.set(".team-heading", { opacity: 0, y: 30 });
      gsap.to(".team-heading", {
        opacity: 1, y: 0, duration: 0.6, ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 85%" },
      });

      gsap.set(".team-carousel", { opacity: 0 });
      gsap.to(".team-carousel", {
        opacity: 1, duration: 0.6, ease: "power2.out",
        scrollTrigger: { trigger: ".team-carousel", start: "top 85%" },
      });

    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="team-section" aria-labelledby="team-title">

      <div className="team-bg-ecg" aria-hidden="true">
        <svg viewBox="0 0 1440 120" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <polyline
            points="0,60 120,60 180,60 210,20 240,100 270,10 300,110 330,60 400,60 520,60 560,60 590,20 620,100 650,10 680,110 710,60 800,60 920,60 960,60 990,20 1020,100 1050,10 1080,110 1110,60 1200,60 1320,60 1360,60 1390,20 1420,100 1440,60"
            fill="none"
            stroke="rgba(238,53,56,0.15)"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <div className="container-main">
        <div className="team-heading text-center mb-12">
          <h2
            id="team-title"
            className="font-heading font-bold text-3xl md:text-4xl mb-3"
            style={{ color: "#fff" }}
          >
            Nuestro personal médico
          </h2>
          <p className="font-body text-base max-w-lg mx-auto" style={{ color: "rgba(255,255,255,0.6)" }}>
            Gran experiencia, conocimiento y atención personalizada son sus mayores virtudes.
          </p>
        </div>
      </div>

      <div className="team-carousel" role="list">
        <div className="team-track">
        {team.map(({ name, role, specialty, formation, img }, i) => (
          <div key={`${name}-${i}`} className="team-card" role="listitem">

            <div className="team-card-img">
              <Image
                src={img}
                alt={name}
                fill
                style={{ objectFit: "cover", objectPosition: "top center" }}
                sizes="280px"
              />
              <div className="team-card-gradient" aria-hidden="true" />
            </div>

            {/* Botón ↗ */}
            <div className="team-card-btn" aria-hidden="true">
              <ArrowUpRight size={17} />
            </div>

            {/* Texto base siempre visible */}
            <div className="team-card-body">
              <p className="team-card-name">{name}</p>
              <span className="team-card-chip">{specialty}</span>
            </div>

            {/* Panel que sube en hover */}
            <div className="team-card-reveal">
              <p className="team-card-name">{name}</p>
              <p className="team-card-role">{role}</p>
              {formation.length > 0 && (
                <ul className="team-card-formation">
                  {formation.map((item) => (
                    <li key={item} className="team-card-formation-item">
                      <GraduationCap size={13} aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </div>

          </div>
        ))}
        </div>
      </div>

      <div className="container-main">
        <div className="text-center mt-12">
          <Link
            href="/equipo"
            className="inline-flex items-center gap-2 font-heading font-semibold text-base rounded-full px-8 py-3 transition-colors duration-200"
            style={{ backgroundColor: "var(--color-rojo-500)", color: "#fff" }}
          >
            Conocer todo el equipo
            <ArrowUpRight size={17} aria-hidden="true" />
          </Link>
        </div>
      </div>

    </section>
  );
}
