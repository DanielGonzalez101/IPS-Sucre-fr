import type { Metadata } from "next";
import Image from "next/image";
import { EquipoTecSection } from "@/components/public/EquipoTecSection";

export const metadata: Metadata = {
  title: "Equipo Tecnológico",
  description:
    "Conoce la infraestructura y los equipos médicos de última generación del Cardiocentro Pediátrico de Sucre para diagnóstico y monitoreo cardiovascular.",
};

export default function EquipoTecPage() {
  return (
    <div id="main-content">

      {/* ── Hero ── */}
      <section className="equipo-hero equipo-hero--sm" aria-labelledby="equipo-tec-title">
        <Image
          src="/images/hero-2.png"
          alt="Equipos tecnológicos del Cardiocentro Pediátrico de Sucre"
          fill
          className="equipo-hero-img"
          priority
        />
        <div className="equipo-hero-overlay" aria-hidden="true" />

        <div className="container-main equipo-hero-inner">
          <p className="equipo-hero-eyebrow">Cardiocentro Pediátrico de Sucre</p>
          <h1 id="equipo-tec-title" className="equipo-hero-title">
            Equipo tecnológico
          </h1>
          <p className="equipo-hero-subtitle">
            Infraestructura y equipos médicos de última generación
          </p>
          <div className="equipo-hero-accent" aria-hidden="true" />
        </div>

        <div className="equipo-hero-bar" aria-hidden="true" />
      </section>

      {/* ── Sección equipos ── */}
      <EquipoTecSection />

    </div>
  );
}