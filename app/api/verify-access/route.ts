import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const key = new URL(req.url).searchParams.get("key");

  if (!key) {
    return NextResponse.json(
      { valid: false, error: "Clave requerida" },
      { status: 400 }
    );
  }

  const accessKey = process.env.ONBOARDING_ACCESS_KEY;
  if (!accessKey) {
    console.error("[verify-access] ONBOARDING_ACCESS_KEY no está configurado");
    return NextResponse.json(
      { valid: false, error: "Servidor no configurado correctamente" },
      { status: 500 }
    );
  }

  if (key !== accessKey) {
    return NextResponse.json(
      { valid: false, error: "Clave de acceso incorrecta" },
      { status: 401 }
    );
  }

  return NextResponse.json({ valid: true });
}
