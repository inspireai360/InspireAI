/**
 * Cliente centralizado de Airtable.
 * Solo debe usarse en server-side code (API routes, Server Components).
 * El token NUNCA llega al cliente.
 */

export interface AirtableRecord {
  id: string;
  createdTime: string;
  fields: Record<string, unknown>;
}

function getConfig(): { token: string; baseId: string } {
  const token = process.env.AIRTABLE_TOKEN;
  const baseId = process.env.AIRTABLE_BASE_ID;

  if (!token) {
    throw new AirtableConfigError(
      "AIRTABLE_TOKEN no está configurado. Añádelo a .env.local"
    );
  }
  if (!baseId) {
    throw new AirtableConfigError(
      "AIRTABLE_BASE_ID no está configurado. Añádelo a .env.local"
    );
  }

  return { token, baseId };
}

function handleErrorResponse(
  status: number,
  body: Record<string, unknown>,
  tableName: string
): never {
  const errorMsg = (body?.error as Record<string, unknown>)?.message as string | undefined;
  const errorType = (body?.error as Record<string, unknown>)?.type as string | undefined;

  console.error("[Airtable] Error HTTP:", { status, errorType, message: errorMsg });

  if (status === 401 || status === 403) {
    throw new AirtableError(
      "Token de Airtable inválido o sin permisos. Comprueba AIRTABLE_TOKEN.",
      status
    );
  }
  if (status === 404) {
    throw new AirtableError(
      `Base ID o tabla "${tableName}" no encontrada. Comprueba AIRTABLE_BASE_ID y el nombre exacto de la tabla.`,
      status
    );
  }
  if (status === 422) {
    throw new AirtableError(
      `Campo mal escrito o tipo de dato incorrecto en "${tableName}": ${errorMsg ?? "sin detalle"}`,
      status
    );
  }
  if (status === 429) {
    throw new AirtableError(
      "Límite de peticiones de Airtable alcanzado. Intenta de nuevo en unos segundos.",
      status
    );
  }
  throw new AirtableError(
    `Error ${status} de Airtable: ${errorMsg ?? "desconocido"}`,
    status
  );
}

async function parseErrorBody(res: Response): Promise<Record<string, unknown>> {
  try {
    return (await res.json()) as Record<string, unknown>;
  } catch {
    return {};
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// createRecord
// ─────────────────────────────────────────────────────────────────────────────

export async function createRecord(
  tableName: string,
  fields: Record<string, unknown>
): Promise<{ id: string }> {
  const { token, baseId } = getConfig();
  const url = `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableName)}`;

  let res: Response;
  try {
    res = await fetch(url, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ fields }),
    });
  } catch {
    throw new AirtableError("Error de red al conectar con Airtable.", 0);
  }

  if (!res.ok) handleErrorResponse(res.status, await parseErrorBody(res), tableName);

  const data = (await res.json()) as AirtableRecord;
  return { id: data.id };
}

// ─────────────────────────────────────────────────────────────────────────────
// findRecords  — busca registros por fórmula de Airtable
// ─────────────────────────────────────────────────────────────────────────────

export async function findRecords(
  tableName: string,
  formula: string,
  maxRecords = 10
): Promise<AirtableRecord[]> {
  const { token, baseId } = getConfig();

  const url = new URL(
    `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableName)}`
  );
  url.searchParams.set("filterByFormula", formula);
  url.searchParams.set("maxRecords", String(maxRecords));

  let res: Response;
  try {
    res = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch {
    throw new AirtableError("Error de red al conectar con Airtable.", 0);
  }

  if (!res.ok) handleErrorResponse(res.status, await parseErrorBody(res), tableName);

  const data = (await res.json()) as { records: AirtableRecord[] };
  return data.records ?? [];
}

// ─────────────────────────────────────────────────────────────────────────────
// getRecord  — obtiene un registro por su ID
// ─────────────────────────────────────────────────────────────────────────────

export async function getRecord(
  tableName: string,
  recordId: string
): Promise<AirtableRecord> {
  const { token, baseId } = getConfig();
  const url = `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableName)}/${encodeURIComponent(recordId)}`;

  let res: Response;
  try {
    res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch {
    throw new AirtableError("Error de red al conectar con Airtable.", 0);
  }

  if (!res.ok) handleErrorResponse(res.status, await parseErrorBody(res), tableName);

  return (await res.json()) as AirtableRecord;
}

// ─────────────────────────────────────────────────────────────────────────────
// updateRecord  — actualiza campos de un registro existente (PATCH)
// ─────────────────────────────────────────────────────────────────────────────

export async function updateRecord(
  tableName: string,
  recordId: string,
  fields: Record<string, unknown>
): Promise<void> {
  const { token, baseId } = getConfig();
  const url = `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableName)}/${recordId}`;

  let res: Response;
  try {
    res = await fetch(url, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ fields }),
    });
  } catch {
    throw new AirtableError("Error de red al conectar con Airtable.", 0);
  }

  if (!res.ok) handleErrorResponse(res.status, await parseErrorBody(res), tableName);
}

// ─────────────────────────────────────────────────────────────────────────────
// Errores tipados
// ─────────────────────────────────────────────────────────────────────────────

export class AirtableError extends Error {
  constructor(message: string, public statusCode: number) {
    super(message);
    this.name = "AirtableError";
  }
}

export class AirtableConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AirtableConfigError";
  }
}
