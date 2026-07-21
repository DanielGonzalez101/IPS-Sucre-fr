"use client";

import { useEffect, useState } from "react";

type Heading = { level: number; text: string; id: string };

export function PageStructure() {
  const [headings, setHeadings] = useState<Heading[]>([]);

  useEffect(() => {
    const collect = () => {
      const nodes = Array.from(document.querySelectorAll<HTMLElement>("main h1, main h2, main h3, main h4"));
      const list: Heading[] = nodes.map((n, i) => {
        if (!n.id) n.id = `a11y-h-${i}`;
        return {
          level: parseInt(n.tagName.slice(1), 10),
          text: (n.innerText || "").trim().slice(0, 80),
          id: n.id,
        };
      });
      setHeadings(list);
    };
    collect();
    const obs = new MutationObserver(collect);
    obs.observe(document.body, { childList: true, subtree: true });
    return () => obs.disconnect();
  }, []);

  return (
    <aside className="a11y-structure-panel" aria-label="Estructura de la página">
      <h3>Estructura de la página</h3>
      {headings.length === 0 ? (
        <p style={{ fontSize: "0.8rem", color: "#6b7280" }}>Sin encabezados detectados.</p>
      ) : (
        <ul>
          {headings.map((h) => (
            <li key={h.id} className={`lvl-h${h.level}`}>
              <a href={`#${h.id}`}>{h.text || "(sin título)"}</a>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}
