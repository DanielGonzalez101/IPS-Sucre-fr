"use client";

import { useCallback } from "react";

declare global {
  interface Window {
    grecaptcha: {
      ready: (cb: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}

export function useRecaptcha() {
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? "";

  const getToken = useCallback(
    (action: string): Promise<string> => {
      if (!siteKey || typeof window === "undefined" || !window.grecaptcha) {
        return Promise.resolve("");
      }
      return new Promise((resolve) => {
        window.grecaptcha.ready(async () => {
          try {
            const token = await window.grecaptcha.execute(siteKey, { action });
            resolve(token);
          } catch {
            resolve("");
          }
        });
      });
    },
    [siteKey]
  );

  return { getToken };
}
