"use client";

import { useEffect, useRef } from "react";

const ROWS = [
  ["1","2","3","4","5","6","7","8","9","0"],
  ["q","w","e","r","t","y","u","i","o","p"],
  ["a","s","d","f","g","h","j","k","l","ñ"],
  ["z","x","c","v","b","n","m",",",".","?"],
];

export function VirtualKeyboard() {
  const targetRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);

  useEffect(() => {
    const onFocus = (e: FocusEvent) => {
      const el = e.target as HTMLElement;
      if (el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA")) {
        targetRef.current = el as HTMLInputElement;
      }
    };
    document.addEventListener("focusin", onFocus);
    return () => document.removeEventListener("focusin", onFocus);
  }, []);

  const write = (fn: (v: string) => string) => {
    const el = targetRef.current;
    if (!el) return;
    el.focus();
    const next = fn(el.value);
    el.value = next;
    el.dispatchEvent(new Event("input", { bubbles: true }));
  };

  const press = (k: string) => write((v) => v + k);
  const backspace = () => write((v) => v.slice(0, -1));
  const space = () => press(" ");

  return (
    <div className="a11y-vkeyboard" role="group" aria-label="Teclado virtual">
      {ROWS.map((row, i) => (
        <div key={i} className="a11y-vkeyboard-row">
          {row.map((k) => (
            <button key={k} className="a11y-vkey" onClick={() => press(k)} type="button">{k}</button>
          ))}
        </div>
      ))}
      <div className="a11y-vkeyboard-row">
        <button className="a11y-vkey" onClick={backspace} type="button" style={{ minWidth: 80 }}>⌫</button>
        <button className="a11y-vkey" onClick={space} type="button" style={{ minWidth: 240 }}>espacio</button>
      </div>
    </div>
  );
}
