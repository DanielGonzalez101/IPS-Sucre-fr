import Link from "next/link";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { getRelacionados, type ServicioDetalle as ServicioDetalleData } from "@/data/servicios-detalle";
import { PanelDatos } from "./PanelDatos";
import { CtaSolicitarCita } from "./CtaSolicitarCita";
import { ServiciosRelacionados } from "./ServiciosRelacionados";
import { ContactoSedes } from "./ContactoSedes";

interface Props {
  servicio: ServicioDetalleData;
}

export function ServicioDetalleTarjeta({ servicio }: Props) {
  const relacionados = getRelacionados(servicio);
  const sedesContacto = servicio.sedes && servicio.sedes.length > 0 ? servicio.sedes : ["Sincelejo"];

  return (
    <div id="main-content" className="container-main py-16 md:py-24 relative">
      <div className="participa-section-blobs" aria-hidden="true" />

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
            {servicio.nombre}
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

      <div className="relative z-10 max-w-xl mx-auto rounded-3xl p-8 md:p-10 servicio-detalle-glass-navy text-center">
        <span
          className="inline-flex items-center gap-1.5 font-heading font-semibold text-sm px-4 py-1.5 mb-4"
          style={{ backgroundColor: "rgba(255,255,255,0.15)", color: "#fff", borderRadius: "999px" }}
        >
          Servicio Nº {servicio.numero} · {servicio.categoria}
        </span>
        <h1 className="font-heading font-bold text-2xl md:text-3xl leading-tight text-white">{servicio.nombre}</h1>

        <div className="mt-8 flex justify-center">
          <CtaSolicitarCita nombreServicio={servicio.nombre} />
        </div>
      </div>

      <div className="relative z-10 max-w-xl mx-auto mt-8 space-y-8 text-left">
        <PanelDatos
          sedes={servicio.sedes}
          especialista={servicio.especialista}
          horario={servicio.horario}
          modalidad={servicio.modalidad}
          nivelComplejidad={servicio.nivelComplejidad}
        />
        <ContactoSedes sedes={sedesContacto} />
        {relacionados.length > 0 && <ServiciosRelacionados servicios={relacionados} />}
      </div>
    </div>
  );
}
