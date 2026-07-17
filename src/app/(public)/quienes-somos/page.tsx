import type { Metadata } from "next";
import QuienesSomosHero    from "@/components/quienes-somos/QuienesSomosHero";
import QuienesSomosSection from "@/components/quienes-somos/QuienesSomosSection";
import EntesVigilancia     from "@/components/quienes-somos/EntesVigilancia";

export const metadata: Metadata = {
  title: "Quiénes Somos",
  description:
    "Conoce la historia, misión y visión del Cardiocentro Pediátrico de Sucre — más de 15 años especializados en Cardiología Pediátrica, Radiología y Diagnóstico por Imágenes en la región Caribe.",
};

export default function QuienesSomosPage() {
  return (
    <div id="main-content">
      <QuienesSomosHero />
      <QuienesSomosSection />
      <EntesVigilancia />
    </div>
  );
}
