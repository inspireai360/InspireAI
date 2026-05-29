import { NextRequest, NextResponse } from "next/server";

// GET /api/onboarding/airtable-health?access=<key>
// GET /api/onboarding/airtable-health?access=<key>&writeTest=1
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const access = searchParams.get("access");
  const expectedKey = process.env.ONBOARDING_ACCESS_KEY;

  if (!expectedKey || access !== expectedKey) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const token = process.env.AIRTABLE_TOKEN;
  const baseId = process.env.AIRTABLE_BASE_ID;

  const env = {
    AIRTABLE_TOKEN: token ? `${token.slice(0, 8)}...${token.slice(-4)}` : "MISSING",
    AIRTABLE_BASE_ID: baseId ?? "MISSING",
    AIRTABLE_BASE_ID_starts_with_app: baseId?.startsWith("app") ? "yes ✓" : "NO ✗ (should start with 'app')",
    AIRTABLE_TABLE_DELIVERY: process.env.AIRTABLE_TABLE_DELIVERY ?? "MISSING",
    AIRTABLE_TABLE_MARKETING: process.env.AIRTABLE_TABLE_MARKETING ?? "MISSING",
    AIRTABLE_TABLE_VENTAS: process.env.AIRTABLE_TABLE_VENTAS ?? "MISSING",
    AIRTABLE_TABLE_OPERACIONES: process.env.AIRTABLE_TABLE_OPERACIONES ?? "MISSING",
    ONBOARDING_ACCESS_KEY: expectedKey ? "present ✓" : "MISSING",
  };

  const tableMap: Record<string, string | undefined> = {
    delivery: process.env.AIRTABLE_TABLE_DELIVERY,
    marketing: process.env.AIRTABLE_TABLE_MARKETING,
    ventas: process.env.AIRTABLE_TABLE_VENTAS,
    operaciones: process.env.AIRTABLE_TABLE_OPERACIONES,
  };

  // Check read access to each table
  const tables: Record<string, unknown> = {};
  for (const [key, tableName] of Object.entries(tableMap)) {
    if (!tableName) { tables[key] = { ok: false, error: "ENV VAR MISSING" }; continue; }
    if (!token || !baseId) { tables[key] = { ok: false, error: "AIRTABLE_TOKEN or AIRTABLE_BASE_ID missing" }; continue; }

    try {
      const url = `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableName)}?maxRecords=1`;
      const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) {
        const body = await res.json().catch(() => ({})) as Record<string, unknown>;
        const msg = (body?.error as Record<string, unknown>)?.message ?? "unknown";
        tables[key] = { ok: false, tableName, httpStatus: res.status, error: String(msg) };
      } else {
        const data = await res.json() as { records?: unknown[] };
        tables[key] = { ok: true, tableName, existingRecords: data.records?.length ?? 0 };
      }
    } catch (err) {
      tables[key] = { ok: false, tableName, error: `Network: ${err instanceof Error ? err.message : String(err)}` };
    }
  }

  // Optional write test in Operaciones
  const writeTest = searchParams.get("writeTest") === "1";
  let writeTestResult: unknown = "not requested — add ?writeTest=1 to run";

  if (writeTest) {
    const opTable = process.env.AIRTABLE_TABLE_OPERACIONES;
    if (!token || !baseId || !opTable) {
      writeTestResult = { error: "Missing env vars — cannot write" };
    } else {
      try {
        const createUrl = `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(opTable)}`;
        const createRes = await fetch(createUrl, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
          body: JSON.stringify({
            fields: {
              Empresa: "HEALTH-CHECK — borrar",
              Contacto: "Health Check",
              Email: "health@inspireai.test",
              Area: "Operaciones",
              Estado: "Nuevo",
              Prioridad: "Media",
              "Fecha de envio": new Date().toISOString().slice(0, 10),
            },
          }),
        });

        if (!createRes.ok) {
          const body = await createRes.json().catch(() => ({})) as Record<string, unknown>;
          const msg = (body?.error as Record<string, unknown>)?.message ?? "unknown";
          writeTestResult = { created: false, httpStatus: createRes.status, error: String(msg) };
        } else {
          const created = await createRes.json() as { id: string };
          const recordId = created.id;

          const deleteUrl = `${createUrl}/${recordId}`;
          const deleteRes = await fetch(deleteUrl, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          });

          if (!deleteRes.ok) {
            writeTestResult = {
              created: true, recordId, deleted: false,
              warning: `Creado OK pero DELETE falló (${deleteRes.status}) — borra manualmente: ${recordId}`,
            };
          } else {
            writeTestResult = { created: true, recordId, deleted: true };
          }
        }
      } catch (err) {
        writeTestResult = { error: `Exception: ${err instanceof Error ? err.message : String(err)}` };
      }
    }
  }

  const allTablesOk = Object.values(tables).every((t) => (t as Record<string, unknown>).ok);

  return NextResponse.json({
    timestamp: new Date().toISOString(),
    status: allTablesOk ? "ok" : "degraded",
    env,
    tables,
    writeTest: writeTestResult,
  });
}
