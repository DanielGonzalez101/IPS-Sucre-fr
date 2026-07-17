import { ExternalLink, Phone, Mail, MapPin, ShieldCheck } from "lucide-react";

const entes = [
  {
    nombre: "Superintendencia Nacional de Salud — Supersalud",
    tipo: "Control sanitario, financiero y de calidad",
    direccion: "Carrera 68A N° 24B-10, Torre 3, Pisos 4, 9 y 10, Edificio Plaza Claro, Bogotá D.C.",
    telefono: "(601) 481 7000 | Línea gratuita: 018000 513 700",
    email: "correointernosns@supersalud.gov.co",
    web: "https://www.supersalud.gov.co",
  },
  {
    nombre: "Secretaría de Salud Departamental de Sucre",
    tipo: "Control sanitario territorial",
    direccion: "Carrera 14 N° 15A-140, Barrio Los Libertadores, Sincelejo — Sucre",
    telefono: "(605) 279 8888",
    email: "contactenos@saludsucre.gov.co",
    web: "https://www.saludsucre.gov.co",
  },
  {
    nombre: "Ministerio de Salud y Protección Social",
    tipo: "Control regulatorio y de política pública en salud",
    direccion: "Carrera 13 N° 32-76, Bogotá D.C.",
    telefono: "(601) 330 5000 | Línea gratuita: 018000 960 020",
    email: "correo@minsalud.gov.co",
    web: "https://www.minsalud.gov.co",
  },
];

export default function EntesVigilancia() {
  return (
    <section
      className="py-16 md:py-24"
      style={{ backgroundColor: "var(--color-gris-50)" }}
      aria-labelledby="entes-title"
    >
      <div className="container-main">

        <div className="mb-10 md:mb-14">
          <span
            className="inline-flex items-center gap-1.5 font-heading font-semibold text-sm px-4 py-1.5 mb-4"
            style={{
              backgroundColor: "var(--color-azul-100)",
              color: "var(--color-azul-800)",
              borderRadius: "999px",
            }}
          >
            <ShieldCheck size={14} aria-hidden="true" />
            Transparencia institucional
          </span>
          <h2
            id="entes-title"
            className="font-heading font-bold text-2xl md:text-3xl"
            style={{ color: "var(--color-azul-900)" }}
          >
            Entes y autoridades que nos vigilan
          </h2>
          <p
            className="mt-3 font-body text-base max-w-2xl"
            style={{ color: "var(--color-gris-600)" }}
          >
            Las siguientes entidades ejercen control, inspección y vigilancia sobre IPS Cardiocentro Pediátrico de Sucre S.A.S.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {entes.map((ente) => (
            <div
              key={ente.nombre}
              className="rounded-2xl p-6 flex flex-col gap-4"
              style={{
                backgroundColor: "#fff",
                boxShadow: "var(--shadow-card)",
              }}
            >
              <div>
                <p
                  className="font-heading font-bold text-base leading-snug mb-1"
                  style={{ color: "var(--color-azul-900)" }}
                >
                  {ente.nombre}
                </p>
                <span
                  className="inline-block font-body text-xs px-2.5 py-1 rounded-full"
                  style={{
                    backgroundColor: "var(--color-azul-50)",
                    color: "var(--color-azul-700)",
                  }}
                >
                  {ente.tipo}
                </span>
              </div>

              <ul className="space-y-2.5 font-body text-sm" style={{ color: "var(--color-gris-600)" }}>
                <li className="flex items-start gap-2">
                  <MapPin size={14} className="mt-0.5 shrink-0" style={{ color: "var(--color-rojo-500)" }} aria-hidden="true" />
                  {ente.direccion}
                </li>
                <li className="flex items-start gap-2">
                  <Phone size={14} className="mt-0.5 shrink-0" style={{ color: "var(--color-rojo-500)" }} aria-hidden="true" />
                  {ente.telefono}
                </li>
                <li className="flex items-center gap-2">
                  <Mail size={14} className="shrink-0" style={{ color: "var(--color-rojo-500)" }} aria-hidden="true" />
                  <a
                    href={`mailto:${ente.email}`}
                    className="hover:underline transition-colors"
                    style={{ color: "var(--color-azul-700)" }}
                  >
                    {ente.email}
                  </a>
                </li>
              </ul>

              <a
                href={ente.web}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-heading font-semibold text-sm mt-auto transition-colors hover:underline"
                style={{ color: "var(--color-rojo-500)" }}
              >
                Visitar sitio web
                <ExternalLink size={13} aria-hidden="true" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
