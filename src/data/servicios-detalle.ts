// Fuente de datos para la ficha de detalle de servicio (/servicios/catalogo/[slug]).
// Reutiliza FILAS de servicios-alfabetico.ts (numero/codigoCups/nombre/categoria)
// para no duplicar los 104 registros.
//
// Auditoría cruzada (2026-08-04) de las tres fuentes:
//   1. .claude/informacion/servicios-cardiocentro-numerados.md
//   2. .claude/informacion/servicios-extendidos.md
//   3. .claude/PORTAFOLIO DE SERVICIOS_CARDIOCENTRO.pdf
// Las tres coinciden sin discrepancias entre sí (extendidos.md y el .md
// numerado son transcripciones fieles del PDF). Lo que SÍ existe en las
// fuentes, más allá de numero/codigoCups/nombre/categoria:
//   - Tabla "Servicios Habilitados por Sede" (§1): 6 grupos de servicio
//     declarados (361, 302, 316, 742, 744, 745), cada uno con sede(s),
//     modalidad ("Intramural" en el 100% de los casos) y complejidad
//     ("Media" en el 100% de los casos — ninguno marcado Baja ni Alta).
//   - Horario único para sede principal y sucursales (no varía por sede
//     ni por servicio): L-V 7-12/1-5, sábados 7-12.
//   - Para 9 de los 104 servicios (radiografías de vía digestiva +
//     urografía/ureterografía), una nota de preparación explícita
//     ("requiere medio de contraste oral/rectal/endovenoso").
// Lo que NO existe en ninguna de las tres fuentes (queda null/undefined,
// no se inventa): nombre de especialista, descripción clínica más allá
// del nombre del examen, pasos del proceso, imagen.
//
// La tabla de habilitación agrupa por "servicio declarado" (6 grupos), no
// por código CUPS individual — no hay mapeo 1:1 explícito en la fuente
// entre cada uno de los 104 CUPS y su grupo. Se mapea por coincidencia de
// nombre de categoría (Cardiología Pediátrica → grupo 361, Cardiología
// Adultos → grupo 302, Gastroenterología → grupo 316) y, para Radiología/
// Mamografía/Radiología especial (todas usan rayos X), por el grupo 744
// "Imágenes Diagnósticas - Ionizantes" (el único de los seis que aplica
// por definición física: son procedimientos con radiación ionizante).
// Esto es una inferencia documentada, no un dato literal del origen — se
// reporta como tal. Detalle completo del cruce y de la única discrepancia
// interna del PDF encontrada (ver más abajo) en
// bitacora/trazabilidad-funcionalidades.md, entrada 2026-08-04.
//
// Listo para migrar a Supabase: ver
// .claude/Cam.Claude/backend/backend-2026-08-04-servicios-detalle.md

import { FILAS } from "./servicios-alfabetico";
import { slugServicio } from "@/lib/slugify";

export interface PasoProceso {
  titulo: string;
  detalle: string;
}

export type LayoutVariante = "A" | "B" | "C" | "D" | "E";
export type LayoutCompacto = "M1" | "M2";
export type LayoutBaja = "TARJETA";
export type Variante = LayoutVariante | LayoutCompacto | LayoutBaja;
export type Densidad = "alta" | "media" | "baja";
export type NivelComplejidad = "Baja" | "Media" | "Alta";

export interface ServicioDetalle {
  id: string;
  numero: number;
  slug: string;
  nombre: string;
  letraInicial: string;
  categoria: string;
  intro?: string;
  descripcionLarga?: string;
  pasos?: PasoProceso[];
  sedes?: string[]; // claves de SEDES
  especialista?: string;
  horario?: string;
  modalidad?: string;
  nivelComplejidad?: NivelComplejidad;
  requierePreparacion?: string;
  imagen?: string | null;
  layout?: LayoutVariante;
  relacionados?: string[];
  visible: boolean;
  sortOrder: number;
}

export interface SedeInfo {
  nombre: string;
  direccion?: string;
  telefono?: string;
}

// Fuente: servicios-extendidos.md §1 / PDF "SERVICIOS HABILITADOS" — las
// mismas 3 sedes con tabla de habilitación (Sahagún queda fuera: el
// documento fuente no trae tabla de servicios habilitados para esa sede,
// solo teléfono — ver trazabilidad-pendientes.md).
export const SEDES: Record<string, SedeInfo> = {
  Sincelejo: {
    nombre: "Sede principal — Sincelejo, Sucre",
    direccion: "Calle 14 No 17-72, Barrio Ford",
    telefono: "(5) 2714005 / 3009127565",
  },
  "El Carmen de Bolívar": {
    nombre: "Sucursal — El Carmen de Bolívar, Bolívar",
    direccion: "Calle 23 No. 54-20, Barrio Bureche",
    telefono: "3160108423",
  },
  Magangué: {
    nombre: "Sucursal — Magangué, Bolívar",
    direccion: "Calle 16 N.º 12-56, Barrio San José",
    telefono: "3244800737",
  },
};

const HORARIO_GENERAL =
  "Lunes a viernes: 7:00 a.m. – 12:00 p.m. y 1:00 p.m. – 5:00 p.m. Sábados: 7:00 a.m. – 12:00 p.m.";

