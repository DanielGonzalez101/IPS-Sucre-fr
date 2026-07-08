import type { Metadata } from "next";
import { getServiciosPublicos } from "@/actions/servicios";
import ServiciosHero from "@/components/public/servicios/ServiciosHero";
import ServiciosGrid from "@/components/public/servicios/ServiciosGrid";
import ServiciosCTA from "@/components/public/servicios/ServiciosCTA";
import ServiciosDiferenciadores from "@/components/public/servicios/ServiciosDiferenciadores";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Servicios",
  description:
    "Cardiología Pediátrica, Radiología y Diagnóstico por Imágenes en Sucre y la región Caribe — conoce todos los servicios del Cardiocentro Pediátrico de Sucre.",
};

export default async function ServiciosPage() {
  const { data: servicios } = await getServiciosPublicos();

  return (
    <div id="main-content">
      <ServiciosHero />
      <ServiciosGrid servicios={servicios ?? []} />
      <ServiciosCTA />
      <ServiciosDiferenciadores />
    </div>
  );
}
