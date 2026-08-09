"use client";

import { useEffect, useRef } from "react";

const SIZE = 220;
const ZOOM = 2.0;

export function Magnifier() {
  const lensRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (window.self !== window.top) return;

    const lens = lensRef.current;
    const iframe = iframeRef.current;
    if (!lens || !iframe) return;

    // Sincronizar scroll cuando el iframe termina de cargar
    const syncScroll = () => {
      try {
        iframe.contentWindow?.scrollTo({
          top: window.scrollY,
          left: window.scrollX,
          behavior: "instant" as ScrollBehavior,
        });
      } catch {
        // cross-origin o aún cargando
      }
    };

    iframe.addEventListener("load", syncScroll);
    iframe.src = window.location.href;

    let rafId: number;

    const onMove = (e: MouseEvent) => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const cx = e.clientX;
        const cy = e.clientY;

        // Centrar el círculo en el cursor
        lens.style.left = `${cx - SIZE / 2}px`;
        lens.style.top = `${cy - SIZE / 2}px`;

        // El iframe ocupa todo el viewport.
        // Lo desplazamos para que el punto (cx, cy) quede en el centro del círculo.
        // Luego scale(ZOOM) con origin en (cx, cy) amplía desde ese punto.
        iframe.style.left = `${SIZE / 2 - cx}px`;
        iframe.style.top = `${SIZE / 2 - cy}px`;
        iframe.style.transformOrigin = `${cx}px ${cy}px`;
        iframe.style.transform = `scale(${ZOOM})`;

        syncScroll();
      });
    };

    window.addEventListener("mousemove", onMove);
    return () => {
      window.removeEventListener("mousemove", onMove);
      iframe.removeEventListener("load", syncScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  if (typeof window !== "undefined" && window.self !== window.top) return null;

  return (
    <div ref={lensRef} className="a11y-magnifier" aria-hidden>
      <iframe
        ref={iframeRef}
        className="a11y-magnifier-frame"
        tabIndex={-1}
        aria-hidden
      />
    </div>
  );
}
