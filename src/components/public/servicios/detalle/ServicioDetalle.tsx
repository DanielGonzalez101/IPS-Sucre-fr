import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ChevronRight } from "lucide-react";
import type { ServicioDetalle as ServicioDetalleData, LayoutVariante } from "@/data/servicios-detalle";
import { PanelDatos } from "./PanelDatos";
import { ProcesoTimeline } from "./ProcesoTimeline";
import { CtaSolicitarCita } from "./CtaSolicitarCita";
import { NotaPreparacion } from "./NotaPreparacion";

interface Props {
  servicio: ServicioDetalleData;
  variante: LayoutVariante;
}

type ProcesoEstilo = "dark" | "light" | "plain";

const CONFIG_VARIANTE: Record<LayoutVariante, { procesoEstilo: ProcesoEstilo; datosDark: boolean }> = {
  A: { procesoEstilo: "dark", datosDark: false },
  B: { procesoEstilo: "plain", datosDark: true },
  C: { procesoEstilo: "light", datosDark: true },
  D: { procesoEstilo: "plain", datosDark: true },
  E: { procesoEstilo: "light", datosDark: true },
};

export function ServicioDetalle({ servicio, variante }: Props) {
  const { procesoEstilo, datosDark } = CONFIG_VARIANTE[variante];
  const orientacion = variante === "D" ? "horizontal" : "vertical";
  const tienePasos = Boolean(servicio.pasos && servicio.pasos.length > 0);
  const tieneImagen = Boolean(servicio.imagen);
  const tieneDatos = Boolean(
    (servicio.sedes && servicio.sedes.length > 0) || servicio.especialista || servicio.horario || servicio.modalidad
  );
  const tieneIntroOPreparacion = Boolean(servicio.intro || servicio.requierePreparacion);

  const proceso = (
    <ProcesoTimeline pasos={servicio.pasos} orientacion={orientacion} dark={procesoEstilo === "dark"} />
  );

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

      <div className="servicio-detalle-grid relative z-10" data-variant={variante}>
        <div className="sd-slot sd-slot--header">
          <span
            className="inline-flex items-center gap-1.5 font-heading font-semibold text-sm px-4 py-1.5 mb-4"
            style={{
              backgroundColor: "var(--color-azul-100)",
              color: "var(--color-azul-800)",
              borderRadius: "999px",
            }}
          >
            Servicio Nº {servicio.numero} · {servicio.categoria}
          </span>
          <h1 className="font-heading font-bold text-3xl md:text-4xl leading-tight" style={{ color: "var(--color-azul-900)" }}>
            {servicio.nombre}
          </h1>
        </div>

        {tieneIntroOPreparacion && (
          <div className="sd-slot sd-slot--intro">
            {servicio.intro && (
              <p className="font-body text-lg leading-relaxed" style={{ color: "var(--color-gris-600)" }}>
                {servicio.intro}
              </p>
            )}
            <NotaPreparacion texto={servicio.requierePreparacion} />
          </div>
        )}

        {tieneImagen && (
          <div className="sd-slot sd-slot--imagen">
            <div className="relative w-full aspect-[16/10] rounded-3xl overflow-hidden" style={{ backgroundColor: "var(--color-azul-50)" }}>
              <Image
                src={servicio.imagen as string}
                alt={`Imagen ilustrativa del servicio: ${servicio.nombre}`}
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 50vw, 100vw"
              />
            </div>
          </div>
        )}

        {tienePasos && (
          <div className="sd-slot sd-slot--proceso">
            {procesoEstilo === "plain" ? (
              proceso
            ) : (
              <div className={`rounded-3xl p-6 md:p-8 ${procesoEstilo === "dark" ? "servicio-detalle-glass-navy" : "participa-glass"}`}>
                {proceso}
              </div>
            )}
          </div>
        )}

        {tieneDatos && (
          <div className="sd-slot sd-slot--datos">
            <PanelDatos
              sedes={servicio.sedes}
              especialista={servicio.especialista}
              horario={servicio.horario}
              modalidad={servicio.modalidad}
              nivelComplejidad={servicio.nivelComplejidad}
              dark={datosDark}
            />
          </div>
        )}

        <div className="sd-slot sd-slot--cta">
          <CtaSolicitarCita nombreServicio={servicio.nombre} />
        </div>
      </div>
    </div>
  );
}
