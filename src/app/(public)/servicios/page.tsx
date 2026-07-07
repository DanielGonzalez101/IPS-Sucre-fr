import type { Metadata } from "next";
import ServiciosHero from "@/components/public/servicios/ServiciosHero";
import ServiciosGrid from "@/components/public/servicios/ServiciosGrid";
import ServiciosCTA from "@/components/public/servicios/ServiciosCTA";
import ServiciosDiferenciadores from "@/components/public/servicios/ServiciosDiferenciadores";
import { SERVICIOS_MOCK } from "@/data/servicios.mock";

export const metadata: Metadata = {
  title: "Servicios",
  description:
    "Cardiología Pediátrica, Radiología y Diagnóstico por Imágenes en Sucre y la región Caribe — conoce todos los servicios del Cardiocentro Pediátrico de Sucre.",
};

export default function ServiciosPage() {
  return (
    <div id="main-content">
      <ServiciosHero />
      <ServiciosGrid servicios={SERVICIOS_MOCK} />
      <ServiciosCTA />
      <ServiciosDiferenciadores />
    </div>
  );
}
