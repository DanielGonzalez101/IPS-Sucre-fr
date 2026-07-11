"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ChevronDown,
  MapPin,
  MessageCircle,
  Phone,
  Mail,
  Clock,
} from "lucide-react";
import type { Sede } from "@/actions/sitio";

interface ContactanosDropdownProps {
  sedes: Sede[];
  emailContacto: string;
  telefono: string;
  whatsappUrl: string;
  horario: string;
}

const CLOSE_DELAY_MS = 150;

export default function ContactanosDropdown({
  sedes,
  emailContacto,
  telefono,
  whatsappUrl,
  horario,
}: ContactanosDropdownProps) {
  const [open, setOpen] = useState(false);
  const closeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLLIElement>(null);

  const clearCloseTimeout = () => {
    if (closeTimeout.current) {
      clearTimeout(closeTimeout.current);
      closeTimeout.current = null;
    }
  };

  const handleMouseEnter = () => {
    clearCloseTimeout();
    setOpen(true);
  };

  const handleMouseLeave = () => {
    clearCloseTimeout();
    closeTimeout.current = setTimeout(() => setOpen(false), CLOSE_DELAY_MS);
  };

  const handleTriggerClick = () => {
    clearCloseTimeout();
    setOpen(true);
  };

  const closeDropdown = () => {
    clearCloseTimeout();
    setOpen(false);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => clearCloseTimeout, []);

  const telHref = `tel:${telefono.replace(/[^\d+]/g, "")}`;

  return (
    <li
      ref={containerRef}
      className="nav-dropdown-group"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        type="button"
        className="nav-dropdown-trigger"
        aria-haspopup="true"
        aria-expanded={open}
        aria-label="Menú Contáctanos"
        onClick={handleTriggerClick}
        style={
          open
            ? { color: "var(--color-azul-800)", backgroundColor: "var(--color-azul-50)" }
            : undefined
        }
      >
        Contáctanos
        <ChevronDown
          size={14}
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>

      {open && (
        <div
          role="menu"
          aria-label="Submenú Contáctanos"
          className="absolute top-[calc(100%+10px)] right-0 z-50 min-w-[600px] md:min-w-[700px] overflow-hidden rounded-2xl border border-white/10 bg-[#1B2B5E]/80 shadow-2xl shadow-[#1B2B5E]/40 backdrop-blur-xl transition-all duration-200 ease-out"
        >
          <div className="grid grid-cols-12 gap-6 p-6">
            {/* Sedes */}
            <div className="col-span-5">
              <p className="mb-3 font-heading text-xs font-medium uppercase tracking-wider text-white/50">
                Nuestras sedes
              </p>
              <ul role="none" className="flex flex-col">
                {sedes.map((sede, index) => (
                  <li
                    key={sede.id}
                    role="none"
                    className={index < sedes.length - 1 ? "border-b border-white/5" : ""}
                  >
                    <div
                      role="menuitem"
                      tabIndex={-1}
                      className="flex items-start gap-2 rounded-xl px-3 py-2 transition hover:bg-white/5"
                    >
                      <MapPin size={16} className="mt-0.5 shrink-0 text-white/70" aria-hidden="true" />
                      <div>
                        <p className="font-heading text-sm font-medium text-white">{sede.ciudad}</p>
                        <p className="text-xs text-white/60">{sede.direccion}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Canales de contacto */}
            <div className="col-span-7">
              <p className="mb-3 font-heading text-xs font-medium uppercase tracking-wider text-white/50">
                Canales de contacto
              </p>
              <ul role="none" className="flex flex-col gap-1">
                <li role="none">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    role="menuitem"
                    onClick={closeDropdown}
                    className="flex items-center gap-3 rounded-xl px-3 py-2 transition hover:bg-white/5"
                  >
                    <MessageCircle size={18} className="shrink-0 text-white/70" aria-hidden="true" />
                    <span className="flex-1">
                      <span className="block text-sm text-white/80">WhatsApp</span>
                      <span className="block text-xs text-white/50">{telefono}</span>
                    </span>
                    <span className="rounded-full bg-green-500/20 px-2.5 py-1 text-xs font-medium text-green-300">
                      En línea
                    </span>
                  </a>
                </li>
                <li role="none">
                  <a
                    href={telHref}
                    role="menuitem"
                    onClick={closeDropdown}
                    className="flex items-center gap-3 rounded-xl px-3 py-2 transition hover:bg-white/5"
                  >
                    <Phone size={18} className="shrink-0 text-white/70" aria-hidden="true" />
                    <span>
                      <span className="block text-sm text-white/80">Teléfono</span>
                      <span className="block text-xs text-white/50">{telefono}</span>
                    </span>
                  </a>
                </li>
                <li role="none">
                  <a
                    href={`mailto:${emailContacto}`}
                    role="menuitem"
                    onClick={closeDropdown}
                    className="flex items-center gap-3 rounded-xl px-3 py-2 transition hover:bg-white/5"
                  >
                    <Mail size={18} className="shrink-0 text-white/70" aria-hidden="true" />
                    <span>
                      <span className="block text-sm text-white/80">Email</span>
                      <span className="block text-xs text-white/50">{emailContacto}</span>
                    </span>
                  </a>
                </li>
                <li role="none">
                  <div
                    role="menuitem"
                    tabIndex={-1}
                    className="flex items-center gap-3 rounded-xl px-3 py-2 transition hover:bg-white/5"
                  >
                    <Clock size={18} className="shrink-0 text-white/70" aria-hidden="true" />
                    <span>
                      <span className="block text-sm text-white/80">Horario</span>
                      <span className="block whitespace-pre-line text-xs text-white/50">{horario}</span>
                    </span>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* CTA */}
          <div className="flex items-center justify-between gap-4 rounded-b-2xl border-t border-white/10 bg-white/5 px-6 py-4">
            <p className="text-xs text-white/60">
              ¿Prefieres escribirnos?{" "}
              <Link
                href="/contacto"
                onClick={closeDropdown}
                className="font-heading text-sm font-medium hover:underline"
                style={{ color: "var(--color-rojo-400)" }}
              >
                Ir al formulario →
              </Link>
            </p>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={closeDropdown}
              className="shrink-0 rounded-full bg-[var(--color-rojo-500)] px-4 py-2 font-heading text-sm font-semibold text-white transition-colors hover:bg-[var(--color-rojo-600)]"
            >
              Agenda tu cita
            </a>
          </div>
        </div>
      )}
    </li>
  );
}
