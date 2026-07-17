"use server";

import { createClient } from "@/lib/supabase/server";
import type { GaleriaItem } from "@/components/public/multimedia/GaleriaGrid";

export async function getGaleriaPublica(): Promise<GaleriaItem[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("galeria")
    .select("id, url, titulo, subtitulo, categoria")
    .eq("publicado", true)
    .order("orden", { ascending: true });

  if (error) {
    console.error("galeria:", error.message);
    return [];
  }

  return data ?? [];
}
