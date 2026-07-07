"use client";

import { useState, useRef, useTransition, useEffect } from "react";
import Image from "next/image";
import { ChevronRight, Trash2, GripVertical, ChevronUp, ChevronDown } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import {
  updateEquipoHero,
  createEquipoMiembro,
  updateEquipoMiembro,
  deleteEquipoMiembro,
  reorderEquipoMiembros,
  getEquipoGrupos,
} from "@/actions/equipo";

interface Hero  { id: string; pagina: "humano" | "tecnologico"; imagen_url: string; imagen_alt: string; }
interface Miembro { id: string; grupo_id: string; nombre: string; cargo: string; especialidad: string; formacion: string[]; foto_url: string; imagen_alt: string; orden: number; activo: boolean; }
interface Grupo  { id: string; nombre: string; orden: number; miembros: Miembro[]; }

interface Props { hero: Hero; grupos: Grupo[]; }

// ── Manager principal ────────────────────────────────────────

export function EquipoHumanoManager({ hero: initialHero, grupos: initialGrupos }: Props) {
  const [hero, setHero] = useState(initialHero);
  const [grupos, setGrupos] = useState(initialGrupos);

  async function refreshGrupos() {
    const { data } = await getEquipoGrupos();
    if (data) setGrupos(data as Grupo[]);
  }

  function updateGrupoMiembros(grupoId: string, miembros: Miembro[]) {
    setGrupos((prev) => prev.map((g) => g.id === grupoId ? { ...g, miembros } : g));
  }

  return (
    <div className="space-y-8">
      {/* Hero */}
      <HeroImageSection hero={hero} onUpdated={(url, alt) => setHero((h) => ({ ...h, imagen_url: url, imagen_alt: alt }))} />

      {/* Grupos */}
      {grupos.map((grupo) => (
        <GrupoSection
          key={grupo.id}
          grupo={grupo}
          onMiembrosChange={(m) => updateGrupoMiembros(grupo.id, m)}
          onRefresh={refreshGrupos}
        />
      ))}
    </div>
  );
}

// ── Sección hero ─────────────────────────────────────────────

