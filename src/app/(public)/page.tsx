import type { Metadata } from "next";
import { createClient }    from "@/lib/supabase/server";
import type { HeroSlide }  from "@/types";
import { HeroSection }     from "@/components/home/HeroSection";
import { StatsSection }    from "@/components/home/StatsSection";
import { ServicesSection } from "@/components/home/ServicesSection";
import { BentoCtaRow }    from "@/components/home/BentoCtaRow";
import { TeamSection }    from "@/components/home/TeamSection";
import { NewsSection }     from "@/components/home/NewsSection";
import { SedesSection }    from "@/components/home/SedesSection";
import { getServiciosPublicos } from "@/actions/servicios";

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

export default async function HomePage() {
  const [slides, { data: servicios }] = await Promise.all([
    getHeroSlides(),
    getServiciosPublicos(),
  ]);

  return (
    <div id="main-content">
      <HeroSection slides={slides} />
      <StatsSection />
      <ServicesSection servicios={servicios ?? []} />
      <BentoCtaRow />
      <TeamSection />
      <NewsSection />
      <SedesSection />
    </div>
  );
}