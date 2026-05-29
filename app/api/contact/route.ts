import { NextRequest, NextResponse } from "next/server";
import { createRecord, AirtableError, AirtableConfigError } from "@/lib/airtable";

const VALID_TAMANIO = ["1-10", "11-50", "51-200", "200+"];

export async function POST(req: NextRequest) {
  console.log("[/api/contact] → POST recibido");
  console.log("[/api/contact] AIRTABLE_TOKEN exists:", Boolean(process.env.AIRTABLE_TOKEN));
  console.log("[/api/contact] AIRTABLE_BASE_ID:", process.env.AIRTABLE_BASE_ID ?? "UNDEFINED");
  console.log("[/api/contact] AIRTABLE_LEADS_TABLE:", process.env.AIRTABLE_LEADS_TABLE ?? "UNDEFINED");

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    console.error("[/api/contact] Error al parsear body");
    return NextResponse.json(
      { success: false, error: "Cuerpo de la petición inválido" },
      { status: 400 }
    );
  }

  const { nombre, email, telefono, empresa, tamanio, mensaje } = body as {
    nombre?: string;
    email?: string;
    telefono?: string;
    empresa?: string;
    tamanio?: string;
    mensaje?: string;
  };

  console.log("[/api/contact] Body: nombre=%s, email=%s, empresa=%s, tamanio=%s",
    nombre ?? "(vacío)", email ? email.slice(0, 3) + "***" : "(vacío)", empresa ?? "(vacío)", tamanio ?? "(vacío)");

  const missingFields: string[] = [];
  if (!nombre?.trim()) missingFields.push("nombre");
  if (!email?.trim()) missingFields.push("email");
  if (!empresa?.trim()) missingFields.push("empresa");

  if (missingFields.length > 0) {
    console.warn("[/api/contact] Campos faltantes:", missingFields);
    return NextResponse.json(
      { success: false, error: "Faltan campos obligatorios", missingFields },
      { status: 400 }
    );
  }

  if (!/\S+@\S+\.\S+/.test(email!)) {
    console.warn("[/api/contact] Email inválido");
    return NextResponse.json(
      { success: false, error: "El email no tiene un formato válido" },
      { status: 400 }
    );
  }

  const tableName = process.env.AIRTABLE_LEADS_TABLE;
  if (!tableName) {
    console.error("[/api/contact] AIRTABLE_LEADS_TABLE no está configurado");
    return NextResponse.json(
      { success: false, error: "El servidor no está configurado correctamente" },
      { status: 500 }
    );
  }

  const now = new Date();
  const nowISO = now.toISOString();
  const tamanioValido = tamanio && VALID_TAMANIO.includes(tamanio) ? tamanio : null;

  const observaciones = [
    `Lead web:`,
    `- Contacto: ${nombre!.trim()}`,
    `- Empresa: ${empresa!.trim()}`,
    `- Email: ${email!.trim().toLowerCase()}`,
    ...(telefono?.trim() ? [`- Teléfono: ${telefono.trim()}`] : []),
    ...(tamanioValido ? [`- Tamaño de empresa: ${tamanioValido}`] : []),
    ...(mensaje?.trim() ? [`\nMensaje:\n${mensaje.trim()}`] : []),
    `\nOrigen: web`,
    `Fecha: ${nowISO}`,
  ].join("\n");

  const respuestasJSON = JSON.stringify(
    {
      metadata: { origen: "web", submittedAt: nowISO, version: "1.0" },
      datosFormulario: {
        nombre: nombre!.trim(),
        empresa: empresa!.trim(),
        email: email!.trim().toLowerCase(),
        telefono: telefono?.trim() ?? "",
        tamanioEmpresa: tamanioValido ?? "",
        mensaje: mensaje?.trim() ?? "",
      },
    },
    null,
    2
  );

  const fields: Record<string, unknown> = {
    "Nombre de Lead": nombre!.trim(),
    Empresa: empresa!.trim(),
    Email: email!.trim().toLowerCase(),
    "Teléfono": telefono?.trim() ?? "",
    Estado: "Nuevo lead",
    Prioridad: "Media",
    ...(tamanioValido ? { "Tamaño": tamanioValido } : {}),
    Observaciones: observaciones,
    "Respuestas JSON": respuestasJSON,
  };

  console.log("[/api/contact] Enviando a Airtable tabla=%s, campos=%s",
    tableName, Object.keys(fields).join(", "));

  try {
    const record = await createRecord(tableName, fields);
    console.log("[/api/contact] ✅ Registro creado:", record.id);
    return NextResponse.json({ success: true, recordId: record.id });
  } catch (err) {
    if (err instanceof AirtableConfigError) {
      console.error("[/api/contact] Config error:", err.message);
      return NextResponse.json(
        { success: false, error: "El servidor no está configurado correctamente" },
        { status: 500 }
      );
    }
    if (err instanceof AirtableError) {
      console.error("[/api/contact] Airtable HTTP", err.statusCode, "–", err.message);
      console.error("[/api/contact] Detalle:", err.message);
      return NextResponse.json(
        { success: false, error: "Error al guardar la solicitud. Inténtalo de nuevo." },
        { status: 502 }
      );
    }
    console.error("[/api/contact] Error inesperado:", err);
    return NextResponse.json(
      { success: false, error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
