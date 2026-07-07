import type { Metadata } from "next";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import type { EquipoHero, EquipoTec } from "@/types";
import { EquipoTecSection } from "@/components/public/EquipoTecSection";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Equipo Tecnológico",
  description:
    "Conoce la infraestructura y los equipos médicos de última generación del Cardiocentro Pediátrico de Sucre para diagnóstico y monitoreo cardiovascular.",
};

const FALLBACK_HERO: EquipoHero = {
  id: "", pagina: "tecnologico",
  imagen_url: "/images/hero-2.png",
  imagen_alt: "Equipos tecnológicos del Cardiocentro Pediátrico de Sucre",
};

async function getData() {
  try {
    const supabase = await createClient();
    const [{ data: heroData }, { data: equiposData }] = await Promise.all([
      supabase.from("equipo_hero").select("*").eq("pagina", "tecnologico").single(),
      supabase.from("equipo_tecnologico").select("*").eq("activo", true).order("orden"),
    ]);
    return {
      hero: (heroData as EquipoHero) ?? FALLBACK_HERO,
      equipos: (equiposData as EquipoTec[]) ?? [],
    };
  } catch {
    return { hero: FALLBACK_HERO, equipos: [] };
  }
}

export default async function EquipoTecPage() {
  const { hero, equipos } = await getData();

  return (
    <div id="main-content">
      <section className="equipo-hero equipo-hero--sm" aria-labelledby="equipo-tec-title">
        <Image
          src={hero.imagen_url}
          alt={hero.imagen_alt}
          fill
          className="equipo-hero-img"
          priority
          unoptimized={hero.imagen_url.startsWith("http")}
        />
        <div className="equipo-hero-overlay" aria-hidden="true" />
        <div className="container-main equipo-hero-inner">
          <p className="equipo-hero-eyebrow">Cardiocentro Pediátrico de Sucre</p>
          <h1 id="equipo-tec-title" className="equipo-hero-title">Equipo tecnológico</h1>
          <p className="equipo-hero-subtitle">Infraestructura y equipos médicos de última generación</p>
          <div className="equipo-hero-accent" aria-hidden="true" />
        </div>
        <div className="equipo-hero-bar" aria-hidden="true" />
      </section>

      <EquipoTecSection equipos={equipos} />
    </div>
  );
}
