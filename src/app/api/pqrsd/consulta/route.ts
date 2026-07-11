import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { rateLimit } from "@/lib/rate-limit";

const STATUS_LABELS: Record<string, string> = {
  recibido: "Recibido",
  en_proceso: "En proceso",
  respondido: "Respondido",
  cerrado: "Cerrado",
};

const TYPE_LABELS: Record<string, string> = {
  peticion: "Petición",
  queja: "Queja",
  reclamo: "Reclamo",
  solicitud: "Solicitud",
  denuncia: "Denuncia",
  sugerencia: "Sugerencia",
};

export async function GET(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  const limit = rateLimit(`pqrsd-consulta:${ip}`, 10, 60 * 60 * 1000);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Demasiadas consultas. Intente más tarde." },
      { status: 429 }
    );
  }

  const { searchParams } = req.nextUrl;
  const codigo = searchParams.get("codigo")?.trim().toUpperCase();
  const email = searchParams.get("email")?.trim().toLowerCase();

  if (!codigo || !email) {
    return NextResponse.json(
      { error: "Código de radicado y correo son obligatorios." },
      { status: 400 }
    );
  }

  if (!/^PQRSD-\d{8}-\d{4}$/.test(codigo)) {
    return NextResponse.json(
      { error: "Formato de código inválido. Ejemplo: PQRSD-20260710-0001" },
      { status: 400 }
    );
  }

  const admin = createAdminClient();

  const { data, error } = await admin
    .from("pqrsd")
    .select(
      "tracking_code, type, status, subject, created_at, response_deadline, responded_at, is_overdue, admin_response, response_mode"
    )
    .eq("tracking_code", codigo)
    .ilike("email", email)
    .single();

  if (error || !data) {
    // Respuesta genérica para no revelar si el código existe pero el email no coincide
    return NextResponse.json(
      {
        error:
          "No se encontró ninguna solicitud con ese código y correo. Verifique los datos.",
      },
      { status: 404 }
    );
  }

  return NextResponse.json({
    tracking_code: data.tracking_code,
    type: data.type,
    type_label: TYPE_LABELS[data.type] ?? data.type,
    status: data.status,
    status_label: STATUS_LABELS[data.status] ?? data.status,
    subject: data.subject,
    created_at: data.created_at,
    response_deadline: data.response_deadline,
    responded_at: data.responded_at,
    is_overdue: data.is_overdue,
    response_mode: data.response_mode,
    admin_response:
      data.status === "respondido" || data.status === "cerrado"
        ? data.admin_response
        : null,
  });
}
