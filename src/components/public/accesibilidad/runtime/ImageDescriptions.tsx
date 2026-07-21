"use client";

import { useEffect } from "react";

export function ImageDescriptions() {
  useEffect(() => {
    const decorated: HTMLElement[] = [];

    const apply = () => {
      const imgs = Array.from(document.querySelectorAll<HTMLImageElement>("img"));
      imgs.forEach((img) => {
        if (img.closest(".a11y-panel, .a11y-launcher")) return;
        const alt = img.alt?.trim();
        if (!alt) return;
        const parent = img.parentElement;
        if (!parent) return;
        if (parent.querySelector(".a11y-alt-badge")) return;
        const badge = document.createElement("div");
        badge.className = "a11y-alt-badge";
        badge.textContent = alt;
        if (getComputedStyle(parent).position === "static") {
          parent.style.position = "relative";
        }
        parent.appendChild(badge);
        decorated.push(badge);
      });
    };

    apply();
    const obs = new MutationObserver(apply);
    obs.observe(document.body, { childList: true, subtree: true });

    return () => {
      obs.disconnect();
      decorated.forEach((el) => el.remove());
    };
  }, []);

  return null;
}
