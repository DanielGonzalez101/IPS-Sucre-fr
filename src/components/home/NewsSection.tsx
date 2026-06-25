"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { ArrowLeft, ArrowRight, Eye, ArrowUpRight } from "lucide-react";

const news = [
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
];

function formatDate(iso: string) {
  const [y, m, d] = iso.split("-");
  const months = ["ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic"];
  return `${d} ${months[parseInt(m) - 1]}. ${y}`;
}

export function NewsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      gsap.from(".news-heading", {
        y: 30, opacity: 0, duration: 0.6, ease: "power2.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 85%" },
      });

      gsap.from(".news-card", {
        y: 40, opacity: 0, duration: 0.55, stagger: 0.12, ease: "power2.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
      });
    },
    { scope: sectionRef }
  );

  const scroll = (dir: "left" | "right") => {
    if (!trackRef.current) return;
    trackRef.current.scrollBy({ left: dir === "right" ? 360 : -360, behavior: "smooth" });
  };

  return (
    <section
      ref={sectionRef}
      className="py-16 md:py-24"
      style={{ backgroundColor: "#fff" }}
      aria-labelledby="news-title"
    >
      <div className="container-main">

        {/* ── Header ── */}
        <div className="news-heading flex items-end justify-between mb-10 gap-4 flex-wrap">
          <div>
            <span className="news-chip">+ Noticias</span>
            <h2
              id="news-title"
              className="font-heading font-bold text-3xl md:text-4xl mt-3"
              style={{ color: "var(--color-azul-900)" }}
            >
              Últimas publicaciones
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => scroll("left")}
              className="news-nav-btn"
              aria-label="Noticias anteriores"
            >
              <ArrowLeft size={18} />
            </button>
            <button
              onClick={() => scroll("right")}
              className="news-nav-btn"
              aria-label="Noticias siguientes"
            >
              <ArrowRight size={18} />
            </button>
          </div>
        </div>

        {/* ── Cards ── */}
        <div ref={trackRef} className="news-track">
          {news.map(({ slug, tag, title, excerpt, date, views, img }) => (
            <article key={slug} className="news-card">

              {/* Imagen */}
              <div className="news-card-img">
                <Image
                  src={img}
                  alt={title}
                  fill
                  style={{ objectFit: "cover", objectPosition: "top center" }}
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                />
              </div>

              {/* Cuerpo */}
              <div className="news-card-body">
                <span className="news-tag">{tag}</span>
                <h3 className="news-card-title">{title}</h3>
                <p className="news-card-excerpt">{excerpt}</p>
              </div>

              {/* Footer */}
              <div className="news-card-footer">
                <Link href={`/noticias/${slug}`} className="news-read-more">
                  Leer más <ArrowUpRight size={13} aria-hidden="true" />
                </Link>
                <div className="news-meta">
                  <span>{formatDate(date)}</span>
                  <span className="news-meta-views">
                    <Eye size={13} aria-hidden="true" />
                    {views}
                  </span>
                </div>
              </div>

            </article>
          ))}
        </div>

      </div>
    </section>
  );
}
