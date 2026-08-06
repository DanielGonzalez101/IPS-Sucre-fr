import type { Metadata } from "next";
import { createClient }    from "@/lib/supabase/server";
import type { HeroSlide }  from "@/types";
import { HeroSection }     from "@/components/home/HeroSection";
import { StatsSection }    from "@/components/home/StatsSection";
import { ServicesSection } from "@/components/home/ServicesSection";
import { ServiciosAlfabeticoSection } from "@/components/home/ServiciosAlfabeticoSection";
import { BentoCtaRow }    from "@/components/home/BentoCtaRow";
import { TeamSection }    from "@/components/home/TeamSection";
import { NewsSection }     from "@/components/home/NewsSection";
import { SedesSection }    from "@/components/home/SedesSection";
import { CoberturaRegional } from "@/components/home/CoberturaRegional";
import { getServiciosPublicos } from "@/actions/servicios";
import { getSedes } from "@/actions/sitio";
import { SERVICIOS_ALFABETICO } from "@/data/servicios-alfabetico";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Inicio",
  description:
    "IPS Cardiocentro Pediátrico de Sucre — Especialistas en Cardiología Pediátrica, Radiología y Diagnóstico por Imágenes. Más de 16 años al servicio de las familias de Sucre y la región Caribe.",
};

const FALLBACK_SLIDE: HeroSlide = {
  id: "fallback",
  orden: 0,
  es_principal: true,
  imagen_url: "/images/hero-team.png",
  imagen_alt: "Equipo del Cardiocentro Pediátrico de Sucre",
  badge_texto: "Cardiocentro Pediátrico de Sucre",
  titulo: "Cuidamos el corazón de tus hijos",
  subtitulo:
    "Atención especializada en Cardiología Pediátrica, Radiología y Diagnóstico por Imágenes para bebés, niños y adolescentes en Sucre y la región Caribe.",
};

async function getHeroSlides(): Promise<HeroSlide[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("hero_slides")
      .select("id, orden, imagen_url, imagen_alt, badge_texto, titulo, subtitulo, es_principal")
      .eq("activo", true)
      .order("es_principal", { ascending: false })
      .order("orden", { ascending: true });

    if (error || !data || data.length === 0) return [FALLBACK_SLIDE];

    const valid = (data as HeroSlide[]).map((s) => {
      try {
        new URL(s.imagen_url);
        return s;
      } catch {
        return { ...s, imagen_url: FALLBACK_SLIDE.imagen_url };
      }
    });
    return valid;
  } catch {
    return [FALLBACK_SLIDE];
  }
}

// Selección acotada para el Home — la grilla completa vive en /servicios.
// Mantiene el orden dentro de cada categoría (campo `orden`, ya viene
// ordenado por getServiciosPublicos()).
function seleccionParaHome<T extends { categoria: string }>(servicios: T[]): T[] {
  const tomar = (categoria: string, cantidad: number) =>
    servicios.filter((s) => s.categoria === categoria).slice(0, cantidad);

  return [
    ...tomar("Cardiología Pediátrica", 3),
    ...tomar("Cardiología Adultos", 3),
    ...tomar("Diagnóstico por Imágenes", 2),
  ];
}

export default async function HomePage() {
  const [slides, { data: servicios }, { data: sedes }] = await Promise.all([
    getHeroSlides(),
    getServiciosPublicos(),
    getSedes(),
  ]);

  const serviciosHome = seleccionParaHome(servicios ?? []);
  const serviciosAlfabetico = SERVICIOS_ALFABETICO.filter((s) => s.visible).sort(
    (a, b) => a.sort_order - b.sort_order
  );

  return (
    <div id="main-content">
      <HeroSection slides={slides} />
      <StatsSection />
      <ServicesSection servicios={serviciosHome} />
      <ServiciosAlfabeticoSection servicios={serviciosAlfabetico} />
      <BentoCtaRow />
      <TeamSection />
      <NewsSection />
      <SedesSection sedes={sedes} />
      <CoberturaRegional />
    </div>
  );
}