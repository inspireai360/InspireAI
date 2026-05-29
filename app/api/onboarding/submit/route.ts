import { NextRequest, NextResponse } from "next/server";
import { createRecord, AirtableError, AirtableConfigError } from "@/lib/airtable";

type AreaKey = "ventas" | "marketing" | "operaciones" | "delivery" | "administracion_documentacion";

interface RespuestaDetallada {
  id: string;
  label: string;
  type: string;
  answer: string;
  section?: string;
}

const AREA_ALIASES: Record<string, AreaKey> = {
  ventas: "ventas",
  sales: "ventas",
  marketing: "marketing",
  operaciones: "operaciones",
  operations: "operaciones",
  delivery: "delivery",
  fulfillment: "delivery",
  administracion_documentacion: "administracion_documentacion",
  administracion: "administracion_documentacion",
  admin: "administracion_documentacion",
};

const AREA_NAMES: Record<AreaKey, string> = {
  ventas: "Ventas",
  marketing: "Marketing",
  operaciones: "Operaciones",
  delivery: "Delivery / Fulfillment",
  administracion_documentacion: "Administración y Documentación",
};

// Short values written to the Airtable 'Area' Select field — must match options exactly
// Valid Airtable options: Delivery, Marketing, Ventas, Operaciones
const AREA_VALUES: Record<AreaKey, string> = {
  ventas: "Ventas",
  marketing: "Marketing",
  operaciones: "Operaciones",
  delivery: "Delivery",
  administracion_documentacion: "Operaciones",
};

function normalizeArea(raw: string): AreaKey | null {
  return AREA_ALIASES[raw?.toLowerCase().trim()] ?? null;
}

function getTableName(area: AreaKey): string {
  const map: Record<AreaKey, string | undefined> = {
    ventas: process.env.AIRTABLE_TABLE_VENTAS,
    marketing: process.env.AIRTABLE_TABLE_MARKETING,
    operaciones: process.env.AIRTABLE_TABLE_OPERACIONES,
    delivery: process.env.AIRTABLE_TABLE_DELIVERY,
    administracion_documentacion: process.env.AIRTABLE_TABLE_OPERACIONES,
  };
  const name = map[area];
  if (!name) throw new Error(`AIRTABLE_TABLE_${area.toUpperCase()} no configurado`);
  return name;
}

// ─── Section helpers ──────────────────────────────────────────────────────────

function extractSection(id: string): string {
  const parts = id.split("_");
  if (parts.length < 3) return "01";
  return parts[parts.length - 2].toUpperCase();
}

function formatAnswerText(answer: string, type: string): string {
  if (type === "scale") {
    const n = answer.trim();
    return n ? `${n} / 10` : n;
  }
  if (type !== "multi_select" || !answer.includes(",")) return answer.trim();
  return answer
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean)
    .map((v) => `  - ${v}`)
    .join("\n");
}

// ─── Prioridad ────────────────────────────────────────────────────────────────

const ALTA_KEYWORDS = [
  "urgente", "urgencia", "crítico", "critico", "inmediato", "este mes", "esta semana",
  "necesito ya", "lo antes posible", "cuanto antes",
  "pérdida", "perdida", "perdemos", "perdemos leads", "clientes perdidos", "oportunidades perdidas",
  "se nos escapan", "se pierden",
  "colapso", "saturado", "saturados", "no damos abasto", "desbordados",
  "no podemos crecer", "techo operativo",
  "no funciona", "falla", "fallas", "errores frecuentes", "errores constantes",
  "dobles reservas", "duplicados", "información duplicada", "se nos olvida",
  "sin crm", "no tenemos crm", "sin seguimiento", "no hay seguimiento",
  "sin pipeline", "no hay pipeline", "sin datos", "no medimos",
  "depende de mí", "depende de una persona", "solo yo", "si no estoy",
  "todo manual", "trabajo manual", "procesos manuales",
  "caos", "desorden", "desorganizado", "todo por whatsapp", "todo en mi cabeza",
  "retrasos", "incidencias", "quejas", "clientes insatisfechos",
];

