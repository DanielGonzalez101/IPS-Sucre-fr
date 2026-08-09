"use client";

import { useA11y } from "../A11yContext";
import { ProfileKey } from "../types";

const PROFILES: { key: ProfileKey; label: string }[] = [
  { key: "ceguera", label: "Ceguera" },
  { key: "motora", label: "Trastornos de las habilidades motoras" },
  { key: "daltonismo", label: "Daltonismo" },
  { key: "visual", label: "Discapacidad visual" },
  { key: "epilepsia", label: "Epilepsia" },
  { key: "mayor", label: "Mayor" },
  { key: "dislexia", label: "Dislexia" },
];

export function ProfilesSection() {
  const { state, toggleProfile } = useA11y();

  return (
    <div>
      {PROFILES.map((p) => {
        const on = state.profiles[p.key];
        return (
          <div key={p.key} className="a11y-profile-row">
            <span style={{ display: "flex", alignItems: "center" }}>
              <span className="a11y-plus" aria-hidden>+</span>
              {p.label}
            </span>
            <button
              type="button"
              className="a11y-switch"
              data-on={on ? "true" : "false"}
              onClick={() => toggleProfile(p.key)}
              aria-pressed={on}
              aria-label={`${p.label} ${on ? "activado" : "desactivado"}`}
            >
              <span>ON</span>
              <span>OFF</span>
            </button>
          </div>
        );
      })}
    </div>
  );
}
