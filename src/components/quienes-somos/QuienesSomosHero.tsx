import Image from "next/image";

const HERO_IMG = "/images/hero-team.png";

export default function QuienesSomosHero() {
  return (
    <section className="equipo-hero equipo-hero--sm" aria-labelledby="quienes-somos-hero-title">
      <Image
        src={HERO_IMG}
        alt="Equipo médico del Cardiocentro Pediátrico de Sucre"
        fill
        className="equipo-hero-img"
        priority
        sizes="100vw"
      />
      <div className="equipo-hero-overlay" aria-hidden="true" />
      <div className="container-main equipo-hero-inner">
        <p className="equipo-hero-eyebrow">Cardiocentro Pediátrico de Sucre</p>
        <h1 id="quienes-somos-hero-title" className="equipo-hero-title">Quiénes somos</h1>
        <p className="equipo-hero-subtitle">
          Más de 15 años de experiencia en cardiología pediátrica y diagnóstico por imágenes
        </p>
        <div className="equipo-hero-accent" aria-hidden="true" />
      </div>
      <div className="equipo-hero-bar" aria-hidden="true" />
    </section>
  );
}
