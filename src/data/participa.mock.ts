// Contenido de la sección Participa.
// Hoy: datos mock estáticos. Cuando el backend exponga las tablas
// participa_* (ver .claude/Cam.Claude/backend/backend-2026-07-14-participa.md),
// estas interfaces se convierten en el contrato de esa API/consulta a
// Supabase — solo cambia la fuente de los arrays, no la forma de los datos.

export interface ParticipaHeroContent {
  eyebrow: string;
  titulo: string;
  subtitulo: string;
  visible: boolean;
}

export interface QueEsRespuesta {
  id: string;
  pregunta: string;
  respuesta: string;
  orden: number;
  visible: boolean;
}

export interface MecanismoParticipacion {
  id: string;
  titulo: string;
  descripcion: string;
  icono: "usuarios" | "pqrsd" | "encuestas" | "canales";
  ctaLabel: string;
  ctaHref: string;
  orden: number;
  visible: boolean;
}

export interface DocumentoInstitucional {
  id: string;
  titulo: string;
  descripcion: string;
  url: string | null;
  año?: string;
  orden: number;
  visible: boolean;
}

export type EstadoConvocatoria = "abierta" | "cerrada";

export interface Convocatoria {
  id: string;
  tema: string;
  objetivo: string;
  requisitos: string;
  plazo: string; // fecha límite en formato legible, ej. "30 de agosto de 2026"
  plazoISO: string; // fecha ISO para calcular el estado
  orden: number;
  visible: boolean;
}

export interface ActividadCalendario {
  id: string;
  mes: string;
  actividad: string;
  descripcion: string;
  orden: number;
  visible: boolean;
}

export function estadoConvocatoria(plazoISO: string): EstadoConvocatoria {
  return new Date(plazoISO).getTime() >= Date.now() ? "abierta" : "cerrada";
}

export const PARTICIPA_HERO_MOCK: ParticipaHeroContent = {
  eyebrow: "Participa",
  titulo: "Participa",
  subtitulo: "Tu voz construye nuestra institución",
  visible: true,
};

export const QUE_ES_PARTICIPA_MOCK: QueEsRespuesta[] = [
  {
    id: "que-es",
    pregunta: "¿De qué se trata el menú Participa?",
    respuesta:
      "Es el espacio donde la comunidad, los usuarios y sus familias pueden informarse sobre los mecanismos de participación social en salud de la IPS Cardiocentro Pediátrico de Sucre, y acceder de forma directa a los canales para incidir en las decisiones que nos afectan como institución.",
    orden: 1,
    visible: true,
  },
  {
    id: "secciones",
    pregunta: "¿Qué secciones lo integran?",
    respuesta:
      "Mecanismos de participación (Asociación de Usuarios, PQRSD, encuestas y canales de contacto), documentos institucionales de participación social en salud, convocatorias activas, un calendario de actividades del año y un formulario de inscripción a los espacios de participación.",
    orden: 2,
    visible: true,
  },
  {
    id: "como-participar",
    pregunta: "¿Cómo puedes participar?",
    respuesta:
      "Puedes vincularte a la Asociación de Usuarios, radicar una PQRSD, responder nuestras encuestas de satisfacción, inscribirte a una convocatoria abierta o comunicarte por cualquiera de nuestros canales de atención. Toda la información de contacto está disponible en esta misma página.",
    orden: 3,
    visible: true,
  },
];

