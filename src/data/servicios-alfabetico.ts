// Fuente: .claude/informacion/servicios-cardiocentro-numerados.md
// Sección "2.1 Lista 1 — Servicios 1 a 104". Mapeo 1:1 por número de fila.
// Cuando el backend agregue la columna generada `letra` a la tabla `servicios`
// (ver .claude/Cam.Claude/backend/backend-2026-07-23-servicios-alfabetico.md),
// este array se reemplaza por la consulta a Supabase — la forma no cambia.
// `FILAS` también se reutiliza en src/data/servicios-detalle.ts para no
// duplicar numero/codigoCups/nombre/categoria en la ficha de detalle.

import { slugServicio } from "@/lib/slugify";

export interface ServicioAlfabetico {
  id: string;
  numero: number;
  codigoCups: string;
  nombre: string;
  letra: string;
  categoria: string;
  icono: string;
  url?: string;
  visible: boolean;
  sort_order: number;
}

function derivarLetra(nombre: string): string {
  return nombre
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .charAt(0)
    .toUpperCase();
}

function iconoPorCategoria(categoria: string): string {
  if (categoria.startsWith("Cardiología Pediátrica")) return "Heartbeat";
  if (categoria.startsWith("Cardiología Adultos")) return "Heart";
  if (categoria.startsWith("Gastroenterología")) return "Stethoscope";
  if (categoria.startsWith("Mamografía")) return "Waves";
  if (categoria.startsWith("Radiología especial")) return "Microscope";
  return "Bone";
}

export interface FilaServicio {
  numero: number;
  codigoCups: string;
  nombre: string;
  categoria: string;
}

