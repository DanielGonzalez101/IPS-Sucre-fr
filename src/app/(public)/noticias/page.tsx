import type { Metadata } from "next";
import NoticiasHero from "@/components/public/noticias/NoticiasHero";
import NoticiasGrid from "@/components/public/noticias/NoticiasGrid";
import { getNoticiasPublicas } from "@/actions/noticias";

export const metadata: Metadata = {
  title: "Noticias",
  description:
    "Tecnología, eventos institucionales y novedades del Cardiocentro Pediátrico de Sucre — mantente informado sobre salud cardiovascular pediátrica en la región Caribe.",
};

export default async function NoticiasPage() {
  const { data } = await getNoticiasPublicas();
  const noticias = data ?? [];

  return (
    <div id="main-content">
      <NoticiasHero />
      <NoticiasGrid noticias={noticias} />
    </div>
  );
}
