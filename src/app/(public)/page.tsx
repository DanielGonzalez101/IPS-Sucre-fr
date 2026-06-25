import type { Metadata } from "next";
import { HeroSection }     from "@/components/home/HeroSection";
import { StatsSection }    from "@/components/home/StatsSection";
import { ServicesSection } from "@/components/home/ServicesSection";
import { BentoCtaRow }    from "@/components/home/BentoCtaRow";
import { TeamSection }    from "@/components/home/TeamSection";
import { NewsSection }     from "@/components/home/NewsSection";
import { CTASection }      from "@/components/home/CTASection";
import { SedesSection }    from "@/components/home/SedesSection";

export const metadata: Metadata = {
  title: "Inicio",
  description:
    "IPS Cardiocentro Pediátrico de Sucre — Especialistas en Cardiología Pediátrica, Radiología y Diagnóstico por Imágenes. Más de 16 años al servicio de las familias de Sucre y la región Caribe.",
};

export default function HomePage() {
  return (
    <div id="main-content">
      <HeroSection />
      <StatsSection />
      <ServicesSection />
      <BentoCtaRow />
      <TeamSection />
      <NewsSection />
      {/* <CTASection /> */}
      <SedesSection />
    </div>
  );
}
