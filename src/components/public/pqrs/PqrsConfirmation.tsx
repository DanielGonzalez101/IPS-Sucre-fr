"use client";

import { CheckCircle, Copy, FileText } from "lucide-react";
import { useState } from "react";

interface PqrsConfirmationProps {
  trackingCode: string;
  email: string;
  onNew: () => void;
}

export default function PqrsConfirmation({
  trackingCode,
  email,
  onNew,
}: PqrsConfirmationProps) {
  const [copied, setCopied] = useState(false);

  function copyCode() {
    navigator.clipboard.writeText(trackingCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div
      className="text-center py-12 px-6 max-w-lg mx-auto"
      role="alert"
      aria-live="polite"
    >
      <div
        className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
        style={{ backgroundColor: "var(--color-azul-50)" }}
        aria-hidden="true"
      >
        <CheckCircle
          size={40}
          style={{ color: "var(--color-azul-800)" }}
        />
      </div>

      <h2
        className="font-bold text-2xl md:text-3xl mb-3"
        style={{ color: "var(--color-azul-900)" }}
      >
        Solicitud radicada exitosamente
      </h2>
      <p className="text-sm mb-8" style={{ color: "var(--color-gris-500)" }}>
        Hemos recibido su solicitud. A continuación encontrará su número de
        radicado.
      </p>

      <div
        className="rounded-2xl p-6 mb-6 text-left"
        style={{
          backgroundColor: "var(--color-azul-50)",
          border: "1.5px solid var(--color-azul-100)",
        }}
      >
        <p
          className="text-xs font-semibold uppercase tracking-wide mb-2"
          style={{ color: "var(--color-azul-600)" }}
        >
          Número de radicado
        </p>
        <div className="flex items-center justify-between gap-3">
          <span
            className="font-bold text-xl tracking-widest"
            style={{ color: "var(--color-azul-900)" }}
          >
            {trackingCode}
          </span>
          <button
            onClick={copyCode}
            className="flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 rounded-full transition-all duration-200 cursor-pointer"
            style={{
              backgroundColor: copied
                ? "var(--color-azul-800)"
                : "var(--color-azul-100)",
              color: copied ? "#fff" : "var(--color-azul-800)",
            }}
            aria-label="Copiar número de radicado"
          >
            <Copy size={14} aria-hidden="true" />
            {copied ? "¡Copiado!" : "Copiar"}
          </button>
        </div>
      </div>

      <div
        className="rounded-xl p-4 mb-8 text-sm text-left"
        style={{
          backgroundColor: "#fff",
          border: "1px solid var(--color-gris-100)",
        }}
      >
        <div className="flex gap-3">
          <FileText
            size={18}
            className="flex-shrink-0 mt-0.5"
            style={{ color: "var(--color-azul-600)" }}
            aria-hidden="true"
          />
          <div style={{ color: "var(--color-gris-700)" }}>
            <p className="font-semibold mb-1">Próximos pasos</p>
            <ul className="space-y-1 text-sm" style={{ color: "var(--color-gris-500)" }}>
              <li>• Guarde su número de radicado para consultas futuras.</li>
              <li>
                • Tiene derecho a respuesta en un plazo de{" "}
                <strong>15 días hábiles</strong>.
              </li>
              {email && (
                <li>
                  • La respuesta se remitirá a{" "}
                  <strong>{email}</strong>.
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>

      <button
        onClick={onNew}
        className="inline-flex items-center justify-center font-semibold text-sm rounded-full px-7 py-3.5 transition-all duration-200 hover:opacity-90 active:scale-95 focus-visible:ring-2 focus-visible:ring-offset-2 cursor-pointer"
        style={{
          backgroundColor: "var(--color-rojo-500)",
          color: "#fff",
          boxShadow: "0 4px 16px 0 rgba(238,53,56,0.30)",
        }}
      >
        Radicar otra solicitud
      </button>
    </div>
  );
}