function HeroImageSection({ hero, onUpdated }: { hero: Hero; onUpdated: (url: string, alt: string) => void }) {
  const [isPending, startTransition] = useTransition();
  const [uploadProgress, setUploadProgress] = useState<"idle" | "uploading" | "done" | "error">("idle");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [alt, setAlt] = useState(hero.imagen_alt);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const currentImage = previewUrl ?? hero.imagen_url;

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { setError("Máximo 5 MB"); return; }
    setPreviewUrl(URL.createObjectURL(file));
    setUploadProgress("uploading");
    setError(null);
    const ext = file.name.split(".").pop();
    const filename = `equipo-humano-hero-${Date.now()}.${ext}`;
    const supabase = createClient();
    const { error: uploadError } = await supabase.storage.from("equipo-fotos").upload(filename, file, { upsert: true });
    if (uploadError) { setUploadProgress("error"); setError(uploadError.message); return; }
    const { data: { publicUrl } } = supabase.storage.from("equipo-fotos").getPublicUrl(filename);
    startTransition(async () => {
      const result = await updateEquipoHero("humano", { imagen_url: publicUrl, imagen_alt: alt });
      if (result.error) { setUploadProgress("error"); setError(result.error); }
      else { setUploadProgress("done"); onUpdated(publicUrl, alt); }
    });
  }

  function handleSaveAlt() {
    setError(null); setSuccess(false);
    startTransition(async () => {
      const result = await updateEquipoHero("humano", { imagen_alt: alt });
      if (result.error) setError(result.error);
      else { setSuccess(true); onUpdated(hero.imagen_url, alt); setTimeout(() => setSuccess(false), 3000); }
    });
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-5 py-3 border-b border-gray-100 bg-gray-50">
        <span className="text-sm font-semibold text-gray-700">Imagen del hero</span>
      </div>
      <div className="p-5 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-3">
          <div className="relative w-full rounded-lg overflow-hidden bg-gray-100" style={{ aspectRatio: "16/6" }}>
            <Image src={currentImage} alt={alt || "Hero equipo"} fill className="object-cover" unoptimized />
            {uploadProgress === "uploading" && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="text-white text-sm font-medium">Subiendo…</span>
              </div>
            )}
            {uploadProgress === "done" && (
              <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">✓ Guardada</div>
            )}
          </div>
          <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp,image/avif" className="hidden" onChange={handleUpload} />
          <button onClick={() => fileRef.current?.click()} disabled={isPending || uploadProgress === "uploading"}
            className="w-full rounded-lg border-2 border-dashed border-gray-300 py-2.5 text-sm text-gray-600 hover:border-azul-600 transition-colors disabled:opacity-50">
            {uploadProgress === "uploading" ? "Subiendo…" : "Cambiar imagen"}
          </button>
          <p className="text-xs text-gray-400">JPG, PNG, WebP o AVIF · máx. 5 MB</p>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Texto alternativo</label>
            <input type="text" value={alt} onChange={(e) => setAlt(e.target.value)}
              className="w-full rounded border border-gray-200 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-azul-600"
              placeholder="Descripción de la imagen" />
          </div>
          {error && <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">{error}</p>}
          {success && <p className="text-xs text-green-700 bg-green-50 border border-green-200 rounded px-3 py-2">Guardado correctamente</p>}
          <button onClick={handleSaveAlt} disabled={isPending}
            className="w-full rounded-lg py-2.5 text-sm font-semibold text-white disabled:opacity-60"
            style={{ backgroundColor: "var(--color-azul-800)" }}>
            {isPending ? "Guardando…" : "Guardar texto alternativo"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Sección grupo ────────────────────────────────────────────

function GrupoSection({ grupo, onMiembrosChange, onRefresh }: {
  grupo: Grupo;
  onMiembrosChange: (m: Miembro[]) => void;
  onRefresh: () => void;
}) {
  const [miembros, setMiembros] = useState(grupo.miembros);
  const [showNew, setShowNew] = useState(false);

  useEffect(() => { setMiembros(grupo.miembros); }, [grupo.miembros]);
  const [, startTransition] = useTransition();
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  function update(newList: Miembro[]) { setMiembros(newList); onMiembrosChange(newList); }

  function moveUp(index: number) {
    if (index === 0) return;
    const next = [...miembros];
    const [a, b] = [next[index - 1], next[index]];
    next[index - 1] = { ...b, orden: a.orden };
    next[index] = { ...a, orden: b.orden };
    update(next);
    startTransition(async () => { await reorderEquipoMiembros(next.map((m) => ({ id: m.id, orden: m.orden }))); });
  }

  function moveDown(index: number) {
    if (index === miembros.length - 1) return;
    const next = [...miembros];
    const [a, b] = [next[index], next[index + 1]];
    next[index] = { ...b, orden: a.orden };
    next[index + 1] = { ...a, orden: b.orden };
    update(next);
    startTransition(async () => { await reorderEquipoMiembros(next.map((m) => ({ id: m.id, orden: m.orden }))); });
  }

  function handleDrop(targetIndex: number) {
    if (dragIndex === null || dragIndex === targetIndex) { setDragIndex(null); setDragOverIndex(null); return; }
    const next = [...miembros];
    const [moved] = next.splice(dragIndex, 1);
    next.splice(targetIndex, 0, moved);
    const reordered = next.map((m, i) => ({ ...m, orden: i }));
    update(reordered);
    setDragIndex(null); setDragOverIndex(null);
    startTransition(async () => { await reorderEquipoMiembros(reordered.map((m) => ({ id: m.id, orden: m.orden }))); });
  }

  async function handleCreated() {
    setShowNew(false);
    onRefresh();
  }

  return (
    <div>
      <h2 className="text-base font-bold mb-3" style={{ color: "var(--color-azul-900)" }}>{grupo.nombre}</h2>
      <div className="space-y-3">
        {miembros.map((miembro, index) => (
          <MiembroCard
            key={miembro.id}
            miembro={miembro}
            index={index}
            total={miembros.length}
            isDragging={dragIndex === index}
            isDragOver={dragOverIndex === index}
            onMoveUp={() => moveUp(index)}
            onMoveDown={() => moveDown(index)}
            onToggleActivo={() => {
              const next = miembros.map((m) => m.id === miembro.id ? { ...m, activo: !m.activo } : m);
              update(next);
              startTransition(async () => { await updateEquipoMiembro(miembro.id, { activo: !miembro.activo }); });
            }}
            onDeleted={() => update(miembros.filter((m) => m.id !== miembro.id))}
            onDragStart={() => setDragIndex(index)}
            onDragOver={(e) => { e.preventDefault(); setDragOverIndex(index); }}
            onDragLeave={() => setDragOverIndex(null)}
            onDrop={() => handleDrop(index)}
            onDragEnd={() => { setDragIndex(null); setDragOverIndex(null); }}
          />
        ))}

        {showNew ? (
          <NuevoMiembroCard
            grupoId={grupo.id}
            orden={miembros.length}
            onCancel={() => setShowNew(false)}
            onCreated={handleCreated}
          />
        ) : (
          <button onClick={() => setShowNew(true)}
            className="w-full rounded-xl border-2 border-dashed py-4 text-sm font-medium transition-colors"
            style={{ borderColor: "var(--color-azul-200)", color: "var(--color-azul-700)" }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--color-azul-600)"; e.currentTarget.style.backgroundColor = "var(--color-azul-50)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--color-azul-200)"; e.currentTarget.style.backgroundColor = "transparent"; }}>
            + Agregar miembro a {grupo.nombre}
          </button>
        )}
      </div>
    </div>
  );
}

// ── Card de miembro ──────────────────────────────────────────

function MiembroCard({ miembro, index, total, isDragging, isDragOver, onMoveUp, onMoveDown, onToggleActivo, onDeleted, onDragStart, onDragOver, onDragLeave, onDrop, onDragEnd }: {
  miembro: Miembro; index: number; total: number; isDragging: boolean; isDragOver: boolean;
  onMoveUp: () => void; onMoveDown: () => void; onToggleActivo: () => void; onDeleted: () => void;
  onDragStart: () => void; onDragOver: (e: React.DragEvent) => void; onDragLeave: () => void; onDrop: () => void; onDragEnd: () => void;
}) {
  const [collapsed, setCollapsed] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [uploadProgress, setUploadProgress] = useState<"idle" | "uploading" | "done" | "error">("idle");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    nombre: miembro.nombre,
    cargo: miembro.cargo,
    especialidad: miembro.especialidad,
    formacion: miembro.formacion.join("\n"),
    imagen_alt: miembro.imagen_alt,
  });

  const currentImage = previewUrl ?? miembro.foto_url;
  const isValidUrl = currentImage.startsWith("/") || (() => { try { new URL(currentImage); return true; } catch { return false; } })();

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { setError("Máximo 5 MB"); return; }
    setPreviewUrl(URL.createObjectURL(file));
    setUploadProgress("uploading");
    setError(null);
    const ext = file.name.split(".").pop();
    const filename = `miembro-${miembro.id}-${Date.now()}.${ext}`;
    const supabase = createClient();
    const { error: uploadError } = await supabase.storage.from("equipo-fotos").upload(filename, file, { upsert: true });
    if (uploadError) { setUploadProgress("error"); setError(uploadError.message); return; }
    const { data: { publicUrl } } = supabase.storage.from("equipo-fotos").getPublicUrl(filename);
    startTransition(async () => {
      const result = await updateEquipoMiembro(miembro.id, { foto_url: publicUrl });
      if (result.error) { setUploadProgress("error"); setError(result.error); }
      else setUploadProgress("done");
    });
  }

  function handleSave() {
    setError(null); setSuccess(false);
    startTransition(async () => {
      const result = await updateEquipoMiembro(miembro.id, {
        nombre: form.nombre,
        cargo: form.cargo,
        especialidad: form.especialidad,
        formacion: form.formacion.split("\n").map((s) => s.trim()).filter(Boolean),
        imagen_alt: form.imagen_alt,
      });
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
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-100 bg-gray-50">
        <div className="flex items-center gap-2">
          <span className="cursor-grab active:cursor-grabbing" style={{ color: "#9CA3AF", display: "flex" }}><GripVertical size={15} /></span>
          <span className="text-sm font-semibold text-gray-700 truncate max-w-[180px]">{miembro.nombre}</span>
          {!miembro.activo && <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: "#F3F4F6", color: "#6B7280" }}>Oculto</span>}
        </div>
        <div className="flex items-center gap-2">
          <div className="flex gap-0.5">
            <button onClick={onMoveUp} disabled={index === 0} className="p-1 rounded disabled:opacity-25" style={{ color: "var(--color-azul-600)" }}><ChevronUp size={14} /></button>
            <button onClick={onMoveDown} disabled={index === total - 1} className="p-1 rounded disabled:opacity-25" style={{ color: "var(--color-azul-600)" }}><ChevronDown size={14} /></button>
          </div>
          <label className="flex items-center gap-1.5 cursor-pointer select-none">
            <span className="text-xs text-gray-500">{miembro.activo ? "Activo" : "Inactivo"}</span>
            <button onClick={onToggleActivo} disabled={isPending}
              className="relative inline-flex h-4 w-8 items-center rounded-full transition-colors disabled:opacity-50"
              style={{ backgroundColor: miembro.activo ? "var(--color-azul-800)" : "#D1D5DB" }}>
              <span className="inline-block h-3 w-3 rounded-full bg-white shadow transition-transform"
                style={{ transform: miembro.activo ? "translateX(17px)" : "translateX(2px)" }} />
            </button>
          </label>
          {confirmDelete ? (
            <div className="flex items-center gap-1">
              <span className="text-xs text-red-600 font-medium">¿Eliminar?</span>
              <button onClick={() => { startTransition(async () => { const r = await deleteEquipoMiembro(miembro.id); if (!r.error) onDeleted(); }); }}
                disabled={isPending} className="text-xs font-semibold px-1.5 py-0.5 rounded" style={{ backgroundColor: "#FEE2E2", color: "#DC2626" }}>Sí</button>
              <button onClick={() => setConfirmDelete(false)} className="text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: "#F3F4F6", color: "#6B7280" }}>No</button>
            </div>
          ) : (
            <button onClick={() => setConfirmDelete(true)} disabled={isPending} className="p-1 rounded" style={{ color: "#EF4444" }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#FEE2E2")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}>
              <Trash2 size={14} />
            </button>
          )}
          <button onClick={() => setCollapsed((c) => !c)} className="p-1 rounded" style={{ color: "#9CA3AF" }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#F3F4F6")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}>
            <ChevronRight size={15} style={{ transform: collapsed ? "rotate(0deg)" : "rotate(90deg)", transition: "transform 0.2s ease" }} />
          </button>
        </div>
      </div>

      {!collapsed && (
        <div className="p-4 grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Foto */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700">Foto</p>
            <div className="relative w-full rounded-lg overflow-hidden bg-gray-100" style={{ aspectRatio: "3/4", maxHeight: 220 }}>
              {isValidUrl
                ? <Image src={currentImage} alt={form.imagen_alt || miembro.nombre} fill className="object-cover object-top" unoptimized />
                : <div className="flex items-center justify-center h-full text-xs text-gray-400">Sin foto</div>}
              {uploadProgress === "uploading" && <div className="absolute inset-0 bg-black/50 flex items-center justify-center"><span className="text-white text-sm">Subiendo…</span></div>}
              {uploadProgress === "done" && <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">✓</div>}
            </div>
            <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp,image/avif" className="hidden" onChange={handleUpload} />
            <button onClick={() => fileRef.current?.click()} disabled={isPending || uploadProgress === "uploading"}
              className="w-full rounded border-2 border-dashed border-gray-300 py-2 text-sm text-gray-600 hover:border-azul-600 transition-colors disabled:opacity-50">
              {uploadProgress === "uploading" ? "Subiendo…" : "Cambiar foto"}
            </button>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Texto alt (accesibilidad)</label>
              <input type="text" value={form.imagen_alt} onChange={(e) => setForm((f) => ({ ...f, imagen_alt: e.target.value }))}
                className="w-full rounded border border-gray-200 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-azul-600" placeholder="Nombre de la persona" />
            </div>
          </div>
          {/* Datos */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Nombre completo</label>
              <input type="text" value={form.nombre} onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))}
                className="w-full rounded border border-gray-200 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-azul-600" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Cargo</label>
              <input type="text" value={form.cargo} onChange={(e) => setForm((f) => ({ ...f, cargo: e.target.value }))}
                className="w-full rounded border border-gray-200 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-azul-600" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Especialidad</label>
              <input type="text" value={form.especialidad} onChange={(e) => setForm((f) => ({ ...f, especialidad: e.target.value }))}
                className="w-full rounded border border-gray-200 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-azul-600" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Formación <span className="font-normal text-gray-400">(una por línea)</span></label>
              <textarea value={form.formacion} onChange={(e) => setForm((f) => ({ ...f, formacion: e.target.value }))}
                rows={3} className="w-full rounded border border-gray-200 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-azul-600 resize-none"
                placeholder={"Universidad del Salvador\nBuenos Aires, Argentina"} />
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

// ── Nuevo miembro ────────────────────────────────────────────

function NuevoMiembroCard({ grupoId, orden, onCancel, onCreated }: {
  grupoId: string; orden: number; onCancel: () => void; onCreated: () => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [uploadProgress, setUploadProgress] = useState<"idle" | "uploading" | "done" | "error">("idle");
  const [fotoUrl, setFotoUrl] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({ nombre: "", cargo: "", especialidad: "", formacion: "", imagen_alt: "" });

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { setError("Máximo 5 MB"); return; }
    setPreviewUrl(URL.createObjectURL(file));
    setUploadProgress("uploading");
    setError(null);
    const ext = file.name.split(".").pop();
    const filename = `miembro-new-${Date.now()}.${ext}`;
    const supabase = createClient();
    const { error: uploadError } = await supabase.storage.from("equipo-fotos").upload(filename, file, { upsert: true });
    if (uploadError) { setUploadProgress("error"); setError(uploadError.message); return; }
    const { data: { publicUrl } } = supabase.storage.from("equipo-fotos").getPublicUrl(filename);
    setFotoUrl(publicUrl);
    setUploadProgress("done");
  }

  function handleCreate() {
    if (!fotoUrl) { setError("Sube una foto primero"); return; }
    if (!form.nombre.trim()) { setError("El nombre es obligatorio"); return; }
    if (!form.imagen_alt.trim()) { setError("El texto alternativo es obligatorio"); return; }
    setError(null);
    startTransition(async () => {
      const result = await createEquipoMiembro({
        grupo_id: grupoId,
        nombre: form.nombre,
        cargo: form.cargo,
        especialidad: form.especialidad,
        formacion: form.formacion.split("\n").map((s) => s.trim()).filter(Boolean),
        foto_url: fotoUrl,
        imagen_alt: form.imagen_alt,
        orden,
      });
      if (result.error) setError(result.error);
      else onCreated();
    });
  }

  return (
    <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: "var(--color-azul-200)" }}>
      <div className="flex items-center justify-between px-4 py-2.5 border-b" style={{ borderColor: "var(--color-gris-100)", backgroundColor: "var(--color-azul-50)" }}>
        <span className="text-sm font-semibold" style={{ color: "var(--color-azul-900)" }}>Nuevo miembro</span>
        <button onClick={onCancel} className="text-xs text-gray-400 hover:text-gray-600">Cancelar</button>
      </div>
      <div className="p-4 grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">Foto</p>
          <div className="relative w-full rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center" style={{ aspectRatio: "3/4", maxHeight: 220 }}>
            {previewUrl ? <Image src={previewUrl} alt="Preview" fill className="object-cover object-top" unoptimized /> : <span className="text-xs text-gray-400">Sin foto</span>}
            {uploadProgress === "uploading" && <div className="absolute inset-0 bg-black/50 flex items-center justify-center"><span className="text-white text-sm">Subiendo…</span></div>}
            {uploadProgress === "done" && <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">✓</div>}
          </div>
          <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp,image/avif" className="hidden" onChange={handleUpload} />
          <button onClick={() => fileRef.current?.click()} disabled={uploadProgress === "uploading"}
            className="w-full rounded border-2 border-dashed border-gray-300 py-2 text-sm text-gray-600 hover:border-azul-600 transition-colors disabled:opacity-50">
            {uploadProgress === "uploading" ? "Subiendo…" : "Seleccionar foto"}
          </button>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Texto alt *</label>
            <input type="text" value={form.imagen_alt} onChange={(e) => setForm((f) => ({ ...f, imagen_alt: e.target.value }))}
              className="w-full rounded border border-gray-200 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-azul-600" placeholder="Nombre de la persona" />
          </div>
        </div>
        <div className="space-y-3">
          {[
            { label: "Nombre completo *", key: "nombre", placeholder: "Dra. Alicia Llach López" },
            { label: "Cargo", key: "cargo", placeholder: "Médico Radiólogo" },
            { label: "Especialidad", key: "especialidad", placeholder: "Diagnóstico por Imágenes" },
          ].map(({ label, key, placeholder }) => (
            <div key={key}>
              <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
              <input type="text" value={form[key as keyof typeof form]}
                onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                className="w-full rounded border border-gray-200 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-azul-600" placeholder={placeholder} />
            </div>
          ))}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Formación <span className="font-normal text-gray-400">(una por línea)</span></label>
            <textarea value={form.formacion} onChange={(e) => setForm((f) => ({ ...f, formacion: e.target.value }))}
              rows={3} className="w-full rounded border border-gray-200 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-azul-600 resize-none"
              placeholder={"Universidad del Salvador\nBuenos Aires, Argentina"} />
          </div>
          {error && <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">{error}</p>}
          <button onClick={handleCreate} disabled={isPending || uploadProgress === "uploading"}
            className="w-full rounded-lg py-2.5 text-sm font-semibold text-white disabled:opacity-60"
            style={{ backgroundColor: "var(--color-azul-800)" }}>
            {isPending ? "Creando…" : "Crear miembro"}
          </button>
        </div>
      </div>
    </div>
  );
}
