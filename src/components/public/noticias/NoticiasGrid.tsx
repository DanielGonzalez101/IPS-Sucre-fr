"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Eye, ArrowUpRight } from "lucide-react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";

const noticias = [
  {
    slug: "nueva-tecnologia-ecocardiograma",
    tag: "Tecnología",
    title: "Nueva tecnología de ecocardiograma 4D disponible en el Cardiocentro",
    excerpt:
      "Incorporamos equipos de última generación que permiten diagnósticos más precisos y seguros para nuestros pacientes pediátricos.",
    date: "2026-06-10",
    views: 142,
    img: "/images/bgecocardio.png",
  },
  {
    slug: "jornada-salud-cardiovascular",
    tag: "Eventos",
    title: "Jornada gratuita de salud cardiovascular para niños en Sincelejo",
    excerpt:
      "El próximo 5 de julio realizaremos una jornada de tamizaje cardíaco gratuita para niños entre 0 y 14 años en nuestra sede principal.",
    date: "2026-06-03",
    views: 89,
    img: "/images/bgholter.png",
  },
  {
    slug: "convenio-eps-coosalud",
    tag: "Institucional",
    title: "Cardiocentro firma convenio con Coosalud para ampliar cobertura regional",
    excerpt:
      "Gracias a este acuerdo, más familias de Sucre y Córdoba podrán acceder a nuestros servicios de cardiología pediátrica sin barreras.",
    date: "2026-05-20",
    views: 214,
    img: "/images/bgmamografia.png",
  },
  {
    slug: "nueva-sede-sampues",
    tag: "Institucional",
    title: "Abrimos nueva sede de atención en Sampués",
    excerpt:
      "Ampliamos nuestra cobertura con una nueva sede en Sampués, acercando los servicios de cardiología pediátrica a más familias del departamento.",
    date: "2026-05-08",
    views: 176,
    img: "/images/bgelectro.png",
  },
  {
    slug: "capacitacion-equipo-medico",
    tag: "Tecnología",
    title: "Nuestro equipo se capacita en técnicas de imagen cardiovascular de vanguardia",
    excerpt:
      "Médicos y tecnólogos del Cardiocentro completaron un programa de actualización en resonancia magnética cardíaca pediátrica.",
    date: "2026-04-22",
    views: 98,
    img: "/images/hero-team.png",
  },
  {
    slug: "feria-salud-sincelejo",
    tag: "Eventos",
    title: "Participamos en la Feria de Salud de Sincelejo 2026",
    excerpt:
      "El Cardiocentro estuvo presente con un stand de tamizaje gratuito y charlas educativas sobre salud cardiovascular en la infancia.",
    date: "2026-04-10",
    views: 131,
    img: "/images/hero-2.png",
  },
];

const CATEGORIAS = ["Todos", "Tecnología", "Eventos", "Institucional"];

function formatDate(iso: string) {
  const [y, m, d] = iso.split("-");
  const meses = ["ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic"];
  return `${d} ${meses[parseInt(m) - 1]}. ${y}`;
}

/* ── Sección 1: Artículo destacado ─────────────── */
function FeaturedSection() {
  const [main, side, quote] = noticias;
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const trigger = { trigger: sectionRef.current, start: "top 82%" };

      // Card principal: entra desde la izquierda con leve escala
      gsap.from(".nf-main", {
        x: -60,
        opacity: 0,
        scale: 0.97,
        duration: 0.85,
        ease: "power3.out",
        scrollTrigger: trigger,
      });

      // Tarjeta lateral superior: entra desde la derecha, con delay
      gsap.from(".nf-side", {
        x: 50,
        opacity: 0,
        duration: 0.7,
        ease: "power2.out",
        delay: 0.18,
        scrollTrigger: trigger,
      });

      // Bloque cita: entra desde la derecha, más tarde
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
              src={main.img}
              alt={main.title}
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
                {main.title}
              </h2>
              <p
                className="font-body text-sm leading-relaxed mb-4"
                style={{ color: "rgba(255,255,255,0.82)" }}
              >
                {main.excerpt}
              </p>
              <div
                className="flex items-center gap-3"
                style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.82rem" }}
              >
                <span>{formatDate(main.date)}</span>
                <span className="flex items-center gap-1">
                  <Eye size={12} aria-hidden="true" />{main.views}
                </span>
              </div>
            </div>
          </Link>

          {/* Tarjeta lateral con imagen */}
          <Link href={`/noticias/${side.slug}`} className="nf-side noticias-featured-side-card group">
            <div className="noticias-featured-side-img">
              <Image
                src={side.img}
                alt={side.title}
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
                {side.title}
              </p>
              <span className="font-body text-xs" style={{ color: "var(--color-gris-400)" }}>
                {formatDate(side.date)}
              </span>
            </div>
          </Link>

          {/* Bloque cita */}
          <div className="nf-quote noticias-featured-quote">
            <span
              className="font-heading font-black"
              style={{
                fontSize: "clamp(1.8rem, 3vw, 2.5rem)",
                lineHeight: 1,
                color: "var(--color-rojo-500)",
                opacity: 0.3,
              }}
              aria-hidden="true"
            >
              "
            </span>
            <p
              className="font-heading font-semibold leading-snug"
              style={{ fontSize: "clamp(0.95rem, 1.4vw, 1.1rem)", color: "var(--color-azul-900)" }}
            >
              {quote.excerpt}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <span className="news-tag" style={{ fontSize: "0.75rem" }}>{quote.tag}</span>
              <span className="font-body text-xs" style={{ color: "var(--color-gris-400)" }}>
                {formatDate(quote.date)}
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

        </div>
      </div>
    </section>
  );
}

