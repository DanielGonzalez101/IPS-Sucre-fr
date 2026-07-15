"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Eye, ArrowUpRight, Quote } from "lucide-react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";

interface Noticia {
  id: string;
  slug: string;
  titulo: string;
  extracto: string;
  tag: string;
  img_url: string;
  fecha: string;
  vistas: number;
  activo: boolean;
}

const CATEGORIAS = ["Todos", "Tecnología", "Eventos", "Institucional"];

function formatDate(iso: string) {
  const [y, m, d] = iso.split("-");
  const meses = ["ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic"];
  return `${d} ${meses[parseInt(m) - 1]}. ${y}`;
}

/* ── Sección 1: Artículo destacado ─────────────── */
function FeaturedSection({ noticias }: { noticias: Noticia[] }) {
  const [main, side, quote] = noticias;
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const trigger = { trigger: sectionRef.current, start: "top 82%" };

      gsap.from(".nf-main", {
        x: -60,
        opacity: 0,
        scale: 0.97,
        duration: 0.85,
        ease: "power3.out",
        scrollTrigger: trigger,
      });

      gsap.from(".nf-side", {
        x: 50,
        opacity: 0,
        duration: 0.7,
        ease: "power2.out",
        delay: 0.18,
        scrollTrigger: trigger,
      });

      gsap.from(".nf-quote", {
        x: 50,
        opacity: 0,
        duration: 0.7,
        ease: "power2.out",
        delay: 0.34,
        scrollTrigger: trigger,
      });
    },
    { scope: sectionRef }
  );

  if (!main) return null;

  return (
    <section
      ref={sectionRef}
      className="py-12 md:py-16 border-b"
      style={{ borderColor: "var(--color-gris-200)" }}
    >
      <div className="container-main">
        <div className="noticias-featured-grid">

          {/* Artículo principal */}
          <Link href={`/noticias/${main.slug}`} className="nf-main noticias-featured-main group">
            <Image
              src={main.img_url}
              alt={main.titulo}
              fill
              style={{ objectFit: "cover", objectPosition: "top center" }}
              sizes="(min-width: 768px) 60vw, 100vw"
              priority
            />
            <div className="noticias-featured-overlay" aria-hidden="true" />
            <div className="noticias-featured-content">
              <span
                className="news-tag mb-3 inline-block"
                style={{ backgroundColor: "rgba(238,53,56,0.2)", color: "#fff" }}
              >
                {main.tag}
              </span>
              <h2
                className="font-heading font-bold text-white leading-tight mb-3"
                style={{ fontSize: "clamp(1.35rem, 2.5vw, 2rem)", textShadow: "0 2px 8px rgba(0,0,0,0.4)" }}
              >
                {main.titulo}
              </h2>
              <p
                className="font-body text-sm leading-relaxed mb-4"
                style={{ color: "rgba(255,255,255,0.82)" }}
              >
                {main.extracto}
              </p>
              <div
                className="flex items-center gap-3"
                style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.82rem" }}
              >
                <span>{formatDate(main.fecha)}</span>
                <span className="flex items-center gap-1">
                  <Eye size={12} aria-hidden="true" />{main.vistas}
                </span>
              </div>
            </div>
          </Link>

          {/* Tarjeta lateral con imagen */}
          {side && (
            <Link href={`/noticias/${side.slug}`} className="nf-side noticias-featured-side-card group">
              <div className="noticias-featured-side-img">
                <Image
                  src={side.img_url}
                  alt={side.titulo}
                  fill
                  style={{ objectFit: "cover", objectPosition: "top center" }}
                  sizes="130px"
                />
              </div>
              <div className="noticias-featured-side-body">
                <span className="news-tag" style={{ fontSize: "0.75rem" }}>{side.tag}</span>
                <p
                  className="font-heading font-bold text-sm leading-snug"
                  style={{ color: "var(--color-azul-900)" }}
                >
                  {side.titulo}
                </p>
                <span className="font-body text-xs" style={{ color: "var(--color-gris-400)" }}>
                  {formatDate(side.fecha)}
                </span>
              </div>
            </Link>
          )}

          {/* Bloque cita */}
          {quote && (
            <div className="nf-quote noticias-featured-quote">
              <Quote
                size={28}
                aria-hidden="true"
                style={{ color: "var(--color-rojo-500)", opacity: 0.35 }}
              />
              <p
                className="font-heading font-semibold leading-snug"
                style={{ fontSize: "clamp(0.95rem, 1.4vw, 1.1rem)", color: "var(--color-azul-900)" }}
              >
                {quote.extracto}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="news-tag" style={{ fontSize: "0.75rem" }}>{quote.tag}</span>
                <span className="font-body text-xs" style={{ color: "var(--color-gris-400)" }}>
                  {formatDate(quote.fecha)}
                </span>
              </div>
              <Link
                href={`/noticias/${quote.slug}`}
                className="inline-flex items-center gap-1 font-heading font-semibold text-xs mt-2"
                style={{ color: "var(--color-azul-700)" }}
              >
                Leer nota <ArrowUpRight size={12} aria-hidden="true" />
              </Link>
            </div>
          )}

        </div>
      </div>
    </section>
  );
}

