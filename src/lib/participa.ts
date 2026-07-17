// Capa de acceso a datos de Participa.
// Hoy lee de los mocks en src/data/participa.mock.ts. Cuando existan las
// tablas participa_* en Supabase (ver solicitud en
// .claude/Cam.Claude/backend/backend-2026-07-14-participa.md), estas
// funciones pasan a consultar Supabase — los componentes que las llaman
// no cambian, porque devuelven el mismo tipo filtrado por `visible` y
// ordenado por `orden`.

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

export function getParticipaHero(): ParticipaHeroContent | null {
  return PARTICIPA_HERO_MOCK.visible ? PARTICIPA_HERO_MOCK : null;
}

export function getQueEsParticipa(): QueEsRespuesta[] {
  return porOrden(QUE_ES_PARTICIPA_MOCK);
}

export function getMecanismos(): MecanismoParticipacion[] {
  return porOrden(MECANISMOS_MOCK);
}

export function getDocumentos(): DocumentoInstitucional[] {
  return porOrden(DOCUMENTOS_MOCK);
}

export function getConvocatorias(): Convocatoria[] {
  return porOrden(CONVOCATORIAS_MOCK);
}

export function getCalendario(): ActividadCalendario[] {
  return porOrden(CALENDARIO_MOCK);
}
