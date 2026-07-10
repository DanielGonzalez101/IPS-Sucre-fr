"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { DEBERES_MOCK } from "@/data/calidad.mock";

export default function DeberesPaciente() {
  const [openId, setOpenId] = useState<number>(DEBERES_MOCK[0].id);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
      <div className="lg:col-span-8 lg:order-1 order-2">
        <div
          className="rounded-3xl border p-8 md:p-10"
          style={{ backgroundColor: "#fff", borderColor: "var(--color-gris-100)", boxShadow: "var(--shadow-card)" }}
        >
          {DEBERES_MOCK.map((deber) => {
            const isOpen = openId === deber.id;
            return (
              <div
                key={deber.id}
                className="border-b"
                style={{ borderColor: "var(--color-gris-100)" }}
              >
                <button
                  type="button"
                  onClick={() => setOpenId(isOpen ? -1 : deber.id)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center gap-4 py-5 text-left transition-colors duration-200 rounded-lg px-2 -mx-2"
                  style={{ backgroundColor: "transparent" }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--color-azul-50)")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                >
                  <span
                    className="font-heading font-bold text-lg shrink-0 w-8"
                    style={{ color: "var(--color-azul-900)" }}
                  >
                    {deber.numero}
                  </span>
                  <span
                    className="font-heading text-base md:text-lg flex-1"
                    style={{
                      color: "var(--color-azul-900)",
                      fontWeight: isOpen ? 600 : 500,
                    }}
                  >
                    {deber.titulo}
                  </span>
                  <ChevronDown
                    size={20}
                    aria-hidden="true"
                    className="shrink-0 transition-transform duration-300"
                    style={{ color: "var(--color-gris-400)", transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                  />
                </button>

                <div
                  className="overflow-hidden transition-all duration-300"
                  style={{
                    maxHeight: isOpen ? "480px" : "0px",
                    opacity: isOpen ? 1 : 0,
                  }}
                >
                  <p
                    className="font-body text-sm md:text-base leading-relaxed pb-6 pl-12 pr-2"
                    style={{ color: "var(--color-gris-600)" }}
                  >
                    {deber.descripcion}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="lg:col-span-4 lg:order-2 order-1">
        <div className="lg:sticky lg:top-24">
          <span
            className="inline-flex items-center rounded-full px-4 py-1.5 font-heading font-semibold text-sm mb-4"
            style={{ backgroundColor: "var(--color-azul-50)", color: "var(--color-azul-800)" }}
          >
            + Deberes
          </span>

          <h2
            className="font-heading font-bold leading-tight mb-4"
            style={{ fontSize: "clamp(1.75rem, 3vw, 2.5rem)", color: "var(--color-azul-900)" }}
          >
            Tus deberes como paciente
          </h2>

          <p className="font-body text-base leading-relaxed mb-6" style={{ color: "var(--color-gris-600)" }}>
            Así como garantizamos tus derechos, te invitamos a cumplir estos
            deberes que fortalecen una atención en salud responsable y
            solidaria.
          </p>

          <p
            className="font-heading font-semibold text-sm"
            style={{ color: "var(--color-rojo-500)" }}
          >
            9 deberes del paciente
          </p>
        </div>
      </div>
    </div>
  );
}