/* ── Sección 2: Publicaciones recientes + filtros ── */
function RecentSection({ noticias }: { noticias: Noticia[] }) {
  const [activo, setActivo] = useState("Todos");
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const trigger = { trigger: sectionRef.current, start: "top 80%" };

      gsap.from(".nr-header", {
        y: 28,
        opacity: 0,
        duration: 0.6,
        ease: "power2.out",
        scrollTrigger: trigger,
      });

      gsap.from(".nr-big", {
        scale: 0.95,
        opacity: 0,
        duration: 0.85,
        ease: "power3.out",
        delay: 0.15,
        scrollTrigger: trigger,
      });

      gsap.from(".nr-sm", {
        y: 40,
        opacity: 0,
        duration: 0.55,
        stagger: 0.1,
        ease: "power2.out",
        delay: 0.25,
        scrollTrigger: trigger,
      });
    },
    { scope: sectionRef }
  );

  const filtradas =
    activo === "Todos" ? noticias : noticias.filter((n) => n.tag === activo);

  const bentoMain = filtradas[0];
  const bentoGrid = filtradas.slice(1, 5);

  return (
    <section
      ref={sectionRef}
      className="py-12 md:py-16 border-b"
      style={{ borderColor: "var(--color-gris-200)" }}
      aria-labelledby="recientes-titulo"
    >
      <div className="container-main">

        {/* Header + tabs */}
        <div className="nr-header flex flex-wrap items-center justify-between gap-4 mb-8">
          <h2
            id="recientes-titulo"
            className="font-heading font-bold text-2xl"
            style={{ color: "var(--color-azul-900)" }}
          >
            Publicaciones recientes
          </h2>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar por categoría">
            {CATEGORIAS.map((cat) => {
              const activa = activo === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActivo(cat)}
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

        {filtradas.length === 0 ? (
          <p className="text-center py-16 font-body" style={{ color: "var(--color-gris-400)" }}>
            No hay publicaciones en esta categoría.
          </p>
        ) : (
          <div className="noticias-bento-grid">

            {bentoMain && (
              <Link href={`/noticias/${bentoMain.slug}`} className="nr-big noticias-bento-big group">
                <Image
                  src={bentoMain.img_url}
                  alt={bentoMain.titulo}
                  fill
                  style={{ objectFit: "cover", objectPosition: "top center" }}
                  sizes="(min-width: 1024px) 40vw, 100vw"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(6,36,77,0.92) 0%, rgba(6,36,77,0.3) 55%, transparent 100%)",
                  }}
                  aria-hidden="true"
                />
                <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                  <span
                    className="font-heading font-semibold text-xs rounded-full px-3 py-1 mb-3 inline-block"
                    style={{ backgroundColor: "rgba(238,53,56,0.2)", color: "#fff" }}
                  >
                    {bentoMain.tag.toUpperCase()}
                  </span>
                  <h3
                    className="font-heading font-bold text-white leading-snug mb-2"
                    style={{ fontSize: "clamp(1rem, 1.6vw, 1.25rem)" }}
                  >
                    {bentoMain.titulo}
                  </h3>
                  <div
                    className="flex items-center gap-3"
                    style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.8rem" }}
                  >
                    <span>{formatDate(bentoMain.fecha)}</span>
                    <span className="flex items-center gap-1">
                      <Eye size={11} aria-hidden="true" />{bentoMain.vistas}
                    </span>
                  </div>
                </div>
              </Link>
            )}

            {bentoGrid.length > 0 && (
              <div className="noticias-bento-right">
                {bentoGrid.map((n) => (
                  <Link key={n.slug} href={`/noticias/${n.slug}`} className="nr-sm noticias-bento-sm">
                    <div className="noticias-bento-sm-img">
                      <Image
                        src={n.img_url}
                        alt={n.titulo}
                        fill
                        style={{ objectFit: "cover", objectPosition: "top center" }}
                        sizes="(min-width: 1024px) 20vw, 50vw"
                      />
                    </div>
                    <div className="noticias-bento-sm-body">
                      <span className="news-tag" style={{ fontSize: "0.75rem" }}>{n.tag}</span>
                      <p
                        className="font-heading font-bold text-sm leading-snug"
                        style={{ color: "var(--color-azul-900)" }}
                      >
                        {n.titulo}
                      </p>
                      <div className="noticias-bento-sm-meta">
                        <span>{formatDate(n.fecha)}</span>
                        <span className="flex items-center gap-1">
                          <Eye size={11} aria-hidden="true" />{n.vistas}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

          </div>
        )}

      </div>
    </section>
  );
}

/* ── Sección 3: Lista + artículo grande ─────────── */
function ListAndBigSection({ noticias }: { noticias: Noticia[] }) {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const trigger = { trigger: sectionRef.current, start: "top 90%", once: true };

      gsap.set(".nl-item", { y: 28, opacity: 0 });
      gsap.set(".nl-big", { y: 32, opacity: 0, scale: 0.97 });

      gsap.to(".nl-item", {
        y: 0,
        opacity: 1,
        duration: 0.55,
        stagger: 0.09,
        ease: "power2.out",
        scrollTrigger: trigger,
      });

      gsap.to(".nl-big", {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.8,
        ease: "power3.out",
        delay: 0.15,
        scrollTrigger: trigger,
      });
    },
    { scope: sectionRef }
  );

  const listItems = noticias.slice(0, 4);
  const bigArticle = noticias[noticias.length - 1];

  if (!bigArticle) return null;

  return (
    <section ref={sectionRef} className="py-12 md:py-16">
      <div className="container-main">
        <div className="noticias-list-grid">

          {/* Columna lista */}
          <div>
            {listItems.map((n) => (
              <Link key={n.slug} href={`/noticias/${n.slug}`} className="nl-item noticias-list-item group">
                <div className="noticias-list-img">
                  <Image
                    src={n.img_url}
                    alt={n.titulo}
                    fill
                    style={{ objectFit: "cover", objectPosition: "top center" }}
                    sizes="96px"
                  />
                </div>
                <div className="noticias-list-body">
                  <span className="news-tag" style={{ fontSize: "0.72rem" }}>{n.tag}</span>
                  <p
                    className="font-heading font-bold text-sm leading-snug"
                    style={{ color: "var(--color-azul-900)" }}
                  >
                    {n.titulo}
                  </p>
                  <div
                    className="flex items-center gap-3"
                    style={{ color: "var(--color-gris-400)", fontSize: "0.78rem" }}
                  >
                    <span>{formatDate(n.fecha)}</span>
                    <span className="flex items-center gap-1">
                      <Eye size={11} aria-hidden="true" />{n.vistas}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Artículo grande derecha */}
          <Link href={`/noticias/${bigArticle.slug}`} className="nl-big noticias-big-right group">
            <Image
              src={bigArticle.img_url}
              alt={bigArticle.titulo}
              fill
              style={{ objectFit: "cover", objectPosition: "top center" }}
              sizes="(min-width: 1024px) 50vw, 100vw"
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to top, rgba(6,36,77,0.92) 0%, rgba(6,36,77,0.3) 55%, transparent 100%)",
              }}
              aria-hidden="true"
            />
            <div className="absolute bottom-0 left-0 right-0 p-8 z-10">
              <span
                className="font-heading font-semibold text-xs rounded-full px-3 py-1 mb-3 inline-block"
                style={{ backgroundColor: "rgba(238,53,56,0.2)", color: "#fff" }}
              >
                {bigArticle.tag.toUpperCase()}
              </span>
              <h3
                className="font-heading font-bold text-white leading-snug mb-2"
                style={{ fontSize: "clamp(1.1rem, 1.8vw, 1.5rem)" }}
              >
                {bigArticle.titulo}
              </h3>
              <p
                className="font-body text-sm leading-relaxed mb-4"
                style={{ color: "rgba(255,255,255,0.80)" }}
              >
                {bigArticle.extracto}
              </p>
              <span
                className="inline-flex items-center gap-1 font-heading font-semibold text-sm"
                style={{ color: "rgba(255,255,255,0.7)" }}
              >
                Leer nota <ArrowUpRight size={14} aria-hidden="true" />
              </span>
            </div>
          </Link>

        </div>
      </div>
    </section>
  );
}

/* ── Export principal ────────────────────────────── */
export default function NoticiasGrid({ noticias }: { noticias: Noticia[] }) {
  return (
    <>
      <FeaturedSection noticias={noticias} />
      <RecentSection noticias={noticias} />
      <ListAndBigSection noticias={noticias} />
    </>
  );
}
