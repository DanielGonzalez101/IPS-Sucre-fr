export interface DerechosDeber {
  id: number;
  numero: string;
  titulo: string;
  descripcion: string;
}

export interface DocumentoFinanciero {
  id: string;
  titulo: string;
  año: string;
  url: string;
  tipo: "estados" | "dictamen" | "certificacion" | "notas" | "informe";
}

export const DERECHOS_MOCK: DerechosDeber[] = [
  {
    id: 1,
    numero: "01",
    titulo: "Acceso a servicios de salud",
    descripcion:
      "Acceder a los servicios y tecnologías de salud, que le garanticen una atención integral, oportuna y de alta calidad.",
  },
  {
    id: 2,
    numero: "02",
    titulo: "Atención de urgencias",
    descripcion:
      "Recibir la atención de urgencias que sea requerida con la oportunidad que su condición amerite sin que sea exigible documento o cancelación de pago previo alguno.",
  },
  {
    id: 3,
    numero: "03",
    titulo: "Comunicación con el profesional",
    descripcion:
      "Mantener una comunicación plena, permanente, expresa y clara con el profesional de salud tratante.",
  },
  {
    id: 4,
    numero: "04",
    titulo: "Información para decisiones libres",
    descripcion:
      "Obtener información clara, apropiada y suficiente por parte del profesional de la salud que permita tomar decisiones libres, conscientes e informadas respecto de los procedimientos que se vayan a practicar y riesgos de los mismos. Ninguna persona podrá ser obligada, contra su voluntad, a recibir un tratamiento de salud.",
  },
  {
    id: 5,
    numero: "05",
    titulo: "Prestaciones según la ley",
    descripcion:
      "Recibir prestaciones de salud en las condiciones y términos consagrados en la ley.",
  },
  {
    id: 6,
    numero: "06",
    titulo: "Trato digno y respetuoso",
    descripcion:
      "Recibir un trato digno, respetando sus creencias y costumbres, así como las opiniones personales que tenga sobre los procedimientos.",
  },
  {
    id: 7,
    numero: "07",
    titulo: "Confidencialidad de la historia clínica",
    descripcion:
      "A que la historia clínica sea tratada de manera confidencial y reservada y que únicamente pueda ser conocida por terceros, con previa autorización del paciente o en los casos previstos en la ley, y a poder consultar la totalidad de la historia clínica de manera gratuita.",
  },
  {
    id: 8,
    numero: "08",
    titulo: "Asistencia de calidad",
    descripcion:
      "A que se preste durante todo el proceso de la enfermedad, asistencia de calidad por trabajadores de la salud debidamente capacitados y autorizados para ejercer.",
  },
  {
    id: 9,
    numero: "09",
    titulo: "Derecho a la intimidad",
    descripcion:
      "A la intimidad. Se garantiza la confidencialidad de toda la información que sea suministrada en el ámbito de acceso a los servicios de salud y de las condiciones de salud y enfermedad de la persona, sin perjuicio de la posibilidad de acceso a la misma por los familiares en los eventos autorizados por la ley o las autoridades en las condiciones que esta determine.",
  },
  {
    id: 10,
    numero: "10",
    titulo: "Acceso a tecnologías y medicamentos",
    descripcion:
      "A la provisión y acceso oportuno a las tecnologías y a los medicamentos requeridos.",
  },
  {
    id: 11,
    numero: "11",
    titulo: "Canales de reclamación",
    descripcion:
      "Recibir información sobre los canales formales para presentar reclamaciones, quejas, sugerencias y en general, para comunicarse con la administración de las instituciones, así como recibir una respuesta por escrito.",
  },
  {
    id: 12,
    numero: "12",
    titulo: "Condiciones de higiene y seguridad",
    descripcion:
      "Recibir los servicios de salud en condiciones de higiene, seguridad y respeto a su intimidad.",
  },
  {
    id: 13,
    numero: "13",
    titulo: "Rendición de cuentas",
    descripcion:
      "Solicitar y recibir explicaciones o rendición de cuentas acerca de los costos por los tratamientos de salud recibidos.",
  },
  {
    id: 14,
    numero: "14",
    titulo: "Voluntad sobre donación de órganos",
    descripcion:
      "Que se respete la voluntad de aceptar o negar la donación de sus órganos de conformidad con la ley.",
  },
  {
    id: 15,
    numero: "15",
    titulo: "Protección contra tratos inhumanos",
    descripcion:
      "A no ser sometido en ningún caso a tratos crueles o inhumanos que afecten su dignidad, ni a ser obligado a soportar sufrimiento evitable, ni obligado a padecer enfermedades que pueden recibir tratamiento.",
  },
  {
    id: 16,
    numero: "16",
    titulo: "Sin cargas administrativas indebidas",
    descripcion:
      "A que no se trasladen las cargas administrativas y burocráticas que les corresponde asumir a los encargados o intervinientes en la prestación del servicio.",
  },
  {
    id: 17,
    numero: "17",
    titulo: "Agotar posibilidades de tratamiento",
    descripcion: "Agotar las posibilidades de tratamiento para la superación de su enfermedad.",
  },
];

