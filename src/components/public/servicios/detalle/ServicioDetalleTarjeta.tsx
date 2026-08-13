import { getRelacionados, type ServicioDetalle as ServicioDetalleData } from "@/data/servicios-detalle";
import { PanelDatos } from "./PanelDatos";
import { CtaSolicitarCita } from "./CtaSolicitarCita";
import { ServiciosRelacionados } from "./ServiciosRelacionados";
import { ContactoSedes } from "./ContactoSedes";
import { VolverAlfabetico } from "./VolverAlfabetico";

interface Props {
  servicio: ServicioDetalleData;
}

export function ServicioDetalleTarjeta({ servicio }: Props) {
  const relacionados = getRelacionados(servicio);
  const sedesContacto = servicio.sedes && servicio.sedes.length > 0 ? servicio.sedes : ["Sincelejo"];

  return (
    <div id="main-content" className="container-main py-16 md:py-24 relative">
      <div className="participa-section-blobs" aria-hidden="true" />

      <VolverAlfabetico />

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
