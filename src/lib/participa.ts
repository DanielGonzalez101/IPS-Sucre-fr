import { createClient } from "@/lib/supabase/server";
import {
  PARTICIPA_HERO_MOCK,
  QUE_ES_PARTICIPA_MOCK,
  MECANISMOS_MOCK,
  DOCUMENTOS_MOCK,
  CONVOCATORIAS_MOCK,
  CALENDARIO_MOCK,
  type ParticipaHeroContent,
  type QueEsRespuesta,
  type MecanismoParticipacion,
  type DocumentoInstitucional,
  type Convocatoria,
  type ActividadCalendario,
} from "@/data/participa.mock";

function porOrden<T extends { orden: number; visible: boolean }>(items: T[]): T[] {
  return items.filter((i) => i.visible).sort((a, b) => a.orden - b.orden);
}

function formatearFecha(iso: string): string {
  return new Intl.DateTimeFormat("es-CO", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(iso));
}

export async function getParticipaHero(): Promise<ParticipaHeroContent | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("participa_hero")
      .select("eyebrow, titulo, subtitulo, visible")
      .eq("visible", true)
      .limit(1)
      .single();
    if (error || !data) throw error;
    return data as ParticipaHeroContent;
  } catch {
    return PARTICIPA_HERO_MOCK.visible ? PARTICIPA_HERO_MOCK : null;
  }
}

export async function getQueEsParticipa(): Promise<QueEsRespuesta[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("participa_que_es")
      .select("id, pregunta, respuesta, orden, visible")
      .eq("visible", true)
      .order("orden");
    if (error || !data) throw error;
    return data as QueEsRespuesta[];
  } catch {
    return porOrden(QUE_ES_PARTICIPA_MOCK);
  }
}

export async function getMecanismos(): Promise<MecanismoParticipacion[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("participa_mecanismos")
      .select("id, titulo, descripcion, icono, cta_label, cta_href, orden, visible")
      .eq("visible", true)
      .order("orden");
    if (error || !data) throw error;
    return data.map((r) => ({
      ...r,
      ctaLabel: r.cta_label,
      ctaHref: r.cta_href,
    })) as MecanismoParticipacion[];
  } catch {
    return porOrden(MECANISMOS_MOCK);
  }
}

export async function getDocumentos(): Promise<DocumentoInstitucional[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("participa_documentos")
      .select("id, titulo, descripcion, url, anio, orden, visible")
      .eq("visible", true)
      .order("orden");
    if (error || !data) throw error;
    return data.map((r) => ({ ...r, año: r.anio })) as DocumentoInstitucional[];
  } catch {
    return porOrden(DOCUMENTOS_MOCK);
  }
}

export async function getConvocatorias(): Promise<Convocatoria[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("participa_convocatorias")
      .select("id, tema, objetivo, requisitos, plazo, orden, visible")
      .eq("visible", true)
      .order("orden");
    if (error || !data) throw error;
    return data.map((r) => ({
      ...r,
      plazoISO: r.plazo,
      plazo: formatearFecha(r.plazo),
    })) as Convocatoria[];
  } catch {
    return porOrden(CONVOCATORIAS_MOCK);
  }
}

export async function getCalendario(): Promise<ActividadCalendario[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("participa_calendario")
      .select("id, mes, actividad, descripcion, orden, visible")
      .eq("visible", true)
      .order("orden");
    if (error || !data) throw error;
    return data as ActividadCalendario[];
  } catch {
    return porOrden(CALENDARIO_MOCK);
  }
}
