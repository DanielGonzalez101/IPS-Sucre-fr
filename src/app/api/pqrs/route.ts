import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { pqrsSchema } from "@/lib/validations/pqrs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = pqrsSchema.parse(body);

    const supabase = await createClient();
    const { error } = await supabase.from("pqrs").insert(data);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ message: "PQRS registrada exitosamente" }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 422 });
  }
}