export const DEBERES_MOCK: DerechosDeber[] = [
  {
    id: 1,
    numero: "01",
    titulo: "Autocuidado",
    descripcion: "Propender por su autocuidado, el de su familia y el de su comunidad.",
  },
  {
    id: 2,
    numero: "02",
    titulo: "Promoción y prevención",
    descripcion:
      "Atender oportunamente las recomendaciones formuladas en los programas de promoción y prevención.",
  },
  {
    id: 3,
    numero: "03",
    titulo: "Solidaridad",
    descripcion:
      "Actuar de manera solidaria ante las situaciones que pongan en peligro la vida o la salud de las personas.",
  },
  {
    id: 4,
    numero: "04",
    titulo: "Respeto al personal de salud",
    descripcion: "Respetar al personal responsable de la prestación y administración de los servicios de salud.",
  },
  {
    id: 5,
    numero: "05",
    titulo: "Uso racional de los recursos",
    descripcion:
      "Usar adecuada y racionalmente las prestaciones ofrecidas, así como los recursos del sistema.",
  },
  {
    id: 6,
    numero: "06",
    titulo: "Cumplir las normas del sistema",
    descripcion: "Cumplir las normas del sistema de salud.",
  },
  {
    id: 7,
    numero: "07",
    titulo: "Buena fe",
    descripcion: "Actuar de buena fe frente al sistema de salud.",
  },
  {
    id: 8,
    numero: "08",
    titulo: "Suministrar información oportuna",
    descripcion:
      "Suministrar de manera oportuna y suficiente la información que se requiera para efectos del servicio.",
  },
  {
    id: 9,
    numero: "09",
    titulo: "Contribución solidaria al sistema",
    descripcion:
      "Contribuir solidariamente al financiamiento de los gastos que demande la atención en salud y la seguridad social en salud, de acuerdo con su capacidad de pago.",
  },
];

export const DOCUMENTOS_FINANCIEROS_MOCK: DocumentoFinanciero[] = [
  {
    id: "estados-2025",
    titulo: "Estados financieros 2025",
    año: "2025",
    url: "/documentos/estados-financieros-2025.pdf",
    tipo: "estados",
  },
  {
    id: "estados-2024",
    titulo: "Estados financieros 2024",
    año: "2024",
    url: "/documentos/estados-financieros-2024.pdf",
    tipo: "estados",
  },
  {
    id: "dictamen-revisor-fiscal",
    titulo: "Dictamen del revisor fiscal",
    año: "",
    url: "/documentos/dictamen-revisor-fiscal.pdf",
    tipo: "dictamen",
  },
  {
    id: "estados-2023-2022",
    titulo: "Estados financieros 2023 - 2022",
    año: "2023-2022",
    url: "/documentos/estados-financieros-2023-2022.pdf",
    tipo: "estados",
  },
  {
    id: "estados-2022",
    titulo: "Estados financieros 2022",
    año: "2022",
    url: "/documentos/estados-financieros-2022.pdf",
    tipo: "estados",
  },
  {
    id: "estados-2021",
    titulo: "Estados financieros 2021",
    año: "2021",
    url: "/documentos/estados-financieros-2021.pdf",
    tipo: "estados",
  },
  {
    id: "estados-2020",
    titulo: "Estados financieros 2020",
    año: "2020",
    url: "/documentos/estados-financieros-2020-cardiocentro.pdf",
    tipo: "estados",
  },
  {
    id: "estados-2017-2018",
    titulo: "Estados financieros 2017-2018",
    año: "2017-2018",
    url: "/documentos/estados-financieros-2018.pdf",
    tipo: "estados",
  },
  {
    id: "estados-2016",
    titulo: "Estados financieros 2016",
    año: "2016",
    url: "/documentos/estados-financieros-2016-2.pdf",
    tipo: "estados",
  },
  {
    id: "certificacion-estados-financieros",
    titulo: "Certificación de estados financieros",
    año: "",
    url: "/documentos/certificacion-estados-financieros-2.pdf",
    tipo: "certificacion",
  },
  {
    id: "notas-estados-financieros",
    titulo: "Notas a los estados financieros",
    año: "2016",
    url: "/documentos/notas-est-fin-2016-3.pdf",
    tipo: "notas",
  },
  {
    id: "informe",
    titulo: "Informe",
    año: "",
    url: "/informe",
    tipo: "informe",
  },
];
