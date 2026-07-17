import type { Metadata } from "next";
import ParticipaHero from "@/components/public/participa/ParticipaHero";
import ParticipaQueEs from "@/components/public/participa/ParticipaQueEs";
import ParticipaMecanismos from "@/components/public/participa/ParticipaMecanismos";
import ParticipaDocumentos from "@/components/public/participa/ParticipaDocumentos";
import ParticipaConvocatorias from "@/components/public/participa/ParticipaConvocatorias";
import ParticipaForm from "@/components/public/participa/ParticipaForm";

// El contenido de esta página se lee hoy de src/data/participa.mock.ts
// (no existe .claude/informacion/participa.md todavía). Ver el
// requerimiento de tablas Supabase en
// .claude/Cam.Claude/backend/backend-2026-07-14-participa.md.

export const metadata: Metadata = {
  title: "Participa",
  description:
    "Conoce los mecanismos de participación social en salud de IPS Cardiocentro Pediátrico de Sucre: Asociación de Usuarios, PQRSD, encuestas, convocatorias y documentos institucionales.",
};

export default function ParticipaPage() {
  return (
    <div id="main-content">
      <ParticipaHero />
      <ParticipaQueEs />
      <ParticipaMecanismos />
      <ParticipaDocumentos />
      <ParticipaConvocatorias />
      <ParticipaForm />
    </div>
  );
}
