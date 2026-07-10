"use server";

import { createAdminClient } from "@/lib/supabase/admin";

export async function getDashboardStats() {
  const supabase = createAdminClient();

  const ahora = new Date();
  const hace7dias = new Date(ahora);
  hace7dias.setDate(ahora.getDate() - 7);

  const [
    { count: pqrsTotal },
    { count: pqrsSemana },
    { data: servicios },
    { count: docsTotal },
    { count: docsPublicos },
    { count: miembros },
    { data: pqrsRecientes },
  ] = await Promise.all([
    supabase.from("pqrs").select("*", { count: "exact", head: true }),
    supabase
      .from("pqrs")
      .select("*", { count: "exact", head: true })
      .gte("created_at", hace7dias.toISOString()),
    supabase.from("servicios").select("activo"),
    supabase
      .from("documents")
      .select("*", { count: "exact", head: true })
      .eq("is_audit_doc", true),
    supabase
      .from("documents")
      .select("*", { count: "exact", head: true })
      .eq("is_audit_doc", true)
      .eq("is_public", true),
    supabase
      .from("equipo_miembros")
      .select("*", { count: "exact", head: true })
      .eq("activo", true),
    supabase
      .from("pqrs")
      .select("id, tipo, nombre, email, created_at")
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  const serviciosActivos = (servicios ?? []).filter((s) => s.activo).length;
  const serviciosTotal = (servicios ?? []).length;

  return {
    pqrsTotal: pqrsTotal ?? 0,
    pqrsSemana: pqrsSemana ?? 0,
    serviciosActivos,
    serviciosTotal,
    docsTotal: docsTotal ?? 0,
    docsPublicos: docsPublicos ?? 0,
    miembros: miembros ?? 0,
    pqrsRecientes: pqrsRecientes ?? [],
  };
}
