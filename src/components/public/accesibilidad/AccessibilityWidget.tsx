"use client";

import { useState } from "react";
import { useA11y } from "./A11yContext";
import { A11yApplier } from "./A11yApplier";
import { A11yRuntime } from "./A11yRuntime";
import { AccessibilityPanel } from "./AccessibilityPanel";

function A11yIcon() {
  return (
    <svg width={30} height={30} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <circle cx="12" cy="4" r="2" />
      <path d="M4 8h16v2h-6v12h-2v-6h-2v6h-2V10H4z" />
    </svg>
  );
}

export function AccessibilityWidget() {
  const [open, setOpen] = useState(false);
  useA11y(); // asegura contexto

  return (
    <>
      <A11yApplier />
      <A11yRuntime />
      <button
        type="button"
        className="a11y-launcher"
        aria-label="Abrir accesibilidad"
        onClick={() => setOpen(true)}
      >
        <A11yIcon />
      </button>
      {open && (
        <>
          <div className="a11y-overlay" onClick={() => setOpen(false)} />
          <AccessibilityPanel onClose={() => setOpen(false)} />
        </>
      )}
    </>
  );
}
