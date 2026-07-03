import Link from "next/link";
import { MapPin, Phone, Mail, Heart, Clock } from "lucide-react";

const linksInteres = [
  { href: "/servicios",    label: "Nuestros servicios" },
  { href: "/equipo",       label: "Equipo médico" },
  { href: "/pqrs",         label: "PQRSD" },
  { href: "/contacto",     label: "Contacto" },
  { href: "/normativa",    label: "Normativa" },
];

const politicas = [
  { href: "/politicas/terminos-y-condiciones", label: "Términos y condiciones" },
  { href: "/politicas/privacidad",             label: "Política de privacidad" },
  { href: "/politicas/derechos-de-autor",      label: "Derechos de autor" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      style={{ backgroundColor: "var(--color-azul-900)", color: "rgba(255,255,255,0.75)" }}
      aria-label="Pie de página"
    >
      <div className="container-main pt-14 pb-8">

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

          {/* Bloque 1 — Marca */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2.5 mb-5 focus-visible:ring-2 focus-visible:ring-white rounded-lg">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: "var(--color-azul-800)" }}
                aria-hidden="true"
              >
                <Heart size={18} className="text-white" />
              </div>
              <div className="leading-tight">
                <span className="block font-heading font-black text-sm text-white">Cardiocentro</span>
                <span className="block font-heading font-medium text-sm" style={{ color: "rgba(255,255,255,0.55)" }}>
                  Pediátrico de Sucre
                </span>
              </div>
            </Link>

            <div className="flex items-start gap-2 mb-3">
              <Clock size={13} className="mt-0.5 shrink-0" style={{ color: "var(--color-rojo-500)" }} aria-hidden="true" />
              <div className="font-body text-sm leading-relaxed">
                <p>Lunes a Viernes: 7:00 a.m. – 12:00 m. / 1:00 – 6:00 p.m.</p>
                <p>Sábados: 7:00 a.m. – 11:00 a.m.</p>
              </div>
            </div>
          </div>

          {/* Bloque 2 — Contacto */}
          <div>
            <h2 className="font-heading font-bold text-white text-sm mb-4 uppercase tracking-wider">
              Contacto
            </h2>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <MapPin size={13} className="mt-0.5 shrink-0" style={{ color: "var(--color-rojo-500)" }} aria-hidden="true" />
                <span className="font-body text-sm leading-relaxed">
                  Calle 14 No. 17-72 / Barrio Ford<br />
                  Sincelejo — Sucre
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={13} className="shrink-0" style={{ color: "var(--color-rojo-500)" }} aria-hidden="true" />
                <a href="tel:+573009127565" className="font-body text-sm hover:text-white transition-colors">
                  (+57) 300 912 7565
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={13} className="shrink-0" style={{ color: "var(--color-rojo-500)" }} aria-hidden="true" />
                <a href="mailto:info@cardiopediasucre.com" className="font-body text-sm hover:text-white transition-colors">
                  info@cardiopediasucre.com
                </a>
              </li>
            </ul>
          </div>

          {/* Bloque 3 — Links de interés */}
          <div>
            <h2 className="font-heading font-bold text-white text-sm mb-4 uppercase tracking-wider">
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
          <div>
            <h2 className="font-heading font-bold text-white text-sm mb-4 uppercase tracking-wider">
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

        {/* Línea inferior */}
        <div
          className="border-t pt-6 flex flex-col sm:flex-row items-center justify-between gap-3"
          style={{ borderColor: "rgba(255,255,255,0.1)" }}
        >
          <p className="font-body text-sm text-center sm:text-left" style={{ color: "rgba(255,255,255,0.45)" }}>
            © {year} IPS Cardiocentro Pediátrico de Sucre S.A.S. — NIT 900.550.249-0. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://www.facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-body text-sm hover:text-white transition-colors focus-visible:underline"
              aria-label="Síguenos en Facebook"
            >
              Facebook
            </a>
            <a
              href="https://www.instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-body text-sm hover:text-white transition-colors focus-visible:underline"
              aria-label="Síguenos en Instagram"
            >
              Instagram
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
