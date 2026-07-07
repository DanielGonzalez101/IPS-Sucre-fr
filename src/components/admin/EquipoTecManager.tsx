"use client";

import { useState, useRef, useTransition } from "react";
import Image from "next/image";
import { ChevronRight, Trash2, GripVertical, ChevronUp, ChevronDown } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import {
  createEquipoTec,
  updateEquipoTec,
  deleteEquipoTec,
  reorderEquipoTec,
  getEquipoTecnologico,
} from "@/actions/equipo";

interface Equipo {
  id: string; nombre: string; categoria: string; descripcion: string;
  imagen_url: string; imagen_alt: string; orden: number; activo: boolean;
}

interface Props { equipos: Equipo[]; }

export function EquipoTecManager({ equipos: initialEquipos }: Props) {
  const [equipos, setEquipos] = useState(initialEquipos);
  const [showNew, setShowNew] = useState(false);
  const [, startTransition] = useTransition();
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  function moveUp(index: number) {
    if (index === 0) return;
    const next = [...equipos];
    const [a, b] = [next[index - 1], next[index]];
    next[index - 1] = { ...b, orden: a.orden };
    next[index] = { ...a, orden: b.orden };
    setEquipos(next);
    startTransition(async () => { await reorderEquipoTec(next.map((e) => ({ id: e.id, orden: e.orden }))); });
  }

  function moveDown(index: number) {
    if (index === equipos.length - 1) return;
    const next = [...equipos];
    const [a, b] = [next[index], next[index + 1]];
    next[index] = { ...b, orden: a.orden };
    next[index + 1] = { ...a, orden: b.orden };
    setEquipos(next);
    startTransition(async () => { await reorderEquipoTec(next.map((e) => ({ id: e.id, orden: e.orden }))); });
  }

  function handleDrop(targetIndex: number) {
    if (dragIndex === null || dragIndex === targetIndex) { setDragIndex(null); setDragOverIndex(null); return; }
    const next = [...equipos];
    const [moved] = next.splice(dragIndex, 1);
    next.splice(targetIndex, 0, moved);
    const reordered = next.map((e, i) => ({ ...e, orden: i }));
    setEquipos(reordered);
    setDragIndex(null); setDragOverIndex(null);
    startTransition(async () => { await reorderEquipoTec(reordered.map((e) => ({ id: e.id, orden: e.orden }))); });
  }

  async function handleCreated() {
    setShowNew(false);
    const { data } = await getEquipoTecnologico();
    if (data) setEquipos(data as Equipo[]);
  }

  return (
    <div className="space-y-3">
      {equipos.map((equipo, index) => (
        <EquipoCard
          key={equipo.id}
          equipo={equipo}
          index={index}
          total={equipos.length}
          isDragging={dragIndex === index}
          isDragOver={dragOverIndex === index}
          onMoveUp={() => moveUp(index)}
          onMoveDown={() => moveDown(index)}
          onToggleActivo={() => {
            setEquipos((prev) => prev.map((e) => e.id === equipo.id ? { ...e, activo: !e.activo } : e));
            startTransition(async () => { await updateEquipoTec(equipo.id, { activo: !equipo.activo }); });
          }}
          onDeleted={() => setEquipos((prev) => prev.filter((e) => e.id !== equipo.id))}
          onDragStart={() => setDragIndex(index)}
          onDragOver={(e) => { e.preventDefault(); setDragOverIndex(index); }}
          onDragLeave={() => setDragOverIndex(null)}
          onDrop={() => handleDrop(index)}
          onDragEnd={() => { setDragIndex(null); setDragOverIndex(null); }}
        />
      ))}

      {showNew ? (
        <NuevoEquipoCard orden={equipos.length} onCancel={() => setShowNew(false)} onCreated={handleCreated} />
      ) : (
        <button onClick={() => setShowNew(true)}
          className="w-full rounded-xl border-2 border-dashed py-5 text-sm font-medium transition-colors"
          style={{ borderColor: "var(--color-azul-200)", color: "var(--color-azul-700)" }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--color-azul-600)"; e.currentTarget.style.backgroundColor = "var(--color-azul-50)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--color-azul-200)"; e.currentTarget.style.backgroundColor = "transparent"; }}>
          + Agregar equipo
        </button>
      )}
    </div>
  );
}

