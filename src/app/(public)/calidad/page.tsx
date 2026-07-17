import type { Metadata } from "next";
import CalidadHero from "@/components/public/calidad/CalidadHero";
import CalidadTabs from "@/components/public/calidad/CalidadTabs";
import TransparenciaFinanciera from "@/components/public/calidad/TransparenciaFinanciera";
import CalidadCTA from "@/components/public/calidad/CalidadCTA";
import { getPublicFinancialDocuments } from "@/actions/documentos";

export const metadata: Metadata = {
  title: "Calidad",
  description:
    "Conoce tus derechos y deberes como paciente, y la transparencia financiera de IPS Cardiocentro Pediátrico de Sucre.",
};

export default async function CalidadPage() {
  const { data: docs } = await getPublicFinancialDocuments();

  return (
    <div id="main-content">
      <CalidadHero />
      <CalidadTabs />
      <TransparenciaFinanciera docs={docs ?? []} />
      <CalidadCTA />
    </div>
  );
}
