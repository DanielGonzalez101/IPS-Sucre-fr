"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { CursorClick } from "@phosphor-icons/react";
import { ServiciosAlfabeticoFiltro } from "./ServiciosAlfabeticoFiltro";
import { ServiciosAlfabeticoResultados } from "./ServiciosAlfabeticoResultados";
import type { ServicioCatalogo } from "@/actions/servicios";

const PAGE_SIZE = 12;

function normalizarTexto(s: string): string {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();
}

function derivarLetra(titulo: string): string {
  return normalizarTexto(titulo).charAt(0).toUpperCase();
}

interface Props {
  servicios: ServicioCatalogo[] | null;
}

export function ServiciosAlfabeticoSection({ servicios }: Props) {
  const lista = servicios ?? [];
  const sectionRef = useRef<HTMLDivElement>(null);
  const resultadosRef = useRef<HTMLDivElement>(null);

  const [letraActiva, setLetraActiva] = useState<string | null>(null);
  const [busquedaInput, setBusquedaInput] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [pagina, setPagina] = useState(1);

  useEffect(() => {
    const timeout = setTimeout(() => setBusqueda(normalizarTexto(busquedaInput)), 200);
    return () => clearTimeout(timeout);
  }, [busquedaInput]);

  const handleLetraChange = (letra: string | null) => {
    setLetraActiva(letra);
    setPagina(1);
    if (letra) setBusquedaInput("");
  };

  const handleBusquedaChange = (valor: string) => {
    setBusquedaInput(valor);
    setPagina(1);
    if (valor) setLetraActiva(null);
  };

  const letras = useMemo(
    () => Array.from(new Set(lista.map((s) => derivarLetra(s.titulo)))).sort(),
    [lista]
  );

  const interactuando = letraActiva !== null || busqueda.length > 0;

  const resultados = useMemo(() => {
    const filtrados = letraActiva
      ? lista.filter((s) => derivarLetra(s.titulo) === letraActiva)
      : busqueda
        ? lista.filter((s) => normalizarTexto(s.titulo).includes(busqueda))
        : [];
    return [...filtrados].sort((a, b) => a.titulo.localeCompare(b.titulo, "es"));
  }, [lista, letraActiva, busqueda]);

  // Reset page when results change (nueva letra o búsqueda)
  useEffect(() => { setPagina(1); }, [resultados]);

  const resultadosVisibles = useMemo(
    () => resultados.slice(0, pagina * PAGE_SIZE),
    [resultados, pagina]
  );
  const hayMas = resultados.length > pagina * PAGE_SIZE;

  const [resultadosCongelados, setResultadosCongelados] = useState<ServicioCatalogo[]>([]);
  const [paginaCongelada, setPaginaCongelada] = useState(1);
  const [panelVisible, setPanelVisible] = useState(interactuando);
  const estabaInteractuandoRef = useRef(interactuando);

  useEffect(() => {
    if (interactuando) {
      setResultadosCongelados(resultadosVisibles);
      setPaginaCongelada(pagina);
    }
  }, [resultadosVisibles, interactuando, pagina]);

  useEffect(() => {
    if (interactuando) {
      estabaInteractuandoRef.current = true;
      setPanelVisible(true);
      return;
    }
    if (!estabaInteractuandoRef.current) return;
    estabaInteractuandoRef.current = false;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !resultadosRef.current) {
      setPanelVisible(false);
      return;
    }

    const cards = resultadosRef.current.querySelectorAll(".servicios-alfabetico-card");
    if (cards.length === 0) {
      setPanelVisible(false);
      return;
    }

    gsap.to(cards, {
      opacity: 0,
      y: 12,
      duration: 0.25,
      ease: "power2.in",
      onComplete: () => setPanelVisible(false),
    });
  }, [interactuando]);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      gsap.set(".servicios-alfabetico-heading", { opacity: 0, y: 24 });
      gsap.to(".servicios-alfabetico-heading", {
        opacity: 1,
        y: 0,
        duration: 0.55,
        ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 85%" },
      });

      gsap.set(".servicios-alfabetico-panel", { opacity: 0, y: 32 });
      gsap.to(".servicios-alfabetico-panel", {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
      });
    },
    { scope: sectionRef }
  );

  useGSAP(
    () => {
      if (!interactuando) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      if (!resultadosRef.current) return;

      const cards = resultadosRef.current.querySelectorAll(".servicios-alfabetico-card");
      if (cards.length === 0) return;

      gsap.fromTo(
        cards,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.35, stagger: 0.04, ease: "power2.out" }
      );
    },
    { dependencies: [resultadosVisibles, interactuando], scope: resultadosRef }
  );

  if (lista.length === 0) return null;

  const visibles = interactuando ? resultadosVisibles : resultadosCongelados;
  const totalResultados = resultados.length;
  const mostradosHasta = interactuando ? pagina * PAGE_SIZE : paginaCongelada * PAGE_SIZE;

  return (
    <section
      ref={sectionRef}
      className="relative py-16 md:py-24 overflow-hidden"
      style={{ backgroundColor: "#fff" }}
      aria-labelledby="servicios-alfabetico-title"
    >
      <div className="participa-section-blobs" aria-hidden="true" />

      <div className="container-main relative z-10">
        <div className="servicios-alfabetico-heading mb-10">
          <span
            className="inline-flex items-center gap-1.5 font-heading font-semibold text-sm px-4 py-1.5 mb-4"
            style={{
              backgroundColor: "var(--color-azul-100)",
              color: "var(--color-azul-800)",
              borderRadius: "999px",
            }}
          >
            Servicios
          </span>
          <h2
            id="servicios-alfabetico-title"
            className="font-heading font-bold text-3xl md:text-4xl leading-tight"
            style={{ color: "var(--color-azul-900)" }}
          >
            Encuentra tu servicio de A a Z
          </h2>
        </div>

        <div className="grid lg:grid-cols-[300px_1fr] gap-8 items-start">
          <div className="servicios-alfabetico-panel participa-glass rounded-3xl p-6">
            <ServiciosAlfabeticoFiltro
              letras={letras}
              letraActiva={letraActiva}
              busqueda={busquedaInput}
              onLetraChange={handleLetraChange}
              onBusquedaChange={handleBusquedaChange}
            />
          </div>

          <div ref={resultadosRef} className="servicios-alfabetico-panel">
            {panelVisible ? (
              <ServiciosAlfabeticoResultados
                servicios={visibles}
                total={totalResultados}
                mostrados={Math.min(mostradosHasta, totalResultados)}
                onVerMas={hayMas && interactuando ? () => setPagina((p) => p + 1) : undefined}
              />
            ) : (
              <div
                className="participa-glass rounded-3xl flex flex-col items-center justify-center text-center gap-3 py-16 px-6"
                role="status"
              >
                <CursorClick size={28} style={{ color: "var(--color-gris-400)" }} aria-hidden="true" />
                <p className="font-heading font-semibold text-base" style={{ color: "var(--color-azul-900)" }}>
                  Elige una letra o escribe el nombre de un servicio
                </p>
                <p className="font-body text-sm max-w-xs" style={{ color: "var(--color-gris-500)" }}>
                  Los resultados aparecerán aquí apenas empieces a filtrar.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
