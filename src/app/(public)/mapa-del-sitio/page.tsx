import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Mapa del sitio | IPS Cardiocentro Pediátrico de Sucre",
  description:
    "Índice completo de todas las secciones y páginas disponibles en el sitio web del Cardiocentro Pediátrico de Sucre.",
};

interface SitemapSection {
  title: string;
  links: { href: string; label: string }[];
}

const sections: SitemapSection[] = [
  {
    title: "Inicio",
    links: [{ href: "/", label: "Página principal" }],
  },
  {
    title: "Quiénes somos",
    links: [{ href: "/quienes-somos", label: "Misión, visión y organigrama" }],
  },
  {
    title: "Servicios",
    links: [{ href: "/servicios", label: "Catálogo de servicios" }],
  },
  {
    title: "Equipo",
    links: [
      { href: "/equipo", label: "Equipo médico" },
      { href: "/equipo/tecnologico", label: "Equipo tecnológico" },
    ],
  },
  {
    title: "Noticias",
    links: [{ href: "/noticias", label: "Noticias y comunicados" }],
  },
  {
    title: "Normativa",
    links: [{ href: "/normativa", label: "Marco legal y normativo" }],
  },
  {
    title: "Calidad",
    links: [{ href: "/calidad", label: "Gestión de calidad" }],
  },
  {
    title: "Multimedia",
    links: [
      { href: "/multimedia", label: "Multimedia" },
      { href: "/multimedia/galeria", label: "Galería de imágenes" },
    ],
  },
  {
    title: "Participa",
    links: [{ href: "/participa", label: "Participación ciudadana" }],
  },
  {
    title: "Atención y PQRSD",
    links: [
      { href: "/pqrs", label: "Radicar Petición, Queja, Reclamo, Solicitud, Denuncia o Sugerencia" },
      { href: "/pqrs/consulta", label: "Consultar estado de PQRSD" },
      { href: "/contacto", label: "Contacto" },
    ],
  },
  {
    title: "Información legal",
    links: [
      { href: "/politicas/privacidad", label: "Política de privacidad" },
      { href: "/politicas/terminos-y-condiciones", label: "Términos y condiciones" },
      { href: "/politicas/derechos-de-autor", label: "Derechos de autor" },
      { href: "/politicas/seguridad-digital", label: "Política de seguridad digital" },
    ],
  },
];

export default function MapaDelSitioPage() {
  return (
    <>
      {/* Hero */}
      <section
        aria-labelledby="mapa-heading"
        className="py-16 md:py-20"
        style={{ backgroundColor: "var(--color-azul-900)" }}
      >
        <div className="container-main text-center">
          <span
            className="inline-flex items-center gap-1.5 font-semibold text-sm px-4 py-1.5 mb-6"
            style={{
              backgroundColor: "rgba(238,53,56,0.18)",
              color: "var(--color-rojo-400)",
              borderRadius: "999px",
            }}
          >
            Navegación
          </span>
          <h1
            id="mapa-heading"
            className="font-bold text-3xl md:text-4xl lg:text-5xl text-white mb-4"
          >
            Mapa del sitio
          </h1>
          <p
            className="text-base md:text-lg max-w-xl mx-auto"
            style={{ color: "rgba(255,255,255,0.75)" }}
          >
            Índice de todas las secciones y páginas disponibles en este sitio web.
          </p>
        </div>
      </section>

      {/* Contenido */}
      <section
        className="py-12 md:py-16"
        style={{ backgroundColor: "var(--color-gris-50)" }}
        aria-label="Listado de páginas del sitio"
      >
        <div className="container-main">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {sections.map((section) => (
              <div
                key={section.title}
                className="rounded-2xl p-6"
                style={{
                  backgroundColor: "#fff",
                  boxShadow: "var(--shadow-card)",
                }}
              >
                <h2
                  className="font-bold text-base mb-4 pb-3"
                  style={{
                    color: "var(--color-azul-900)",
                    borderBottom: "2px solid var(--color-azul-50)",
                  }}
                >
                  {section.title}
                </h2>
                <ul className="space-y-2.5">
                  {section.links.map(({ href, label }) => (
                    <li key={href}>
                      <Link
                        href={href}
                        className="text-sm leading-snug transition-colors hover:underline focus-visible:underline"
                        style={{ color: "var(--color-azul-700)" }}
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