const BAJA_KEYWORDS = [
  "explorando", "curiosidad", "en el futuro", "sin prisa", "evaluar",
  "ver opciones", "no es urgente", "más adelante", "a largo plazo",
  "sin urgencia", "cuando podamos", "no tenemos prisa", "no hay prisa",
];

const AUTO_HIGH_KEYWORDS = [
  "automatizado", "automáticamente", "sistema integrado", "crm integrado",
  "erp", "software especializado", "api", "integración automática", "sincronización",
  "plataforma", "herramienta digital", "flujo automático",
];

const AUTO_LOW_KEYWORDS = [
  "todo manual", "trabajo manual", "procesos manuales", "sin sistema",
  "excel", "whatsapp", "papel", "a mano", "sin crm", "no tenemos sistema",
  "anotamos", "cuaderno", "carpetas", "todo en mi cabeza",
];

function detectAutomationLevel(text: string): "Bajo" | "Medio" | "Alto" {
  const t = text.toLowerCase();
  const hi = AUTO_HIGH_KEYWORDS.filter((k) => t.includes(k)).length;
  const lo = AUTO_LOW_KEYWORDS.filter((k) => t.includes(k)).length;
  if (hi > lo && hi >= 2) return "Alto";
  if (lo > 0) return "Bajo";
  return "Medio";
}

function detectUrgencySignals(text: string): string[] {
  const t = text.toLowerCase();
  return ALTA_KEYWORDS.filter((kw) => t.includes(kw)).slice(0, 6);
}

function calculatePriority(
  respuestas: Record<string, unknown>,
  observaciones: string,
  respuestasDetalladas: RespuestaDetallada[] = []
): "Alta" | "Media" | "Baja" {
  const text = [
    ...Object.values(respuestas).map((v) => String(v ?? "")),
    ...respuestasDetalladas.map((r) => r.answer),
    observaciones,
  ]
    .join(" ")
    .toLowerCase();

  if (ALTA_KEYWORDS.some((kw) => text.includes(kw))) return "Alta";
  if (BAJA_KEYWORDS.some((kw) => text.includes(kw))) return "Baja";
  return "Media";
}

// ─── Observaciones ────────────────────────────────────────────────────────────

// Airtable long-text fields support up to 100,000 characters; we leave a 10k safety buffer
const MAX_OBSERVACIONES_CHARS = 90_000;
const DIVIDER = "=".repeat(50);
const SUB_DIVIDER = "-".repeat(50);

