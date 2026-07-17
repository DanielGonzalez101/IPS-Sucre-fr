"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { ZoomIn, X, ChevronLeft, ChevronRight } from "lucide-react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";

export interface GaleriaItem {
  id: string;
  url: string;
  titulo?: string;
  subtitulo?: string;
  categoria: string;
}

const CATEGORIAS = [
  "Todos",
  "IPS",
  "Servicio",
  "Directores",
  "Equipo Humano",
  "Instalaciones",
];

// Sustituir por datos reales cuando la tabla `galeria` en Supabase esté lista.
const PLACEHOLDER_ITEMS: GaleriaItem[] = [
  { id: "1", url: "", titulo: "Instalaciones IPS", categoria: "IPS" },
  { id: "2", url: "", titulo: "Área de Diagnóstico", categoria: "Instalaciones" },
  { id: "3", url: "", titulo: "Equipo Médico", categoria: "Equipo Humano" },
  { id: "4", url: "", titulo: "Consultorios", categoria: "Instalaciones" },
  { id: "5", url: "", titulo: "Dr. Leandro Ruíz Moreno", subtitulo: "Cardiólogo Pediatra", categoria: "Directores" },
  { id: "6", url: "", titulo: "Sala de Espera", categoria: "Instalaciones" },
  { id: "7", url: "", titulo: "Dra. Alicia Llach López", subtitulo: "Médico Radiólogo", categoria: "Directores" },
];

export type CategoriaGaleria = "IPS" | "Servicio" | "Directores" | "Equipo Humano" | "Instalaciones";

interface GaleriaGridProps {
  items?: GaleriaItem[];
}

