"use server";

import { createAdminClient } from "@/lib/supabase/admin";

export async function getPqrsdList() {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("pqrsd")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data ?? [];
}
