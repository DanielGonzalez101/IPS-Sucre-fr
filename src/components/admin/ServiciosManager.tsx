"use client";

import { useState, useTransition } from "react";
import { ChevronRight, Trash2, ChevronUp, ChevronDown } from "lucide-react";
import {
  createServicio,
  updateServicio,
  deleteServicio,
  reorderServicios,
  getServicios,
} from "@/actions/servicios";

const ICONOS_DISPONIBLES = [
  "Stethoscope",
  "Heartbeat",
  "Pulse",
  "Timer",
  "Gauge",
  "Waves",
  "DropHalf",
  "FirstAid",
  "Heart",
  "Brain",
  "Bone",
  "Eye",
  "Ear",
  "Tooth",
  "Baby",
  "Syringe",
  "Pill",
  "Bandaids",
  "Flask",
  "Microscope",
  "Activity",
  "Thermometer",
];

interface Servicio {
  id: string;
  titulo: string;
  categoria: string;
  descripcion: string;
  icono: string;
  href_anchor: string;
  orden: number;
  activo: boolean;
}

interface Props {
  servicios: Servicio[];
}

export function ServiciosManager({ servicios: initialServicios }: Props) {
  const [servicios, setServicios] = useState(initialServicios);
  const [showNew, setShowNew] = useState(false);
  const [, startTransition] = useTransition();

  async function refresh() {
    const { data } = await getServicios();
    if (data) setServicios(data as Servicio[]);
  }

  function moveUp(index: number) {
    if (index === 0) return;
    const next = [...servicios];
    const [a, b] = [next[index - 1], next[index]];
    next[index - 1] = { ...b, orden: a.orden };
    next[index] = { ...a, orden: b.orden };
    setServicios(next);
    startTransition(async () => {
      await reorderServicios(next.map((s) => ({ id: s.id, orden: s.orden })));
    });
  }

  function moveDown(index: number) {
    if (index === servicios.length - 1) return;
    const next = [...servicios];
    const [a, b] = [next[index], next[index + 1]];
    next[index] = { ...b, orden: a.orden };
    next[index + 1] = { ...a, orden: b.orden };
    setServicios(next);
    startTransition(async () => {
      await reorderServicios(next.map((s) => ({ id: s.id, orden: s.orden })));
    });
  }

  return (
    <div className="space-y-3">
      {servicios.map((servicio, index) => (
        <ServicioCard
          key={servicio.id}
          servicio={servicio}
          index={index}
          total={servicios.length}
          onMoveUp={() => moveUp(index)}
          onMoveDown={() => moveDown(index)}
          onToggleActivo={() => {
            const next = servicios.map((s) =>
              s.id === servicio.id ? { ...s, activo: !s.activo } : s
            );
            setServicios(next);
            startTransition(async () => {
              await updateServicio(servicio.id, { activo: !servicio.activo });
            });
          }}
          onDeleted={() => setServicios((prev) => prev.filter((s) => s.id !== servicio.id))}
        />
      ))}

      {showNew ? (
        <NuevoServicioCard
          orden={servicios.length}
          onCancel={() => setShowNew(false)}
          onCreated={() => { setShowNew(false); refresh(); }}
        />
      ) : (
        <button
          onClick={() => setShowNew(true)}
          className="w-full rounded-xl border-2 border-dashed py-4 text-sm font-medium transition-colors"
          style={{ borderColor: "var(--color-azul-200)", color: "var(--color-azul-700)" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "var(--color-azul-600)";
            e.currentTarget.style.backgroundColor = "var(--color-azul-50)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "var(--color-azul-200)";
            e.currentTarget.style.backgroundColor = "transparent";
          }}
        >
          + Agregar servicio
        </button>
      )}
    </div>
  );
}

// ── Card de servicio ─────────────────────────────────────────

