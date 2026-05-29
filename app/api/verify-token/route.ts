import { NextRequest, NextResponse } from "next/server";
import { findRecords, AirtableError, AirtableConfigError } from "@/lib/airtable";

const AREA_ALIASES: Record<string, string> = {
  ventas: "ventas",
  sales: "ventas",
  marketing: "marketing",
  operaciones: "operaciones",
  operations: "operaciones",
  delivery: "delivery",
  fulfillment: "delivery",
};

function normalizeArea(raw: string): string | null {
  return AREA_ALIASES[raw?.toLowerCase().trim()] ?? null;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const rawToken = searchParams.get("token");
  const rawArea = searchParams.get("area");

  if (!rawToken || !rawArea) {
    return NextResponse.json(
      { valid: false, error: "Parámetros requeridos: token y area" },
      { status: 400 }
    );
  }

  const area = normalizeArea(rawArea);
  if (!area) {
    return NextResponse.json(
      { valid: false, error: "Área no reconocida" },
      { status: 400 }
    );
  }

  const tableName = process.env.AIRTABLE_TOKENS_TABLE;
  if (!tableName) {
    console.error("[verify-token] AIRTABLE_TOKENS_TABLE no configurado");
    return NextResponse.json(
      { valid: false, error: "Servidor no configurado correctamente" },
      { status: 500 }
    );
  }

  // Sanitizar token para la fórmula (evitar formula injection)
  const safeToken = rawToken.replace(/['"\\,()]/g, "");
  const formula = `AND({token}="${safeToken}",{area}="${area}",{estado}="Activo")`;

  try {
    const records = await findRecords(tableName, formula, 1);

    if (records.length === 0) {
      return NextResponse.json(
        { valid: false, error: "Enlace inválido o ya utilizado" },
        { status: 401 }
      );
    }

    const record = records[0];
    const fields = record.fields as Record<string, unknown>;

    // Comprobar expiración
    if (fields.expira) {
      const expiresAt = new Date(fields.expira as string);
      if (expiresAt < new Date()) {
        return NextResponse.json(
          { valid: false, error: "Este enlace ha expirado" },
          { status: 401 }
        );
      }
    }

    return NextResponse.json({
      valid: true,
      recordId: record.id,
      empresa: (fields.empresa as string) ?? "",
      contacto: (fields.contacto as string) ?? "",
      email: (fields.email as string) ?? "",
      telefono: (fields.telefono as string) ?? "",
    });
  } catch (err) {
    if (err instanceof AirtableConfigError) {
      return NextResponse.json(
        { valid: false, error: "Servidor no configurado correctamente" },
        { status: 500 }
      );
    }
    if (err instanceof AirtableError) {
      console.error("[verify-token] Airtable error:", err.message);
      return NextResponse.json(
        { valid: false, error: "Error al verificar el enlace. Inténtalo de nuevo." },
        { status: 502 }
      );
    }
    console.error("[verify-token] Error inesperado:", err);
    return NextResponse.json(
      { valid: false, error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
