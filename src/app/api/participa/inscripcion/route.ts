import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { participaInscripcionSchema } from "@/lib/validations/participa";
import { rateLimit } from "@/lib/rate-limit";
import { verifyRecaptcha } from "@/lib/recaptcha";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  const limit = rateLimit(`participa-inscripcion:${ip}`, 5, 60 * 60 * 1000);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Demasiadas solicitudes. Intente más tarde." },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Solicitud inválida" }, { status: 400 });
  }

  const recaptchaToken = (body as Record<string, unknown>)?.recaptcha_token;
  if (typeof recaptchaToken === "string" && recaptchaToken) {
    const ok = await verifyRecaptcha(recaptchaToken);
    if (!ok) {
      return NextResponse.json(
        { error: "Verificación de seguridad fallida. Intente nuevamente." },
        { status: 422 }
      );
    }
  }

  const result = participaInscripcionSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { error: "Datos inválidos", fields: result.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  const supabase = createAdminClient();
  const { error } = await supabase.from("participa_inscripciones").insert({
    full_name:  result.data.full_name,
    doc_type:   result.data.doc_type,
    doc_number: result.data.doc_number,
    email:      result.data.email,
    phone:      result.data.phone,
    espacio_id: result.data.espacio_id,
    message:    result.data.message ?? null,
  });

  if (error) {
    console.error("participa_inscripciones insert error:", error);
    return NextResponse.json(
      { error: "No se pudo registrar la inscripción. Intente más tarde." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
