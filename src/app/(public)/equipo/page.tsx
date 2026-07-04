import type { Metadata } from "next";
import Image from "next/image";
import { EquipoSection } from "@/components/public/EquipoSection";

export const metadata: Metadata = {
  title: "Nuestro Equipo",
  description:
    "Conoce a los profesionales de salud que conforman el Cardiocentro Pediátrico de Sucre — médicos especialistas, radiólogos y personal administrativo al servicio de las familias de la región.",
};

export default function EquipoPage() {
  return (
    <div id="main-content">

      {/* ── Hero ── */}
      <section className="equipo-hero equipo-hero--sm" aria-labelledby="equipo-title">
        <Image
          src="/images/hero-team.png"
          alt="Equipo del Cardiocentro Pediátrico de Sucre"
          fill
          className="equipo-hero-img"
          priority
        />
        <div className="equipo-hero-overlay" aria-hidden="true" />

        <div className="container-main equipo-hero-inner">
          <p className="equipo-hero-eyebrow">Cardiocentro Pediátrico de Sucre</p>
          <h1 id="equipo-title" className="equipo-hero-title">
            Equipo humano
          </h1>
          <p className="equipo-hero-subtitle">
            Profesionales comprometidos con la salud cardiovascular infantil
          </p>
          <div className="equipo-hero-accent" aria-hidden="true" />
        </div>

        <div className="equipo-hero-bar" aria-hidden="true" />
      </section>

      {/* ── Sección animada (Client Component) ── */}
      <EquipoSection />

    </div>
  );
}