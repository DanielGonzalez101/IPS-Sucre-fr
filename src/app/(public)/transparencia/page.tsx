import type { Metadata } from "next";
import TransparenciaHero      from "@/components/public/transparencia/TransparenciaHero";
import TransparenciaIntro     from "@/components/public/transparencia/TransparenciaIntro";
import TransparenciaDocumentos from "@/components/public/transparencia/TransparenciaDocumentos";
import EntesVigilancia        from "@/components/quienes-somos/EntesVigilancia";
import TransparenciaCTA       from "@/components/public/transparencia/TransparenciaCTA";

export const metadata: Metadata = {
  title: "Transparencia y Acceso a la Información Pública",
  description:
    "Consulta la información institucional, documentos de gestión, normativa y entes de vigilancia de IPS Cardiocentro Pediátrico de Sucre S.A.S., en cumplimiento de la Ley 1712 de 2014.",
};

export default function TransparenciaPage() {
  return (
    <div id="main-content">
      <TransparenciaHero />
      <TransparenciaIntro />
      <TransparenciaDocumentos />
      <EntesVigilancia />
      <TransparenciaCTA />
    </div>
  );
}
