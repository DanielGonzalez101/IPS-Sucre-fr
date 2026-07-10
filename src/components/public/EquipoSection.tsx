"use client";

import { useRef, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import {
  GraduationCap,
  ArrowUpRight,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";

import type { EquipoGrupo, EquipoMiembro } from "@/types";

type TeamMember = {
  name: string;
  role: string;
  specialty: string;
  formation: string[];
  img: string;
};

type Group = {
  title: string;
  members: TeamMember[];
};

function mapToGroup(g: EquipoGrupo): Group {
  return {
    title: g.nombre,
    members: g.miembros.map((m: EquipoMiembro) => ({
      name: m.nombre,
      role: m.cargo,
      specialty: m.especialidad,
      formation: m.formacion,
      img: m.foto_url,
    })),
  };
}

const CARDS_PER_VIEW = 3;
const CARD_WIDTH = 216;
const CARD_GAP = 20;

function TeamCard({ name, role, specialty, formation, img }: TeamMember) {
  return (
    <div className="team-card">
      <div className="team-card-img">
        <Image
          src={img}
          alt={name}
          fill
          style={{ objectFit: "cover", objectPosition: "top center" }}
          sizes="280px"
          unoptimized={img.startsWith("http")}
        />
        <div className="team-card-gradient" aria-hidden="true" />
      </div>
      <div className="team-card-btn" aria-hidden="true">
        <ArrowUpRight size={17} />
      </div>
      <div className="team-card-body">
        <p className="team-card-name">{name}</p>
        <span className="team-card-chip">{specialty}</span>
      </div>
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
  );
}

function GroupCarousel({ title, members }: Group) {
  const [index, setIndex] = useState(0);

  const canPrev = index > 0;
  const canNext = index + CARDS_PER_VIEW < members.length;

  const prev = useCallback(() => setIndex((i) => Math.max(0, i - 1)), []);
  const next = useCallback(
    () => setIndex((i) => Math.min(members.length - CARDS_PER_VIEW, i + 1)),
    [members.length],
  );

  const offset = index * (CARD_WIDTH + CARD_GAP);

  return (
    <div className="equipo-group">
      <div className="equipo-group-header">
        <h3 className="equipo-group-title">{title}</h3>
        <div className="equipo-group-arrows">
          <button
            className="equipo-arrow-btn"
            onClick={prev}
            disabled={!canPrev}
            aria-label={`Anterior — ${title}`}
          >
            <ArrowLeft size={16} />
          </button>
          <button
            className="equipo-arrow-btn"
            onClick={next}
            disabled={!canNext}
            aria-label={`Siguiente — ${title}`}
          >
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

      <div
        className="equipo-carousel-viewport"
        aria-label={title}
        role="region"
      >
        <div
          className="equipo-carousel-track"
          style={{ transform: `translateX(-${offset}px)` }}
        >
          {members.map((member) => (
            <div key={member.name} className="equipo-carousel-item">
              <TeamCard {...member} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function EquipoSection({ grupos: gruposDB }: { grupos: EquipoGrupo[] }) {
  const groups = gruposDB.map(mapToGroup);
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      gsap.fromTo(
        ".equipo-sidebar",
        { opacity: 0, x: -30 },
        {
          opacity: 1,
          x: 0,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 78%" },
        },
      );

      gsap.fromTo(
        ".equipo-group",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power3.out",
          stagger: 0.15,
          scrollTrigger: { trigger: sectionRef.current, start: "top 78%" },
        },
      );
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="equipo-bento-section"
      aria-label="Equipo de profesionales"
    >
      <div className="container-main">
        <div className="equipo-page-layout">
          {/* Sidebar izquierdo */}
          <aside className="equipo-sidebar">
            <p className="equipo-side-eyebrow">Nuestro equipo</p>
            <h2 className="equipo-sidebar-heading">
              Conoce a nuestros profesionales
            </h2>
            <p className="equipo-sidebar-desc">
              Especialistas comprometidos con la salud cardiovascular infantil y
              la atención integral de las familias de Sucre.
            </p>
            <Link
              href="https://wa.me/573009127565"
              target="_blank"
              rel="noopener noreferrer"
              className="equipo-side-cta"
            >
              Agendar cita
              <ArrowUpRight size={14} aria-hidden="true" />
            </Link>
          </aside>

          {/* Grupos con carrusel */}
          <div className="equipo-groups">
            {groups.map((group) => (
              <GroupCarousel key={group.title} {...group} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

