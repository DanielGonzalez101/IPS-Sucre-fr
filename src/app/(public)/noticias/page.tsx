import type { Metadata } from "next";
import NoticiasHero from "@/components/public/noticias/NoticiasHero";
import NoticiasGrid from "@/components/public/noticias/NoticiasGrid";

export const metadata: Metadata = {
  title: "Noticias",
  description:
    "Tecnología, eventos institucionales y novedades del Cardiocentro Pediátrico de Sucre — mantente informado sobre salud cardiovascular pediátrica en la región Caribe.",
};

export default function NoticiasPage() {
  return (
    <div id="main-content">
      <NoticiasHero />
      <NoticiasGrid />
    </div>
  );
}
