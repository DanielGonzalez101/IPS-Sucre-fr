import { NextResponse } from "next/server";

// Esta ruta ha sido reemplazada por /api/pqrsd
export async function POST() {
  return NextResponse.json(
    { error: "Ruta obsoleta. Use /api/pqrsd" },
    { status: 410 }
  );
}
