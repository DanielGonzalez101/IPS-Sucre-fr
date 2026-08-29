import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import type { Sede, RedesSociales } from "@/actions/sitio";

interface FooterProps {
  emailContacto?: string;
  sedePrincipal?: Pick<Sede, "direccion" | "telefono" | "ciudad">;
  redes?: RedesSociales;
}

const linksInteres = [
  { href: "/servicios",       label: "Nuestros servicios" },
  { href: "/equipo",          label: "Equipo médico" },
  { href: "/pqrs",            label: "Radicar PQRSD" },
  { href: "/pqrs/consulta",   label: "Consultar estado de PQRSD" },
  { href: "/contacto",        label: "Contacto" },
  { href: "/normativa",       label: "Normativa" },
];

const politicas = [
  { href: "/politicas/terminos-y-condiciones", label: "Términos y condiciones" },
  { href: "/politicas/privacidad",             label: "Política de privacidad" },
  { href: "/politicas/derechos-de-autor",      label: "Derechos de autor" },
  { href: "/politicas/seguridad-digital",      label: "Seguridad digital" },
];

export default function Footer({
  emailContacto = "info@cardiopediasucre.com",
  sedePrincipal = {
    ciudad: "Sincelejo",
    direccion: "Calle 14 No. 17-72 / Barrio Ford",
    telefono: "(+57) 300 912 7565",
  },
  redes = { facebook_url: "", instagram_url: "", whatsapp_url: "" },
}: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer
      style={{ backgroundColor: "var(--color-azul-900)", color: "rgba(255,255,255,0.75)" }}
      aria-label="Pie de página"
    >
      <div className="container-main pt-12 pb-6">

        {/* Franja 1 — Marca / Contacto / Links / Políticas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-8 lg:divide-x pb-8" style={{ borderColor: "rgba(255,255,255,0.1)" }}>

          {/* Bloque 1 — Marca */}
          <div className="lg:pr-8">
            <Link href="/" className="inline-flex items-center gap-2.5 mb-4 focus-visible:ring-2 focus-visible:ring-white rounded-lg">
              <Image
                src="/images/logo-watermark.png"
                alt=""
                width={205}
                height={218}
                className="w-11 h-11 object-contain shrink-0"
                aria-hidden="true"
              />
              <div className="leading-tight">
                <span className="block font-heading font-black text-base text-white">Cardiocentro</span>
                <span className="block font-heading font-medium text-sm" style={{ color: "rgba(255,255,255,0.55)" }}>
                  Pediátrico de Sucre
                </span>
              </div>
            </Link>

            <div className="flex items-start gap-2">
              <Clock size={14} className="mt-0.5 shrink-0" style={{ color: "var(--color-rojo-500)" }} aria-hidden="true" />
              <div className="font-body text-sm leading-relaxed">
                <p>Lunes a Viernes: 7:00 a.m. – 12:00 m. / 1:00 – 6:00 p.m.</p>
                <p>Sábados: 7:00 a.m. – 11:00 a.m.</p>
              </div>
            </div>
          </div>

          {/* Bloque 2 — Contacto */}
          <div className="lg:px-8">
            <h2 className="font-heading font-bold text-white text-sm mb-3 uppercase tracking-wider">
              Contacto
            </h2>
            <ul className="space-y-2.5">
              <li className="flex items-start gap-2">
                <MapPin size={14} className="mt-0.5 shrink-0" style={{ color: "var(--color-rojo-500)" }} aria-hidden="true" />
                <span className="font-body text-sm leading-relaxed">
                  {sedePrincipal.direccion}<br />
                  {sedePrincipal.ciudad} — Sucre
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={14} className="shrink-0" style={{ color: "var(--color-rojo-500)" }} aria-hidden="true" />
                <a
                  href={`tel:${sedePrincipal.telefono.replace(/\s|\(|\)|-/g, "")}`}
                  className="font-body text-sm hover:text-white transition-colors"
                >
                  {sedePrincipal.telefono}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={14} className="shrink-0" style={{ color: "var(--color-rojo-500)" }} aria-hidden="true" />
                <a href={`mailto:${emailContacto}`} className="font-body text-sm hover:text-white transition-colors">
                  {emailContacto}
                </a>
              </li>
            </ul>
          </div>

          {/* Bloque 3 — Links de interés */}
          <div className="lg:px-8">
            <h2 className="font-heading font-bold text-white text-sm mb-3 uppercase tracking-wider">
              Links de interés
            </h2>
            <ul className="space-y-2">
              {linksInteres.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="font-body text-sm hover:text-white transition-colors focus-visible:underline"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Bloque 4 — Políticas */}
          <div className="lg:pl-8">
            <h2 className="font-heading font-bold text-white text-sm mb-3 uppercase tracking-wider">
              Información legal
            </h2>
            <ul className="space-y-2">
              {politicas.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="font-body text-sm hover:text-white transition-colors focus-visible:underline"
                  >
                    {label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/transparencia"
                  className="font-body text-sm hover:text-white transition-colors focus-visible:underline"
                >
                  Transparencia y acceso a información
                </Link>
              </li>
              <li>
                <Link
                  href="/mapa-del-sitio"
                  className="font-body text-sm hover:text-white transition-colors focus-visible:underline"
                >
                  Mapa del sitio
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Franja 2 — Vigilancia Supersalud (separada, propia jerarquía) Comentada hasta nuevo aviso */}
        {/* <div
          className="border-t py-6 flex flex-col sm:flex-row items-start sm:items-center gap-5"
          style={{ borderColor: "rgba(255,255,255,0.1)" }}
        >
          <a
            href="https://www.supersalud.gov.co"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Vigilado por la Superintendencia Nacional de Salud - Supersalud (abre en nueva pestaña)"
            className="inline-block shrink-0"
          >
            <Image
              src="/images/footer/vigiladoSupersalud.svg"
              alt="Vigilado Supersalud"
              width={170}
              height={58}
              className="object-contain"
            />
          </a>
          <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-6 font-body text-sm" style={{ color: "rgba(255,255,255,0.75)" }}>
            <span>
              <span className="text-white font-semibold">PBX:</span> +57(601) 744 2000
            </span>
            <span>
              <span className="text-white font-semibold">Línea gratuita nacional:</span> 01 8000 513700
            </span>
            <span>
              <span className="text-white font-semibold">Fax:</span> +57(601) 744 2000
            </span>
          </div>
        </div> */}

        {/* Franja 3 — Línea legal inferior */}
        <div
          className="border-t pt-5 flex flex-col sm:flex-row items-center justify-between gap-3"
          style={{ borderColor: "rgba(255,255,255,0.1)" }}
        >
          <p className="font-body text-sm text-center sm:text-left" style={{ color: "rgba(255,255,255,0.45)" }}>
            © {year} IPS Cardiocentro Pediátrico de Sucre S.A.S. — NIT 900.550.249-0. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-4">
            {redes.facebook_url && (
              <a
                href={redes.facebook_url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-body text-sm hover:text-white transition-colors focus-visible:underline"
                aria-label="Síguenos en Facebook"
              >
                Facebook
              </a>
            )}
            {redes.instagram_url && (
              <a
                href={redes.instagram_url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-body text-sm hover:text-white transition-colors focus-visible:underline"
                aria-label="Síguenos en Instagram"
              >
                Instagram
              </a>
            )}
            {redes.whatsapp_url && (
              <a
                href={redes.whatsapp_url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-body text-sm hover:text-white transition-colors focus-visible:underline"
                aria-label="Contáctanos por WhatsApp"
              >
                WhatsApp
              </a>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
