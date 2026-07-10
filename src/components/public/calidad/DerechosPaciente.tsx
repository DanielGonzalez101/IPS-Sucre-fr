"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { DERECHOS_MOCK } from "@/data/calidad.mock";

export default function DerechosPaciente() {
  const [openId, setOpenId] = useState<number>(DERECHOS_MOCK[0].id);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
      <div className="lg:col-span-4">
        <div className="lg:sticky lg:top-24">
          <span
            className="inline-flex items-center rounded-full px-4 py-1.5 font-heading font-semibold text-sm mb-4"
            style={{ backgroundColor: "var(--color-azul-50)", color: "var(--color-azul-800)" }}
          >
            + Derechos
          </span>

          <h2
            className="font-heading font-bold leading-tight mb-4"
            style={{ fontSize: "clamp(1.75rem, 3vw, 2.5rem)", color: "var(--color-azul-900)" }}
          >
            Tus derechos como paciente
          </h2>

          <p className="font-body text-base leading-relaxed mb-6" style={{ color: "var(--color-gris-600)" }}>
            En IPS Cardiocentro Pediátrico de Sucre garantizamos el respeto
            pleno de tus derechos como paciente, conforme a la normativa
            vigente en salud.
          </p>

          <p
            className="font-heading font-semibold text-sm mb-6"
            style={{ color: "var(--color-rojo-500)" }}
          >
            17 derechos garantizados
          </p>

          <Link
            href="/pqrs"
            className="inline-flex items-center gap-2 font-heading font-semibold text-sm text-white rounded-full px-6 py-3 transition-all duration-200 hover:opacity-90 active:scale-95 focus-visible:ring-2 focus-visible:ring-offset-2"
            style={{
              backgroundColor: "var(--color-rojo-500)",
              boxShadow: "0 4px 16px 0 rgba(238,53,56,0.45)",
            }}
          >
            ¿Tienes una queja? →
          </Link>
        </div>
      </div>

      <div className="lg:col-span-8">
        <div className="rounded-3xl overflow-hidden" style={{ backgroundColor: "var(--color-azul-900)" }}>
          <div className="p-8 md:p-10">
            {DERECHOS_MOCK.map((derecho) => {
              const isOpen = openId === derecho.id;
              return (
                <div
                  key={derecho.id}
                  className="border-b"
                  style={{ borderColor: "rgba(255,255,255,0.1)" }}
                >
                  <button
                    type="button"
                    onClick={() => setOpenId(isOpen ? -1 : derecho.id)}
                    aria-expanded={isOpen}
                    className="w-full flex items-center gap-4 py-5 text-left transition-colors duration-200 hover:bg-white/5 rounded-lg px-2 -mx-2"
                  >
                    <span
                      className="font-heading font-bold text-lg shrink-0 w-8"
                      style={{ color: isOpen ? "var(--color-rojo-400)" : "rgba(255,255,255,0.4)" }}
                    >
                      {derecho.numero}
                    </span>
                    <span className="font-heading font-semibold text-base md:text-lg text-white flex-1">
                      {derecho.titulo}
                    </span>
                    <ChevronDown
                      size={20}
                      aria-hidden="true"
                      className="shrink-0 text-white/60 transition-transform duration-300"
                      style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
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
                      style={{ color: "rgba(255,255,255,0.75)" }}
                    >
                      {derecho.descripcion}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="rounded-b-3xl px-8 md:px-10 py-6 flex flex-col sm:flex-row items-center justify-between gap-4" style={{ backgroundColor: "var(--color-rojo-500)" }}>
            <p className="font-heading font-semibold text-white text-center sm:text-left">
              ¿Tienes una queja o sugerencia?
            </p>
            <Link
              href="/pqrs"
              className="inline-flex items-center gap-2 font-heading font-semibold text-sm rounded-full px-6 py-3 bg-white transition-all duration-200 hover:opacity-90 active:scale-95 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2"
              style={{ color: "var(--color-rojo-500)" }}
            >
              Ir a PQRS →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