export const MECANISMOS_MOCK: MecanismoParticipacion[] = [
  {
    id: "asociacion-usuarios",
    titulo: "Asociación de Usuarios",
    descripcion:
      "Espacio de representación de los usuarios ante la IPS para el seguimiento a la calidad del servicio y la construcción conjunta de mejoras.",
    icono: "usuarios",
    ctaLabel: "Conocer más",
    ctaHref: "#mecanismos",
    orden: 1,
    visible: true,
  },
  {
    id: "pqrsd",
    titulo: "PQRSD",
    descripcion:
      "Radica peticiones, quejas, reclamos, sugerencias o denuncias y haz seguimiento a tu solicitud con el número de radicado.",
    icono: "pqrsd",
    ctaLabel: "Ir a PQRSD",
    ctaHref: "/pqrs",
    orden: 2,
    visible: true,
  },
  {
    id: "encuestas",
    titulo: "Encuestas de satisfacción",
    descripcion:
      "Tu opinión sobre la atención recibida nos ayuda a identificar oportunidades de mejora en cada uno de nuestros servicios.",
    icono: "encuestas",
    ctaLabel: "Conocer más",
    ctaHref: "#mecanismos",
    orden: 3,
    visible: true,
  },
  {
    id: "canales-contacto",
    titulo: "Canales de contacto",
    descripcion:
      "Comunícate con nosotros por WhatsApp, correo electrónico o de forma presencial en cualquiera de nuestras sedes.",
    icono: "canales",
    ctaLabel: "Conocer más",
    ctaHref: "#mecanismos",
    orden: 4,
    visible: true,
  },
];

export const DOCUMENTOS_MOCK: DocumentoInstitucional[] = [
  {
    id: "politica-pps",
    titulo: "Política de Participación Social en Salud",
    descripcion: "Resolución 2063 de 2017.",
    url: null,
    orden: 1,
    visible: true,
  },
  {
    id: "estrategia-rendicion-cuentas",
    titulo: "Estrategia anual de rendición de cuentas",
    descripcion: "Plan de la vigencia para la rendición de cuentas a la comunidad.",
    url: null,
    orden: 2,
    visible: true,
  },
  {
    id: "paac",
    titulo: "Plan Anticorrupción y de Atención al Ciudadano",
    descripcion: "PAAC vigente de la institución.",
    url: null,
    orden: 3,
    visible: true,
  },
  {
    id: "informes-rendicion-cuentas",
    titulo: "Informes de rendición de cuentas",
    descripcion: "Consulta los informes publicados en la sección de Transparencia.",
    url: "/transparencia",
    orden: 4,
    visible: true,
  },
  {
    id: "informe-ppss-2024",
    titulo: "Informe anual de implementación PPSS",
    descripcion: "Vigencia 2024.",
    url: null,
    año: "2024",
    orden: 5,
    visible: true,
  },
  {
    id: "informe-ppss-2025",
    titulo: "Informe anual de implementación PPSS",
    descripcion: "Vigencia 2025.",
    url: null,
    año: "2025",
    orden: 6,
    visible: true,
  },
];

export const CONVOCATORIAS_MOCK: Convocatoria[] = [
  {
    id: "convocatoria-asociacion-usuarios-2026",
    tema: "Renovación de representantes de la Asociación de Usuarios",
    objetivo:
      "Elegir a los representantes de los usuarios que integrarán la Asociación de Usuarios para el próximo periodo.",
    requisitos:
      "Ser usuario activo de la IPS y diligenciar el formulario de inscripción de esta página.",
    plazo: "30 de agosto de 2026",
    plazoISO: "2026-08-30",
    orden: 1,
    visible: true,
  },
];

export const CALENDARIO_MOCK: ActividadCalendario[] = [
  {
    id: "cal-marzo",
    mes: "Marzo",
    actividad: "Asamblea Asociación de Usuarios",
    descripcion: "Reunión ordinaria de seguimiento con la comunidad.",
    orden: 3,
    visible: true,
  },
  {
    id: "cal-agosto",
    mes: "Agosto",
    actividad: "Convocatoria de representantes",
    descripcion: "Apertura de inscripciones para nuevos representantes de usuarios.",
    orden: 8,
    visible: true,
  },
  {
    id: "cal-noviembre",
    mes: "Noviembre",
    actividad: "Rendición de cuentas anual",
    descripcion: "Audiencia pública de rendición de cuentas a la comunidad.",
    orden: 11,
    visible: true,
  },
];
