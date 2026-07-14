"use client";

import { useState, useRef, useEffect, useId } from "react";
import { ChevronDown, FileText } from "lucide-react";
import { DOC_TYPES, type DocType } from "@/lib/validations/pqrs";

const DOC_LABEL: Record<DocType, string> = {
  CC:        "Cédula de Ciudadanía",
  CE:        "Cédula de Extranjería",
  NUIP:      "NUIP",
  TI:        "Tarjeta de Identidad",
  NIT:       "NIT",
  Pasaporte: "Pasaporte",
  PPT:       "Permiso de Protección Temporal",
  Otro:      "Otro",
};

interface Props {
  inputId: string;
  value: DocType | "";
  onChange: (value: DocType) => void;
  hasError?: boolean;
}

export default function DocTypeSelect({ inputId, value, onChange, hasError = false }: Props) {
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listId = useId();

  const borderColor = hasError
    ? "#EE3538"
    : open
    ? "var(--color-azul-600)"
    : "#e5e7eb";

  const ringColor = hasError
    ? "rgba(238,53,56,0.20)"
    : "rgba(26,92,184,0.20)";

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    if (!open) return;
    const item = listRef.current?.children[highlighted] as HTMLElement;
    item?.scrollIntoView({ block: "nearest" });
  }, [highlighted, open]);

  function toggle() {
    if (!open) {
      const idx = value ? DOC_TYPES.indexOf(value as DocType) : 0;
      setHighlighted(idx >= 0 ? idx : 0);
    }
    setOpen((v) => !v);
  }

  function select(dt: DocType) {
    onChange(dt);
    setOpen(false);
    triggerRef.current?.focus();
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!open) {
      if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        setOpen(true);
        setHighlighted(value ? DOC_TYPES.indexOf(value as DocType) : 0);
      }
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlighted((h) => Math.min(h + 1, DOC_TYPES.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlighted((h) => Math.max(h - 1, 0));
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      select(DOC_TYPES[highlighted]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        ref={triggerRef}
        id={inputId}
        type="button"
        role="combobox"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls={listId}
        onKeyDown={handleKeyDown}
        onClick={toggle}
        className="w-full flex items-center gap-3 rounded-xl border px-5 py-4 text-base bg-white transition-all duration-200 cursor-pointer focus:outline-none"
        style={{
          borderColor,
          boxShadow: open || hasError ? `0 0 0 3px ${ringColor}` : "none",
          color: value ? "var(--color-gris-800)" : "#9ca3af",
        }}
      >
        <FileText
          size={18}
          className="flex-shrink-0"
          aria-hidden="true"
          style={{ color: value ? "var(--color-azul-600)" : "#9ca3af" }}
        />
        <span className="flex-1 text-left truncate">
          {value ? DOC_LABEL[value as DocType] : "Seleccione tipo de documento…"}
        </span>
        <ChevronDown
          size={18}
          className="flex-shrink-0 transition-transform duration-200"
          aria-hidden="true"
          style={{
            color: "#9ca3af",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
          }}
        />
      </button>

      {open && (
        <ul
          ref={listRef}
          id={listId}
          role="listbox"
          aria-label="Tipo de documento"
          className="absolute z-50 w-full mt-1.5 rounded-xl overflow-y-auto"
          style={{
            backgroundColor: "#fff",
            border: "1.5px solid var(--color-azul-100)",
            boxShadow: "0 8px 32px rgba(6,36,77,0.12)",
            maxHeight: "280px",
          }}
        >
          {DOC_TYPES.map((dt, i) => {
            const isHighlighted = i === highlighted;
            const isSelected = dt === value;
            return (
              <li
                key={dt}
                role="option"
                aria-selected={isSelected}
                onMouseDown={(e) => { e.preventDefault(); select(dt); }}
                onMouseEnter={() => setHighlighted(i)}
                className="flex items-center gap-3 px-5 py-3.5 cursor-pointer transition-colors duration-100"
                style={{
                  backgroundColor: isHighlighted ? "var(--color-azul-50)" : "#fff",
                  color: isSelected ? "var(--color-azul-800)" : "var(--color-gris-800)",
                }}
              >
                <span className={`text-base flex-1 ${isSelected ? "font-semibold" : ""}`}>
                  {DOC_LABEL[dt]}
                </span>
                {isSelected && (
                  <span
                    className="text-xs font-bold flex-shrink-0"
                    style={{ color: "var(--color-azul-600)" }}
                  >
                    ✓
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
