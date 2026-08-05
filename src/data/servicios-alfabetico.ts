// Fuente: docs/servicios-cardiocentro-numerados.md
// Portafolio completo — 208 servicios. Mapeo 1:1 por número de fila.
// Cuando el backend agregue la columna generada `letra` a la tabla `servicios`
// (ver .claude/Cam.Claude/backend/backend-2026-07-23-servicios-alfabetico.md),
// este array se reemplaza por la consulta a Supabase — la forma no cambia.

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
    .replace(/[̀-ͯ]/g, "")
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
  if (categoria.startsWith("Tomografía")) return "Scan";
  if (categoria.startsWith("Ecografías")) return "Waves";
  if (categoria.startsWith("Estudios vasculares")) return "DropHalf";
  return "Bone";
}

interface FilaServicio {
  numero: number;
  codigoCups: string;
  nombre: string;
  categoria: string;
}

const FILAS: FilaServicio[] = [
  // ── 2.1 Cardiología Pediátrica ──────────────────────────────
  { numero: 1,   codigoCups: "890229",   nombre: "Consulta de primera vez por especialista en Cardiología Pediátrica",              categoria: "Cardiología Pediátrica" },
  { numero: 2,   codigoCups: "890329",   nombre: "Consulta de control o seguimiento por especialista en Cardiología Pediátrica",    categoria: "Cardiología Pediátrica" },
  { numero: 3,   codigoCups: "890402",   nombre: "Interconsulta por medicina especializada en Cardiología Pediátrica",              categoria: "Cardiología Pediátrica" },
  { numero: 4,   codigoCups: "890202",   nombre: "Consulta de primera vez otras especialidades — Electrofisiología Pediátrica",     categoria: "Cardiología Pediátrica" },
  { numero: 5,   codigoCups: "890302",   nombre: "Consulta de control o seguimiento — Electrofisiología Pediátrica",                categoria: "Cardiología Pediátrica" },
  { numero: 6,   codigoCups: "881202",   nombre: "Ecocardiograma transtorácico",                                                    categoria: "Cardiología Pediátrica" },
  { numero: 7,   codigoCups: "881205",   nombre: "Ecocardiograma transesofágico",                                                   categoria: "Cardiología Pediátrica" },
  { numero: 8,   codigoCups: "881438",   nombre: "Ecocardiograma fetal",                                                            categoria: "Cardiología Pediátrica" },
  { numero: 9,   codigoCups: "894102",   nombre: "Prueba de esfuerzo",                                                              categoria: "Cardiología Pediátrica" },
  { numero: 10,  codigoCups: "895001",   nombre: "Monitoreo electrocardiográfico continuo (Holter)",                                categoria: "Cardiología Pediátrica" },
  { numero: 11,  codigoCups: "895003",   nombre: "Mesa basculante o tilt test",                                                     categoria: "Cardiología Pediátrica" },
  { numero: 12,  codigoCups: "895004",   nombre: "Monitoreo ambulatorio de presión arterial",                                       categoria: "Cardiología Pediátrica" },
  { numero: 13,  codigoCups: "895100",   nombre: "Electrocardiograma de ritmo o de superficie SOD+",                               categoria: "Cardiología Pediátrica" },
  // ── 2.2 Cardiología Adultos ─────────────────────────────────
  { numero: 14,  codigoCups: "890228",   nombre: "Consulta de primera vez por especialista en Cardiología",                         categoria: "Cardiología Adultos" },
  { numero: 15,  codigoCups: "890328",   nombre: "Consulta de control o seguimiento por especialista en Cardiología",               categoria: "Cardiología Adultos" },
  { numero: 16,  codigoCups: "881202",   nombre: "Ecocardiograma transtorácico",                                                    categoria: "Cardiología Adultos" },
  { numero: 17,  codigoCups: "881205",   nombre: "Ecocardiograma transesofágico",                                                   categoria: "Cardiología Adultos" },
  { numero: 18,  codigoCups: "881205-1", nombre: "Ecocardiograma transesofágico con sedación",                                     categoria: "Cardiología Adultos" },
  { numero: 19,  codigoCups: "881210",   nombre: "Ecocardiograma de stress con prueba de esfuerzo o farmacológica",                categoria: "Cardiología Adultos" },
  { numero: 20,  codigoCups: "894102",   nombre: "Prueba de esfuerzo",                                                              categoria: "Cardiología Adultos" },
  { numero: 21,  codigoCups: "895001",   nombre: "Monitoreo electrocardiográfico continuo (Holter)",                                categoria: "Cardiología Adultos" },
  { numero: 22,  codigoCups: "895003",   nombre: "Mesa basculante o tilt test",                                                     categoria: "Cardiología Adultos" },
  { numero: 23,  codigoCups: "895004",   nombre: "Monitoreo ambulatorio de presión arterial",                                       categoria: "Cardiología Adultos" },
  { numero: 24,  codigoCups: "895101",   nombre: "Electrocardiograma de ritmo o de superficie SOD+",                               categoria: "Cardiología Adultos" },
  { numero: 25,  codigoCups: "894402",   nombre: "Prueba de caminata de 6 minutos",                                                 categoria: "Cardiología Adultos" },
  // ── 2.3 Gastroenterología ───────────────────────────────────
  { numero: 26,  codigoCups: "890247",   nombre: "Consulta de primera vez por especialista en Gastroenterología Pediátrica",        categoria: "Gastroenterología" },
  { numero: 27,  codigoCups: "890347",   nombre: "Consulta de control o seguimiento por especialista en Gastroenterología Pediátrica", categoria: "Gastroenterología" },
  // ── 3.1 Radiología general de cabeza, cara y cuello ─────────
  { numero: 28,  codigoCups: "870001",   nombre: "Radiografía de cráneo simple",                                                    categoria: "Radiología general de cabeza, cara y cuello" },
  { numero: 29,  codigoCups: "870003",   nombre: "Radiografía de base de cráneo",                                                   categoria: "Radiología general de cabeza, cara y cuello" },
  { numero: 30,  codigoCups: "870004",   nombre: "Radiografía de silla turca",                                                      categoria: "Radiología general de cabeza, cara y cuello" },
  { numero: 31,  codigoCups: "870005",   nombre: "Radiografía de mastoides comparativas",                                           categoria: "Radiología general de cabeza, cara y cuello" },
  { numero: 32,  codigoCups: "870006",   nombre: "Radiografía de peñascos",                                                         categoria: "Radiología general de cabeza, cara y cuello" },
  { numero: 33,  codigoCups: "870007",   nombre: "Radiografía de conducto auditivo interno",                                        categoria: "Radiología general de cabeza, cara y cuello" },
  { numero: 34,  codigoCups: "870101",   nombre: "Radiografía de cara (perfilograma)",                                              categoria: "Radiología general de cabeza, cara y cuello" },
  { numero: 35,  codigoCups: "870102",   nombre: "Radiografía de órbitas",                                                          categoria: "Radiología general de cabeza, cara y cuello" },
  { numero: 36,  codigoCups: "870103",   nombre: "Radiografía de agujeros ópticos",                                                 categoria: "Radiología general de cabeza, cara y cuello" },
  { numero: 37,  codigoCups: "870104",   nombre: "Radiografía de malar",                                                            categoria: "Radiología general de cabeza, cara y cuello" },
  { numero: 38,  codigoCups: "870105",   nombre: "Radiografía de arco cigomático",                                                  categoria: "Radiología general de cabeza, cara y cuello" },
  { numero: 39,  codigoCups: "870107",   nombre: "Radiografía de huesos nasales",                                                   categoria: "Radiología general de cabeza, cara y cuello" },
  { numero: 40,  codigoCups: "870108",   nombre: "Radiografía de senos paranasales",                                                categoria: "Radiología general de cabeza, cara y cuello" },
  { numero: 41,  codigoCups: "870112",   nombre: "Radiografía de maxilar superior",                                                 categoria: "Radiología general de cabeza, cara y cuello" },
  { numero: 42,  codigoCups: "870113",   nombre: "Radiografía de maxilar inferior",                                                 categoria: "Radiología general de cabeza, cara y cuello" },
  { numero: 43,  codigoCups: "870131",   nombre: "Radiografía de articulación temporomaxilar (ATM)",                                categoria: "Radiología general de cabeza, cara y cuello" },
  // ── 3.2 Radiología general de cuello ────────────────────────
  { numero: 44,  codigoCups: "870601",   nombre: "Radiografía de tejidos blandos de cuello",                                        categoria: "Radiología general de cuello" },
  { numero: 45,  codigoCups: "870602",   nombre: "Radiografía de cavum faríngeo",                                                   categoria: "Radiología general de cuello" },
  { numero: 46,  codigoCups: "870603",   nombre: "Radiografía de faringe (faringografía)",                                          categoria: "Radiología general de cuello" },
  // ── 3.3 Radiología general de columna vertebral ─────────────
  { numero: 47,  codigoCups: "871010",   nombre: "Radiografía de columna cervical",                                                  categoria: "Radiología general de columna vertebral" },
  { numero: 48,  codigoCups: "871019",   nombre: "Radiografía de columna unión cervico dorsal",                                     categoria: "Radiología general de columna vertebral" },
  { numero: 49,  codigoCups: "871020",   nombre: "Radiografía de columna torácica",                                                  categoria: "Radiología general de columna vertebral" },
  { numero: 50,  codigoCups: "871030",   nombre: "Radiografía de columna dorsolumbar",                                              categoria: "Radiología general de columna vertebral" },
  { numero: 51,  codigoCups: "871040",   nombre: "Radiografía de columna lumbosacra",                                               categoria: "Radiología general de columna vertebral" },
  { numero: 52,  codigoCups: "871050",   nombre: "Radiografía de sacro cóccix",                                                     categoria: "Radiología general de columna vertebral" },
  { numero: 53,  codigoCups: "871061",   nombre: "Radiografía panorámica de columna (goniometría/ortograma) 14\"x36\" (adultos)",   categoria: "Radiología general de columna vertebral" },
  { numero: 54,  codigoCups: "871062",   nombre: "Radiografía panorámica de columna (goniometría/ortograma) 14\"x17\" (niños)",    categoria: "Radiología general de columna vertebral" },
  // ── 3.4 Radiología general de tórax y mediastino ────────────
  { numero: 55,  codigoCups: "871111",   nombre: "Radiografía de reja costal",                                                      categoria: "Radiología general de tórax y mediastino" },
  { numero: 56,  codigoCups: "871112",   nombre: "Radiografía de esternón",                                                         categoria: "Radiología general de tórax y mediastino" },
  { numero: 57,  codigoCups: "871121",   nombre: "Radiografía de tórax (PA/AP y lateral, decúbito lateral, oblicuas)",             categoria: "Radiología general de tórax y mediastino" },
  { numero: 58,  codigoCups: "871129",   nombre: "Radiografía de articulaciones esternoclaviculares",                               categoria: "Radiología general de tórax y mediastino" },
  { numero: 59,  codigoCups: "871320",   nombre: "Radiografía de esófago",                                                          categoria: "Radiología general de tórax y mediastino" },
  // ── 3.5 Radiología general de abdomen y vía digestiva ───────
  { numero: 60,  codigoCups: "872002",   nombre: "Radiografía de abdomen simple",                                                   categoria: "Radiología general de abdomen y vía digestiva" },
  { numero: 61,  codigoCups: "872011",   nombre: "Radiografía de abdomen simple con proyecciones adicionales (serie abdomen agudo)", categoria: "Radiología general de abdomen y vía digestiva" },
  { numero: 62,  codigoCups: "872101",   nombre: "Radiografía de tránsito intestinal convencional",                                 categoria: "Radiología general de abdomen y vía digestiva" },
  { numero: 63,  codigoCups: "872102",   nombre: "Radiografía de tránsito intestinal doble contraste",                              categoria: "Radiología general de abdomen y vía digestiva" },
  { numero: 64,  codigoCups: "872104",   nombre: "Radiografía de colon por enema o ingesta",                                        categoria: "Radiología general de abdomen y vía digestiva" },
  { numero: 65,  codigoCups: "872105",   nombre: "Radiografía de colon por enema con doble contraste",                              categoria: "Radiología general de abdomen y vía digestiva" },
  { numero: 66,  codigoCups: "872121",   nombre: "Radiografía de vías digestivas altas",                                            categoria: "Radiología general de abdomen y vía digestiva" },
  { numero: 67,  codigoCups: "872122",   nombre: "Radiografía de vías digestivas altas con doble contraste",                        categoria: "Radiología general de abdomen y vía digestiva" },
  { numero: 68,  codigoCups: "872123",   nombre: "Radiografía de vías digestivas altas y tránsito intestinal",                      categoria: "Radiología general de abdomen y vía digestiva" },
  // ── 3.6 Radiología de extremidades y articulaciones ─────────
  { numero: 69,  codigoCups: "873004",   nombre: "Radiografía para detectar edad ósea (carpograma)",                                categoria: "Radiología de extremidades y articulaciones" },
  { numero: 70,  codigoCups: "873111",   nombre: "Radiografía de omoplato",                                                         categoria: "Radiología de extremidades y articulaciones" },
  { numero: 71,  codigoCups: "873112",   nombre: "Radiografía de clavícula",                                                        categoria: "Radiología de extremidades y articulaciones" },
  { numero: 72,  codigoCups: "873121",   nombre: "Radiografía de húmero",                                                           categoria: "Radiología de extremidades y articulaciones" },
  { numero: 73,  codigoCups: "873122",   nombre: "Radiografía de antebrazo",                                                        categoria: "Radiología de extremidades y articulaciones" },
  { numero: 74,  codigoCups: "873204",   nombre: "Radiografía de hombro",                                                           categoria: "Radiología de extremidades y articulaciones" },
  { numero: 75,  codigoCups: "873205",   nombre: "Radiografía de codo",                                                             categoria: "Radiología de extremidades y articulaciones" },
  { numero: 76,  codigoCups: "873206",   nombre: "Radiografía de puño o muñeca",                                                    categoria: "Radiología de extremidades y articulaciones" },
  { numero: 77,  codigoCups: "873210",   nombre: "Radiografía de mano",                                                             categoria: "Radiología de extremidades y articulaciones" },
  { numero: 78,  codigoCups: "873302",   nombre: "Radiografía para medición de miembros inferiores (estudio de Farill/osteometría)", categoria: "Radiología de extremidades y articulaciones" },
  { numero: 79,  codigoCups: "873303",   nombre: "Radiografía comparativa de pies con apoyo (AP y lateral)",                        categoria: "Radiología de extremidades y articulaciones" },
  { numero: 80,  codigoCups: "873304",   nombre: "Radiografía axial de sesamoideos y cabezas de metatarsianos",                    categoria: "Radiología de extremidades y articulaciones" },
  { numero: 81,  codigoCups: "873305",   nombre: "Radiografía panorámica de miembros inferiores 14\"x36\" (adultos)",              categoria: "Radiología de extremidades y articulaciones" },
  { numero: 82,  codigoCups: "873306",   nombre: "Radiografía panorámica de miembros inferiores 14\"x17\" (niños)",               categoria: "Radiología de extremidades y articulaciones" },
  { numero: 83,  codigoCups: "873308",   nombre: "Radiografía digital de miembros inferiores (estudio de longitud)",                categoria: "Radiología de extremidades y articulaciones" },
  { numero: 84,  codigoCups: "873311",   nombre: "Radiografía de anteversión femoral",                                              categoria: "Radiología de extremidades y articulaciones" },
  { numero: 85,  codigoCups: "873312",   nombre: "Radiografía de fémur (AP, lateral)",                                              categoria: "Radiología de extremidades y articulaciones" },
  { numero: 86,  codigoCups: "873313",   nombre: "Radiografía de pierna (AP, lateral)",                                             categoria: "Radiología de extremidades y articulaciones" },
  { numero: 87,  codigoCups: "873314",   nombre: "Radiografía de anteversión tibial",                                               categoria: "Radiología de extremidades y articulaciones" },
  { numero: 88,  codigoCups: "873333",   nombre: "Radiografía de pie (AP, lateral y oblicua)",                                      categoria: "Radiología de extremidades y articulaciones" },
  { numero: 89,  codigoCups: "873335",   nombre: "Radiografía de calcáneo (axial y lateral)",                                       categoria: "Radiología de extremidades y articulaciones" },
  { numero: 90,  codigoCups: "873340",   nombre: "Radiografía de miembro inferior (AP, lateral)",                                   categoria: "Radiología de extremidades y articulaciones" },
  { numero: 91,  codigoCups: "873411",   nombre: "Radiografía de cadera o articulación coxo-femoral (AP, lateral)",                 categoria: "Radiología de extremidades y articulaciones" },
  { numero: 92,  codigoCups: "873412",   nombre: "Radiografía de cadera comparativa",                                               categoria: "Radiología de extremidades y articulaciones" },
  { numero: 93,  codigoCups: "873420",   nombre: "Radiografía de rodilla (AP, lateral)",                                            categoria: "Radiología de extremidades y articulaciones" },
  { numero: 94,  codigoCups: "873422",   nombre: "Radiografía de rodillas comparativas posición vertical",                          categoria: "Radiología de extremidades y articulaciones" },
  { numero: 95,  codigoCups: "873423",   nombre: "Radiografía tangencial o axial de rótula",                                        categoria: "Radiología de extremidades y articulaciones" },
  { numero: 96,  codigoCups: "873431",   nombre: "Radiografía de tobillo (AP, lateral y rotación interna)",                         categoria: "Radiología de extremidades y articulaciones" },
  { numero: 97,  codigoCups: "873444",   nombre: "Radiografías en extremidades, proyecciones adicionales (stress, túnel, oblicuas)", categoria: "Radiología de extremidades y articulaciones" },
  // ── 3.7 Mamografía ──────────────────────────────────────────
  { numero: 98,  codigoCups: "876801",   nombre: "Mamografía unilateral o de pieza quirúrgica",                                     categoria: "Mamografía" },
  { numero: 99,  codigoCups: "876802",   nombre: "Mamografía bilateral",                                                            categoria: "Mamografía" },
  { numero: 100, codigoCups: "876802-1", nombre: "Mamografía bilateral + compresión mamaria (calcificaciones sospechosas)",         categoria: "Mamografía" },
  { numero: 101, codigoCups: "876802-2", nombre: "Mamografía bilateral + magnificación (nódulos irregulares)",                      categoria: "Mamografía" },
  { numero: 102, codigoCups: "876802-3", nombre: "Mamografía bilateral + técnica Eklund (prótesis mamaria)",                        categoria: "Mamografía" },
  // ── 3.8 Radiología especial e intervencionista — sistema urinario ──
  { numero: 103, codigoCups: "877802",   nombre: "Urografía intravenosa",                                                           categoria: "Radiología especial e intervencionista de sistema urinario" },
  { numero: 104, codigoCups: "877831",   nombre: "Ureterografía retrógrada por catéter o ureterostomía",                            categoria: "Radiología especial e intervencionista de sistema urinario" },
  { numero: 105, codigoCups: "877851",   nombre: "Cistografía con proyecciones oblicuas",                                           categoria: "Radiología especial e intervencionista de sistema urinario" },
  { numero: 106, codigoCups: "877861",   nombre: "Uretrocistografía",                                                               categoria: "Radiología especial e intervencionista de sistema urinario" },
  { numero: 107, codigoCups: "877862",   nombre: "Uretrocistografía miccional",                                                     categoria: "Radiología especial e intervencionista de sistema urinario" },
  { numero: 108, codigoCups: "877863",   nombre: "Uretrocistografía retrógrada",                                                    categoria: "Radiología especial e intervencionista de sistema urinario" },
  { numero: 109, codigoCups: "877871",   nombre: "Uretrografía retrógrada",                                                         categoria: "Radiología especial e intervencionista de sistema urinario" },
  // ── 3.9 Tomografía Computada (TC) ───────────────────────────
  { numero: 110, codigoCups: "879111",   nombre: "TC de cráneo simple",                                                             categoria: "Tomografía Computada (TC)" },
  { numero: 111, codigoCups: "879112",   nombre: "TC de cráneo con contraste",                                                      categoria: "Tomografía Computada (TC)" },
  { numero: 112, codigoCups: "879113",   nombre: "TC de cráneo simple y con contraste",                                             categoria: "Tomografía Computada (TC)" },
  { numero: 113, codigoCups: "879116",   nombre: "TC de silla turca (hipófisis)",                                                   categoria: "Tomografía Computada (TC)" },
  { numero: 114, codigoCups: "879121",   nombre: "TC de órbitas",                                                                   categoria: "Tomografía Computada (TC)" },
  { numero: 115, codigoCups: "879122",   nombre: "TC de oído, peñasco y conducto auditivo interno",                                 categoria: "Tomografía Computada (TC)" },
  { numero: 116, codigoCups: "879131",   nombre: "TC de senos paranasales o cara",                                                  categoria: "Tomografía Computada (TC)" },
  { numero: 117, codigoCups: "879132",   nombre: "TC de rinofaringe",                                                               categoria: "Tomografía Computada (TC)" },
  { numero: 118, codigoCups: "879141",   nombre: "TC de maxilares (estudio implantología)",                                         categoria: "Tomografía Computada (TC)" },
  { numero: 119, codigoCups: "879150",   nombre: "TC de articulación temporomandibular (bilateral)",                                 categoria: "Tomografía Computada (TC)" },
  { numero: 120, codigoCups: "879161",   nombre: "TC de cuello",                                                                    categoria: "Tomografía Computada (TC)" },
  { numero: 121, codigoCups: "879162",   nombre: "TC de laringe",                                                                   categoria: "Tomografía Computada (TC)" },
  { numero: 122, codigoCups: "879201",   nombre: "TC de columna (cervical/torácico/lumbar/sacro), por nivel",                       categoria: "Tomografía Computada (TC)" },
  { numero: 123, codigoCups: "879205",   nombre: "TC de columna, complemento a mielografía",                                        categoria: "Tomografía Computada (TC)" },
  { numero: 124, codigoCups: "879301",   nombre: "TC de tórax",                                                                     categoria: "Tomografía Computada (TC)" },
  { numero: 125, codigoCups: "879304",   nombre: "TC de tórax de alta resolución simple (TACAR)",                                   categoria: "Tomografía Computada (TC)" },
  { numero: 126, codigoCups: "879391",   nombre: "TC de tórax extendido al abdomen superior con suprarrenales",                     categoria: "Tomografía Computada (TC)" },
  { numero: 127, codigoCups: "879410",   nombre: "TC de abdomen superior",                                                          categoria: "Tomografía Computada (TC)" },
  { numero: 128, codigoCups: "879411-2", nombre: "Colonografía por TC / colonoscopia virtual",                                      categoria: "Tomografía Computada (TC)" },
  { numero: 129, codigoCups: "879420",   nombre: "TC de abdomen y pelvis (abdomen total)",                                          categoria: "Tomografía Computada (TC)" },
  { numero: 130, codigoCups: "879420-2", nombre: "TC de abdomen y pelvis 3 fases (arterial, venosa-portal, tardía)",               categoria: "Tomografía Computada (TC)" },
  { numero: 131, codigoCups: "879421",   nombre: "TC de cadera",                                                                    categoria: "Tomografía Computada (TC)" },
  { numero: 132, codigoCups: "879430",   nombre: "TC de vías urinarias (uroTC)",                                                    categoria: "Tomografía Computada (TC)" },
  { numero: 133, codigoCups: "879460",   nombre: "TC de pelvis",                                                                    categoria: "Tomografía Computada (TC)" },
  { numero: 134, codigoCups: "879510",   nombre: "TC de miembros superiores y articulaciones",                                      categoria: "Tomografía Computada (TC)" },
  { numero: 135, codigoCups: "879520",   nombre: "TC de miembros inferiores y articulaciones",                                      categoria: "Tomografía Computada (TC)" },
  { numero: 136, codigoCups: "879522",   nombre: "TC de miembros inferiores (anteversión femoral/torsión tibial)",                  categoria: "Tomografía Computada (TC)" },
  { numero: 137, codigoCups: "879523",   nombre: "TC de miembros inferiores (axiales de rótula/longitud)",                          categoria: "Tomografía Computada (TC)" },
  { numero: 138, codigoCups: "879901",   nombre: "TC de vasos - AngioTC",                                                           categoria: "Tomografía Computada (TC)" },
  { numero: 139, codigoCups: "879910",   nombre: "TC axial en reconstrucción tridimensional",                                       categoria: "Tomografía Computada (TC)" },
  { numero: 140, codigoCups: "879911",   nombre: "TC en reconstrucción virtual",                                                    categoria: "Tomografía Computada (TC)" },
  // ── 3.10 Ecografías — cabeza, cara, cuello, tórax ───────────
  { numero: 141, codigoCups: "881112",   nombre: "Ecografía cerebral transfontanelar (transductor 7 MHz+)",                         categoria: "Ecografías — cabeza, cara, cuello, tórax" },
  { numero: 142, codigoCups: "881118",   nombre: "Ecografía cerebral transfontanelar con Doppler",                                  categoria: "Ecografías — cabeza, cara, cuello, tórax" },
  { numero: 143, codigoCups: "881130",   nombre: "Ecografía de tejidos blandos de cara",                                            categoria: "Ecografías — cabeza, cara, cuello, tórax" },
  { numero: 144, codigoCups: "881131",   nombre: "Ecografía de glándulas salivales",                                                categoria: "Ecografías — cabeza, cara, cuello, tórax" },
  { numero: 145, codigoCups: "881132",   nombre: "Ecografía de cuello",                                                             categoria: "Ecografías — cabeza, cara, cuello, tórax" },
  { numero: 146, codigoCups: "881141",   nombre: "Ecografía de tiroides",                                                           categoria: "Ecografías — cabeza, cara, cuello, tórax" },
  { numero: 147, codigoCups: "881151",   nombre: "Ecografía de ganglios cervicales (mapeo)",                                        categoria: "Ecografías — cabeza, cara, cuello, tórax" },
  { numero: 148, codigoCups: "881201",   nombre: "Ecografía de mama",                                                               categoria: "Ecografías — cabeza, cara, cuello, tórax" },
  { numero: 149, codigoCups: "881211",   nombre: "Ecografía de tórax (pericardio o pleura)",                                        categoria: "Ecografías — cabeza, cara, cuello, tórax" },
  { numero: 150, codigoCups: "881212",   nombre: "Ecografía de otros sitios torácicos",                                             categoria: "Ecografías — cabeza, cara, cuello, tórax" },
  // ── 3.11 Ecografías — abdomen, pelvis y genitales ───────────
  { numero: 151, codigoCups: "881301",   nombre: "Ecografía de tejidos blandos de pared abdominal y pelvis",                        categoria: "Ecografías — abdomen, pelvis y genitales" },
  { numero: 152, codigoCups: "881302",   nombre: "Ecografía de abdomen total",                                                      categoria: "Ecografías — abdomen, pelvis y genitales" },
  { numero: 153, codigoCups: "881305",   nombre: "Ecografía de abdomen superior",                                                   categoria: "Ecografías — abdomen, pelvis y genitales" },
  { numero: 154, codigoCups: "881306",   nombre: "Ecografía de hígado, páncreas, vía biliar y vesícula",                            categoria: "Ecografías — abdomen, pelvis y genitales" },
  { numero: 155, codigoCups: "881313",   nombre: "Ecografía de abdomen (píloro)",                                                   categoria: "Ecografías — abdomen, pelvis y genitales" },
  { numero: 156, codigoCups: "881331",   nombre: "Ecografía de riñones, bazo, aorta o adrenales",                                   categoria: "Ecografías — abdomen, pelvis y genitales" },
  { numero: 157, codigoCups: "881332",   nombre: "Ecografía de vías urinarias",                                                     categoria: "Ecografías — abdomen, pelvis y genitales" },
  { numero: 158, codigoCups: "881360",   nombre: "Ecografía pélvica con Doppler",                                                   categoria: "Ecografías — abdomen, pelvis y genitales" },
  { numero: 159, codigoCups: "881362",   nombre: "Ecografía de tejidos blandos de abdomen con Doppler",                             categoria: "Ecografías — abdomen, pelvis y genitales" },
  { numero: 160, codigoCups: "881401",   nombre: "Ecografía pélvica ginecológica transvaginal",                                     categoria: "Ecografías — abdomen, pelvis y genitales" },
  { numero: 161, codigoCups: "881402",   nombre: "Ecografía pélvica ginecológica transabdominal",                                   categoria: "Ecografías — abdomen, pelvis y genitales" },
  { numero: 162, codigoCups: "881403",   nombre: "Ecografía pélvica ginecológica (estudio integral folicular)",                     categoria: "Ecografías — abdomen, pelvis y genitales" },
  { numero: 163, codigoCups: "881431",   nombre: "Ecografía obstétrica transabdominal",                                             categoria: "Ecografías — abdomen, pelvis y genitales" },
  { numero: 164, codigoCups: "881432",   nombre: "Ecografía obstétrica transvaginal",                                               categoria: "Ecografías — abdomen, pelvis y genitales" },
  { numero: 165, codigoCups: "881434",   nombre: "Perfil biofísico",                                                                categoria: "Ecografías — abdomen, pelvis y genitales" },
  { numero: 166, codigoCups: "881436",   nombre: "Ecografía obstétrica con translucencia nucal",                                    categoria: "Ecografías — abdomen, pelvis y genitales" },
  { numero: 167, codigoCups: "881437",   nombre: "Ecografía obstétrica con detalle anatómico",                                      categoria: "Ecografías — abdomen, pelvis y genitales" },
  { numero: 168, codigoCups: "881501",   nombre: "Ecografía de próstata transabdominal",                                            categoria: "Ecografías — abdomen, pelvis y genitales" },
  { numero: 169, codigoCups: "881502",   nombre: "Ecografía de próstata transrectal",                                               categoria: "Ecografías — abdomen, pelvis y genitales" },
  { numero: 170, codigoCups: "881510",   nombre: "Ecografía testicular",                                                            categoria: "Ecografías — abdomen, pelvis y genitales" },
  { numero: 171, codigoCups: "881511",   nombre: "Ecografía testicular con Doppler",                                                categoria: "Ecografías — abdomen, pelvis y genitales" },
  { numero: 172, codigoCups: "881521",   nombre: "Ecografía de pene",                                                               categoria: "Ecografías — abdomen, pelvis y genitales" },
  // ── 3.12 Ecografías — extremidades y articulaciones ─────────
  { numero: 173, codigoCups: "881601",   nombre: "Ecografía de tejidos blandos extremidades superiores",                            categoria: "Ecografías — extremidades y articulaciones" },
  { numero: 174, codigoCups: "881602",   nombre: "Ecografía de tejidos blandos extremidades inferiores",                            categoria: "Ecografías — extremidades y articulaciones" },
  { numero: 175, codigoCups: "881603",   nombre: "Ecografía de alta resolución en nervios de extremidades",                         categoria: "Ecografías — extremidades y articulaciones" },
  { numero: 176, codigoCups: "881610",   nombre: "Ecografía articular de hombro",                                                   categoria: "Ecografías — extremidades y articulaciones" },
  { numero: 177, codigoCups: "881611",   nombre: "Ecografía articular de codo",                                                     categoria: "Ecografías — extremidades y articulaciones" },
  { numero: 178, codigoCups: "881612",   nombre: "Ecografía articular de puño (muñeca)",                                            categoria: "Ecografías — extremidades y articulaciones" },
  { numero: 179, codigoCups: "881613",   nombre: "Ecografía articular de mano",                                                     categoria: "Ecografías — extremidades y articulaciones" },
  { numero: 180, codigoCups: "881620",   nombre: "Ecografía articular de rodilla",                                                  categoria: "Ecografías — extremidades y articulaciones" },
  { numero: 181, codigoCups: "881621",   nombre: "Ecografía articular de tobillo",                                                  categoria: "Ecografías — extremidades y articulaciones" },
  { numero: 182, codigoCups: "881622",   nombre: "Ecografía articular de pie",                                                      categoria: "Ecografías — extremidades y articulaciones" },
  { numero: 183, codigoCups: "881630",   nombre: "Ecografía articular de cadera",                                                   categoria: "Ecografías — extremidades y articulaciones" },
  { numero: 184, codigoCups: "881640",   nombre: "Ecografía de calcáneo",                                                           categoria: "Ecografías — extremidades y articulaciones" },
  // ── 3.13 Estudios vasculares no invasivos (Doppler) ─────────
  { numero: 185, codigoCups: "882106",   nombre: "Doppler de arterias temporales",                                                  categoria: "Estudios vasculares no invasivos (Doppler)" },
  { numero: 186, codigoCups: "882112",   nombre: "Doppler de vasos del cuello (carótidas, vertebrales, yugular)",                   categoria: "Estudios vasculares no invasivos (Doppler)" },
  { numero: 187, codigoCups: "882132",   nombre: "Doppler de otros vasos periféricos del cuello",                                   categoria: "Estudios vasculares no invasivos (Doppler)" },
  { numero: 188, codigoCups: "882203",   nombre: "Doppler de vasos abdominales o pélvicos",                                         categoria: "Estudios vasculares no invasivos (Doppler)" },
  { numero: 189, codigoCups: "882212",   nombre: "Doppler de aorta abdominal",                                                      categoria: "Estudios vasculares no invasivos (Doppler)" },
  { numero: 190, codigoCups: "882222",   nombre: "Doppler de arterias renales",                                                     categoria: "Estudios vasculares no invasivos (Doppler)" },
  { numero: 191, codigoCups: "882232",   nombre: "Doppler de arterias mesentéricas",                                                categoria: "Estudios vasculares no invasivos (Doppler)" },
  { numero: 192, codigoCups: "882242",   nombre: "Doppler de tronco celíaco",                                                       categoria: "Estudios vasculares no invasivos (Doppler)" },
  { numero: 193, codigoCups: "882252",   nombre: "Doppler de vena cava",                                                            categoria: "Estudios vasculares no invasivos (Doppler)" },
  { numero: 194, codigoCups: "882262",   nombre: "Doppler de arterias ilíacas",                                                     categoria: "Estudios vasculares no invasivos (Doppler)" },
  { numero: 195, codigoCups: "882282",   nombre: "Doppler de vasos escrotales",                                                     categoria: "Estudios vasculares no invasivos (Doppler)" },
  { numero: 196, codigoCups: "882292",   nombre: "Doppler con evaluación de flujo en masas abdominales",                            categoria: "Estudios vasculares no invasivos (Doppler)" },
  { numero: 197, codigoCups: "882294",   nombre: "Doppler con evaluación de flujo en masas pélvicas",                               categoria: "Estudios vasculares no invasivos (Doppler)" },
  { numero: 198, codigoCups: "882296",   nombre: "Doppler con evaluación de flujo en hipertensión portal",                          categoria: "Estudios vasculares no invasivos (Doppler)" },
  { numero: 199, codigoCups: "882307",   nombre: "Doppler de vasos arteriales de miembros superiores",                              categoria: "Estudios vasculares no invasivos (Doppler)" },
  { numero: 200, codigoCups: "882308",   nombre: "Doppler de vasos arteriales de miembros inferiores",                              categoria: "Estudios vasculares no invasivos (Doppler)" },
  { numero: 201, codigoCups: "882309",   nombre: "Doppler de vasos venosos de miembros superiores",                                 categoria: "Estudios vasculares no invasivos (Doppler)" },
  { numero: 202, codigoCups: "882316",   nombre: "Doppler de vasos venosos de miembro superior",                                    categoria: "Estudios vasculares no invasivos (Doppler)" },
  { numero: 203, codigoCups: "882318",   nombre: "Doppler de vasos venosos de miembro inferior",                                    categoria: "Estudios vasculares no invasivos (Doppler)" },
  { numero: 204, codigoCups: "882602",   nombre: "Doppler de otros órganos trasplantados",                                          categoria: "Estudios vasculares no invasivos (Doppler)" },
  { numero: 205, codigoCups: "882603",   nombre: "Doppler de riñón trasplantado",                                                   categoria: "Estudios vasculares no invasivos (Doppler)" },
  // ── 3.14 Estudios de densidad mineral ósea ──────────────────
  { numero: 206, codigoCups: "886012",   nombre: "Osteodensitometría por absorción dual",                                           categoria: "Estudios de densidad mineral ósea" },
  { numero: 207, codigoCups: "886013",   nombre: "Osteodensitometría y composición corporal (tejidos blandos)",                     categoria: "Estudios de densidad mineral ósea" },
  { numero: 208, codigoCups: "886014",   nombre: "Morfometría vertebral",                                                           categoria: "Estudios de densidad mineral ósea" },
];

export const SERVICIOS_ALFABETICO: ServicioAlfabetico[] = FILAS.map((fila) => ({
  id: `svc-${fila.numero}`,
  numero: fila.numero,
  codigoCups: fila.codigoCups,
  nombre: fila.nombre,
  letra: derivarLetra(fila.nombre),
  categoria: fila.categoria,
  icono: iconoPorCategoria(fila.categoria),
  url: "/servicios",
  visible: true,
  sort_order: fila.numero,
}));
