"use client";

import { useState } from "react";
import DerechosPaciente from "./DerechosPaciente";
import DeberesPaciente from "./DeberesPaciente";

type Tab = "derechos" | "deberes";

export default function CalidadTabs() {
  const [activeTab, setActiveTab] = useState<Tab>("derechos");

  return (
    <section className="py-16 md:py-24" aria-labelledby="calidad-tabs-title">
      <h2 id="calidad-tabs-title" className="sr-only">
        Derechos y deberes del paciente
      </h2>

      <div className="container-main">
        <div
          className="flex items-center gap-8 border-b mb-12"
          style={{ borderColor: "var(--color-gris-100)" }}
          role="tablist"
          aria-label="Derechos y deberes del paciente"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "derechos"}
            onClick={() => setActiveTab("derechos")}
            className="font-heading font-semibold text-base md:text-lg pb-4 -mb-px border-b-2 transition-colors duration-200"
            style={{
              borderColor: activeTab === "derechos" ? "var(--color-rojo-500)" : "transparent",
              color: activeTab === "derechos" ? "var(--color-azul-900)" : "var(--color-gris-400)",
            }}
          >
            Derechos del paciente
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "deberes"}
            onClick={() => setActiveTab("deberes")}
            className="font-heading font-semibold text-base md:text-lg pb-4 -mb-px border-b-2 transition-colors duration-200"
            style={{
              borderColor: activeTab === "deberes" ? "var(--color-rojo-500)" : "transparent",
              color: activeTab === "deberes" ? "var(--color-azul-900)" : "var(--color-gris-400)",
            }}
          >
            Deberes del paciente
          </button>
        </div>

        <div key={activeTab}>
          {activeTab === "derechos" ? <DerechosPaciente /> : <DeberesPaciente />}
        </div>
      </div>
    </section>
  );
}
