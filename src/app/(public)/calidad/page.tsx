import type { Metadata } from "next";
import CalidadHero from "@/components/public/calidad/CalidadHero";
import CalidadTabs from "@/components/public/calidad/CalidadTabs";
import TransparenciaFinanciera from "@/components/public/calidad/TransparenciaFinanciera";
import CalidadCTA from "@/components/public/calidad/CalidadCTA";

export const metadata: Metadata = {
  title: "Calidad",
  description:
    "Conoce tus derechos y deberes como paciente, y la transparencia financiera de IPS Cardiocentro Pediátrico de Sucre.",
};

export default function CalidadPage() {
  return (
    <div id="main-content">
      <CalidadHero />
      <CalidadTabs />
      <TransparenciaFinanciera />
      <CalidadCTA />
    </div>
  );
}
