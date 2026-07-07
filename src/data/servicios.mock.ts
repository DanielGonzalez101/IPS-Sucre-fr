export type ServicioCategoria = "cardiologia" | "radiologia";

export interface Servicio {
  id: string;
  titulo: string;
  descripcion: string;
  categoria: ServicioCategoria;
  icono: string;
  slug: string;
  featured?: boolean;
  orden: number;
}

export const SERVICIOS_MOCK: Servicio[] = [
  {
    id: "1",
    titulo: "Consulta",
    descripcion: "Valoración del paciente con sospecha de enfermedad cardiaca.",
    categoria: "cardiologia",
    icono: "Stethoscope",
    slug: "consulta",
    orden: 1,
  },
  {
    id: "2",
    titulo: "Ecocardiograma",
    descripcion:
      "Método de diagnóstico por imágenes para evaluación de corazón y grandes vasos.",
    categoria: "cardiologia",
    icono: "HeartPulse",
    slug: "ecocardiograma",
    orden: 2,
  },
  {
    id: "3",
    titulo: "Electrocardiograma",
    descripcion: "Evaluación gráfica de los movimientos del corazón.",
    categoria: "cardiologia",
    icono: "Activity",
    slug: "electrocardiograma",
    orden: 3,
  },
  {
    id: "4",
    titulo: "Holter 24 horas",
    descripcion:
      "Valoración gráfica de los movimientos del corazón en 24 horas.",
    categoria: "cardiologia",
    icono: "Watch",
    slug: "holter-24-horas",
    orden: 4,
  },
  {
    id: "5",
    titulo: "Monitoreo de presión arterial 24 horas (Mapa)",
    descripcion: "Medición de presión arterial en 24 horas.",
    categoria: "cardiologia",
    icono: "Gauge",
    slug: "monitoreo-presion-arterial-24-horas-mapa",
    orden: 5,
  },
  {
    id: "6",
    titulo: "Prueba de esfuerzo",
    descripcion: "Se utiliza para medir el efecto del ejercicio sobre el corazón.",
    categoria: "cardiologia",
    icono: "Dumbbell",
    slug: "prueba-de-esfuerzo",
    orden: 6,
  },
  {
    id: "7",
    titulo: "Mesa basculante",
    descripcion:
      "Se utiliza para encontrar la causa de cierto tipo de vértigo o de desmayo grave.",
    categoria: "cardiologia",
    icono: "RotateCw",
    slug: "mesa-basculante",
    orden: 7,
  },
  {
    id: "8",
    titulo: "Ecografía general",
    descripcion: "Valoración de órganos internos por imágenes de ultrasonido.",
    categoria: "radiologia",
    icono: "Waves",
    slug: "ecografia-general",
    orden: 8,
  },
  {
    id: "9",
    titulo: "Doppler color",
    descripcion:
      "Tipo de ecografía con la que se estudia flujo de sangre a través de las arterias y venas.",
    categoria: "radiologia",
    icono: "Radar",
    slug: "doppler-color",
    orden: 9,
  },
  {
    id: "10",
    titulo: "Rayos X",
    descripcion:
      "Evaluación por imágenes que muestra el interior del cuerpo en tonos de blanco y negro.",
    categoria: "radiologia",
    icono: "Bone",
    slug: "rayos-x",
    orden: 10,
  },
  {
    id: "11",
    titulo: "Mamografía",
    descripcion:
      "Es un tipo de imagen médica especializada que utiliza un sistema de dosis baja de rayos X para visualizar el interior de las mamas. Un examen de mamografía, llamado mamograma, ayuda en la detección temprana y el diagnóstico de las enfermedades mamarias en las mujeres.",
    categoria: "radiologia",
    icono: "ShieldPlus",
    slug: "mamografia",
    orden: 11,
  },
  {
    id: "12",
    titulo: "Tomografía",
    descripcion:
      "Es un examen que ayuda a detectar una variedad de enfermedades y condiciones. La exploración por TAC es rápida, indolora, no es invasiva y es precisa. En casos de emergencia, puede identificar lesiones y hemorragias internas lo suficientemente rápido como para ayudar a salvar vidas.",
    categoria: "radiologia",
    icono: "Scan",
    slug: "tomografia",
    orden: 12,
  },
];
