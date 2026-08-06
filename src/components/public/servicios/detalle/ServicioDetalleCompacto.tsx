import Link from "next/link";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { getRelacionados, type ServicioDetalle as ServicioDetalleData, type LayoutCompacto } from "@/data/servicios-detalle";
import { PanelDatos } from "./PanelDatos";
import { CtaSolicitarCita } from "./CtaSolicitarCita";
import { NotaPreparacion } from "./NotaPreparacion";
import { ServiciosRelacionados } from "./ServiciosRelacionados";

interface Props {
  servicio: ServicioDetalleData;
  variante: LayoutCompacto;
}

function Breadcrumb({ nombre }: { nombre: string }) {
  return (
    <>
      <nav aria-label="Ruta de navegación" className="relative z-10 mb-6">
        <ol className="flex flex-wrap items-center gap-1.5 font-body text-sm" style={{ color: "var(--color-gris-500)" }}>
          <li>
            <Link href="/" className="hover:underline" style={{ color: "var(--color-azul-800)" }}>
              Inicio
            </Link>
          </li>
          <ChevronRight size={14} aria-hidden="true" />
          <li>
            <Link href="/servicios" className="hover:underline" style={{ color: "var(--color-azul-800)" }}>
              Servicios
            </Link>
          </li>
          <ChevronRight size={14} aria-hidden="true" />
          <li aria-current="page" className="line-clamp-1" style={{ color: "var(--color-gris-700)" }}>
            {nombre}
          </li>
        </ol>
      </nav>
      <Link
        href="/servicios"
        className="relative z-10 inline-flex items-center gap-1.5 font-heading font-semibold text-sm mb-8"
        style={{ color: "var(--color-azul-800)" }}
      >
        <ArrowLeft size={16} aria-hidden="true" />
        Volver a servicios
      </Link>
    </>
  );
}

function Encabezado({ servicio }: { servicio: ServicioDetalleData }) {
  return (
    <>
      <span
        className="inline-flex items-center gap-1.5 font-heading font-semibold text-sm px-4 py-1.5 mb-4"
        style={{ backgroundColor: "var(--color-azul-100)", color: "var(--color-azul-800)", borderRadius: "999px" }}
      >
        Servicio Nº {servicio.numero} · {servicio.categoria}
      </span>
      <h1 className="font-heading font-bold text-3xl md:text-4xl leading-tight" style={{ color: "var(--color-azul-900)" }}>
        {servicio.nombre}
      </h1>
      {servicio.intro && (
        <p className="mt-4 font-body text-lg leading-relaxed" style={{ color: "var(--color-gris-600)" }}>
          {servicio.intro}
        </p>
      )}
      <NotaPreparacion texto={servicio.requierePreparacion} />
    </>
  );
}

export function ServicioDetalleCompacto({ servicio, variante }: Props) {
  const relacionados = getRelacionados(servicio);

  if (variante === "M1") {
    return (
      <div id="main-content" className="container-main py-16 md:py-24 relative">
        <div className="participa-section-blobs" aria-hidden="true" />
        <Breadcrumb nombre={servicio.nombre} />

        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <div className="text-left inline-block w-full">
            <Encabezado servicio={servicio} />
          </div>

          <div className="mt-8 text-left">
            <PanelDatos
              sedes={servicio.sedes}
              especialista={servicio.especialista}
              horario={servicio.horario}
              modalidad={servicio.modalidad}
              nivelComplejidad={servicio.nivelComplejidad}
            />
          </div>

          {relacionados.length > 0 && (
            <div className="mt-8 text-left">
              <ServiciosRelacionados servicios={relacionados} />
            </div>
          )}

          <div className="mt-8">
            <CtaSolicitarCita nombreServicio={servicio.nombre} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="main-content" className="container-main py-16 md:py-24 relative">
      <div className="participa-section-blobs" aria-hidden="true" />
      <Breadcrumb nombre={servicio.nombre} />

      <div className="relative z-10 grid gap-8 lg:grid-cols-[1fr_360px] items-start">
        <div>
          <Encabezado servicio={servicio} />
          <div className="mt-8">
            <CtaSolicitarCita nombreServicio={servicio.nombre} />
          </div>
        </div>

        <div className="space-y-6">
          <PanelDatos
            sedes={servicio.sedes}
            especialista={servicio.especialista}
            horario={servicio.horario}
            modalidad={servicio.modalidad}
            nivelComplejidad={servicio.nivelComplejidad}
            dark
          />
          {relacionados.length > 0 && <ServiciosRelacionados servicios={relacionados} />}
        </div>
      </div>
    </div>
  );
}
