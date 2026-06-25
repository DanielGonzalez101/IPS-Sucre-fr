"use server";

import { createClient } from "@/lib/supabase/server";

export async function getServicios() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("servicios")
    .select("*")
    .order("orden");

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function createServicio(data: { titulo: string; descripcion: string; orden?: number }) {
  const supabase = await createClient();
  const { error } = await supabase.from("servicios").insert(data);

  if (error) return { error: error.message };
  return { success: true };
}