/* ── Sección 2: Publicaciones recientes + filtros ── */
function RecentSection() {
  const [activo, setActivo] = useState("Todos");
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const trigger = { trigger: sectionRef.current, start: "top 80%" };

      // Encabezado + tabs
      gsap.from(".nr-header", {
        y: 28,
        opacity: 0,
        duration: 0.6,
        ease: "power2.out",
        scrollTrigger: trigger,
      });

      // Card grande: escala + fade
      gsap.from(".nr-big", {
        scale: 0.95,
        opacity: 0,
        duration: 0.85,
        ease: "power3.out",
        delay: 0.15,
        scrollTrigger: trigger,
      });

      // Cards pequeñas: stagger de abajo hacia arriba
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

            {/* Card grande con overlay */}
            {bentoMain && (
              <Link href={`/noticias/${bentoMain.slug}`} className="nr-big noticias-bento-big group">
                <Image
                  src={bentoMain.img}
                  alt={bentoMain.title}
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
                    {bentoMain.title}
                  </h3>
                  <div
                    className="flex items-center gap-3"
                    style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.8rem" }}
                  >
                    <span>{formatDate(bentoMain.date)}</span>
                    <span className="flex items-center gap-1">
                      <Eye size={11} aria-hidden="true" />{bentoMain.views}
                    </span>
                  </div>
                </div>
              </Link>
            )}

            {/* Grid 2×2 */}
            {bentoGrid.length > 0 && (
              <div className="noticias-bento-right">
                {bentoGrid.map(({ slug, tag, title, date, views, img }) => (
                  <Link key={slug} href={`/noticias/${slug}`} className="nr-sm noticias-bento-sm">
                    <div className="noticias-bento-sm-img">
                      <Image
                        src={img}
                        alt={title}
                        fill
                        style={{ objectFit: "cover", objectPosition: "top center" }}
                        sizes="(min-width: 1024px) 20vw, 50vw"
                      />
                    </div>
                    <div className="noticias-bento-sm-body">
                      <span className="news-tag" style={{ fontSize: "0.75rem" }}>{tag}</span>
                      <p
                        className="font-heading font-bold text-sm leading-snug"
                        style={{ color: "var(--color-azul-900)" }}
                      >
                        {title}
                      </p>
                      <div className="noticias-bento-sm-meta">
                        <span>{formatDate(date)}</span>
                        <span className="flex items-center gap-1">
                          <Eye size={11} aria-hidden="true" />{views}
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
function ListAndBigSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const trigger = { trigger: sectionRef.current, start: "top 90%", once: true };

      // Fijar estado inicial antes de que ScrollTrigger decida cuándo animar
      gsap.set(".nl-item", { y: 28, opacity: 0 });
      gsap.set(".nl-big", { y: 32, opacity: 0, scale: 0.97 });

      // Items de lista: stagger vertical suave
      gsap.to(".nl-item", {
        y: 0,
        opacity: 1,
        duration: 0.55,
        stagger: 0.09,
        ease: "power2.out",
        scrollTrigger: trigger,
      });

      // Artículo grande: sube con leve escala
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

  return (
    <section ref={sectionRef} className="py-12 md:py-16">
      <div className="container-main">
        <div className="noticias-list-grid">

          {/* Columna lista */}
          <div>
            {listItems.map(({ slug, tag, title, date, views, img }) => (
              <Link key={slug} href={`/noticias/${slug}`} className="nl-item noticias-list-item group">
                <div className="noticias-list-img">
                  <Image
                    src={img}
                    alt={title}
                    fill
                    style={{ objectFit: "cover", objectPosition: "top center" }}
                    sizes="96px"
                  />
                </div>
                <div className="noticias-list-body">
                  <span className="news-tag" style={{ fontSize: "0.72rem" }}>{tag}</span>
                  <p
                    className="font-heading font-bold text-sm leading-snug"
                    style={{ color: "var(--color-azul-900)" }}
                  >
                    {title}
                  </p>
                  <div
                    className="flex items-center gap-3"
                    style={{ color: "var(--color-gris-400)", fontSize: "0.78rem" }}
                  >
                    <span>{formatDate(date)}</span>
                    <span className="flex items-center gap-1">
                      <Eye size={11} aria-hidden="true" />{views}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Artículo grande derecha */}
          <Link href={`/noticias/${bigArticle.slug}`} className="nl-big noticias-big-right group">
            <Image
              src={bigArticle.img}
              alt={bigArticle.title}
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
                {bigArticle.title}
              </h3>
              <p
                className="font-body text-sm leading-relaxed mb-4"
                style={{ color: "rgba(255,255,255,0.80)" }}
              >
                {bigArticle.excerpt}
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
export default function NoticiasGrid() {
  return (
    <>
      <FeaturedSection />
      <RecentSection />
      <ListAndBigSection />
    </>
  );
}
