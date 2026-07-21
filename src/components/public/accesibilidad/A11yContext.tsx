"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { A11yState, DEFAULT_STATE, ProfileKey } from "./types";
import { PROFILE_PRESETS } from "./presets";

const STORAGE_KEY = "ips-sucre-a11y-v1";

type Ctx = {
  state: A11yState;
  setState: React.Dispatch<React.SetStateAction<A11yState>>;
  toggleProfile: (key: ProfileKey) => void;
  reset: () => void;
  update: <K extends keyof A11yState>(key: K, value: A11yState[K]) => void;
};

const A11yContext = createContext<Ctx | null>(null);

export function A11yProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<A11yState>(() => {
    if (typeof window === "undefined") return DEFAULT_STATE;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) return { ...DEFAULT_STATE, ...JSON.parse(raw) };
    } catch {}
    return DEFAULT_STATE;
  });
  const loaded = useRef(false);

  useEffect(() => {
    if (!loaded.current) {
      loaded.current = true;
      return;
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {}
  }, [state]);

  const update = useCallback(<K extends keyof A11yState>(key: K, value: A11yState[K]) => {
    setState((prev) => ({ ...prev, [key]: value }));
  }, []);

  const toggleProfile = useCallback((key: ProfileKey) => {
    setState((prev) => {
      const willActivate = !prev.profiles[key];
      const nextProfiles = { ...prev.profiles, [key]: willActivate };
      const preset = PROFILE_PRESETS[key] ?? {};

      if (willActivate) {
        return { ...prev, ...preset, profiles: nextProfiles };
      }
      // desactivar: quitar solo los toggles del preset
      const cleared: Partial<A11yState> = {};
      for (const k of Object.keys(preset) as (keyof A11yState)[]) {
        const v = DEFAULT_STATE[k];
        (cleared as Record<string, unknown>)[k as string] = v;
      }
      return { ...prev, ...cleared, profiles: nextProfiles };
    });
  }, []);

  const reset = useCallback(() => setState(DEFAULT_STATE), []);

  const value = useMemo<Ctx>(
    () => ({ state, setState, toggleProfile, reset, update }),
    [state, toggleProfile, reset, update],
  );

  return <A11yContext.Provider value={value}>{children}</A11yContext.Provider>;
}

export function useA11y() {
  const ctx = useContext(A11yContext);
  if (!ctx) throw new Error("useA11y debe usarse dentro de A11yProvider");
  return ctx;
}
