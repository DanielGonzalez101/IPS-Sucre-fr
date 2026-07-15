"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Phone, Mail, ChevronDown, Users, Cpu } from "lucide-react";
import type { Sede } from "@/actions/sitio";
import ContactanosDropdown from "@/components/public/navbar/ContactanosDropdown";
import MobileMenu from "@/components/public/navbar/MobileMenu";

const navLinksBeforeEquipo = [
  { href: "/", label: "Inicio" },
  { href: "/quienes-somos", label: "Quiénes somos" },
];

const navLinksMiddle = [
  { href: "/servicios", label: "Servicios" },
  { href: "/multimedia", label: "Multimedia" },
  { href: "/calidad", label: "Calidad" },
  { href: "/blog", label: "Blog" },
];

const HORARIO_FALLBACK =
  "Lunes a Viernes 7:00 a.m. – 12:00 m. / 1:00 p.m. – 6:00 p.m.\nSábados 7:00 a.m. – 11:00 a.m.";

interface HeaderProps {
  sedes: Sede[];
  emailContacto: string;
  whatsappUrl: string;
}

export default function Header({ sedes, emailContacto, whatsappUrl }: HeaderProps) {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);
  const isEquipoActive = pathname.startsWith("/equipo");

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
              className="transition-colors"
              style={{ color: isActive("/transparencia") ? "#fff" : "rgba(255,255,255,0.85)" }}
            >
              Información Pública
            </Link>
            <Link
              href="/pqrs"
              className="transition-colors"
              style={{ color: isActive("/pqrs") ? "#fff" : "rgba(255,255,255,0.85)" }}
            >
              Peticiones y Solicitudes
            </Link>
            <Link
              href="/participa"
              className="transition-colors"
              style={{ color: isActive("/participa") ? "#fff" : "rgba(255,255,255,0.85)" }}
            >
              Participación Ciudadana
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
        <div className="container-main grid grid-cols-[1fr_auto_1fr] items-center py-4 xl:flex xl:justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center justify-self-center col-start-2 xl:col-start-auto xl:justify-self-auto focus-visible:ring-2 focus-visible:ring-azul-600 focus-visible:ring-offset-2 rounded-lg"
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
          <ul className="hidden xl:flex col-start-1 items-center gap-0.5" role="list">
            {navLinksBeforeEquipo.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={isActive(href) ? "page" : undefined}
                  className={`nav-link font-heading font-semibold text-sm px-2.5 py-2 rounded-lg whitespace-nowrap transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-azul-600 focus-visible:ring-offset-1 ${isActive(href) ? "nav-link-active" : ""}`}
                >
                  {label}
                </Link>
              </li>
            ))}

            {/* Dropdown Equipo — posición 3 */}
            <li className="nav-dropdown-group">
              <button
                className={`nav-dropdown-trigger ${isEquipoActive ? "nav-link-active" : ""}`}
                aria-haspopup="true"
                aria-label="Menú Equipo"
                aria-current={isEquipoActive ? "page" : undefined}
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
                  aria-current={isActive(href) ? "page" : undefined}
                  className={`nav-link font-heading font-semibold text-sm px-2.5 py-2 rounded-lg whitespace-nowrap transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-azul-600 focus-visible:ring-offset-1 ${isActive(href) ? "nav-link-active" : ""}`}
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
          </ul>

          {/* CTA */}
          <a
            href="https://cardiocentro.gomedicaltm.co/portal-pacientes"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden xl:inline-flex col-start-3 justify-self-end items-center gap-2 font-heading font-semibold text-sm text-white rounded-full px-5 py-2.5 whitespace-nowrap hover:opacity-90 focus-visible:ring-2 focus-visible:ring-azul-600 focus-visible:ring-offset-2 transition-all duration-200"
            style={{
              backgroundColor: "var(--color-azul-800)",
              boxShadow: "var(--shadow-button)",
            }}
          >
            Tus resultados
          </a>

          {/* Menú mobile/tablet */}
          <div className="col-start-3 justify-self-end xl:hidden">
            <MobileMenu
              telefono={sedes[0]?.telefono ?? "(+57) 300 912 7565"}
              emailContacto={emailContacto}
              whatsappUrl={whatsappUrl}
            />
          </div>
        </div>
      </nav>
    </header>
  );
}
