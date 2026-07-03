"use client";

import { useState, useRef, useTransition } from "react";
import Image from "next/image";
import { ChevronUp, ChevronDown, GripVertical, ChevronRight, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import {
  updateHeroSlide,
  deleteHeroSlide,
  createHeroSlide,
  setAsPrincipal,
  swapSlideOrden,
  reorderSlides,
  getHeroSlides,
} from "@/actions/hero";

interface Slide {
  id: string;
  orden: number;
  activo: boolean;
  es_principal: boolean;
  imagen_url: string;
  imagen_alt: string;
  badge_texto: string | null;
  titulo: string;
  subtitulo: string | null;
}

interface Props {
  slides: Slide[];
}

// ── Componente principal ─────────────────────────────────────

export function HeroSlideManager({ slides: initialSlides }: Props) {
  const [slides, setSlides] = useState(initialSlides);
  const [showNew, setShowNew] = useState(false);
  const [, startTransition] = useTransition();
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const activeCount = slides.filter((s) => s.activo).length;

  // ── Validaciones ──────────────────────────────────────────
  function canDeactivate(slide: Slide): { ok: boolean; reason?: string } {
    if (slide.es_principal)
      return { ok: false, reason: "El slide principal no se puede ocultar" };
    if (slide.activo && activeCount <= 1)
      return { ok: false, reason: "Debe haber al menos un slide activo" };
    return { ok: true };
  }

  function canDelete(slide: Slide): { ok: boolean; reason?: string } {
    if (slide.es_principal)
      return { ok: false, reason: "El slide principal no se puede eliminar" };
    if (slide.activo && activeCount <= 1)
      return { ok: false, reason: "Debe haber al menos un slide activo" };
    return { ok: true };
  }

  // ── Acciones con actualización local ─────────────────────
  function handleToggleActivo(id: string) {
    const slide = slides.find((s) => s.id === id);
    if (!slide) return;
    const check = canDeactivate(slide);
    if (!check.ok) return;
    setSlides((prev) =>
      prev.map((s) => (s.id === id ? { ...s, activo: !s.activo } : s))
    );
    startTransition(async () => {
      await updateHeroSlide(id, { activo: !slide.activo });
    });
  }

  function handleSetPrincipal(id: string) {
    setSlides((prev) =>
      prev.map((s) => ({ ...s, es_principal: s.id === id }))
    );
    startTransition(async () => {
      await setAsPrincipal(id);
    });
  }

  function handleDeleted(id: string) {
    setSlides((prev) => prev.filter((s) => s.id !== id));
  }

  async function handleCreated() {
    setShowNew(false);
    // Refrescar desde el servidor para obtener el slide recién creado con su id real
    const { data } = await getHeroSlides();
    if (data) setSlides(data as Slide[]);
  }

  // ── Orden ─────────────────────────────────────────────────
  function moveUp(index: number) {
    if (index === 0) return;
    const above = slides[index - 1];
    const current = slides[index];
    const next = [...slides];
    next[index - 1] = { ...current, orden: above.orden };
    next[index] = { ...above, orden: current.orden };
    setSlides(next);
    startTransition(async () => {
      await swapSlideOrden(current.id, current.orden, above.id, above.orden);
    });
  }

  function moveDown(index: number) {
    if (index === slides.length - 1) return;
    const below = slides[index + 1];
    const current = slides[index];
    const next = [...slides];
    next[index + 1] = { ...current, orden: below.orden };
    next[index] = { ...below, orden: current.orden };
    setSlides(next);
    startTransition(async () => {
      await swapSlideOrden(current.id, current.orden, below.id, below.orden);
    });
  }

  function handleDrop(targetIndex: number) {
    if (dragIndex === null || dragIndex === targetIndex) {
      setDragIndex(null);
      setDragOverIndex(null);
      return;
    }
    const next = [...slides];
    const [moved] = next.splice(dragIndex, 1);
    next.splice(targetIndex, 0, moved);
    const reordered = next.map((s, i) => ({ ...s, orden: i }));
    setSlides(reordered);
    setDragIndex(null);
    setDragOverIndex(null);
    startTransition(async () => {
      await reorderSlides(reordered.map((s) => ({ id: s.id, orden: s.orden })));
    });
  }

  return (
    <div className="space-y-3">
      {slides.map((slide, index) => (
        <SlideCard
          key={slide.id}
          slide={slide}
          index={index}
          total={slides.length}
          isDragging={dragIndex === index}
          isDragOver={dragOverIndex === index}
          canDeactivate={canDeactivate(slide)}
          canDelete={canDelete(slide)}
          onToggleActivo={() => handleToggleActivo(slide.id)}
          onSetPrincipal={() => handleSetPrincipal(slide.id)}
          onDeleted={() => handleDeleted(slide.id)}
          onMoveUp={() => moveUp(index)}
          onMoveDown={() => moveDown(index)}
          onDragStart={() => setDragIndex(index)}
          onDragOver={(e) => { e.preventDefault(); setDragOverIndex(index); }}
          onDragLeave={() => setDragOverIndex(null)}
          onDrop={() => handleDrop(index)}
          onDragEnd={() => { setDragIndex(null); setDragOverIndex(null); }}
        />
      ))}

      {slides.length >= 3 ? (
        <p
          className="text-center text-sm py-4 rounded-xl border-2 border-dashed"
          style={{ borderColor: "var(--color-azul-100)", color: "var(--color-gris-400)" }}
        >
          Límite alcanzado · máximo 3 slides
        </p>
      ) : showNew ? (
        <NewSlideCard
          nextOrden={slides.length}
          onCancel={() => setShowNew(false)}
          onCreated={handleCreated}
        />
      ) : (
        <button
          onClick={() => setShowNew(true)}
          className="w-full rounded-xl border-2 border-dashed py-5 text-sm font-medium transition-colors"
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
          + Agregar slide
        </button>
      )}
    </div>
  );
}

// ── SlideCard ────────────────────────────────────────────────

function SlideCard({
  slide,
  index,
  total,
  isDragging,
  isDragOver,
  canDeactivate,
  canDelete,
  onToggleActivo,
  onSetPrincipal,
  onDeleted,
  onMoveUp,
  onMoveDown,
  onDragStart,
  onDragOver,
  onDragLeave,
  onDrop,
  onDragEnd,
}: {
  slide: Slide;
  index: number;
  total: number;
  isDragging: boolean;
  isDragOver: boolean;
  canDeactivate: { ok: boolean; reason?: string };
  canDelete: { ok: boolean; reason?: string };
  onToggleActivo: () => void;
  onSetPrincipal: () => void;
  onDeleted: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDragStart: () => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: () => void;
  onDrop: () => void;
  onDragEnd: () => void;
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
    badge_texto: slide.badge_texto ?? "",
    titulo: slide.titulo,
    subtitulo: slide.subtitulo ?? "",
    imagen_alt: slide.imagen_alt,
  });

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setError("La imagen no puede superar 5 MB");
      return;
    }
    setPreviewUrl(URL.createObjectURL(file));
    setUploadProgress("uploading");
    setError(null);

    const ext = file.name.split(".").pop();
    const filename = `slide-${slide.id}-${Date.now()}.${ext}`;
    const supabase = createClient();
    const { error: uploadError } = await supabase.storage
      .from("hero-images")
      .upload(filename, file, { upsert: true });

    if (uploadError) {
      setUploadProgress("error");
      setError("Error al subir la imagen: " + uploadError.message);
      return;
    }
    const { data: { publicUrl } } = supabase.storage.from("hero-images").getPublicUrl(filename);
    startTransition(async () => {
      const result = await updateHeroSlide(slide.id, { imagen_url: publicUrl });
      if (result.error) { setUploadProgress("error"); setError(result.error); }
      else setUploadProgress("done");
    });
  }

  function handleSaveText() {
    setError(null);
    setSuccess(false);
    startTransition(async () => {
      const result = await updateHeroSlide(slide.id, {
        badge_texto: form.badge_texto || undefined,
        titulo: form.titulo,
        subtitulo: form.subtitulo || undefined,
        imagen_alt: form.imagen_alt,
      });
      if (result.error) setError(result.error);
      else { setSuccess(true); setTimeout(() => setSuccess(false), 3000); }
    });
  }

  const currentImage = previewUrl ?? slide.imagen_url;
  const isValidUrl = (() => {
    if (currentImage.startsWith("/")) return true;
    try { new URL(currentImage); return true; } catch { return false; }
  })();

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onDragEnd={onDragEnd}
      className="rounded-xl border overflow-hidden transition-all duration-150"
      style={{
        backgroundColor: "#fff",
        borderColor: isDragOver ? "var(--color-azul-400)" : "#E5E7EB",
        opacity: isDragging ? 0.45 : 1,
        boxShadow: isDragOver ? "0 0 0 2px var(--color-azul-200), 0 4px 16px rgba(0,0,0,0.08)" : undefined,
        transform: isDragOver ? "scale(1.005)" : undefined,
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 bg-gray-50">
        <div className="flex items-center gap-2">
          <span title="Arrastrar para reordenar" className="cursor-grab active:cursor-grabbing" style={{ color: "#9CA3AF", display: "flex" }}>
            <GripVertical size={16} />
          </span>
          <span className="text-sm font-semibold text-gray-700">Slide #{index + 1}</span>
          {slide.es_principal && (
            <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: "var(--color-azul-900)", color: "#fff" }}>
              ★ Principal
            </span>
          )}
          {!slide.activo && (
            <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: "#F3F4F6", color: "#6B7280" }}>
              Oculto
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* Orden ▲ ▼ */}
          <div className="flex items-center gap-0.5">
            <button onClick={onMoveUp} disabled={isPending || index === 0} title="Subir"
              className="p-1 rounded transition-colors disabled:opacity-25" style={{ color: "var(--color-azul-600)" }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--color-azul-50)")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}>
              <ChevronUp size={16} />
            </button>
            <button onClick={onMoveDown} disabled={isPending || index === total - 1} title="Bajar"
              className="p-1 rounded transition-colors disabled:opacity-25" style={{ color: "var(--color-azul-600)" }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--color-azul-50)")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}>
              <ChevronDown size={16} />
            </button>
          </div>

          {/* Marcar principal */}
          {!slide.es_principal && (
            <button onClick={onSetPrincipal} disabled={isPending}
              className="text-xs font-medium transition-colors disabled:opacity-50"
              style={{ color: "var(--color-azul-700)" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-azul-900)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-azul-700)")}>
              Marcar como principal
            </button>
          )}

          {/* Toggle activo */}
          <label
            className="flex items-center gap-2 select-none"
            style={{ cursor: canDeactivate.ok || !slide.activo ? "pointer" : "not-allowed" }}
            title={!canDeactivate.ok && slide.activo ? canDeactivate.reason : undefined}
          >
            <span className="text-xs text-gray-500">{slide.activo ? "Activo" : "Inactivo"}</span>
            <button
              onClick={() => {
                if (!slide.activo || canDeactivate.ok) onToggleActivo();
              }}
              disabled={isPending || (slide.activo && !canDeactivate.ok)}
              className="relative inline-flex h-5 w-9 items-center rounded-full transition-colors disabled:opacity-40"
              style={{ backgroundColor: slide.activo ? "var(--color-azul-800)" : "#D1D5DB" }}
            >
              <span className="inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform"
                style={{ transform: slide.activo ? "translateX(18px)" : "translateX(2px)" }} />
            </button>
          </label>

          {/* Eliminar */}
          {confirmDelete ? (
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-red-600 font-medium">¿Eliminar?</span>
              <button
                onClick={() => {
                  startTransition(async () => {
                    const result = await deleteHeroSlide(slide.id);
                    if (!result.error) onDeleted();
                  });
                }}
                disabled={isPending}
                className="text-xs font-semibold px-2 py-0.5 rounded disabled:opacity-50"
                style={{ backgroundColor: "#FEE2E2", color: "#DC2626" }}>
                Sí
              </button>
              <button onClick={() => setConfirmDelete(false)}
                className="text-xs font-medium px-2 py-0.5 rounded"
                style={{ backgroundColor: "#F3F4F6", color: "#6B7280" }}>
                No
              </button>
            </div>
          ) : (
            <button
              onClick={() => { if (canDelete.ok) setConfirmDelete(true); }}
              disabled={isPending || !canDelete.ok}
              title={!canDelete.ok ? canDelete.reason : "Eliminar slide"}
              className="p-1 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              style={{ color: "#EF4444" }}
              onMouseEnter={(e) => { if (canDelete.ok) e.currentTarget.style.backgroundColor = "#FEE2E2"; }}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}>
              <Trash2 size={15} />
            </button>
          )}

          {/* Toggle colapso */}
          <button onClick={() => setCollapsed((c) => !c)} title={collapsed ? "Expandir" : "Contraer"}
            className="p-1 rounded transition-colors" style={{ color: "#9CA3AF" }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#F3F4F6")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}>
            <ChevronRight size={16} style={{ transform: collapsed ? "rotate(0deg)" : "rotate(90deg)", transition: "transform 0.2s ease" }} />
          </button>
        </div>
      </div>

      {/* Razón bloqueada (si aplica) */}
      {(!canDeactivate.ok || !canDelete.ok) && (
        <div className="px-5 py-2 text-xs" style={{ backgroundColor: "#FFFBEB", color: "#92400E", borderBottom: "1px solid #FDE68A" }}>
          {!canDeactivate.ok ? canDeactivate.reason : canDelete.reason}
        </div>
      )}

      {!collapsed && (
        <div className="p-5 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Imagen */}
          <div className="space-y-3">
            <p className="text-sm font-medium text-gray-700">Imagen de fondo</p>
            <div className="relative w-full rounded-lg overflow-hidden bg-gray-100" style={{ aspectRatio: "16/6" }}>
              {isValidUrl ? (
                <Image src={currentImage} alt={form.imagen_alt || "Hero slide"} fill className="object-cover" unoptimized />
              ) : (
                <div className="flex items-center justify-center h-full text-sm text-gray-400">Sin imagen válida</div>
              )}
              {uploadProgress === "uploading" && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="text-white text-sm font-medium">Subiendo…</span>
                </div>
              )}
              {uploadProgress === "done" && (
                <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">✓ Guardada</div>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp,image/avif" className="hidden" onChange={handleImageUpload} />
            <button onClick={() => fileRef.current?.click()} disabled={isPending || uploadProgress === "uploading"}
              className="w-full rounded-lg border-2 border-dashed border-gray-300 py-2.5 text-sm text-gray-600 hover:border-azul-600 hover:text-azul-800 transition-colors disabled:opacity-50">
              {uploadProgress === "uploading" ? "Subiendo imagen…" : "Seleccionar imagen"}
            </button>
            <p className="text-xs text-gray-400">JPG, PNG, WebP o AVIF · máx. 5 MB · recomendado: <strong>1920 × 711 px</strong></p>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Texto alternativo (accesibilidad)</label>
              <input type="text" value={form.imagen_alt}
                onChange={(e) => setForm((f) => ({ ...f, imagen_alt: e.target.value }))}
                className="w-full rounded border border-gray-200 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-azul-600"
                placeholder="Descripción de la imagen" />
            </div>
          </div>

          {/* Textos */}
          <div className="space-y-4">
            <p className="text-sm font-medium text-gray-700">Contenido del slide</p>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Badge</label>
              <input type="text" value={form.badge_texto}
                onChange={(e) => setForm((f) => ({ ...f, badge_texto: e.target.value }))}
                className="w-full rounded border border-gray-200 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-azul-600"
                placeholder="Cardiocentro Pediátrico de Sucre" maxLength={120} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Título</label>
              <input type="text" value={form.titulo}
                onChange={(e) => setForm((f) => ({ ...f, titulo: e.target.value }))}
                className="w-full rounded border border-gray-200 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-azul-600"
                placeholder="Título principal" maxLength={200} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Subtítulo</label>
              <textarea value={form.subtitulo}
                onChange={(e) => setForm((f) => ({ ...f, subtitulo: e.target.value }))}
                rows={4} className="w-full rounded border border-gray-200 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-azul-600 resize-none"
                placeholder="Descripción del slide…" />
            </div>
            {error && <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">{error}</p>}
            {success && <p className="text-xs text-green-700 bg-green-50 border border-green-200 rounded px-3 py-2">Cambios guardados correctamente</p>}
            <button onClick={handleSaveText} disabled={isPending}
              className="w-full rounded-lg py-2.5 text-sm font-semibold text-white transition-colors disabled:opacity-60"
              style={{ backgroundColor: "var(--color-azul-800)" }}>
              {isPending ? "Guardando…" : "Guardar cambios"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Nuevo slide ──────────────────────────────────────────────

function NewSlideCard({ nextOrden, onCancel, onCreated }: {
  nextOrden: number;
  onCancel: () => void;
  onCreated: () => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [uploadProgress, setUploadProgress] = useState<"idle" | "uploading" | "done" | "error">("idle");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({ badge_texto: "", titulo: "", subtitulo: "", imagen_alt: "" });

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { setError("Máximo 5 MB"); return; }
    setPreviewUrl(URL.createObjectURL(file));
    setUploadProgress("uploading");
    setError(null);
    const ext = file.name.split(".").pop();
    const filename = `slide-new-${Date.now()}.${ext}`;
    const supabase = createClient();
    const { error: uploadError } = await supabase.storage.from("hero-images").upload(filename, file, { upsert: true });
    if (uploadError) { setUploadProgress("error"); setError("Error al subir la imagen: " + uploadError.message); return; }
    const { data: { publicUrl } } = supabase.storage.from("hero-images").getPublicUrl(filename);
    setImageUrl(publicUrl);
    setUploadProgress("done");
  }

  function handleCreate() {
    if (!imageUrl) { setError("Sube una imagen primero"); return; }
    if (!form.titulo.trim()) { setError("El título es obligatorio"); return; }
    if (!form.imagen_alt.trim()) { setError("El texto alternativo es obligatorio"); return; }
    setError(null);
    startTransition(async () => {
      const result = await createHeroSlide({
        imagen_url: imageUrl,
        imagen_alt: form.imagen_alt,
        badge_texto: form.badge_texto || undefined,
        titulo: form.titulo,
        subtitulo: form.subtitulo || undefined,
        orden: nextOrden,
      });
      if (result.error) setError(result.error);
      else onCreated();
    });
  }

  return (
    <div className="bg-white rounded-xl border border-azul-200 overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3" style={{ borderBottom: "1px solid var(--color-gris-100)", backgroundColor: "var(--color-azul-50)" }}>
        <span className="text-sm font-semibold" style={{ color: "var(--color-azul-900)" }}>Nuevo slide</span>
        <button onClick={onCancel} className="text-xs text-gray-400 hover:text-gray-600 transition-colors">Cancelar</button>
      </div>
      <div className="p-5 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-3">
          <p className="text-sm font-medium text-gray-700">Imagen de fondo</p>
          <div className="relative w-full rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center" style={{ aspectRatio: "16/6" }}>
            {previewUrl ? (
              <Image src={previewUrl} alt="Preview" fill className="object-cover" unoptimized />
            ) : (
              <span className="text-xs text-gray-400">Sin imagen</span>
            )}
            {uploadProgress === "uploading" && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="text-white text-sm font-medium">Subiendo…</span>
              </div>
            )}
            {uploadProgress === "done" && (
              <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">✓ Lista</div>
            )}
          </div>
          <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp,image/avif" className="hidden" onChange={handleImageUpload} />
          <button onClick={() => fileRef.current?.click()} disabled={uploadProgress === "uploading"}
            className="w-full rounded-lg border-2 border-dashed border-gray-300 py-2.5 text-sm text-gray-600 hover:border-azul-600 hover:text-azul-800 transition-colors disabled:opacity-50">
            {uploadProgress === "uploading" ? "Subiendo…" : "Seleccionar imagen"}
          </button>
          <p className="text-xs text-gray-400">JPG, PNG, WebP o AVIF · máx. 5 MB · recomendado: <strong>1920 × 711 px</strong></p>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Texto alternativo (accesibilidad) *</label>
            <input type="text" value={form.imagen_alt}
              onChange={(e) => setForm((f) => ({ ...f, imagen_alt: e.target.value }))}
              className="w-full rounded border border-gray-200 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-azul-600"
              placeholder="Descripción de la imagen" />
          </div>
        </div>
        <div className="space-y-4">
          <p className="text-sm font-medium text-gray-700">Contenido del slide</p>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Badge</label>
            <input type="text" value={form.badge_texto}
              onChange={(e) => setForm((f) => ({ ...f, badge_texto: e.target.value }))}
              className="w-full rounded border border-gray-200 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-azul-600"
              placeholder="Cardiocentro Pediátrico de Sucre" maxLength={120} />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Título *</label>
            <input type="text" value={form.titulo}
              onChange={(e) => setForm((f) => ({ ...f, titulo: e.target.value }))}
              className="w-full rounded border border-gray-200 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-azul-600"
              placeholder="Título principal" maxLength={200} />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Subtítulo</label>
            <textarea value={form.subtitulo}
              onChange={(e) => setForm((f) => ({ ...f, subtitulo: e.target.value }))}
              rows={4} className="w-full rounded border border-gray-200 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-azul-600 resize-none"
              placeholder="Descripción del slide…" />
          </div>
          {error && <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">{error}</p>}
          <button onClick={handleCreate} disabled={isPending || uploadProgress === "uploading"}
            className="w-full rounded-lg py-2.5 text-sm font-semibold text-white transition-colors disabled:opacity-60"
            style={{ backgroundColor: "var(--color-azul-800)" }}>
            {isPending ? "Creando…" : "Crear slide"}
          </button>
        </div>
      </div>
    </div>
  );
}