export const FILAS: FilaServicio[] = [
  { numero: 1, codigoCups: "890229", nombre: "Consulta de primera vez por especialista en Cardiología Pediátrica", categoria: "Cardiología Pediátrica" },
  { numero: 2, codigoCups: "890329", nombre: "Consulta de control o seguimiento por especialista en Cardiología Pediátrica", categoria: "Cardiología Pediátrica" },
  { numero: 3, codigoCups: "890402", nombre: "Interconsulta por medicina especializada en Cardiología Pediátrica", categoria: "Cardiología Pediátrica" },
  { numero: 4, codigoCups: "890202", nombre: "Consulta de primera vez otras especialidades — Electrofisiología Pediátrica", categoria: "Cardiología Pediátrica" },
  { numero: 5, codigoCups: "890302", nombre: "Consulta de control o seguimiento — Electrofisiología Pediátrica", categoria: "Cardiología Pediátrica" },
  { numero: 6, codigoCups: "881202", nombre: "Ecocardiograma transtorácico", categoria: "Cardiología Pediátrica" },
  { numero: 7, codigoCups: "881205", nombre: "Ecocardiograma transesofágico", categoria: "Cardiología Pediátrica" },
  { numero: 8, codigoCups: "881438", nombre: "Ecocardiograma fetal", categoria: "Cardiología Pediátrica" },
  { numero: 9, codigoCups: "894102", nombre: "Prueba de esfuerzo", categoria: "Cardiología Pediátrica" },
  { numero: 10, codigoCups: "895001", nombre: "Monitoreo electrocardiográfico continuo (Holter)", categoria: "Cardiología Pediátrica" },
  { numero: 11, codigoCups: "895003", nombre: "Mesa basculante o tilt test", categoria: "Cardiología Pediátrica" },
  { numero: 12, codigoCups: "895004", nombre: "Monitoreo ambulatorio de presión arterial", categoria: "Cardiología Pediátrica" },
  { numero: 13, codigoCups: "895100", nombre: "Electrocardiograma de ritmo o de superficie SOD+", categoria: "Cardiología Pediátrica" },
  { numero: 14, codigoCups: "890228", nombre: "Consulta de primera vez por especialista en Cardiología", categoria: "Cardiología Adultos" },
  { numero: 15, codigoCups: "890328", nombre: "Consulta de control o seguimiento por especialista en Cardiología", categoria: "Cardiología Adultos" },
  { numero: 16, codigoCups: "881202", nombre: "Ecocardiograma transtorácico", categoria: "Cardiología Adultos" },
  { numero: 17, codigoCups: "881205", nombre: "Ecocardiograma transesofágico", categoria: "Cardiología Adultos" },
  { numero: 18, codigoCups: "881205-1", nombre: "Ecocardiograma transesofágico con sedación", categoria: "Cardiología Adultos" },
  { numero: 19, codigoCups: "881210", nombre: "Ecocardiograma de stress con prueba de esfuerzo o farmacológica", categoria: "Cardiología Adultos" },
  { numero: 20, codigoCups: "894102", nombre: "Prueba de esfuerzo", categoria: "Cardiología Adultos" },
  { numero: 21, codigoCups: "895001", nombre: "Monitoreo electrocardiográfico continuo (Holter)", categoria: "Cardiología Adultos" },
  { numero: 22, codigoCups: "895003", nombre: "Mesa basculante o tilt test", categoria: "Cardiología Adultos" },
  { numero: 23, codigoCups: "895004", nombre: "Monitoreo ambulatorio de presión arterial", categoria: "Cardiología Adultos" },
  { numero: 24, codigoCups: "895101", nombre: "Electrocardiograma de ritmo o de superficie SOD+", categoria: "Cardiología Adultos" },
  { numero: 25, codigoCups: "894402", nombre: "Prueba de caminata de 6 minutos", categoria: "Cardiología Adultos" },
  { numero: 26, codigoCups: "890247", nombre: "Consulta de primera vez por especialista en Gastroenterología Pediátrica", categoria: "Gastroenterología" },
  { numero: 27, codigoCups: "890347", nombre: "Consulta de control o seguimiento por especialista en Gastroenterología Pediátrica", categoria: "Gastroenterología" },
  { numero: 28, codigoCups: "870001", nombre: "Radiografía de cráneo simple", categoria: "Radiología general de cabeza, cara y cuello" },
  { numero: 29, codigoCups: "870003", nombre: "Radiografía de base de cráneo", categoria: "Radiología general de cabeza, cara y cuello" },
  { numero: 30, codigoCups: "870004", nombre: "Radiografía de silla turca", categoria: "Radiología general de cabeza, cara y cuello" },
  { numero: 31, codigoCups: "870005", nombre: "Radiografía de mastoides comparativas", categoria: "Radiología general de cabeza, cara y cuello" },
  { numero: 32, codigoCups: "870006", nombre: "Radiografía de peñascos", categoria: "Radiología general de cabeza, cara y cuello" },
  { numero: 33, codigoCups: "870007", nombre: "Radiografía de conducto auditivo interno", categoria: "Radiología general de cabeza, cara y cuello" },
  { numero: 34, codigoCups: "870101", nombre: "Radiografía de cara (perfilograma)", categoria: "Radiología general de cabeza, cara y cuello" },
  { numero: 35, codigoCups: "870102", nombre: "Radiografía de órbitas", categoria: "Radiología general de cabeza, cara y cuello" },
  { numero: 36, codigoCups: "870103", nombre: "Radiografía de agujeros ópticos", categoria: "Radiología general de cabeza, cara y cuello" },
  { numero: 37, codigoCups: "870104", nombre: "Radiografía de malar", categoria: "Radiología general de cabeza, cara y cuello" },
  { numero: 38, codigoCups: "870105", nombre: "Radiografía de arco cigomático", categoria: "Radiología general de cabeza, cara y cuello" },
  { numero: 39, codigoCups: "870107", nombre: "Radiografía de huesos nasales", categoria: "Radiología general de cabeza, cara y cuello" },
  { numero: 40, codigoCups: "870108", nombre: "Radiografía de senos paranasales", categoria: "Radiología general de cabeza, cara y cuello" },
  { numero: 41, codigoCups: "870112", nombre: "Radiografía de maxilar superior", categoria: "Radiología general de cabeza, cara y cuello" },
  { numero: 42, codigoCups: "870113", nombre: "Radiografía de maxilar inferior", categoria: "Radiología general de cabeza, cara y cuello" },
  { numero: 43, codigoCups: "870131", nombre: "Radiografía de articulación temporomaxilar (ATM)", categoria: "Radiología general de cabeza, cara y cuello" },
  { numero: 44, codigoCups: "870601", nombre: "Radiografía de tejidos blandos de cuello", categoria: "Radiología general de cuello" },
  { numero: 45, codigoCups: "870602", nombre: "Radiografía de cavum faríngeo", categoria: "Radiología general de cuello" },
  { numero: 46, codigoCups: "870603", nombre: "Radiografía de faringe (faringografía)", categoria: "Radiología general de cuello" },
  { numero: 47, codigoCups: "871010", nombre: "Radiografía de columna cervical", categoria: "Radiología general de columna vertebral" },
  { numero: 48, codigoCups: "871019", nombre: "Radiografía de columna unión cervico dorsal", categoria: "Radiología general de columna vertebral" },
  { numero: 49, codigoCups: "871020", nombre: "Radiografía de columna torácica", categoria: "Radiología general de columna vertebral" },
  { numero: 50, codigoCups: "871030", nombre: "Radiografía de columna dorsolumbar", categoria: "Radiología general de columna vertebral" },
  { numero: 51, codigoCups: "871040", nombre: "Radiografía de columna lumbosacra", categoria: "Radiología general de columna vertebral" },
  { numero: 52, codigoCups: "871050", nombre: "Radiografía de sacro cóccix", categoria: "Radiología general de columna vertebral" },
  { numero: 53, codigoCups: "871061", nombre: "Radiografía panorámica de columna (goniometría/ortograma) 14\"x36\" (adultos)", categoria: "Radiología general de columna vertebral" },
  { numero: 54, codigoCups: "871062", nombre: "Radiografía panorámica de columna (goniometría/ortograma) 14\"x17\" (niños)", categoria: "Radiología general de columna vertebral" },
  { numero: 55, codigoCups: "871111", nombre: "Radiografía de reja costal", categoria: "Radiología general de tórax y mediastino" },
  { numero: 56, codigoCups: "871112", nombre: "Radiografía de esternón", categoria: "Radiología general de tórax y mediastino" },
  { numero: 57, codigoCups: "871121", nombre: "Radiografía de tórax (PA/AP y lateral, decúbito lateral, oblicuas)", categoria: "Radiología general de tórax y mediastino" },
  { numero: 58, codigoCups: "871129", nombre: "Radiografía de articulaciones esternoclaviculares", categoria: "Radiología general de tórax y mediastino" },
  { numero: 59, codigoCups: "871320", nombre: "Radiografía de esófago", categoria: "Radiología general de tórax y mediastino" },
  { numero: 60, codigoCups: "872002", nombre: "Radiografía de abdomen simple", categoria: "Radiología general de abdomen y vía digestiva" },
  { numero: 61, codigoCups: "872011", nombre: "Radiografía de abdomen simple con proyecciones adicionales (serie abdomen agudo)", categoria: "Radiología general de abdomen y vía digestiva" },
  { numero: 62, codigoCups: "872101", nombre: "Radiografía de tránsito intestinal convencional", categoria: "Radiología general de abdomen y vía digestiva" },
  { numero: 63, codigoCups: "872102", nombre: "Radiografía de tránsito intestinal doble contraste", categoria: "Radiología general de abdomen y vía digestiva" },
  { numero: 64, codigoCups: "872104", nombre: "Radiografía de colon por enema o ingesta", categoria: "Radiología general de abdomen y vía digestiva" },
  { numero: 65, codigoCups: "872105", nombre: "Radiografía de colon por enema con doble contraste", categoria: "Radiología general de abdomen y vía digestiva" },
  { numero: 66, codigoCups: "872121", nombre: "Radiografía de vías digestivas altas", categoria: "Radiología general de abdomen y vía digestiva" },
  { numero: 67, codigoCups: "872122", nombre: "Radiografía de vías digestivas altas con doble contraste", categoria: "Radiología general de abdomen y vía digestiva" },
  { numero: 68, codigoCups: "872123", nombre: "Radiografía de vías digestivas altas y tránsito intestinal", categoria: "Radiología general de abdomen y vía digestiva" },
  { numero: 69, codigoCups: "873004", nombre: "Radiografía para detectar edad ósea (carpograma)", categoria: "Radiología de extremidades y articulaciones" },
  { numero: 70, codigoCups: "873111", nombre: "Radiografía de omoplato", categoria: "Radiología de extremidades y articulaciones" },
  { numero: 71, codigoCups: "873112", nombre: "Radiografía de clavícula", categoria: "Radiología de extremidades y articulaciones" },
  { numero: 72, codigoCups: "873121", nombre: "Radiografía de húmero", categoria: "Radiología de extremidades y articulaciones" },
  { numero: 73, codigoCups: "873122", nombre: "Radiografía de antebrazo", categoria: "Radiología de extremidades y articulaciones" },
  { numero: 74, codigoCups: "873204", nombre: "Radiografía de hombro", categoria: "Radiología de extremidades y articulaciones" },
  { numero: 75, codigoCups: "873205", nombre: "Radiografía de codo", categoria: "Radiología de extremidades y articulaciones" },
  { numero: 76, codigoCups: "873206", nombre: "Radiografía de puño o muñeca", categoria: "Radiología de extremidades y articulaciones" },
  { numero: 77, codigoCups: "873210", nombre: "Radiografía de mano", categoria: "Radiología de extremidades y articulaciones" },
  { numero: 78, codigoCups: "873302", nombre: "Radiografía para medición de miembros inferiores (estudio de Farill/osteometría)", categoria: "Radiología de extremidades y articulaciones" },
  { numero: 79, codigoCups: "873303", nombre: "Radiografía comparativa de pies con apoyo (AP y lateral)", categoria: "Radiología de extremidades y articulaciones" },
  { numero: 80, codigoCups: "873304", nombre: "Radiografía axial de sesamoideos y cabezas de metatarsianos", categoria: "Radiología de extremidades y articulaciones" },
  { numero: 81, codigoCups: "873305", nombre: "Radiografía panorámica de miembros inferiores 14\"x36\" (adultos)", categoria: "Radiología de extremidades y articulaciones" },
  { numero: 82, codigoCups: "873306", nombre: "Radiografía panorámica de miembros inferiores 14\"x17\" (niños)", categoria: "Radiología de extremidades y articulaciones" },
  { numero: 83, codigoCups: "873308", nombre: "Radiografía digital de miembros inferiores (estudio de longitud)", categoria: "Radiología de extremidades y articulaciones" },
  { numero: 84, codigoCups: "873311", nombre: "Radiografía de anteversión femoral", categoria: "Radiología de extremidades y articulaciones" },
  { numero: 85, codigoCups: "873312", nombre: "Radiografía de fémur (AP, lateral)", categoria: "Radiología de extremidades y articulaciones" },
  { numero: 86, codigoCups: "873313", nombre: "Radiografía de pierna (AP, lateral)", categoria: "Radiología de extremidades y articulaciones" },
  { numero: 87, codigoCups: "873314", nombre: "Radiografía de anteversión tibial", categoria: "Radiología de extremidades y articulaciones" },
  { numero: 88, codigoCups: "873333", nombre: "Radiografía de pie (AP, lateral y oblicua)", categoria: "Radiología de extremidades y articulaciones" },
  { numero: 89, codigoCups: "873335", nombre: "Radiografía de calcáneo (axial y lateral)", categoria: "Radiología de extremidades y articulaciones" },
  { numero: 90, codigoCups: "873340", nombre: "Radiografía de miembro inferior (AP, lateral)", categoria: "Radiología de extremidades y articulaciones" },
  { numero: 91, codigoCups: "873411", nombre: "Radiografía de cadera o articulación coxo-femoral (AP, lateral)", categoria: "Radiología de extremidades y articulaciones" },
  { numero: 92, codigoCups: "873412", nombre: "Radiografía de cadera comparativa", categoria: "Radiología de extremidades y articulaciones" },
  { numero: 93, codigoCups: "873420", nombre: "Radiografía de rodilla (AP, lateral)", categoria: "Radiología de extremidades y articulaciones" },
  { numero: 94, codigoCups: "873422", nombre: "Radiografía de rodillas comparativas posición vertical", categoria: "Radiología de extremidades y articulaciones" },
  { numero: 95, codigoCups: "873423", nombre: "Radiografía tangencial o axial de rótula", categoria: "Radiología de extremidades y articulaciones" },
  { numero: 96, codigoCups: "873431", nombre: "Radiografía de tobillo (AP, lateral y rotación interna)", categoria: "Radiología de extremidades y articulaciones" },
  { numero: 97, codigoCups: "873444", nombre: "Radiografías en extremidades, proyecciones adicionales (stress, túnel, oblicuas)", categoria: "Radiología de extremidades y articulaciones" },
  { numero: 98, codigoCups: "876801", nombre: "Mamografía unilateral o de pieza quirúrgica", categoria: "Mamografía" },
  { numero: 99, codigoCups: "876802", nombre: "Mamografía bilateral", categoria: "Mamografía" },
  { numero: 100, codigoCups: "876802-1", nombre: "Mamografía bilateral + compresión mamaria (calcificaciones sospechosas)", categoria: "Mamografía" },
  { numero: 101, codigoCups: "876802-2", nombre: "Mamografía bilateral + magnificación (nódulos irregulares)", categoria: "Mamografía" },
  { numero: 102, codigoCups: "876802-3", nombre: "Mamografía bilateral + técnica Eklund (prótesis mamaria)", categoria: "Mamografía" },
  { numero: 103, codigoCups: "877802", nombre: "Urografía intravenosa", categoria: "Radiología especial e intervencionista de sistema urinario" },
  { numero: 104, codigoCups: "877831", nombre: "Ureterografía retrógrada por catéter o ureterostomía", categoria: "Radiología especial e intervencionista de sistema urinario" },
];

export const SERVICIOS_ALFABETICO: ServicioAlfabetico[] = FILAS.map((fila) => ({
  id: `svc-${fila.numero}`,
  numero: fila.numero,
  codigoCups: fila.codigoCups,
  nombre: fila.nombre,
  letra: derivarLetra(fila.nombre),
  categoria: fila.categoria,
  icono: iconoPorCategoria(fila.categoria),
  url: `/servicios/catalogo/${slugServicio(fila.numero, fila.nombre)}`,
  visible: true,
  sort_order: fila.numero,
}));
