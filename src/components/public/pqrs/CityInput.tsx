"use client";

import { useState, useRef, useEffect, useId } from "react";
import { MapPin, ChevronDown, X } from "lucide-react";
import { CIUDADES_COLOMBIA } from "@/lib/ciudades-colombia";

interface CityInputProps {
  value: string;
  onChange: (value: string) => void;
  hasError?: boolean;
  inputId: string;
}

export default function CityInput({
  value,
  onChange,
  hasError = false,
  inputId,
}: CityInputProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState(value);
  const [highlighted, setHighlighted] = useState(0);
  const listRef = useRef<HTMLUListElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  const filtered =
    query.trim().length === 0
      ? CIUDADES_COLOMBIA
      : CIUDADES_COLOMBIA.filter((c) =>
          c.toLowerCase().includes(query.toLowerCase())
        );

  // Sync external value → query when resetting the form
  useEffect(() => {
    if (value === "") setQuery("");
  }, [value]);

  // Scroll highlighted item into view
  useEffect(() => {
    if (!open) return;
    const item = listRef.current?.children[highlighted] as HTMLElement;
    item?.scrollIntoView({ block: "nearest" });
  }, [highlighted, open]);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) {
        setOpen(false);
        // If user typed something that doesn't match, clear it
        if (!CIUDADES_COLOMBIA.includes(query)) {
          setQuery(value);
        }
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [query, value]);

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setQuery(e.target.value);
    setOpen(true);
    setHighlighted(0);
  }

  function selectCity(city: string) {
    setQuery(city);
    onChange(city);
    setOpen(false);
    inputRef.current?.focus();
  }

  function clear() {
    setQuery("");
    onChange("");
    setOpen(false);
    inputRef.current?.focus();
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!open) {
      if (e.key === "ArrowDown" || e.key === "Enter") {
        setOpen(true);
        setHighlighted(0);
        e.preventDefault();
      }
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlighted((h) => Math.min(h + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlighted((h) => Math.max(h - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filtered[highlighted]) selectCity(filtered[highlighted]);
    } else if (e.key === "Escape") {
      setOpen(false);
      setQuery(value);
    }
  }

  const borderColor = hasError
    ? "#EE3538"
    : open
    ? "var(--color-azul-600)"
    : "#e5e7eb";

  const ringColor = hasError
    ? "rgba(238,53,56,0.20)"
    : "rgba(26,92,184,0.20)";

  return (
    <div ref={containerRef} className="relative">
      {/* Input */}
      <div
        className="flex items-center rounded-xl border transition-all duration-200 bg-white overflow-hidden"
        style={{
          borderColor,
          boxShadow: open || hasError ? `0 0 0 3px ${ringColor}` : "none",
        }}
      >
        <MapPin
          size={18}
          className="ml-4 flex-shrink-0"
          aria-hidden="true"
          style={{ color: open ? "var(--color-azul-600)" : "#9ca3af" }}
        />
        <input
          ref={inputRef}
          id={inputId}
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          className="flex-1 px-3 py-4 text-base bg-transparent focus:outline-none"
          style={{ color: "var(--color-gris-800)" }}
          placeholder="Escriba o seleccione su ciudad"
          autoComplete="off"
          role="combobox"
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={
            open && filtered[highlighted]
              ? `${listId}-${highlighted}`
              : undefined
          }
        />
        {query ? (
          <button
            type="button"
            onClick={clear}
            className="mr-3 p-1 rounded-full transition-colors duration-150 cursor-pointer flex-shrink-0"
            style={{ color: "#9ca3af" }}
            aria-label="Limpiar ciudad"
            tabIndex={-1}
          >
            <X size={16} aria-hidden="true" />
          </button>
        ) : (
          <ChevronDown
            size={18}
            className="mr-4 flex-shrink-0 transition-transform duration-200"
            aria-hidden="true"
            style={{
              color: "#9ca3af",
              transform: open ? "rotate(180deg)" : "rotate(0deg)",
            }}
          />
        )}
      </div>

      {/* Dropdown */}
      {open && (
        <ul
          ref={listRef}
          id={listId}
          role="listbox"
          aria-label="Ciudades de Colombia"
          className="absolute z-50 w-full mt-1.5 rounded-xl overflow-y-auto"
          style={{
            backgroundColor: "#fff",
            border: "1.5px solid var(--color-azul-100)",
            boxShadow: "0 8px 32px rgba(6,36,77,0.12)",
            maxHeight: "240px",
          }}
        >
          {filtered.length === 0 ? (
            <li
              className="px-4 py-4 text-base text-center"
              style={{ color: "var(--color-gris-500)" }}
            >
              No se encontraron ciudades
            </li>
          ) : (
            filtered.map((city, i) => {
              const isHighlighted = i === highlighted;
              const isSelected = city === value;
              return (
                <li
                  key={`${city}-${i}`}
                  id={`${listId}-${i}`}
                  role="option"
                  aria-selected={isSelected}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    selectCity(city);
                  }}
                  onMouseEnter={() => setHighlighted(i)}
                  className="flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors duration-100"
                  style={{
                    backgroundColor: isHighlighted
                      ? "var(--color-azul-50)"
                      : "#fff",
                    color: isSelected
                      ? "var(--color-azul-800)"
                      : "var(--color-gris-800)",
                  }}
                >
                  <MapPin
                    size={15}
                    aria-hidden="true"
                    style={{
                      color: isSelected
                        ? "var(--color-azul-600)"
                        : "#d1d5db",
                      flexShrink: 0,
                    }}
                  />
                  <span className={`text-base ${isSelected ? "font-semibold" : ""}`}>
                    {city}
                  </span>
                  {isSelected && (
                    <span
                      className="ml-auto text-xs font-semibold"
                      style={{ color: "var(--color-azul-600)" }}
                    >
                      ✓
                    </span>
                  )}
                </li>
              );
            })
          )}
        </ul>
      )}
    </div>
  );
}