export default function GaleriaGrid({ items = PLACEHOLDER_ITEMS }: GaleriaGridProps) {
  const [filtroActivo, setFiltroActivo] = useState("Todos");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const trigger = { trigger: sectionRef.current, start: "top 82%" };

      gsap.from(".galeria-cell", {
        opacity: 0,
        scale: 0.96,
        duration: 0.6,
        stagger: 0.07,
        ease: "power2.out",
        scrollTrigger: trigger,
      });
    },
    { scope: sectionRef }
  );

  const filtradas =
    filtroActivo === "Todos"
      ? items
      : items.filter((i) => i.categoria === filtroActivo);

  const featured = filtradas.slice(0, 7);
  const resto    = filtradas.slice(7);

  function openLightbox(index: number) {
    setLightboxIndex(index);
  }

  function closeLightbox() {
    setLightboxIndex(null);
  }

  function navigate(dir: 1 | -1) {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex + dir + filtradas.length) % filtradas.length);
  }

  return (
    <>
      {/* Filtros */}
      <div
        className="border-b"
        style={{ borderColor: "var(--color-gris-200)", backgroundColor: "#fff" }}
      >
        <div className="container-main py-6 flex flex-wrap items-center justify-between gap-4">
          <h2
            className="font-heading font-bold text-2xl"
            style={{ color: "var(--color-azul-900)" }}
          >
            Galería de imágenes
          </h2>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar por categoría">
            {CATEGORIAS.map((cat) => {
              const activa = filtroActivo === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setFiltroActivo(cat)}
                  aria-pressed={activa}
                  className="font-heading font-semibold text-xs rounded-full px-4 py-1.5 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-offset-1"
                  style={
                    activa
                      ? { backgroundColor: "var(--color-azul-900)", color: "#fff" }
                      : { backgroundColor: "var(--color-gris-100)", color: "var(--color-gris-600)" }
                  }
                >
                  {cat.toUpperCase()}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Grid */}
      <section
        ref={sectionRef}
        className="py-12 md:py-16"
        aria-label="Galería de imágenes"
      >
        <div className="container-main space-y-3">
          {filtradas.length === 0 ? (
            <p
              className="text-center py-24 font-body"
              style={{ color: "var(--color-gris-400)" }}
            >
              No hay imágenes en esta categoría.
            </p>
          ) : (
            <>
              {/* Layout asimétrico — primeros 7 */}
              {featured.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {/* Fila 1: ancha (2 col) + lateral (1 col) */}
                  {featured[0] && (
                    <GaleriaCell item={featured[0]} index={0} className="col-span-2 h-80 sm:h-96" onOpen={openLightbox} />
                  )}
                  {featured[1] && (
                    <GaleriaCell item={featured[1]} index={1} className="col-span-2 sm:col-span-1 h-80 sm:h-96" onOpen={openLightbox} />
                  )}

                  {/* Fila 2: 3 iguales */}
                  {featured[2] && (
                    <GaleriaCell item={featured[2]} index={2} className="col-span-1 h-64 sm:h-80" onOpen={openLightbox} />
                  )}
                  {featured[3] && (
                    <GaleriaCell item={featured[3]} index={3} className="col-span-1 h-64 sm:h-80" onOpen={openLightbox} />
                  )}
                  {featured[4] && (
                    <GaleriaCell item={featured[4]} index={4} className="col-span-2 sm:col-span-1 h-64 sm:h-80" onOpen={openLightbox} />
                  )}

                  {/* Fila 3: lateral (1 col) + ancha (2 col) */}
                  {featured[5] && (
                    <GaleriaCell item={featured[5]} index={5} className="col-span-2 sm:col-span-1 h-72 sm:h-80" onOpen={openLightbox} />
                  )}
                  {featured[6] && (
                    <GaleriaCell item={featured[6]} index={6} className="col-span-2 h-72 sm:h-80" onOpen={openLightbox} />
                  )}
                </div>
              )}

              {/* Grid regular para el resto */}
              {resto.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {resto.map((item, i) => (
                    <GaleriaCell
                      key={item.id}
                      item={item}
                      index={7 + i}
                      className="col-span-1 h-64 sm:h-72"
                      onOpen={openLightbox}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {lightboxIndex !== null && filtradas[lightboxIndex]?.url && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: "rgba(6,36,77,0.95)" }}
          role="dialog"
          aria-modal="true"
          aria-label={`Imagen: ${filtradas[lightboxIndex].titulo ?? ""}`}
          onClick={closeLightbox}
        >
          <button
            className="absolute top-5 right-5 flex items-center justify-center w-10 h-10 rounded-full transition-colors"
            style={{ backgroundColor: "rgba(255,255,255,0.12)", color: "#fff" }}
            onClick={closeLightbox}
            aria-label="Cerrar galería"
          >
            <X size={20} aria-hidden="true" />
          </button>

          <button
            className="absolute left-4 flex items-center justify-center w-10 h-10 rounded-full transition-colors"
            style={{ backgroundColor: "rgba(255,255,255,0.12)", color: "#fff" }}
            onClick={(e) => { e.stopPropagation(); navigate(-1); }}
            aria-label="Imagen anterior"
          >
            <ChevronLeft size={22} aria-hidden="true" />
          </button>

          <div
            className="relative mx-20 max-w-4xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full max-h-[80vh] overflow-hidden rounded-2xl">
              <Image
                src={filtradas[lightboxIndex].url}
                alt={filtradas[lightboxIndex].titulo ?? "Imagen de galería"}
                width={1200}
                height={800}
                className="w-full h-auto max-h-[80vh] object-contain"
              />
            </div>

            {(filtradas[lightboxIndex].titulo || filtradas[lightboxIndex].subtitulo) && (
              <div className="mt-4 text-center">
                {filtradas[lightboxIndex].titulo && (
                  <p
                    className="font-heading font-bold text-lg"
                    style={{ color: "#fff" }}
                  >
                    {filtradas[lightboxIndex].titulo}
                  </p>
                )}
                {filtradas[lightboxIndex].subtitulo && (
                  <p
                    className="font-body text-sm mt-1"
                    style={{ color: "rgba(255,255,255,0.65)" }}
                  >
                    {filtradas[lightboxIndex].subtitulo}
                  </p>
                )}
              </div>
            )}

            <p
              className="mt-3 text-center font-body text-xs"
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              {lightboxIndex + 1} / {filtradas.filter((i) => i?.url).length}
            </p>
          </div>

          <button
            className="absolute right-4 flex items-center justify-center w-10 h-10 rounded-full transition-colors"
            style={{ backgroundColor: "rgba(255,255,255,0.12)", color: "#fff" }}
            onClick={(e) => { e.stopPropagation(); navigate(1); }}
            aria-label="Imagen siguiente"
          >
            <ChevronRight size={22} aria-hidden="true" />
          </button>
        </div>
      )}
    </>
  );
}

/* ── Celda individual ─────────────────────────────── */
interface GaleriaCellProps {
  item: GaleriaItem;
  index: number;
  className: string;
  onOpen: (index: number) => void;
}

function GaleriaCell({ item, index, className, onOpen }: GaleriaCellProps) {
  return (
    <button
      className={`galeria-cell relative rounded-2xl overflow-hidden group ${className} w-full text-left`}
      style={{ backgroundColor: "var(--color-azul-50)" }}
      onClick={() => onOpen(index)}
      aria-label={`Ver imagen: ${item.titulo ?? "Galería"}`}
    >
      <Image
        src={item.url}
        alt={item.titulo ?? "Imagen de galería"}
        fill
        className="object-contain object-top transition-transform duration-500 group-hover:scale-105"
        sizes="(max-width: 768px) 50vw, 33vw"
      />

      {/* Overlay con info */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5"
        style={{
          background: "linear-gradient(to top, rgba(6,36,77,0.85) 0%, rgba(6,36,77,0.3) 55%, transparent 100%)",
        }}
        aria-hidden="true"
      >
        {item.titulo && (
          <p className="font-heading font-bold text-sm text-white leading-tight">
            {item.titulo}
          </p>
        )}
        {item.subtitulo && (
          <p className="font-body text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.75)" }}>
            {item.subtitulo}
          </p>
        )}
      </div>

      {/* Ícono zoom */}
      <div
        className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center w-8 h-8 rounded-full"
        style={{ backgroundColor: "rgba(255,255,255,0.18)", backdropFilter: "blur(6px)" }}
        aria-hidden="true"
      >
        <ZoomIn size={14} style={{ color: "#fff" }} />
      </div>
    </button>
  );
}
