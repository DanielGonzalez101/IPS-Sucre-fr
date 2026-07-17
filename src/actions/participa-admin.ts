"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";

export async function getInscripciones() {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("participa_inscripciones")
    .select("id, full_name, doc_type, doc_number, email, phone, espacio_id, message, created_at")
    .order("created_at", { ascending: false });
  if (error) return { data: null, error: error.message };
  return { data, error: null };
}

export async function deleteInscripcion(id: string) {
  const supabase = createAdminClient();
  const { error } = await supabase.from("participa_inscripciones").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/gestion-interna/participa");
  return { error: null };
}
