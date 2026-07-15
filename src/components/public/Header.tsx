import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, ChevronDown, Users, Cpu } from "lucide-react";
import type { Sede } from "@/actions/sitio";
import ContactanosDropdown from "@/components/public/navbar/ContactanosDropdown";

const navLinksBeforeEquipo = [
  { href: "/", label: "Inicio" },
  { href: "/quienes-somos", label: "Quiénes somos" },
];

const navLinksMiddle = [
  { href: "/servicios", label: "Servicios" },
  { href: "/multimedia", label: "Multimedia" },
  { href: "/calidad", label: "Calidad" },
  { href: "/noticias", label: "Noticias" },
];

const navLinksEnd = [{ href: "/consulta-examen", label: "Consulta tu examen" }];

const HORARIO_FALLBACK =
  "Lunes a Viernes 7:00 a.m. – 12:00 m. / 1:00 p.m. – 6:00 p.m.\nSábados 7:00 a.m. – 11:00 a.m.";

interface HeaderProps {
  sedes: Sede[];
  emailContacto: string;
  whatsappUrl: string;
}

export default function Header({ sedes, emailContacto, whatsappUrl }: HeaderProps) {
  return (
    <header>
      {/* Top bar */}
      <div
        className="hidden md:block py-2.5 text-sm"
        style={{ backgroundColor: "var(--color-azul-900)" }}
      >
        <div className="container-main flex items-center justify-between">
          <div className="flex items-center gap-5">
            <a
              href="tel:+573009127565"
              className="flex items-center gap-1.5 text-white/85 hover:text-white transition-colors"
            >
              <Phone size={13} aria-hidden="true" />
              (+57) 300 912 7565
            </a>
            <a
              href="mailto:info@cardiopediasucre.com"
              className="flex items-center gap-1.5 text-white/85 hover:text-white transition-colors"
            >
              <Mail size={13} aria-hidden="true" />
              info@cardiopediasucre.com
            </a>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/transparencia"
              className="text-white/85 hover:text-white transition-colors"
            >
              Información Pública
            </Link>
            <Link
              href="/pqrs"
              className="text-white/85 hover:text-white transition-colors"
            >
              Peticiones y Solicitudes
            </Link>
            <Link
              href="/participa"
              className="text-white/85 hover:text-white transition-colors"
            >
              Voz Ciudadana
            </Link>
          </div>
        </div>
      </div>

      {/* Nav principal */}
      <nav
        className="bg-white border-b border-gris-100 sticky top-0 z-40"
        style={{ boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.06)" }}
        aria-label="Navegación principal"
      >
        <div className="container-main flex items-center justify-between py-4">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center focus-visible:ring-2 focus-visible:ring-azul-600 focus-visible:ring-offset-2 rounded-lg"
          >
            <Image
              src="/logo.png"
              alt="Cardiocentro Pediátrico de Sucre"
              width={200}
              height={60}
              className="h-14 w-auto object-contain"
              priority
            />
          </Link>

          {/* Links desktop */}
          <ul className="hidden lg:flex items-center gap-1" role="list">
            {navLinksBeforeEquipo.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="nav-link font-heading font-semibold text-sm px-3 py-2 rounded-lg transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-azul-600 focus-visible:ring-offset-1"
                >
                  {label}
                </Link>
              </li>
            ))}

            {/* Dropdown Equipo — posición 3 */}
            <li className="nav-dropdown-group">
              <button
                className="nav-dropdown-trigger"
                aria-haspopup="true"
                aria-label="Menú Equipo"
              >
                Equipo
                <ChevronDown size={14} className="nav-dropdown-chevron" aria-hidden="true" />
              </button>

              <div className="nav-dropdown-panel" role="menu" aria-label="Submenú Equipo">
                <Link href="/equipo" className="nav-dropdown-item" role="menuitem">
                  <span className="nav-dropdown-icon" aria-hidden="true">
                    <Users size={17} />
                  </span>
                  <span>
                    <span className="nav-dropdown-label block">Equipo Humano</span>
                    <span className="nav-dropdown-desc block">Médicos y personal de salud</span>
                  </span>
                </Link>

                <Link href="/equipo/tecnologico" className="nav-dropdown-item" role="menuitem">
                  <span className="nav-dropdown-icon" aria-hidden="true">
                    <Cpu size={17} />
                  </span>
                  <span>
                    <span className="nav-dropdown-label block">Equipo Tecnológico</span>
                    <span className="nav-dropdown-desc block">Infraestructura y equipos médicos</span>
                  </span>
                </Link>
              </div>
            </li>

            {navLinksMiddle.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="nav-link font-heading font-semibold text-sm px-3 py-2 rounded-lg transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-azul-600 focus-visible:ring-offset-1"
                >
                  {label}
                </Link>
              </li>
            ))}

            <ContactanosDropdown
              sedes={sedes}
              emailContacto={emailContacto}
              whatsappUrl={whatsappUrl}
              telefono={sedes[0]?.telefono ?? "(+57) 300 912 7565"}
              horario={sedes[0]?.horario ?? HORARIO_FALLBACK}
            />

            {navLinksEnd.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="nav-link font-heading font-semibold text-sm px-3 py-2 rounded-lg transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-azul-600 focus-visible:ring-offset-1"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          {/* CTA */}
          <a
            href="https://wa.me/573009127565"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden lg:inline-flex items-center gap-2 font-heading font-semibold text-sm text-white rounded-full px-5 py-2.5 hover:opacity-90 focus-visible:ring-2 focus-visible:ring-azul-600 focus-visible:ring-offset-2 transition-all duration-200"
            style={{
              backgroundColor: "var(--color-azul-800)",
              boxShadow: "var(--shadow-button)",
            }}
          >
            Agenda tu cita
          </a>

          {/* Hamburguesa mobile — placeholder funcional */}
          <button
            className="lg:hidden p-2 rounded-lg focus-visible:ring-2 focus-visible:ring-azul-600"
            aria-label="Abrir menú de navegación"
            aria-expanded="false"
            style={{ color: "var(--color-azul-900)" }}
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 22 22"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M3 6h16M3 11h16M3 16h16"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      </nav>
    </header>
  );
}
