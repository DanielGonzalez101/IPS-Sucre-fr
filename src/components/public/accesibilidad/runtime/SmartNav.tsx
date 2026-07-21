"use client";

import { useEffect, useState } from "react";

const TARGETS = ["a", "button", "input", "textarea", "select"];

export function SmartNav() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!e.altKey) return;
      const els = Array.from(
        document.querySelectorAll<HTMLElement>(TARGETS.join(",")),
      ).filter((n) => !n.closest(".a11y-panel, .a11y-launcher") && n.offsetParent !== null);
      if (els.length === 0) return;

      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        const next = (idx + 1) % els.length;
        els[next].focus();
        els[next].scrollIntoView({ block: "center", behavior: "smooth" });
        setIdx(next);
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        const prev = (idx - 1 + els.length) % els.length;
        els[prev].focus();
        els[prev].scrollIntoView({ block: "center", behavior: "smooth" });
        setIdx(prev);
      } else if (e.key === "Enter") {
        els[idx]?.click();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [idx]);

  return null;
}
