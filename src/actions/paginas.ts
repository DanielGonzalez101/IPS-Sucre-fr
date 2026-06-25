"use server";

import { createClient } from "@/lib/supabase/server";
import { paginaSchema, type PaginaInput } from "@/lib/validations/pagina";

export async function createPagina(data: PaginaInput) {
  const parsed = paginaSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("paginas").insert(parsed.data);

  if (error) return { error: { _server: [error.message] } };
  return { success: true };
}

export async function getPaginas() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("paginas")
    .select("id, slug, titulo, publicado, updated_at")
    .order("titulo");

  if (error) throw new Error(error.message);
  return data ?? [];
}
