"use client";

import { useState, useTransition } from "react";
import { Trash2, Users, Mail, Phone, FileText, MessageSquare } from "lucide-react";
import { deleteInscripcion } from "@/actions/participa-admin";

interface Inscripcion {
  id: string;
  full_name: string;
  doc_type: string;
  doc_number: string;
  email: string;
  phone: string;
  espacio_id: string;
  message: string | null;
  created_at: string;
}

interface Props {
  inscripciones: Inscripcion[];
}

export function ParticipaInscripcionesManager({ inscripciones: initial }: Props) {
  const [items, setItems] = useState(initial);
  const [filtro, setFiltro] = useState("");

  const filtradas = filtro
    ? items.filter(
        (i) =>
          i.full_name.toLowerCase().includes(filtro.toLowerCase()) ||
          i.email.toLowerCase().includes(filtro.toLowerCase()) ||
          i.espacio_id.toLowerCase().includes(filtro.toLowerCase())
      )
    : items;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <input
          type="text"
          placeholder="Buscar por nombre, correo o espacio…"
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-azul-600"
        />
        <span className="text-sm text-gray-500 shrink-0">
          {filtradas.length} inscripción{filtradas.length !== 1 ? "es" : ""}
        </span>
      </div>

      {filtradas.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 px-5 py-12 text-center">
          <Users size={32} className="mx-auto mb-2 text-gray-300" />
          <p className="text-sm text-gray-400">
            {filtro ? "Sin resultados para esa búsqueda." : "Aún no hay inscripciones."}
          </p>
        </div>
      ) : (
        <ul className="space-y-2">
          {filtradas.map((ins) => (
            <InscripcionFila
              key={ins.id}
              ins={ins}
              onDeleted={() => setItems((prev) => prev.filter((i) => i.id !== ins.id))}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

function InscripcionFila({
  ins,
  onDeleted,
}: {
  ins: Inscripcion;
  onDeleted: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isPending, startTransition] = useTransition();

  const fecha = new Date(ins.created_at).toLocaleDateString("es-CO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <li className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Cabecera siempre visible */}
      <div
        className="flex items-center gap-3 px-4 py-3 cursor-pointer select-none"
        onClick={() => setExpanded((v) => !v)}
      >
        <div
          className="shrink-0 w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm"
          style={{ backgroundColor: "var(--color-azul-50)", color: "var(--color-azul-700)" }}
        >
          {ins.full_name.charAt(0).toUpperCase()}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-800 truncate">{ins.full_name}</p>
          <p className="text-xs text-gray-500 truncate">
            {ins.espacio_id} · {fecha}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {confirmDelete ? (
            <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
              <span className="text-xs text-red-600 font-medium">¿Eliminar?</span>
              <button
                onClick={() =>
                  startTransition(async () => {
                    const r = await deleteInscripcion(ins.id);
                    if (!r.error) onDeleted();
                  })
                }
                disabled={isPending}
                className="text-xs font-semibold px-1.5 py-0.5 rounded"
                style={{ backgroundColor: "#FEE2E2", color: "#DC2626" }}
              >
                Sí
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                className="text-xs px-1.5 py-0.5 rounded"
                style={{ backgroundColor: "#F3F4F6", color: "#6B7280" }}
              >
                No
              </button>
            </div>
          ) : (
            <button
              onClick={(e) => { e.stopPropagation(); setConfirmDelete(true); }}
              disabled={isPending}
              className="p-1.5 rounded-lg transition-colors"
              style={{ color: "#EF4444" }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#FEE2E2")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
              title="Eliminar inscripción"
            >
              <Trash2 size={15} />
            </button>
          )}
        </div>
      </div>

      {/* Detalle expandible */}
      {expanded && (
        <div
          className="px-4 pb-4 pt-1 grid grid-cols-1 sm:grid-cols-2 gap-3 border-t border-gray-100"
          style={{ backgroundColor: "#FAFAFA" }}
        >
          <Detail icon={FileText} label="Documento" value={`${ins.doc_type} ${ins.doc_number}`} />
          <Detail icon={Mail} label="Correo" value={ins.email} />
          <Detail icon={Phone} label="Teléfono" value={ins.phone} />
          <Detail icon={Users} label="Espacio" value={ins.espacio_id} />
          {ins.message && (
            <div className="sm:col-span-2">
              <Detail icon={MessageSquare} label="Mensaje" value={ins.message} />
            </div>
          )}
        </div>
      )}
    </li>
  );
}

function Detail({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2">
      <Icon size={14} className="mt-0.5 shrink-0 text-gray-400" />
      <div>
        <p className="text-xs text-gray-400">{label}</p>
        <p className="text-sm text-gray-700">{value}</p>
      </div>
    </div>
  );
}
