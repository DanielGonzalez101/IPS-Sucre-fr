import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getServicioDetalleBySlug, resolveVariante } from "@/data/servicios-detalle";
import { ServicioDetalle } from "@/components/public/servicios/detalle/ServicioDetalle";
import { ServicioDetalleCompacto } from "@/components/public/servicios/detalle/ServicioDetalleCompacto";
import { ServicioDetalleTarjeta } from "@/components/public/servicios/detalle/ServicioDetalleTarjeta";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const servicio = getServicioDetalleBySlug(slug);

  if (!servicio) return {};

  return {
    title: servicio.nombre,
    description: servicio.intro ?? `${servicio.nombre} — ${servicio.categoria}. Cardiocentro Pediátrico de Sucre.`,
  };
}

export default async function ServicioCatalogoDetallePage({ params }: Props) {
  const { slug } = await params;
  const servicio = getServicioDetalleBySlug(slug);

  if (!servicio) notFound();

  const { densidad, variante } = resolveVariante(servicio);

  if (densidad === "baja") {
    return <ServicioDetalleTarjeta servicio={servicio} />;
  }

  if (densidad === "media") {
    return <ServicioDetalleCompacto servicio={servicio} variante={variante as "M1" | "M2"} />;
  }

  return <ServicioDetalle servicio={servicio} variante={variante as "A" | "B" | "C" | "D" | "E"} />;
}
