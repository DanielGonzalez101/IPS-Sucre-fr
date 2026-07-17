import type { Metadata } from "next";
import GaleriaHero from "@/components/public/multimedia/GaleriaHero";
import GaleriaGrid from "@/components/public/multimedia/GaleriaGrid";
import { getGaleriaPublica } from "@/actions/galeria";

export const metadata: Metadata = {
  title: "Galería",
  description:
    "Galería fotográfica del IPS Cardiocentro Pediátrico de Sucre — instalaciones, equipo médico y momentos institucionales.",
};

export default async function GaleriaPage() {
  const items = await getGaleriaPublica();

  return (
    <div id="main-content">
      <GaleriaHero />
      <GaleriaGrid items={items} />
    </div>
  );
}
