"use server";

import { createClient } from "@/lib/supabase/server";

export async function getMiembrosEquipo() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("equipo")
    .select("*")
    .order("apellido");

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function createMiembroEquipo(data: {
  nombre: string;
  apellido: string;
  cargo: string;
  especialidad?: string;
  foto_url?: string;
}) {
  const supabase = await createClient();
  const { error } = await supabase.from("equipo").insert(data);

  if (error) return { error: error.message };
  return { success: true };
}
