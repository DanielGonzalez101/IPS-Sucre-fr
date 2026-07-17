import { notFound } from "next/navigation";
import Link from "next/link";
import { ClipboardList, ArrowLeft } from "lucide-react";
import { getServiciosPublicos } from "@/actions/servicios";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function ServicioDetallePage({ params }: Props) {
  const { slug } = await params;
  const { data: servicios } = await getServiciosPublicos();
  const servicio = (servicios ?? []).find((s) => s.slug === slug);

  if (!servicio) notFound();

  return (
    <div id="main-content" className="container-main py-16 md:py-24">
      <Link
        href="/servicios"
        className="inline-flex items-center gap-1.5 font-heading font-semibold text-sm mb-8"
        style={{ color: "var(--color-azul-800)" }}
      >
        <ArrowLeft size={16} aria-hidden="true" />
        Volver a servicios
      </Link>

      <div className="max-w-2xl">
        {servicio.categoria && (
          <span
            className="inline-flex items-center gap-1.5 font-heading font-semibold text-sm px-4 py-1.5 mb-6"
            style={{
              backgroundColor: "var(--color-azul-100)",
              color: "var(--color-azul-800)",
              borderRadius: "999px",
            }}
          >
            {servicio.categoria}
          </span>
        )}

        <h1
          className="font-heading font-bold text-3xl md:text-4xl"
          style={{ color: "var(--color-azul-900)" }}
        >
          {servicio.titulo}
        </h1>

        <p
          className="mt-4 font-body text-lg leading-relaxed"
          style={{ color: "var(--color-gris-600)" }}
        >
          {servicio.descripcion}
        </p>

        {servicio.preparacion && (
          <div
            className="mt-8 flex gap-3 p-5"
            style={{
              backgroundColor: "var(--color-azul-50)",
              borderRadius: "16px",
              border: "1px solid var(--color-azul-100)",
            }}
          >
            <ClipboardList
              size={20}
              aria-hidden="true"
              className="shrink-0 mt-0.5"
              style={{ color: "var(--color-azul-800)" }}
            />
            <div>
              <p
                className="font-heading font-semibold text-sm mb-1"
                style={{ color: "var(--color-azul-900)" }}
              >
                Preparación para este examen
              </p>
              <p className="font-body text-sm leading-relaxed" style={{ color: "var(--color-azul-800)" }}>
                {servicio.preparacion}
              </p>
            </div>
          </div>
        )}

        <a
          href="https://cardiocentro.gomedicaltm.co/portal-pacientes"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-flex items-center justify-center font-heading font-semibold text-sm text-white rounded-full px-7 py-3.5 hover:opacity-90 transition-all duration-200"
          style={{ backgroundColor: "var(--color-rojo-500)" }}
        >
          Agendar este servicio
        </a>
      </div>
    </div>
  );
}