// Mapeo categoría → { sedes, modalidad, nivelComplejidad } según la tabla
// de habilitación (§1 de las 3 fuentes). Cardiología Pediátrica (grupo 361)
// es el único grupo, dentro de nuestros 104, habilitado en las 3 sedes;
// todo lo demás está habilitado solo en la sede principal.
const SEDES_CARDIO_PEDIATRICA = ["Sincelejo", "El Carmen de Bolívar", "Magangué"];
const SEDES_SOLO_SINCELEJO = ["Sincelejo"];

function datosPorCategoria(categoria: string): {
  sedes: string[];
  modalidad: string;
  nivelComplejidad: NivelComplejidad;
} {
  const sedes = categoria === "Cardiología Pediátrica" ? SEDES_CARDIO_PEDIATRICA : SEDES_SOLO_SINCELEJO;
  return { sedes, modalidad: "Intramural", nivelComplejidad: "Media" };
}

// Fuente: servicios-extendidos.md §3.5 / PDF — nota de preparación textual
// presente solo en estos 9 de los 104 (radiografías de vía digestiva +
// radiología especial de sistema urinario, todas requieren contraste).
const PREPARACION_POR_NUMERO: Record<number, string> = {
  62: "Requiere medio de contraste oral.",
  63: "Requiere medio de contraste rectal.",
  64: "Requiere medio de contraste rectal.",
  65: "Requiere medio de contraste rectal.",
  66: "Requiere medio de contraste oral.",
  67: "Requiere medio de contraste oral.",
  68: "Requiere medio de contraste oral.",
  103: "Requiere medio de contraste endovenoso.",
  104: "Requiere medio de contraste endovenoso.",
};

function derivarLetraInicial(nombre: string): string {
  return nombre
    .normalize("NFD")
    .replace(new RegExp("[\\u0300-\\u036f]", "g"), "")
    .trim()
    .charAt(0)
    .toUpperCase();
}

export const SERVICIOS_DETALLE: ServicioDetalle[] = FILAS.map((fila) => {
  const { sedes, modalidad, nivelComplejidad } = datosPorCategoria(fila.categoria);

  return {
    id: `svc-${fila.numero}`,
    numero: fila.numero,
    slug: slugServicio(fila.numero, fila.nombre),
    nombre: fila.nombre,
    letraInicial: derivarLetraInicial(fila.nombre),
    categoria: fila.categoria,
    sedes,
    modalidad,
    nivelComplejidad,
    horario: HORARIO_GENERAL,
    requierePreparacion: PREPARACION_POR_NUMERO[fila.numero],
    visible: true,
    sortOrder: fila.numero,
  };
});

const LAYOUTS: readonly LayoutVariante[] = ["A", "B", "C", "D", "E"];

export function getServicioDetalleBySlug(slug: string): ServicioDetalle | undefined {
  return SERVICIOS_DETALLE.find((s) => s.slug === slug && s.visible);
}

export function getRelacionados(servicio: ServicioDetalle, limite = 4): ServicioDetalle[] {
  return SERVICIOS_DETALLE
    .filter((s) => s.visible && s.id !== servicio.id && s.categoria === servicio.categoria)
    .slice(0, limite);
}

export function calcularDensidad(servicio: ServicioDetalle): Densidad {
  const tieneDescripcion = Boolean(servicio.intro || servicio.descripcionLarga);
  const tienePasos = Boolean(servicio.pasos && servicio.pasos.length > 0);
  const tieneEspecialista = Boolean(servicio.especialista);
  const tieneSede = Boolean(servicio.sedes && servicio.sedes.length > 0);
  const tieneImagen = Boolean(servicio.imagen);

  if (tieneDescripcion && tienePasos && tieneEspecialista && tieneSede && tieneImagen) {
    return "alta";
  }

  const tieneAlgunDatoOperativo =
    tieneSede || tieneEspecialista || Boolean(servicio.modalidad) || tieneDescripcion || tienePasos || tieneImagen;

  return tieneAlgunDatoOperativo ? "media" : "baja";
}

export function resolveVariante(servicio: ServicioDetalle): {
  densidad: Densidad;
  variante: Variante;
  fallback: boolean;
} {
  const densidad = calcularDensidad(servicio);

  if (densidad === "baja") {
    return { densidad, variante: "TARJETA", fallback: false };
  }

  if (densidad === "media") {
    const base: LayoutCompacto = servicio.numero % 2 === 0 ? "M1" : "M2";
    const tieneSegundaColumna = Boolean(
      (servicio.sedes && servicio.sedes.length > 0) || servicio.especialista || getRelacionados(servicio).length > 0
    );

    if (base === "M2" && !tieneSegundaColumna) {
      return { densidad, variante: "M1", fallback: true };
    }
    return { densidad, variante: base, fallback: false };
  }

  const base = servicio.layout ?? LAYOUTS[servicio.numero % 5];
  const necesitaImagen = base === "C" || base === "E";

  if (necesitaImagen && !servicio.imagen) {
    return { densidad, variante: base === "C" ? "A" : "B", fallback: true };
  }

  return { densidad, variante: base, fallback: false };
}
