"use client";

import { useState } from "react";
import { useA11y } from "./A11yContext";
import { ProfilesSection } from "./sections/ProfilesSection";
import { VoiceNavSection } from "./sections/VoiceNavSection";
import { ContentSection } from "./sections/ContentSection";

type SectionKey = "profiles" | "voice" | "content";

export function AccessibilityPanel({ onClose }: { onClose: () => void }) {
  const { reset } = useA11y();
  const [openSections, setOpenSections] = useState<Record<SectionKey, boolean>>({
    profiles: true,
    voice: true,
    content: true,
  });

  const toggle = (k: SectionKey) =>
    setOpenSections((prev) => ({ ...prev, [k]: !prev[k] }));

  return (
    <div className="a11y-panel" role="dialog" aria-label="Panel de accesibilidad">
      <div className="a11y-panel-header">
        <h2>Accesibilidad</h2>
        <div style={{ display: "flex", gap: 8 }}>
          <button type="button" onClick={reset}>Restablecer</button>
          <button type="button" onClick={onClose} aria-label="Cerrar">✕</button>
        </div>
      </div>

      <Section
        title="Perfiles de accesibilidad"
        open={openSections.profiles}
        onToggle={() => toggle("profiles")}
      >
        <ProfilesSection />
      </Section>

      <Section
        title="Ajustes de voz y navegación"
        open={openSections.voice}
        onToggle={() => toggle("voice")}
      >
        <VoiceNavSection />
      </Section>

      <Section
        title="Ajuste de contenido"
        open={openSections.content}
        onToggle={() => toggle("content")}
      >
        <ContentSection />
      </Section>
    </div>
  );
}

function Section({
  title,
  open,
  onToggle,
  children,
}: {
  title: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="a11y-section">
      <button type="button" className="a11y-section-title" onClick={onToggle} aria-expanded={open}>
        <span>{title}</span>
        <span className="a11y-section-toggle">{open ? "−" : "+"}</span>
      </button>
      {open && <div>{children}</div>}
    </div>
  );
}
