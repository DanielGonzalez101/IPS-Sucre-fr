import type { Metadata } from "next";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import type { EquipoHero, EquipoGrupo } from "@/types";
import { EquipoSection } from "@/components/public/EquipoSection";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Nuestro Equipo",
  description:
    "Conoce a los profesionales de salud que conforman el Cardiocentro Pediátrico de Sucre — médicos especialistas, radiólogos y personal administrativo al servicio de las familias de la región.",
};

const FALLBACK_HERO: EquipoHero = {
  id: "", pagina: "humano",
  imagen_url: "/images/hero-team.png",
  imagen_alt: "Equipo del Cardiocentro Pediátrico de Sucre",
};

async function getData() {
  try {
    const supabase = await createClient();

    const [{ data: heroData }, { data: grupos }, { data: miembros }] = await Promise.all([
      supabase.from("equipo_hero").select("*").eq("pagina", "humano").single(),
      supabase.from("equipo_grupos").select("*").order("orden"),
      supabase.from("equipo_miembros").select("*").eq("activo", true).order("orden"),
    ]);

    const hero: EquipoHero = heroData ?? FALLBACK_HERO;
    const gruposConMiembros: EquipoGrupo[] = (grupos ?? []).map((g) => ({
      ...g,
      miembros: (miembros ?? []).filter((m) => m.grupo_id === g.id),
    }));

    return { hero, grupos: gruposConMiembros };
  } catch {
    return { hero: FALLBACK_HERO, grupos: [] };
  }
}

export default async function EquipoPage() {
  const { hero, grupos } = await getData();

  return (
    <div id="main-content">
      <section className="equipo-hero equipo-hero--sm" aria-labelledby="equipo-title">
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
          <h1 id="equipo-title" className="equipo-hero-title">Equipo humano</h1>
          <p className="equipo-hero-subtitle">Profesionales comprometidos con la salud cardiovascular infantil</p>
          <div className="equipo-hero-accent" aria-hidden="true" />
        </div>
        <div className="equipo-hero-bar" aria-hidden="true" />
      </section>

      <EquipoSection grupos={grupos} />
    </div>
  );
}
