import type { Metadata } from "next";
import ParticipaHero         from "@/components/public/participa/ParticipaHero";
import ParticipaQueEs         from "@/components/public/participa/ParticipaQueEs";
import ParticipaMecanismos    from "@/components/public/participa/ParticipaMecanismos";
import ParticipaDocumentos    from "@/components/public/participa/ParticipaDocumentos";
import ParticipaConvocatorias from "@/components/public/participa/ParticipaConvocatorias";
import ParticipaForm          from "@/components/public/participa/ParticipaForm";
import {
  getParticipaHero,
  getQueEsParticipa,
  getMecanismos,
  getDocumentos,
  getConvocatorias,
  getCalendario,
} from "@/lib/participa";

export const metadata: Metadata = {
  title: "Participa",
  description:
    "Conoce los mecanismos de participación social en salud de IPS Cardiocentro Pediátrico de Sucre: Asociación de Usuarios, PQRSD, encuestas, convocatorias y documentos institucionales.",
};

export default async function ParticipaPage() {
  const [hero, queEs, mecanismos, documentos, convocatorias, calendario] =
    await Promise.all([
      getParticipaHero(),
      getQueEsParticipa(),
      getMecanismos(),
      getDocumentos(),
      getConvocatorias(),
      getCalendario(),
    ]);

  return (
    <div id="main-content">
      <ParticipaHero         hero={hero} />
      <ParticipaQueEs        items={queEs} />
      <ParticipaMecanismos   mecanismos={mecanismos} />
      <ParticipaDocumentos   documentos={documentos} />
      <ParticipaConvocatorias convocatorias={convocatorias} calendario={calendario} />
      <ParticipaForm         mecanismos={mecanismos} />
    </div>
  );
}
