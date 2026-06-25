"use server";

import { createClient } from "@/lib/supabase/server";
import { pqrsSchema, type PqrsInput } from "@/lib/validations/pqrs";

export async function createPqrs(data: PqrsInput) {
  const parsed = pqrsSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("pqrs").insert(parsed.data);

  if (error) return { error: { _server: [error.message] } };
  return { success: true };
}

export async function getPqrsList() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("pqrs")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data ?? [];
}
