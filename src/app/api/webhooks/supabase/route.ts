import { NextRequest, NextResponse } from "next/server";

// Webhook receptor para eventos de Supabase (e.g. Database Webhooks o Auth hooks).
// Valida el header de firma antes de procesar cualquier evento.
export async function POST(req: NextRequest) {
  const signature = req.headers.get("x-supabase-signature");

  if (!signature) {
    return NextResponse.json({ error: "Firma requerida" }, { status: 401 });
  }

  // TODO: verificar HMAC de la firma con SUPABASE_WEBHOOK_SECRET
  const payload = await req.json();

  console.log("[Supabase Webhook]", payload.type, payload.table);

  return NextResponse.json({ received: true });
}
