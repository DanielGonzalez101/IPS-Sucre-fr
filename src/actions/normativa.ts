"use server";

import { createClient } from "@/lib/supabase/server";

export async function getNormativas() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("normativa")
    .select("*")
    .order("fecha", { ascending: false });

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function createNormativa(data: {
  titulo: string;
  descripcion?: string;
  archivo_url?: string;
  fecha: string;
}) {
  const supabase = await createClient();
  const { error } = await supabase.from("normativa").insert(data);

  if (error) return { error: error.message };
  return { success: true };
}