function generateObservaciones(
  area: AreaKey,
  empresa: string,
  contacto: string,
  email: string,
  telefono: string,
  respuestasDetalladas: RespuestaDetallada[],
  observacionesCliente: string,
  prioridad: string,
  fechaISO: string
): string {
  const lines: string[] = [];

  // ── Header ────────────────────────────────────────────────────────────────
  lines.push(DIVIDER);
  lines.push(`DIAGNÓSTICO INSPIREAI — ${AREA_NAMES[area].toUpperCase()}`);
  lines.push(DIVIDER);
  lines.push("");

  // ── EMPRESA block ─────────────────────────────────────────────────────────
  lines.push("EMPRESA");
  lines.push(`- Empresa:   ${empresa}`);
  lines.push(`- Contacto:  ${contacto}`);
  lines.push(`- Email:     ${email}`);
  if (telefono) lines.push(`- Teléfono:  ${telefono}`);
  lines.push(`- Fecha:     ${fechaISO.slice(0, 10)}`);
  lines.push(`- Prioridad: ${prioridad}`);
  lines.push("");

  // ── RESUMEN EJECUTIVO AUTOMÁTICO ───────────────────────────────────────────
  lines.push(SUB_DIVIDER);
  lines.push("RESUMEN EJECUTIVO AUTOMÁTICO");
  lines.push(SUB_DIVIDER);

  const respondidas = respuestasDetalladas.filter((r) => r.answer.trim());
  const allText = [
    ...respuestasDetalladas.map((r) => r.answer),
    observacionesCliente,
  ].join(" ");

  const urgencySignals = detectUrgencySignals(allText);
  const autoLevel = detectAutomationLevel(allText);
  const riesgo: "Bajo" | "Medio" | "Alto" =
    prioridad === "Alta" ? "Alto" : prioridad === "Baja" ? "Bajo" : "Medio";

  lines.push(`- Total de preguntas respondidas: ${respondidas.length} de ${respuestasDetalladas.length}`);
  lines.push(
    `- Señales de urgencia detectadas: ${urgencySignals.length > 0 ? urgencySignals.join(", ") : "Ninguna"}`
  );
  lines.push(`- Nivel de automatización aparente: ${autoLevel}`);
  lines.push(`- Riesgo operativo/comercial estimado: ${riesgo}`);
  lines.push("");

  // ── RESPUESTAS DEL CUESTIONARIO ────────────────────────────────────────────
  lines.push(SUB_DIVIDER);
  lines.push("RESPUESTAS DEL CUESTIONARIO");
  lines.push(SUB_DIVIDER);

  let currentSection = "";
  for (const r of respondidas) {
    const sec = (r.section ?? extractSection(r.id)).padStart(2, "0");
    if (sec !== currentSection) {
      currentSection = sec;
      lines.push("");
      lines.push(`[${currentSection}]`);
    }
    const label = r.label.length > 140 ? r.label.slice(0, 140) + "…" : r.label;
    const formatted = formatAnswerText(r.answer, r.type);
    lines.push("");
    lines.push(`  Pregunta: ${label}`);
    if (formatted.includes("\n")) {
      lines.push("  Respuesta:");
      lines.push(formatted);
    } else {
      lines.push(`  Respuesta: ${formatted}`);
    }
  }

  lines.push("");

  // ── OBSERVACIONES ADICIONALES DEL CLIENTE ─────────────────────────────────
  if (observacionesCliente.trim()) {
    lines.push(SUB_DIVIDER);
    lines.push("OBSERVACIONES ADICIONALES DEL CLIENTE");
    lines.push(SUB_DIVIDER);
    lines.push(observacionesCliente.trim());
    lines.push("");
  }

  // ── Footer ────────────────────────────────────────────────────────────────
  lines.push(DIVIDER);
  lines.push("FIN DEL DIAGNÓSTICO");
  lines.push(DIVIDER);

  return lines.join("\n").slice(0, MAX_OBSERVACIONES_CHARS);
}

// ─── Límite de tamaño ─────────────────────────────────────────────────────────

const MAX_RESPUESTAS_BYTES = 50_000;

