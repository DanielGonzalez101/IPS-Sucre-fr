import { notFound } from "next/navigation";
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
    <div id="main-content" className="container-main py-24 text-center">
      <span
        className="inline-flex items-center gap-1.5 font-heading font-semibold text-sm px-4 py-1.5 mb-6"
        style={{
          backgroundColor: "var(--color-azul-100)",
          color: "var(--color-azul-800)",
          borderRadius: "999px",
        }}
      >
        Próximamente
      </span>
      <h1
        className="font-heading font-bold text-3xl md:text-4xl"
        style={{ color: "var(--color-azul-900)" }}
      >
        {servicio.titulo}
      </h1>
      <p
        className="mt-4 font-body text-lg max-w-xl mx-auto"
        style={{ color: "var(--color-gris-600)" }}
      >
        {servicio.descripcion}
      </p>
    </div>
  );
}
