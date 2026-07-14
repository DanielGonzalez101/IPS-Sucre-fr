"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ChevronDown, Cpu, Mail, Phone, Users, X } from "lucide-react";
import type { Sede } from "@/actions/sitio";

const navLinks = [
  { href: "/", label: "Inicio" },
  { href: "/quienes-somos", label: "Quiénes somos" },
  { href: "/servicios", label: "Servicios" },
  { href: "/multimedia", label: "Multimedia" },
  { href: "/calidad", label: "Calidad" },
  { href: "/blog", label: "Blog" },
  { href: "/contacto", label: "Contáctanos" },
];

const equipoLinks = [
  { href: "/equipo", label: "Equipo Humano", icon: Users },
  { href: "/equipo/tecnologico", label: "Equipo Tecnológico", icon: Cpu },
];

const institucionalLinks = [
  { href: "/transparencia", label: "Información Pública" },
  { href: "/pqrs", label: "Peticiones y Solicitudes" },
  { href: "/participa", label: "Participación Ciudadana" },
];

interface MobileMenuProps {
  telefono: string;
  emailContacto: string;
  whatsappUrl: string;
}

export default function MobileMenu({ telefono, emailContacto, whatsappUrl }: MobileMenuProps) {
  const [open, setOpen] = useState(false);
  const [equipoOpen, setEquipoOpen] = useState(false);
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);
  const isEquipoActive = pathname.startsWith("/equipo");

  useEffect(() => {
    if (!open) return;

    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const close = () => {
    setOpen(false);
    setEquipoOpen(false);
  };

  return (
    <>
      <button
        type="button"
        className="xl:hidden p-2 rounded-lg focus-visible:ring-2 focus-visible:ring-azul-600"
        aria-label={open ? "Cerrar menú de navegación" : "Abrir menú de navegación"}
        aria-expanded={open}
        aria-controls="mobile-menu-panel"
        onClick={() => setOpen((v) => !v)}
        style={{ color: "var(--color-azul-900)" }}
      >
        {open ? (
          <X size={22} aria-hidden="true" />
        ) : (
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
            <path
              d="M3 6h16M3 11h16M3 16h16"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        )}
      </button>

      {open && (
        <div className="xl:hidden fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Menú de navegación">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={close}
            aria-hidden="true"
          />
          <div
            id="mobile-menu-panel"
            className="absolute right-0 top-0 h-full w-full max-w-sm overflow-y-auto bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: "var(--color-gris-100)" }}>
              <Link href="/" onClick={close} className="flex items-center focus-visible:ring-2 focus-visible:ring-azul-600 focus-visible:ring-offset-2 rounded-lg">
                <Image
                  src="/logo.png"
                  alt="Cardiocentro Pediátrico de Sucre"
                  width={160}
                  height={48}
                  className="h-10 w-auto object-contain"
                />
              </Link>
              <button
                type="button"
                onClick={close}
                aria-label="Cerrar menú de navegación"
                className="p-2 rounded-lg focus-visible:ring-2 focus-visible:ring-azul-600"
                style={{ color: "var(--color-azul-900)" }}
              >
                <X size={20} aria-hidden="true" />
              </button>
            </div>

            <nav className="px-3 py-4" aria-label="Navegación principal móvil">
              <ul role="list" className="flex flex-col">
                {navLinks.map(({ href, label }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      onClick={close}
                      aria-current={isActive(href) ? "page" : undefined}
                      className={`nav-link block font-heading font-semibold text-base px-3 py-3 rounded-lg ${isActive(href) ? "nav-link-active" : ""}`}
                    >
                      {label}
                    </Link>
                  </li>
                ))}

                <li>
                  <button
                    type="button"
                    className={`nav-link flex w-full items-center justify-between font-heading font-semibold text-base px-3 py-3 rounded-lg ${isEquipoActive ? "nav-link-active" : ""}`}
                    aria-expanded={equipoOpen}
                    aria-controls="mobile-equipo-panel"
                    aria-current={isEquipoActive ? "page" : undefined}
                    onClick={() => setEquipoOpen((v) => !v)}
                  >
                    Equipo
                    <ChevronDown
                      size={16}
                      aria-hidden="true"
                      className={`transition-transform duration-200 ${equipoOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                  {equipoOpen && (
                    <ul id="mobile-equipo-panel" role="list" className="pl-3 pb-1">
                      {equipoLinks.map(({ href, label, icon: Icon }) => (
                        <li key={href}>
                          <Link
                            href={href}
                            onClick={close}
                            aria-current={isActive(href) ? "page" : undefined}
                            className="flex items-center gap-3 font-body text-sm px-3 py-2.5 rounded-lg"
                            style={{ color: isActive(href) ? "var(--color-azul-800)" : "var(--color-gris-600)" }}
                          >
                            <Icon size={16} aria-hidden="true" style={{ color: "var(--color-azul-700)" }} />
                            {label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              </ul>
            </nav>

            <div className="px-3 py-4 border-t" style={{ borderColor: "var(--color-gris-100)" }}>
              <p
                className="px-3 mb-2 font-heading text-xs font-semibold uppercase tracking-wider"
                style={{ color: "var(--color-gris-400)" }}
              >
                Institucional
              </p>
              <ul role="list" className="flex flex-col">
                {institucionalLinks.map(({ href, label }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      onClick={close}
                      aria-current={isActive(href) ? "page" : undefined}
                      className={`nav-link block font-body text-sm px-3 py-2.5 rounded-lg ${isActive(href) ? "nav-link-active" : ""}`}
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="px-3 py-4 border-t" style={{ borderColor: "var(--color-gris-100)" }}>
              <p
                className="px-3 mb-2 font-heading text-xs font-semibold uppercase tracking-wider"
                style={{ color: "var(--color-gris-400)" }}
              >
                Contacto
              </p>
              <a
                href={`tel:${telefono.replace(/[^\d+]/g, "")}`}
                className="nav-link flex items-center gap-3 font-body text-sm px-3 py-2.5 rounded-lg"
              >
                <Phone size={16} aria-hidden="true" style={{ color: "var(--color-azul-700)" }} />
                {telefono}
              </a>
              <a
                href={`mailto:${emailContacto}`}
                className="nav-link flex items-center gap-3 font-body text-sm px-3 py-2.5 rounded-lg"
              >
                <Mail size={16} aria-hidden="true" style={{ color: "var(--color-azul-700)" }} />
                {emailContacto}
              </a>
            </div>

            <div className="px-5 py-5">
              <a
                href="https://cardiocentro.gomedicaltm.co/portal-pacientes"
                target="_blank"
                rel="noopener noreferrer"
                onClick={close}
                className="flex items-center justify-center font-heading font-semibold text-sm text-white rounded-full px-5 py-3 w-full"
                style={{
                  backgroundColor: "var(--color-azul-800)",
                  boxShadow: "var(--shadow-button)",
                }}
              >
                Tus resultados
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