// ─── Handler ──────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  console.log("[/api/onboarding/submit] → POST recibido");
  console.log("[/api/onboarding/submit] AIRTABLE_TOKEN exists:", Boolean(process.env.AIRTABLE_TOKEN));
  console.log("[/api/onboarding/submit] AIRTABLE_BASE_ID:", process.env.AIRTABLE_BASE_ID ?? "UNDEFINED");
  console.log("[/api/onboarding/submit] ONBOARDING_ACCESS_KEY exists:", Boolean(process.env.ONBOARDING_ACCESS_KEY));

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    console.error("[/api/onboarding/submit] Error al parsear body");
    return NextResponse.json(
      { success: false, error: "Cuerpo de la petición inválido" },
      { status: 400 }
    );
  }

  const {
    accessKey,
    area: rawArea,
    empresa,
    contacto,
    email,
    telefono,
    respuestas,
    respuestasDetalladas: respuestasDetalladasRaw,
    observaciones,
  } = body as {
    accessKey?: string;
    area?: string;
    empresa?: string;
    contacto?: string;
    email?: string;
    telefono?: string;
    respuestas?: Record<string, unknown>;
    respuestasDetalladas?: RespuestaDetallada[];
    observaciones?: string;
  };

  console.log(
    "[/api/onboarding/submit] area=%s, empresa=%s, email=%s, preguntas=%d",
    rawArea ?? "(vacío)",
    empresa ?? "(vacío)",
    email ? email.slice(0, 3) + "***" : "(vacío)",
    Array.isArray(respuestasDetalladasRaw) ? respuestasDetalladasRaw.length : 0
  );

  const expectedKey = process.env.ONBOARDING_ACCESS_KEY;
  if (!expectedKey) {
    console.error("[/api/onboarding/submit] ONBOARDING_ACCESS_KEY no está configurado");
    return NextResponse.json(
      { success: false, error: "El servidor no está configurado correctamente" },
      { status: 500 }
    );
  }
  if (!accessKey || accessKey !== expectedKey) {
    console.warn("[/api/onboarding/submit] accessKey inválida o ausente");
    return NextResponse.json(
      { success: false, error: "Acceso no autorizado" },
      { status: 403 }
    );
  }

  const missingFields: string[] = [];
  if (!rawArea?.trim()) missingFields.push("area");
  if (!empresa?.trim()) missingFields.push("empresa");
  if (!contacto?.trim()) missingFields.push("contacto");
  if (!email?.trim()) missingFields.push("email");

  if (missingFields.length > 0) {
    console.warn("[/api/onboarding/submit] Campos faltantes:", missingFields);
    return NextResponse.json(
      { success: false, error: "Faltan campos obligatorios", missingFields },
      { status: 400 }
    );
  }

  if (!/\S+@\S+\.\S+/.test(email!)) {
    return NextResponse.json(
      { success: false, error: "El email no tiene un formato válido" },
      { status: 400 }
    );
  }

  if (empresa!.trim().length > 300)
    return NextResponse.json({ success: false, error: "El nombre de empresa es demasiado largo (máx. 300 caracteres)" }, { status: 400 });
  if (contacto!.trim().length > 200)
    return NextResponse.json({ success: false, error: "El nombre de contacto es demasiado largo (máx. 200 caracteres)" }, { status: 400 });
  if (email!.trim().length > 254)
    return NextResponse.json({ success: false, error: "El email es demasiado largo" }, { status: 400 });
  if ((telefono?.trim().length ?? 0) > 50)
    return NextResponse.json({ success: false, error: "El teléfono es demasiado largo (máx. 50 caracteres)" }, { status: 400 });
  if ((observaciones?.trim().length ?? 0) > 10_000)
    return NextResponse.json({ success: false, error: "Las observaciones son demasiado largas (máximo 10.000 caracteres)" }, { status: 400 });

  const area = normalizeArea(rawArea!);
  if (!area) {
    console.warn("[/api/onboarding/submit] Área no reconocida:", rawArea);
    return NextResponse.json(
      { success: false, error: `Área "${rawArea}" no reconocida` },
      { status: 400 }
    );
  }

  if (JSON.stringify(respuestas ?? {}).length > MAX_RESPUESTAS_BYTES) {
    return NextResponse.json(
      { success: false, error: "El formulario contiene demasiado texto. Reduce las respuestas." },
      { status: 400 }
    );
  }

  let tableName: string;
  try {
    tableName = getTableName(area);
  } catch (err) {
    console.error("[/api/onboarding/submit] Config error tabla:", err);
    return NextResponse.json(
      { success: false, error: "El servidor no está configurado correctamente" },
      { status: 500 }
    );
  }

  const now = new Date();
  const fechaYYYYMMDD = now.toISOString().slice(0, 10);
  const nowISO = now.toISOString();

  const empresaTrim = empresa!.trim();
  const contactoTrim = contacto!.trim();
  const emailTrim = email!.trim().toLowerCase();
  const telefonoTrim = telefono?.trim() ?? "";
  const observacionesTrim = observaciones?.trim() ?? "";
  const areaValue = AREA_VALUES[area];
  const respuestasClean = respuestas ?? {};

  // Sanitize respuestasDetalladas: keep only valid entries
  const respuestasDetalladasClean: RespuestaDetallada[] = Array.isArray(respuestasDetalladasRaw)
    ? respuestasDetalladasRaw.filter(
        (r) => r && typeof r.id === "string" && typeof r.label === "string"
      ).map((r) => ({
        id: String(r.id),
        label: String(r.label),
        type: String(r.type ?? "text"),
        answer: String(r.answer ?? "").trim(),
        section: extractSection(String(r.id)),
      }))
    : [];

  const prioridad = calculatePriority(respuestasClean, observacionesTrim, respuestasDetalladasClean);

  const respuestasJSON = JSON.stringify(
    {
      metadata: {
        area,
        formVersion: "1.3",
        submittedAt: nowISO,
        source: "onboarding",
        totalPreguntas: respuestasDetalladasClean.length,
        totalRespondidas: respuestasDetalladasClean.filter((r) => r.answer).length,
      },
      datosGenerales: {
        empresa: empresaTrim,
        contacto: contactoTrim,
        email: emailTrim,
        telefono: telefonoTrim,
      },
      respuestas: respuestasClean,
      respuestasDetalladas: respuestasDetalladasClean,
    },
    null,
    2
  );

  const observacionesGeneradas = generateObservaciones(
    area,
    empresaTrim,
    contactoTrim,
    emailTrim,
    telefonoTrim,
    respuestasDetalladasClean,
    observacionesTrim,
    prioridad,
    nowISO
  );

  console.log(
    "[/api/onboarding/submit] tabla=%s, área=%s, areaValue=%s, prioridad=%s, preguntas=%d, respondidas=%d, jsonBytes=%d, obsChars=%d",
    tableName,
    area,
    areaValue,
    prioridad,
    respuestasDetalladasClean.length,
    respuestasDetalladasClean.filter((r) => r.answer).length,
    respuestasJSON.length,
    observacionesGeneradas.length
  );

  const fields: Record<string, unknown> = {
    Empresa: empresaTrim,
    Contacto: contactoTrim,
    Email: emailTrim,
    Telefono: telefonoTrim,
    Area: areaValue,
    "Fecha de envio": fechaYYYYMMDD,
    Estado: "Nuevo",
    "Respuestas JSON": respuestasJSON,
    Prioridad: prioridad,
    Observaciones: observacionesGeneradas,
  };

  console.log(
    "[/api/onboarding/submit] Campos a enviar: Empresa=%s, Area=%s, Estado=%s, Prioridad=%s, Fecha=%s",
    fields.Empresa, fields.Area, fields.Estado, fields.Prioridad, fields["Fecha de envio"]
  );

  try {
    const record = await createRecord(tableName, fields);
    console.log("[/api/onboarding/submit] ✅ Registro creado:", record.id, "tabla:", tableName, "area:", area, "areaValue:", areaValue);
    return NextResponse.json({ success: true, recordId: record.id, tableName, area, areaValue });
  } catch (err) {
    if (err instanceof AirtableConfigError) {
      console.error("[/api/onboarding/submit] Config error:", err.message);
      return NextResponse.json(
        { success: false, error: "El servidor no está configurado correctamente" },
        { status: 500 }
      );
    }
    if (err instanceof AirtableError) {
      console.error("[/api/onboarding/submit] Airtable HTTP", err.statusCode, "tabla:", tableName, "area:", area, "–", err.message);
      return NextResponse.json(
        { success: false, error: "Error al guardar las respuestas. Inténtalo de nuevo." },
        { status: 502 }
      );
    }
    console.error("[/api/onboarding/submit] Error inesperado:", err);
    return NextResponse.json(
      { success: false, error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
