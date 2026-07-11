"use client";

import { useState } from "react";
import {
  Search,
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
  Calendar,
  AlertTriangle,
} from "lucide-react";

interface PqrsResult {
  tracking_code: string;
  type: string;
  type_label: string;
  status: string;
  status_label: string;
  subject: string;
  created_at: string;
  response_deadline: string | null;
  responded_at: string | null;
  is_overdue: boolean;
  response_mode: string;
  admin_response: string | null;
}

const STATUS_CONFIG: Record<
  string,
  { icon: React.ElementType; bg: string; text: string; border: string }
> = {
  recibido: {
    icon: Clock,
    bg: "rgba(26,92,184,0.08)",
    text: "var(--color-azul-800)",
    border: "var(--color-azul-100)",
  },
  en_proceso: {
    icon: Search,
    bg: "rgba(245,158,11,0.10)",
    text: "#92400e",
    border: "#fde68a",
  },
  respondido: {
    icon: CheckCircle,
    bg: "rgba(16,185,129,0.10)",
    text: "#065f46",
    border: "#a7f3d0",
  },
  cerrado: {
    icon: FileText,
    bg: "rgba(107,114,128,0.10)",
    text: "var(--color-gris-700)",
    border: "var(--color-gris-100)",
  },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("es-CO", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function daysLeft(deadline: string): number {
  const diff = new Date(deadline).getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function inputClass(hasError: boolean) {
  return [
    "w-full px-4 py-3 rounded-xl border text-sm bg-white transition-all duration-200",
    "focus:outline-none focus:ring-2",
    hasError
      ? "border-[#EE3538] focus:ring-[#EE3538]/30"
      : "border-gray-200 focus:ring-[var(--color-azul-600)]/30 focus:border-[var(--color-azul-600)]",
  ].join(" ");
}

export default function PqrsConsulta() {
  const [codigo, setCodigo] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<PqrsResult | null>(null);

  async function handleConsulta(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setResult(null);

    if (!codigo.trim() || !email.trim()) {
      setError("Complete los dos campos para consultar.");
      return;
    }

    setLoading(true);
    try {
      const params = new URLSearchParams({
        codigo: codigo.trim(),
        email: email.trim(),
      });
      const res = await fetch(`/api/pqrsd/consulta?${params}`);
      const json = await res.json();

      if (!res.ok) {
        setError(json.error ?? "No se pudo realizar la consulta.");
        return;
      }

      setResult(json);
    } catch {
      setError("Error de conexión. Verifique su internet e intente nuevamente.");
    } finally {
      setLoading(false);
    }
  }

  const statusCfg = result ? (STATUS_CONFIG[result.status] ?? STATUS_CONFIG.cerrado) : null;

  return (
    <div>
      {/* Formulario de consulta */}
      <form onSubmit={handleConsulta} noValidate aria-label="Consulta de estado PQRSD">
        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label
              htmlFor="consulta-codigo"
              className="block text-sm font-semibold mb-1.5"
              style={{ color: "var(--color-gris-700)" }}
            >
              Número de radicado{" "}
              <span style={{ color: "var(--color-rojo-500)" }} aria-hidden="true">*</span>
            </label>
            <input
              id="consulta-codigo"
              type="text"
              value={codigo}
              onChange={(e) => {
                setCodigo(e.target.value.toUpperCase());
                setError("");
              }}
              className={inputClass(!!error)}
              placeholder="PQRSD-20260710-0001"
              autoComplete="off"
              spellCheck={false}
            />
          </div>

          <div>
            <label
              htmlFor="consulta-email"
              className="block text-sm font-semibold mb-1.5"
              style={{ color: "var(--color-gris-700)" }}
            >
              Correo electrónico registrado{" "}
              <span style={{ color: "var(--color-rojo-500)" }} aria-hidden="true">*</span>
            </label>
            <input
              id="consulta-email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              className={inputClass(!!error)}
              placeholder="ejemplo@correo.com"
              autoComplete="email"
            />
          </div>
        </div>

        {error && (
          <p
            className="flex items-center gap-1.5 mb-4 text-sm"
            role="alert"
            style={{ color: "var(--color-rojo-500)" }}
          >
            <AlertCircle size={14} aria-hidden="true" />
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 font-semibold text-sm rounded-full px-7 py-3 transition-all duration-200 hover:opacity-90 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          style={{
            backgroundColor: "var(--color-azul-800)",
            color: "#fff",
          }}
        >
          <Search size={16} aria-hidden="true" />
          {loading ? "Consultando…" : "Consultar estado"}
        </button>
      </form>

      {/* Resultado */}
      {result && statusCfg && (
        <div
          className="mt-8 rounded-2xl overflow-hidden"
          style={{ border: "1.5px solid var(--color-gris-100)" }}
          role="region"
          aria-label="Resultado de la consulta"
        >
          {/* Encabezado de estado */}
          <div
            className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            style={{ backgroundColor: statusCfg.bg, borderBottom: `1.5px solid ${statusCfg.border}` }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: statusCfg.text + "20" }}
                aria-hidden="true"
              >
                <statusCfg.icon size={20} style={{ color: statusCfg.text }} />
              </div>
              <div>
                <p
                  className="font-bold text-base"
                  style={{ color: statusCfg.text }}
                >
                  {result.status_label}
                </p>
                <p className="text-xs" style={{ color: "var(--color-gris-500)" }}>
                  Estado actual de su solicitud
                </p>
              </div>
            </div>

            {result.is_overdue && result.status !== "respondido" && result.status !== "cerrado" && (
              <span
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full"
                style={{
                  backgroundColor: "rgba(238,53,56,0.10)",
                  color: "var(--color-rojo-500)",
                }}
              >
                <AlertTriangle size={12} aria-hidden="true" />
                Plazo vencido
              </span>
            )}
          </div>

          {/* Datos de la solicitud */}
          <div className="p-5 bg-white">
            <div className="grid sm:grid-cols-2 gap-5 mb-5">
              <DataRow label="Radicado" value={result.tracking_code} mono />
              <DataRow label="Tipo" value={result.type_label} />
              <DataRow
                label="Asunto"
                value={result.subject}
                className="sm:col-span-2"
              />
              <DataRow
                label="Fecha de radicación"
                value={formatDate(result.created_at)}
                icon={<Calendar size={14} aria-hidden="true" />}
              />
              {result.response_deadline && (
                <DataRow
                  label="Fecha límite de respuesta"
                  value={
                    result.status === "respondido" || result.status === "cerrado"
                      ? formatDate(result.response_deadline)
                      : `${formatDate(result.response_deadline)} (${
                          daysLeft(result.response_deadline) > 0
                            ? `${daysLeft(result.response_deadline)} días hábiles restantes`
                            : "plazo vencido"
                        })`
                  }
                  icon={<Clock size={14} aria-hidden="true" />}
                />
              )}
              {result.responded_at && (
                <DataRow
                  label="Fecha de respuesta"
                  value={formatDate(result.responded_at)}
                  icon={<CheckCircle size={14} aria-hidden="true" />}
                />
              )}
            </div>

            {/* Respuesta del admin */}
            {result.admin_response && (
              <div
                className="p-4 rounded-xl"
                style={{
                  backgroundColor: "var(--color-azul-50)",
                  border: "1.5px solid var(--color-azul-100)",
                }}
              >
                <p
                  className="text-xs font-semibold uppercase tracking-wide mb-2"
                  style={{ color: "var(--color-azul-600)" }}
                >
                  Respuesta de la entidad
                </p>
                <p className="text-sm whitespace-pre-wrap" style={{ color: "var(--color-gris-700)" }}>
                  {result.admin_response}
                </p>
              </div>
            )}

            {/* Si está en proceso, mensaje de espera */}
            {(result.status === "recibido" || result.status === "en_proceso") && (
              <p
                className="text-sm mt-4"
                style={{ color: "var(--color-gris-500)" }}
              >
                Su solicitud está siendo gestionada. Recibirá respuesta a través
                de{" "}
                <strong>
                  {result.response_mode === "email"
                    ? "su correo electrónico"
                    : "su dirección de correspondencia"}
                </strong>{" "}
                antes de la fecha límite.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function DataRow({
  label,
  value,
  mono,
  icon,
  className,
}: {
  label: string;
  value: string;
  mono?: boolean;
  icon?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <p
        className="text-xs font-semibold mb-0.5"
        style={{ color: "var(--color-gris-500)" }}
      >
        {label}
      </p>
      <p
        className={`text-sm flex items-center gap-1.5 ${mono ? "font-mono tracking-wide font-bold" : "font-medium"}`}
        style={{ color: "var(--color-gris-800)" }}
      >
        {icon}
        {value}
      </p>
    </div>
  );
}
