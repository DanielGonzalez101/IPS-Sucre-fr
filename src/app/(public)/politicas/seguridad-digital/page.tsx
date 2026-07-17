import type { Metadata } from "next";
import { ShieldCheck, Lock, Server, AlertTriangle, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Política de Seguridad Digital | IPS Cardiocentro Pediátrico de Sucre",
  description:
    "Política de seguridad digital y de la información de IPS Cardiocentro Pediátrico de Sucre S.A.S., conforme al Anexo 3 de la Resolución MinTIC 1519.",
};

const medidas = [
  {
    icon: Lock,
    titulo: "Cifrado y transporte seguro",
    descripcion:
      "Todas las comunicaciones del sitio web utilizan HTTPS con certificado TLS válido. Los datos en tránsito están cifrados en todo momento.",
  },
  {
    icon: Server,
    titulo: "Almacenamiento seguro",
    descripcion:
      "La información de usuarios y solicitudes se almacena en infraestructura cloud con cifrado en reposo, copias de seguridad automáticas y control de acceso por roles.",
  },
  {
    icon: ShieldCheck,
    titulo: "Control de acceso",
    descripcion:
      "El panel administrativo requiere autenticación. Los datos sensibles (PQRSD, inscripciones) solo son accesibles por personal autorizado mediante políticas RLS.",
  },
  {
    icon: AlertTriangle,
    titulo: "Limitación de solicitudes",
    descripcion:
      "Los formularios públicos tienen protección contra abuso mediante rate limiting por IP. Se previene el envío masivo automatizado de solicitudes.",
  },
];

export default function SeguridadDigitalPage() {
  return (
    <>
      {/* Hero */}
      <section
        aria-labelledby="seguridad-heading"
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
            Seguridad Digital
          </span>
          <h1
            id="seguridad-heading"
            className="font-bold text-3xl md:text-4xl lg:text-5xl text-white mb-4"
          >
            Política de seguridad digital
          </h1>
          <p
            className="text-base md:text-lg max-w-2xl mx-auto"
            style={{ color: "rgba(255,255,255,0.75)" }}
          >
            Conforme al Artículo 6 y Anexo 3 de la Resolución MinTIC 1519 y la normativa
            de seguridad de la información vigente en Colombia.
          </p>
        </div>
      </section>

      {/* Contenido */}
      <section
        className="py-12 md:py-16"
        style={{ backgroundColor: "var(--color-gris-50)" }}
        aria-label="Contenido de la política de seguridad digital"
      >
        <div className="container-main max-w-4xl">

          {/* Declaración */}
          <div
            className="rounded-2xl p-6 md:p-10 mb-8"
            style={{ backgroundColor: "#fff", boxShadow: "var(--shadow-card)" }}
          >
            <h2
              className="font-bold text-xl md:text-2xl mb-4"
              style={{ color: "var(--color-azul-900)" }}
            >
              Declaración de compromiso
            </h2>
            <div
              className="font-body text-base leading-relaxed space-y-4"
              style={{ color: "var(--color-gris-700)" }}
            >
              <p>
                IPS Cardiocentro Pediátrico de Sucre S.A.S. (NIT 900.550.249-0) se compromete
                a proteger la confidencialidad, integridad y disponibilidad de la información
                de sus usuarios, colaboradores y grupos de interés, conforme a los principios
                establecidos en la <strong>Ley 1581 de 2012</strong> (Protección de Datos
                Personales), el <strong>Decreto 1074 de 2015</strong> y los lineamientos de
                seguridad digital del <strong>Ministerio de Tecnologías de la Información y
                las Comunicaciones (MinTIC)</strong>.
              </p>
              <p>
                Esta política aplica a todos los sistemas de información de la institución,
                incluyendo el presente sitio web, los sistemas internos de gestión clínica y
                administrativa, y los canales digitales de atención al usuario.
              </p>
            </div>
          </div>

          {/* Medidas implementadas */}
          <h2
            className="font-bold text-xl md:text-2xl mb-6"
            style={{ color: "var(--color-azul-900)" }}
          >
            Medidas de seguridad implementadas
          </h2>
          <div className="grid sm:grid-cols-2 gap-5 mb-8">
            {medidas.map(({ icon: Icon, titulo, descripcion }) => (
              <div
                key={titulo}
                className="rounded-2xl p-6"
                style={{ backgroundColor: "#fff", boxShadow: "var(--shadow-card)" }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: "var(--color-azul-50)" }}
                  aria-hidden="true"
                >
                  <Icon size={20} style={{ color: "var(--color-azul-800)" }} />
                </div>
                <h3
                  className="font-bold text-base mb-2"
                  style={{ color: "var(--color-azul-900)" }}
                >
                  {titulo}
                </h3>
                <p className="font-body text-sm leading-relaxed" style={{ color: "var(--color-gris-600)" }}>
                  {descripcion}
                </p>
              </div>
            ))}
          </div>

          {/* MSPI */}
          <div
            className="rounded-2xl p-6 md:p-8 mb-8"
            style={{ backgroundColor: "#fff", boxShadow: "var(--shadow-card)" }}
          >
            <h2
              className="font-bold text-xl mb-3"
              style={{ color: "var(--color-azul-900)" }}
            >
              Modelo de Seguridad y Privacidad de la Información (MSPI)
            </h2>
            <p
              className="font-body text-base leading-relaxed"
              style={{ color: "var(--color-gris-700)" }}
            >
              IPS Cardiocentro Pediátrico de Sucre se encuentra en proceso de adopción e
              implementación del <strong>Modelo de Seguridad y Privacidad de la Información
              (MSPI)</strong> recomendado por la Dirección de Gobierno Digital del MinTIC,
              conforme a lo establecido en el Artículo 6 y Anexo 3 de la Resolución 1519 de 2020.
              Este proceso incluye la identificación de activos de información, análisis de
              riesgos y definición de controles de seguridad.
            </p>
          </div>

          {/* Reporte de incidentes */}
          <div
            className="rounded-2xl p-6 md:p-8"
            style={{
              backgroundColor: "var(--color-azul-900)",
            }}
          >
            <div className="flex items-start gap-4">
              <Mail size={22} className="flex-shrink-0 mt-0.5" style={{ color: "var(--color-rojo-400)" }} aria-hidden="true" />
              <div>
                <h2 className="font-bold text-lg text-white mb-2">
                  Reporte de incidentes de seguridad
                </h2>
                <p
                  className="font-body text-sm leading-relaxed mb-3"
                  style={{ color: "rgba(255,255,255,0.80)" }}
                >
                  Si detecta una vulnerabilidad o incidente de seguridad relacionado con
                  nuestros sistemas, le agradecemos informarnos de inmediato al siguiente
                  correo:
                </p>
                <a
                  href="mailto:info@cardiopediasucre.com"
                  className="font-semibold text-sm hover:underline"
                  style={{ color: "var(--color-rojo-400)" }}
                >
                  info@cardiopediasucre.com
                </a>
                <p
                  className="font-body text-xs mt-3"
                  style={{ color: "rgba(255,255,255,0.50)" }}
                >
                  Los incidentes que ameriten reporte a la Superintendencia de Industria
                  y Comercio serán notificados conforme a lo establecido en la normativa vigente.
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>
    </>
  );
}