// ── Card equipo ──────────────────────────────────────────────

function EquipoCard({ equipo, index, total, isDragging, isDragOver, onMoveUp, onMoveDown, onToggleActivo, onDeleted, onDragStart, onDragOver, onDragLeave, onDrop, onDragEnd }: {
  equipo: Equipo; index: number; total: number; isDragging: boolean; isDragOver: boolean;
  onMoveUp: () => void; onMoveDown: () => void; onToggleActivo: () => void; onDeleted: () => void;
  onDragStart: () => void; onDragOver: (e: React.DragEvent) => void; onDragLeave: () => void; onDrop: () => void; onDragEnd: () => void;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [uploadProgress, setUploadProgress] = useState<"idle" | "uploading" | "done" | "error">("idle");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    nombre: equipo.nombre,
    categoria: equipo.categoria,
    descripcion: equipo.descripcion,
    imagen_alt: equipo.imagen_alt,
  });

  const currentImage = previewUrl ?? equipo.imagen_url;
  const isValidUrl = currentImage.startsWith("/") || (() => { try { new URL(currentImage); return true; } catch { return false; } })();

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { setError("Máximo 5 MB"); return; }
    setPreviewUrl(URL.createObjectURL(file));
    setUploadProgress("uploading");
    setError(null);
    const ext = file.name.split(".").pop();
    const filename = `equipo-tec-${equipo.id}-${Date.now()}.${ext}`;
    const supabase = createClient();
    const { error: uploadError } = await supabase.storage.from("equipo-tec-fotos").upload(filename, file, { upsert: true });
    if (uploadError) { setUploadProgress("error"); setError(uploadError.message); return; }
    const { data: { publicUrl } } = supabase.storage.from("equipo-tec-fotos").getPublicUrl(filename);
    startTransition(async () => {
      const result = await updateEquipoTec(equipo.id, { imagen_url: publicUrl });
      if (result.error) { setUploadProgress("error"); setError(result.error); }
      else setUploadProgress("done");
    });
  }

  function handleSave() {
    setError(null); setSuccess(false);
    startTransition(async () => {
      const result = await updateEquipoTec(equipo.id, { ...form });
      if (result.error) setError(result.error);
      else { setSuccess(true); setTimeout(() => setSuccess(false), 3000); }
    });
  }

  return (
    <div
      draggable onDragStart={onDragStart} onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop} onDragEnd={onDragEnd}
      className="rounded-xl border overflow-hidden transition-all duration-150"
      style={{ backgroundColor: "#fff", borderColor: isDragOver ? "var(--color-azul-400)" : "#E5E7EB", opacity: isDragging ? 0.45 : 1,
        boxShadow: isDragOver ? "0 0 0 2px var(--color-azul-200)" : undefined }}>
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 bg-gray-50">
        <div className="flex items-center gap-2">
          <span className="cursor-grab active:cursor-grabbing" style={{ color: "#9CA3AF", display: "flex" }}><GripVertical size={16} /></span>
          <span className="text-sm font-semibold text-gray-700 truncate max-w-[200px]">{equipo.nombre}</span>
          {!equipo.activo && <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: "#F3F4F6", color: "#6B7280" }}>Oculto</span>}
        </div>
        <div className="flex items-center gap-3">
          <div className="flex gap-0.5">
            <button onClick={onMoveUp} disabled={index === 0} className="p-1 rounded disabled:opacity-25" style={{ color: "var(--color-azul-600)" }}><ChevronUp size={16} /></button>
            <button onClick={onMoveDown} disabled={index === total - 1} className="p-1 rounded disabled:opacity-25" style={{ color: "var(--color-azul-600)" }}><ChevronDown size={16} /></button>
          </div>
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <span className="text-xs text-gray-500">{equipo.activo ? "Activo" : "Inactivo"}</span>
            <button onClick={onToggleActivo} disabled={isPending}
              className="relative inline-flex h-5 w-9 items-center rounded-full transition-colors disabled:opacity-50"
              style={{ backgroundColor: equipo.activo ? "var(--color-azul-800)" : "#D1D5DB" }}>
              <span className="inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform"
                style={{ transform: equipo.activo ? "translateX(18px)" : "translateX(2px)" }} />
            </button>
          </label>
          {confirmDelete ? (
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-red-600 font-medium">¿Eliminar?</span>
              <button onClick={() => { startTransition(async () => { const r = await deleteEquipoTec(equipo.id); if (!r.error) onDeleted(); }); }}
                disabled={isPending} className="text-xs font-semibold px-2 py-0.5 rounded" style={{ backgroundColor: "#FEE2E2", color: "#DC2626" }}>Sí</button>
              <button onClick={() => setConfirmDelete(false)} className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: "#F3F4F6", color: "#6B7280" }}>No</button>
            </div>
          ) : (
            <button onClick={() => setConfirmDelete(true)} disabled={isPending} className="p-1 rounded" style={{ color: "#EF4444" }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#FEE2E2")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}>
              <Trash2 size={15} />
            </button>
          )}
          <button onClick={() => setCollapsed((c) => !c)} className="p-1 rounded" style={{ color: "#9CA3AF" }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#F3F4F6")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}>
            <ChevronRight size={16} style={{ transform: collapsed ? "rotate(0deg)" : "rotate(90deg)", transition: "transform 0.2s ease" }} />
          </button>
        </div>
      </div>

      {!collapsed && (
        <div className="p-5 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Imagen */}
          <div className="space-y-3">
            <p className="text-sm font-medium text-gray-700">Imagen</p>
            <div className="relative w-full rounded-lg overflow-hidden bg-gray-100" style={{ aspectRatio: "4/3" }}>
              {isValidUrl
                ? <Image src={currentImage} alt={form.imagen_alt || equipo.nombre} fill className="object-cover" unoptimized />
                : <div className="flex items-center justify-center h-full text-xs text-gray-400">Sin imagen</div>}
              {uploadProgress === "uploading" && <div className="absolute inset-0 bg-black/50 flex items-center justify-center"><span className="text-white text-sm">Subiendo…</span></div>}
              {uploadProgress === "done" && <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">✓</div>}
            </div>
            <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp,image/avif" className="hidden" onChange={handleUpload} />
            <button onClick={() => fileRef.current?.click()} disabled={isPending || uploadProgress === "uploading"}
              className="w-full rounded-lg border-2 border-dashed border-gray-300 py-2.5 text-sm text-gray-600 hover:border-azul-600 transition-colors disabled:opacity-50">
              {uploadProgress === "uploading" ? "Subiendo…" : "Cambiar imagen"}
            </button>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Texto alternativo</label>
              <input type="text" value={form.imagen_alt} onChange={(e) => setForm((f) => ({ ...f, imagen_alt: e.target.value }))}
                className="w-full rounded border border-gray-200 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-azul-600" placeholder="Nombre del equipo" />
            </div>
          </div>
          {/* Datos */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Nombre</label>
              <input type="text" value={form.nombre} onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))}
                className="w-full rounded border border-gray-200 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-azul-600" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Categoría</label>
              <input type="text" value={form.categoria} onChange={(e) => setForm((f) => ({ ...f, categoria: e.target.value }))}
                className="w-full rounded border border-gray-200 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-azul-600" placeholder="Cardiología, Radiología…" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Descripción</label>
              <textarea value={form.descripcion} onChange={(e) => setForm((f) => ({ ...f, descripcion: e.target.value }))}
                rows={4} className="w-full rounded border border-gray-200 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-azul-600 resize-none"
                placeholder="Descripción del equipo…" />
            </div>
            {error && <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">{error}</p>}
            {success && <p className="text-xs text-green-700 bg-green-50 border border-green-200 rounded px-3 py-2">Guardado correctamente</p>}
            <button onClick={handleSave} disabled={isPending}
              className="w-full rounded-lg py-2.5 text-sm font-semibold text-white disabled:opacity-60"
              style={{ backgroundColor: "var(--color-azul-800)" }}>
              {isPending ? "Guardando…" : "Guardar cambios"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Nuevo equipo ─────────────────────────────────────────────

function NuevoEquipoCard({ orden, onCancel, onCreated }: { orden: number; onCancel: () => void; onCreated: () => void; }) {
  const [isPending, startTransition] = useTransition();
  const [uploadProgress, setUploadProgress] = useState<"idle" | "uploading" | "done" | "error">("idle");
  const [imagenUrl, setImagenUrl] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({ nombre: "", categoria: "", descripcion: "", imagen_alt: "" });

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { setError("Máximo 5 MB"); return; }
    setPreviewUrl(URL.createObjectURL(file));
    setUploadProgress("uploading");
    setError(null);
    const ext = file.name.split(".").pop();
    const filename = `equipo-tec-new-${Date.now()}.${ext}`;
    const supabase = createClient();
    const { error: uploadError } = await supabase.storage.from("equipo-tec-fotos").upload(filename, file, { upsert: true });
    if (uploadError) { setUploadProgress("error"); setError(uploadError.message); return; }
    const { data: { publicUrl } } = supabase.storage.from("equipo-tec-fotos").getPublicUrl(filename);
    setImagenUrl(publicUrl);
    setUploadProgress("done");
  }

  function handleCreate() {
    if (!imagenUrl) { setError("Sube una imagen primero"); return; }
    if (!form.nombre.trim()) { setError("El nombre es obligatorio"); return; }
    if (!form.imagen_alt.trim()) { setError("El texto alternativo es obligatorio"); return; }
    setError(null);
    startTransition(async () => {
      const result = await createEquipoTec({ ...form, imagen_url: imagenUrl, orden });
      if (result.error) setError(result.error);
      else onCreated();
    });
  }

  return (
    <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: "var(--color-azul-200)" }}>
      <div className="flex items-center justify-between px-5 py-3 border-b" style={{ borderColor: "var(--color-gris-100)", backgroundColor: "var(--color-azul-50)" }}>
        <span className="text-sm font-semibold" style={{ color: "var(--color-azul-900)" }}>Nuevo equipo</span>
        <button onClick={onCancel} className="text-xs text-gray-400 hover:text-gray-600">Cancelar</button>
      </div>
      <div className="p-5 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-3">
          <p className="text-sm font-medium text-gray-700">Imagen</p>
          <div className="relative w-full rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center" style={{ aspectRatio: "4/3" }}>
            {previewUrl ? <Image src={previewUrl} alt="Preview" fill className="object-cover" unoptimized /> : <span className="text-xs text-gray-400">Sin imagen</span>}
            {uploadProgress === "uploading" && <div className="absolute inset-0 bg-black/50 flex items-center justify-center"><span className="text-white text-sm">Subiendo…</span></div>}
            {uploadProgress === "done" && <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">✓</div>}
          </div>
          <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp,image/avif" className="hidden" onChange={handleUpload} />
          <button onClick={() => fileRef.current?.click()} disabled={uploadProgress === "uploading"}
            className="w-full rounded-lg border-2 border-dashed border-gray-300 py-2.5 text-sm text-gray-600 hover:border-azul-600 transition-colors disabled:opacity-50">
            {uploadProgress === "uploading" ? "Subiendo…" : "Seleccionar imagen"}
          </button>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Texto alt *</label>
            <input type="text" value={form.imagen_alt} onChange={(e) => setForm((f) => ({ ...f, imagen_alt: e.target.value }))}
              className="w-full rounded border border-gray-200 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-azul-600" placeholder="Nombre del equipo" />
          </div>
        </div>
        <div className="space-y-4">
          {[
            { label: "Nombre *", key: "nombre", placeholder: "Ecocardiógrafo Philips EPIQ 7" },
            { label: "Categoría", key: "categoria", placeholder: "Cardiología Pediátrica" },
          ].map(({ label, key, placeholder }) => (
            <div key={key}>
              <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
              <input type="text" value={form[key as keyof typeof form]}
                onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                className="w-full rounded border border-gray-200 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-azul-600" placeholder={placeholder} />
            </div>
          ))}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Descripción</label>
            <textarea value={form.descripcion} onChange={(e) => setForm((f) => ({ ...f, descripcion: e.target.value }))}
              rows={4} className="w-full rounded border border-gray-200 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-azul-600 resize-none"
              placeholder="Descripción del equipo médico…" />
          </div>
          {error && <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">{error}</p>}
          <button onClick={handleCreate} disabled={isPending || uploadProgress === "uploading"}
            className="w-full rounded-lg py-2.5 text-sm font-semibold text-white disabled:opacity-60"
            style={{ backgroundColor: "var(--color-azul-800)" }}>
            {isPending ? "Creando…" : "Crear equipo"}
          </button>
        </div>
      </div>
    </div>
  );
}
