"use client";

import { useState, useTransition } from "react";
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { updatePqrsdStatus, type PqrsdStatus } from "@/actions/pqrsd-admin";

const STATUS_OPTIONS: { value: PqrsdStatus; label: string }[] = [
  { value: "recibido",   label: "Recibido"    },
  { value: "en_revision", label: "En revisión" },
  { value: "en_tramite",  label: "En trámite"  },
  { value: "respondido", label: "Respondido"  },
  { value: "cerrado",    label: "Cerrado"     },
];

interface Props {
  id: string;
  currentStatus: PqrsdStatus;
  currentNotes: string | null;
  currentResponse: string | null;
}

export default function PqrsdResponseForm({
  id,
  currentStatus,
  currentNotes,
  currentResponse,
}: Props) {
  const [status, setStatus]     = useState<PqrsdStatus>(currentStatus);
  const [notes, setNotes]       = useState(currentNotes ?? "");
  const [response, setResponse] = useState(currentResponse ?? "");
  const [result, setResult]     = useState<"ok" | "error" | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setResult(null);
    setErrorMsg(null);
    startTransition(async () => {
      const res = await updatePqrsdStatus(id, status, notes, response);
      if (res.error) {
        setResult("error");
        setErrorMsg(res.error);
      } else {
        setResult("ok");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Estado */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
          Estado de la solicitud
        </label>
        <div className="flex flex-wrap gap-2">
          {STATUS_OPTIONS.map((opt) => {
            const selected = status === opt.value;
            const colors: Record<PqrsdStatus, { bg: string; border: string; text: string }> = {
              recibido:    { bg: "#EFF6FF", border: "#93C5FD", text: "#1D4ED8" },
              en_revision: { bg: "#FFFBEB", border: "#FCD34D", text: "#92400E" },
              en_tramite:  { bg: "#FFF7ED", border: "#FDBA74", text: "#9A3412" },
              respondido:  { bg: "#ECFDF5", border: "#6EE7B7", text: "#065F46" },
              cerrado:     { bg: "#F9FAFB", border: "#D1D5DB", text: "#374151" },
            };
            const c = colors[opt.value];
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => setStatus(opt.value)}
                className="px-4 py-1.5 rounded-full text-sm font-semibold border-2 transition-all duration-150 cursor-pointer"
                style={{
                  backgroundColor: selected ? c.bg : "#fff",
                  borderColor: selected ? c.border : "#E5E7EB",
                  color: selected ? c.text : "#9CA3AF",
                }}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Respuesta al ciudadano */}
      <div>
        <label
          htmlFor="admin-response"
          className="block text-sm font-semibold text-gray-700 mb-1.5"
        >
          Respuesta al ciudadano
          <span className="font-normal text-gray-400 ml-1">(visible para el solicitante)</span>
        </label>
        <textarea
          id="admin-response"
          value={response}
          onChange={(e) => setResponse(e.target.value)}
          rows={5}
          placeholder="Escriba la respuesta oficial a esta solicitud…"
          className="w-full px-4 py-3 text-sm rounded-xl border border-gray-200 bg-white resize-none focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all"
          style={{ color: "#1F2937" }}
        />
      </div>

      {/* Notas internas */}
      <div>
        <label
          htmlFor="admin-notes"
          className="block text-sm font-semibold text-gray-700 mb-1.5"
        >
          Notas internas
          <span className="font-normal text-gray-400 ml-1">(solo para el equipo administrativo)</span>
        </label>
        <textarea
          id="admin-notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          placeholder="Notas de gestión interna, seguimiento, observaciones…"
          className="w-full px-4 py-3 text-sm rounded-xl border border-gray-200 bg-white resize-none focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all"
          style={{ color: "#1F2937" }}
        />
      </div>

      {/* Feedback */}
      {result === "ok" && (
        <div className="flex items-center gap-2 text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3">
          <CheckCircle size={16} />
          Cambios guardados correctamente.
        </div>
      )}
      {result === "error" && (
        <div className="flex flex-col gap-1 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          <span className="flex items-center gap-2">
            <AlertCircle size={16} />
            Error al guardar. Intente nuevamente.
          </span>
          {errorMsg && (
            <span className="text-xs text-red-400 font-mono">{errorMsg}</span>
          )}
        </div>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-150 disabled:opacity-60 cursor-pointer"
        style={{ backgroundColor: "var(--color-azul-800)" }}
      >
        {isPending && <Loader2 size={15} className="animate-spin" />}
        {isPending ? "Guardando…" : "Guardar cambios"}
      </button>
    </form>
  );
}
