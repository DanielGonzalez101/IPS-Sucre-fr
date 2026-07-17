"use client";

import { useRef } from "react";
import { FileText, Download, Clock } from "lucide-react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";

interface Documento {
  id: string;
  titulo: string;
  descripcion: string;
  url: string | null;
  año?: string;
}

interface Categoria {
  id: string;
  titulo: string;
  documentos: Documento[];
}

const CATEGORIAS: Categoria[] = [
  {
    id: "organizacion",
    titulo: "Información de la organización",
    documentos: [
      {
        id: "org-1",
        titulo: "Organigrama institucional",
        descripcion: "Estructura orgánica, divisiones, dependencias y responsables de IPS Cardiocentro Pediátrico de Sucre S.A.S.",
        url: null,
      },
      {
        id: "org-2",
        titulo: "Misión, visión y funciones",
        descripcion: "Propósito institucional, valores y funciones de la entidad.",
        url: "/quienes-somos",
      },
    ],
  },
  {
    id: "normativa",
    titulo: "Normativa institucional",
    documentos: [
      {
        id: "norm-1",
        titulo: "Políticas institucionales",
        descripcion: "Conjunto de políticas internas que rigen el funcionamiento de la entidad.",
        url: null,
      },
      {
        id: "norm-2",
        titulo: "Lineamientos y procedimientos",
        descripcion: "Lineamientos operativos y procedimientos internos de gestión.",
        url: null,
      },
      {
        id: "norm-3",
        titulo: "Manuales institucionales",
        descripcion: "Manuales de procesos y funciones vigentes de la entidad.",
        url: null,
      },
    ],
  },
  {
    id: "planeacion",
    titulo: "Planeación y gestión",
    documentos: [
      {
        id: "plan-1",
        titulo: "Calendario de actividades",
        descripcion: "Eventos y fechas clave relacionadas con los procesos misionales de la IPS.",
        url: null,
        año: "2025",
      },
      {
        id: "plan-2",
        titulo: "Distribución presupuestal e indicadores de gestión",
        descripcion: "Distribución del presupuesto de proyectos de inversión junto a los indicadores de gestión.",
        url: null,
        año: "2025",
      },
    ],
  },
  {
    id: "contratacion",
    titulo: "Contratación",
    documentos: [
      {
        id: "cont-1",
        titulo: "Manual de contratación",
        descripcion: "Procedimientos, lineamientos y políticas en materia de adquisición y compras de la entidad.",
        url: null,
      },
    ],
  },
  {
    id: "seguridad",
    titulo: "Seguridad digital",
    documentos: [
      {
        id: "seg-1",
        titulo: "Política de seguridad digital",
        descripcion: "Política de seguridad de la información conforme al Anexo 3 de la Resolución MinTIC 1519/2020.",
        url: "/politicas/seguridad-digital",
      },
      {
        id: "seg-2",
        titulo: "Modelo de Seguridad y Privacidad de la Información (MSPI)",
        descripcion: "Evidencia de adopción del MSPI recomendado por la Dirección de Gobierno Digital del MinTIC.",
        url: null,
      },
    ],
  },
];

export default function TransparenciaDocumentos() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.from(".trans-doc-card", {
        y: 28,
        opacity: 0,
        duration: 0.55,
        stagger: 0.07,
        ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="py-16 md:py-20"
      style={{ backgroundColor: "#fff" }}
      aria-labelledby="trans-docs-title"
    >
      <div className="container-main">
        <h2
          id="trans-docs-title"
          className="font-heading font-bold text-2xl md:text-3xl mb-2"
          style={{ color: "var(--color-azul-900)" }}
        >
          Documentos de gestión
        </h2>
        <p className="font-body text-base mb-12" style={{ color: "var(--color-gris-600)" }}>
          Documentos institucionales publicados en cumplimiento de la Ley 1712 de 2014 y la Resolución MinTIC 1519 de 2020.
        </p>

        <div className="space-y-12">
          {CATEGORIAS.map((cat) => (
            <div key={cat.id}>
              <div className="flex items-center gap-3 mb-6">
                <h3
                  className="font-heading font-bold text-lg"
                  style={{ color: "var(--color-azul-800)" }}
                >
                  {cat.titulo}
                </h3>
                <div className="flex-1 h-px" style={{ backgroundColor: "var(--color-gris-200)" }} />
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {cat.documentos.map((doc) => {
                  const disponible = doc.url !== null;
                  const isInternal = doc.url?.startsWith("/");
                  return (
                    <div
                      key={doc.id}
                      className="trans-doc-card participa-solid-card rounded-2xl p-6 flex flex-col"
                    >
                      <div
                        className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                        style={{ backgroundColor: "var(--color-azul-50)" }}
                      >
                        <FileText size={20} aria-hidden="true" style={{ color: "var(--color-azul-800)" }} />
                      </div>

                      <h4
                        className="font-heading font-bold text-base mb-1"
                        style={{ color: "var(--color-azul-900)" }}
                      >
                        {doc.titulo}
                        {doc.año && (
                          <span
                            className="ml-2 font-body font-normal text-sm"
                            style={{ color: "var(--color-gris-500)" }}
                          >
                            ({doc.año})
                          </span>
                        )}
                      </h4>
                      <p
                        className="font-body text-sm leading-relaxed flex-1 mb-4"
                        style={{ color: "var(--color-gris-600)" }}
                      >
                        {doc.descripcion}
                      </p>

                      {disponible ? (
                        <a
                          href={doc.url!}
                          target={isInternal ? undefined : "_blank"}
                          rel={isInternal ? undefined : "noopener noreferrer"}
                          className="inline-flex items-center gap-2 font-heading font-semibold text-sm transition-colors duration-150 hover:underline"
                          style={{ color: "var(--color-rojo-500)" }}
                        >
                          <Download size={16} aria-hidden="true" />
                          {isInternal ? "Ver información" : "Descargar / ver"}
                        </a>
                      ) : (
                        <span
                          className="inline-flex items-center gap-2 font-heading font-semibold text-sm"
                          style={{ color: "var(--color-gris-400)" }}
                        >
                          <Clock size={16} aria-hidden="true" />
                          Documento en actualización
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