function ServicioCard({
  servicio,
  index,
  total,
  onMoveUp,
  onMoveDown,
  onToggleActivo,
  onDeleted,
}: {
  servicio: Servicio;
  index: number;
  total: number;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onToggleActivo: () => void;
  onDeleted: () => void;
}) {
  const [collapsed, setCollapsed] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    titulo: servicio.titulo,
    categoria: servicio.categoria,
    descripcion: servicio.descripcion,
    icono: servicio.icono,
    href_anchor: servicio.href_anchor,
  });

  function handleSave() {
    setError(null);
    setSuccess(false);
    startTransition(async () => {
      const result = await updateServicio(servicio.id, form);
      if (result.error) setError(result.error);
      else { setSuccess(true); setTimeout(() => setSuccess(false), 3000); }
    });
  }

  return (
    <div
      className="rounded-xl border overflow-hidden"
      style={{ backgroundColor: "#fff", borderColor: "#E5E7EB" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-100 bg-gray-50">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono px-1.5 py-0.5 rounded bg-gray-100 text-gray-500">
            {servicio.icono}
          </span>
          <span className="text-sm font-semibold text-gray-700 truncate max-w-[200px]">
            {servicio.titulo}
          </span>
          <span className="text-xs text-gray-400">{servicio.categoria}</span>
          {!servicio.activo && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
              Oculto
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <div className="flex gap-0.5">
            <button
              onClick={onMoveUp}
              disabled={index === 0}
              className="p-1 rounded disabled:opacity-25"
              style={{ color: "var(--color-azul-600)" }}
            >
              <ChevronUp size={14} />
            </button>
            <button
              onClick={onMoveDown}
              disabled={index === total - 1}
              className="p-1 rounded disabled:opacity-25"
              style={{ color: "var(--color-azul-600)" }}
            >
              <ChevronDown size={14} />
            </button>
          </div>

          <label className="flex items-center gap-1.5 cursor-pointer select-none">
            <span className="text-xs text-gray-500">
              {servicio.activo ? "Activo" : "Inactivo"}
            </span>
            <button
              onClick={onToggleActivo}
              disabled={isPending}
              className="relative inline-flex h-4 w-8 items-center rounded-full transition-colors disabled:opacity-50"
              style={{ backgroundColor: servicio.activo ? "var(--color-azul-800)" : "#D1D5DB" }}
            >
              <span
                className="inline-block h-3 w-3 rounded-full bg-white shadow transition-transform"
                style={{ transform: servicio.activo ? "translateX(17px)" : "translateX(2px)" }}
              />
            </button>
          </label>

          {confirmDelete ? (
            <div className="flex items-center gap-1">
              <span className="text-xs text-red-600 font-medium">¿Eliminar?</span>
              <button
                onClick={() => {
                  startTransition(async () => {
                    const r = await deleteServicio(servicio.id);
                    if (!r.error) onDeleted();
                  });
                }}
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
              onClick={() => setConfirmDelete(true)}
              disabled={isPending}
              className="p-1 rounded"
              style={{ color: "#EF4444" }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#FEE2E2")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
            >
              <Trash2 size={14} />
            </button>
          )}

          <button
            onClick={() => setCollapsed((c) => !c)}
            className="p-1 rounded"
            style={{ color: "#9CA3AF" }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#F3F4F6")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
          >
            <ChevronRight
              size={15}
              style={{
                transform: collapsed ? "rotate(0deg)" : "rotate(90deg)",
                transition: "transform 0.2s ease",
              }}
            />
          </button>
        </div>
      </div>

      {/* Formulario expandible */}
      {!collapsed && (
        <div className="p-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Título</label>
              <input
                type="text"
                value={form.titulo}
                onChange={(e) => setForm((f) => ({ ...f, titulo: e.target.value }))}
                className="w-full rounded border border-gray-200 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-azul-600"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Categoría</label>
              <input
                type="text"
                value={form.categoria}
                onChange={(e) => setForm((f) => ({ ...f, categoria: e.target.value }))}
                className="w-full rounded border border-gray-200 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-azul-600"
                placeholder="Cardiología Pediátrica"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Ancla del enlace{" "}
                <span className="font-normal text-gray-400">(sin # — ej: holter)</span>
              </label>
              <input
                type="text"
                value={form.href_anchor}
                onChange={(e) => setForm((f) => ({ ...f, href_anchor: e.target.value }))}
                className="w-full rounded border border-gray-200 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-azul-600"
                placeholder="holter"
              />
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Ícono</label>
              <select
                value={form.icono}
                onChange={(e) => setForm((f) => ({ ...f, icono: e.target.value }))}
                className="w-full rounded border border-gray-200 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-azul-600 bg-white"
              >
                {ICONOS_DISPONIBLES.map((icono) => (
                  <option key={icono} value={icono}>{icono}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Descripción</label>
              <textarea
                value={form.descripcion}
                onChange={(e) => setForm((f) => ({ ...f, descripcion: e.target.value }))}
                rows={4}
                className="w-full rounded border border-gray-200 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-azul-600 resize-none"
                placeholder="Descripción breve del servicio para la página pública"
              />
            </div>
          </div>

          <div className="lg:col-span-2">
            {error && (
              <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2 mb-3">
                {error}
              </p>
            )}
            {success && (
              <p className="text-xs text-green-700 bg-green-50 border border-green-200 rounded px-3 py-2 mb-3">
                Guardado correctamente
              </p>
            )}
            <button
              onClick={handleSave}
              disabled={isPending}
              className="rounded-lg px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
              style={{ backgroundColor: "var(--color-azul-800)" }}
            >
              {isPending ? "Guardando…" : "Guardar cambios"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Nuevo servicio ───────────────────────────────────────────

function NuevoServicioCard({
  orden,
  onCancel,
  onCreated,
}: {
  orden: number;
  onCancel: () => void;
  onCreated: () => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    titulo: "",
    categoria: "",
    descripcion: "",
    icono: "Stethoscope",
    href_anchor: "",
  });

  function handleCreate() {
    if (!form.titulo.trim()) { setError("El título es obligatorio"); return; }
    if (!form.categoria.trim()) { setError("La categoría es obligatoria"); return; }
    setError(null);
    startTransition(async () => {
      const result = await createServicio({ ...form, orden });
      if (result.error) setError(result.error);
      else onCreated();
    });
  }

  return (
    <div
      className="bg-white rounded-xl border overflow-hidden"
      style={{ borderColor: "var(--color-azul-200)" }}
    >
      <div
        className="flex items-center justify-between px-4 py-2.5 border-b"
        style={{ borderColor: "var(--color-gris-100)", backgroundColor: "var(--color-azul-50)" }}
      >
        <span className="text-sm font-semibold" style={{ color: "var(--color-azul-900)" }}>
          Nuevo servicio
        </span>
        <button onClick={onCancel} className="text-xs text-gray-400 hover:text-gray-600">
          Cancelar
        </button>
      </div>

      <div className="p-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Título *</label>
            <input
              type="text"
              value={form.titulo}
              onChange={(e) => setForm((f) => ({ ...f, titulo: e.target.value }))}
              className="w-full rounded border border-gray-200 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-azul-600"
              placeholder="Ecocardiograma"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Categoría *</label>
            <input
              type="text"
              value={form.categoria}
              onChange={(e) => setForm((f) => ({ ...f, categoria: e.target.value }))}
              className="w-full rounded border border-gray-200 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-azul-600"
              placeholder="Cardiología Pediátrica"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Ancla del enlace{" "}
              <span className="font-normal text-gray-400">(sin # — ej: holter)</span>
            </label>
            <input
              type="text"
              value={form.href_anchor}
              onChange={(e) => setForm((f) => ({ ...f, href_anchor: e.target.value }))}
              className="w-full rounded border border-gray-200 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-azul-600"
              placeholder="holter"
            />
          </div>
        </div>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Ícono</label>
            <select
              value={form.icono}
              onChange={(e) => setForm((f) => ({ ...f, icono: e.target.value }))}
              className="w-full rounded border border-gray-200 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-azul-600 bg-white"
            >
              {ICONOS_DISPONIBLES.map((icono) => (
                <option key={icono} value={icono}>{icono}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Descripción</label>
            <textarea
              value={form.descripcion}
              onChange={(e) => setForm((f) => ({ ...f, descripcion: e.target.value }))}
              rows={4}
              className="w-full rounded border border-gray-200 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-azul-600 resize-none"
              placeholder="Descripción breve del servicio"
            />
          </div>
        </div>

        <div className="lg:col-span-2">
          {error && (
            <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2 mb-3">
              {error}
            </p>
          )}
          <button
            onClick={handleCreate}
            disabled={isPending}
            className="rounded-lg px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
            style={{ backgroundColor: "var(--color-azul-800)" }}
          >
            {isPending ? "Creando…" : "Crear servicio"}
          </button>
        </div>
      </div>
    </div>
  );
}
